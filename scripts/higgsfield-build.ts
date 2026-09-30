import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname, basename, extname } from "node:path";

type Scene = { id:string; refs:string[]; prompt:string };
type Manifest = { version:number; model:string; rate_usd_per_second:number; duration_seconds_each:number; aspect_ratio:string; mode:string; sound:string; output_dir:string; scenes:Scene[] };

const args=new Set(process.argv.slice(2));
const estimateOnly=args.has("--estimate-only");
const generate=args.has("--generate");
if(estimateOnly===generate) throw new Error("Choose exactly one: --estimate-only or --generate");
const key=process.env.HF_API_KEY?.trim();
if(!key) throw new Error("HF_API_KEY is required in the local environment. Do not commit or print it.");
const root=resolve(process.cwd());
const manifest=JSON.parse(await readFile(resolve(root,"config/higgsfield-scenes.json"),"utf8")) as Manifest;
const api="https://api.higgsfield.ai";
const auth={Authorization:`Key ${key}`,"Content-Type":"application/json"};

async function upload(filePath:string){
  const abs=resolve(root,filePath);
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
const cache=new Map<string,string>();
async function publicUrl(path:string){ if(!cache.has(path)) cache.set(path,await upload(path)); return cache.get(path)!; }

async function estimate(body:unknown){
  const r=await fetch(api+"/estimate/"+manifest.model,{method:"POST",headers:auth,body:JSON.stringify(body)});
  if(!r.ok) throw new Error(`estimate failed ${r.status}: ${await r.text()}`);
  return await r.json() as any;
}
async function submit(body:unknown){
  const r=await fetch(api+"/"+manifest.model,{method:"POST",headers:auth,body:JSON.stringify(body)});
  if(!r.ok) throw new Error(`submit failed ${r.status}: ${await r.text()}`);
  return await r.json() as any;
}
async function poll(requestId:string){
  for(;;){
    const r=await fetch(api+`/requests/${requestId}/status`,{headers:{Authorization:`Key ${key}`}});
    if(!r.ok) throw new Error(`status failed ${r.status}: ${await r.text()}`);
    const data=await r.json() as any;
    if(["completed","failed","nsfw","canceled"].includes(data.status)) return data;
    await new Promise(r=>setTimeout(r,2500));
  }
}
await mkdir(resolve(root,manifest.output_dir),{recursive:true});
let total=0;
const report:any[]=[];
for(const scene of manifest.scenes){
  console.log(`Preparing ${scene.id}…`);
  const image_urls=[] as string[];
  for(const ref of scene.refs) image_urls.push(await publicUrl(ref));
  const body={mode:manifest.mode,sound:manifest.sound,prompt:scene.prompt,duration:manifest.duration_seconds_each,shot_type:"customize",image_urls,multi_shots:false,aspect_ratio:manifest.aspect_ratio};
  if(estimateOnly){
    const e=await estimate(body);
    const usd=Number(e.usd ?? e.cost?.usd ?? e.price_usd);
    if(!Number.isFinite(usd)) throw new Error(`No USD estimate returned for ${scene.id}`);
    total+=usd; report.push({scene:scene.id,usd,estimate:e});
    console.log(`${scene.id}: $${usd.toFixed(4)}`);
  } else {
    const created=await submit(body);
    const requestId=created.request_id;
    if(!requestId) throw new Error(`No request_id for ${scene.id}`);
    const done=await poll(requestId);
    if(done.status!=="completed") throw new Error(`${scene.id} ended ${done.status}`);
    const url=done.video?.url;
    if(!url) throw new Error(`No video URL for ${scene.id}`);
    const media=await fetch(url); if(!media.ok) throw new Error(`download failed ${media.status}`);
    const out=resolve(root,manifest.output_dir,`${scene.id}.mp4`);
    await writeFile(out,Buffer.from(await media.arrayBuffer()));
    report.push({scene:scene.id,request_id:requestId,output:out});
    console.log(`Saved ${basename(out)}`);
  }
}
if(estimateOnly) console.log(`TOTAL ESTIMATE: $${total.toFixed(4)} USD`);
await writeFile(resolve(root,manifest.output_dir,estimateOnly?"estimate-report.json":"generation-report.json"),JSON.stringify({created_at:new Date().toISOString(),model:manifest.model,total_usd:estimateOnly?total:undefined,scenes:report},null,2));
