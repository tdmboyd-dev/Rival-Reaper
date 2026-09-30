import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import { resolve, basename, extname } from "node:path";

type Scene={id:string;model:string;rate:number;duration:number;refs:string[];purpose:string;prompt:string};
type Manifest={version:number;plan_name:string;aspect_ratio:string;sound:string;recommended_first_pass_usd:number;two_take_ceiling_usd:number;scenes:Scene[]};

const flags=new Set(process.argv.slice(2));
const estimateOnly=flags.has("--estimate-only");
const generate=flags.has("--generate");
if(estimateOnly===generate) throw new Error("Choose exactly one: --estimate-only or --generate");

const key=(process.env.HF_API_KEY ?? process.env.HF_CREDENTIALS ?? process.env.HF_KEY ?? "").trim();
if(!key) throw new Error("Set HF_API_KEY (or HF_CREDENTIALS/HF_KEY) in a PRIVATE local env file. Paste the complete key copied from open.higgsfield.ai.");
const cap=Number(process.env.HIGGSFIELD_MAX_USD ?? "0");
if(generate && (!Number.isFinite(cap)||cap<=0)) throw new Error("Set HIGGSFIELD_MAX_USD before paid generation.");

const root=resolve(process.cwd());
const manifest=JSON.parse(await readFile(resolve(root,"config/higgsfield-scenes-v2.json"),"utf8")) as Manifest;
const api="https://api.higgsfield.ai";
const auth={Authorization:`Key ${key}`,"Content-Type":"application/json"};

const localFallbacks:Record<string,string>={
  REAPER_MACHINE_URL:"private/higgsfield-inputs/rival-reaper-machine-hero.png",
  FIELD_DAY_MASTER_URL:"private/higgsfield-inputs/field-day-machine-wide.png",
  RIVAL_REAPER_LOGO_URL:"private/higgsfield-inputs/rival-reaper-owner-logo.png",
  CONTROL_ROOM_REFERENCE_URL:"private/higgsfield-inputs/rival-reaper-control-room-reference.png",
};

async function uploadFile(filePath:string){
  const abs=resolve(root,filePath);
  await access(abs);
  const ext=extname(abs).toLowerCase();
  const contentType=ext===".jpg"||ext===".jpeg"?"image/jpeg":ext===".webp"?"image/webp":"image/png";
  const signed=await fetch(api+"/files/generate-upload-url",{method:"POST",headers:auth,body:JSON.stringify({content_type:contentType})});
  if(!signed.ok) throw new Error(`upload-url failed ${signed.status}: ${await signed.text()}`);
  const spec=await signed.json() as {upload_url:string;upload_headers?:Record<string,string>;public_url:string};
  const bytes=await readFile(abs);
  const put=await fetch(spec.upload_url,{method:"PUT",headers:spec.upload_headers??{},body:bytes});
  if(!put.ok) throw new Error(`reference upload failed ${put.status}: ${await put.text()}`);
  return spec.public_url;
}

const refCache=new Map<string,string>();
async function resolveRef(ref:string){
  if(refCache.has(ref)) return refCache.get(ref)!;
  let value:string;
  if(ref.endsWith("_URL")){
    const direct=process.env[ref]?.trim();
    value=direct || await uploadFile(localFallbacks[ref]);
  }else{
    value=await uploadFile(ref);
  }
  refCache.set(ref,value);
  return value;
}

function requestBody(scene:Scene,imageUrls:string[]){
  if(scene.model==="kling-video/v2.5-turbo/standard/image-to-video"){
    if(imageUrls.length!==1) throw new Error(`${scene.id}: Kling 2.5 Standard requires exactly one reference still in this plan`);
    return {
      prompt:scene.prompt,
      image_url:imageUrls[0],
      duration:scene.duration,
      cfg_scale:0.5,
      negative_prompt:"morphing machinery, changing logo, misspelled text, player names, distorted people, camera spin, full-screen flash"
    };
  }
  if(scene.model==="kling-video/o3/image-reference"){
    return {
      mode:"std",
      sound:"off",
      prompt:scene.prompt,
      duration:scene.duration,
      shot_type:"customize",
      image_urls:imageUrls,
      multi_shots:false,
      aspect_ratio:manifest.aspect_ratio
    };
  }
  throw new Error(`Unsupported model in approved plan: ${scene.model}`);
}

async function estimate(model:string,body:unknown){
  const r=await fetch(api+"/estimate/"+model,{method:"POST",headers:auth,body:JSON.stringify(body)});
  if(!r.ok) throw new Error(`estimate failed for ${model} (${r.status}): ${await r.text()}`);
  const data=await r.json() as any;
  const usd=Number(data.usd ?? data.cost?.usd ?? data.price_usd);
  if(!Number.isFinite(usd)) throw new Error(`estimate response for ${model} did not contain a usable USD amount`);
  return {usd,data};
}

async function submit(model:string,body:unknown){
  const r=await fetch(api+"/"+model,{method:"POST",headers:auth,body:JSON.stringify(body)});
  if(!r.ok) throw new Error(`submit failed for ${model} (${r.status}): ${await r.text()}`);
  const data=await r.json() as any;
  if(!data.request_id) throw new Error("Generation response missing request_id");
  return data.request_id as string;
}
async function poll(id:string){
  for(;;){
    const r=await fetch(api+`/requests/${id}/status`,{headers:{Authorization:`Key ${key}`}});
    if(!r.ok) throw new Error(`status failed ${r.status}: ${await r.text()}`);
    const data=await r.json() as any;
    if(["completed","failed","nsfw","canceled"].includes(data.status)) return data;
    await new Promise(r=>setTimeout(r,2500));
  }
}

const prepared:any[]=[];
let total=0;
console.log(`RiVAL REAPER Higgsfield plan: ${manifest.scenes.length} scenes`);
for(const scene of manifest.scenes){
  const urls=[] as string[];
  for(const ref of scene.refs) urls.push(await resolveRef(ref));
  const body=requestBody(scene,urls);
  const e=await estimate(scene.model,body);
  total+=e.usd;
  prepared.push({scene,body,estimate:e.usd});
  console.log(`${scene.id}: $${e.usd.toFixed(4)} estimated`);
}
console.log(`TOTAL AUTHENTICATED ESTIMATE: $${total.toFixed(4)} USD`);

await mkdir(resolve(root,"private/higgsfield-output"),{recursive:true});
await writeFile(resolve(root,"private/higgsfield-output/estimate-report.json"),JSON.stringify({
  created_at:new Date().toISOString(),plan:manifest.plan_name,total_usd:total,scenes:prepared.map(x=>({id:x.scene.id,model:x.scene.model,usd:x.estimate}))
},null,2));

if(estimateOnly) process.exit(0);
if(total>cap) throw new Error(`Authenticated estimate $${total.toFixed(4)} exceeds HIGGSFIELD_MAX_USD=$${cap.toFixed(2)}. No paid requests sent.`);

const outputs:any[]=[];
for(const item of prepared){
  console.log(`Generating ${item.scene.id}…`);
  const id=await submit(item.scene.model,item.body);
  const done=await poll(id);
  if(done.status!=="completed") throw new Error(`${item.scene.id} ended with status ${done.status}`);
  const url=done.video?.url;
  if(!url) throw new Error(`${item.scene.id}: completed response missing video.url`);
  const media=await fetch(url);
  if(!media.ok) throw new Error(`${item.scene.id}: download failed ${media.status}`);
  const out=resolve(root,"private/higgsfield-output",item.scene.id+".mp4");
  await writeFile(out,Buffer.from(await media.arrayBuffer()));
  outputs.push({id:item.scene.id,model:item.scene.model,request_id:id,usd:item.estimate,file:basename(out)});
  console.log(`Saved ${basename(out)}`);
}
await writeFile(resolve(root,"private/higgsfield-output/generation-report.json"),JSON.stringify({created_at:new Date().toISOString(),total_estimated_usd:total,outputs},null,2));
