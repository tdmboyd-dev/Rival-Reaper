import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {drawPoster,POSTER_TEAMS,POSTER_TEMPLATES,originalPosterRegion} from '../examples/rival-reaper/roster-posters.js';
import {entries} from '../test/fixtures.ts';
import {buildLineupState} from '../src/rival-reaper/roster.ts';
import {drawPlayer} from '../src/rival-reaper/engine.ts';
const require=createRequire(import.meta.url);
const {createCanvas,loadImage,GlobalFonts}=require(process.env.REAPER_CANVAS_MODULE ?? '@napi-rs/canvas');
GlobalFonts.registerFromPath(process.env.REAPER_PROOF_FONT ?? '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf','Arial');
const count=Number(process.env.REAPER_RENDER_COUNT ?? 47);
if(!Number.isSafeInteger(count)||count<1||count>250)throw new Error("Invalid fake render count");
const lineup=process.env.REAPER_RENDER_LINEUP ?? "six-v1";
const state=buildLineupState(entries(count),lineup).state;state.players.forEach((p,i)=>{p.gender=i<25?'male':'female';p.name=`FAKE PLAYER ${String(i+1).padStart(2,'0')}`;});
let seed=47;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
for(const p of state.players)drawPlayer(state,p.id,rng);
const out=process.env.REAPER_RENDER_OUTPUT ?? `evidence/screenshots/native-${lineup}-${count}`;await mkdir(out,{recursive:true});
const report=[];
for(const identity of POSTER_TEAMS.filter(identity=>state.teams.some(team=>team.id===identity.id))){
 const team={id:identity.id,roster:state.assignments.filter(a=>a.teamId===identity.id).map(a=>({name:state.players.find(p=>p.id===a.playerId).name,drawIndex:a.drawIndex}))};
 const image=await loadImage(`examples/rival-reaper/assets/${identity.id}-roster-template.png`);
 const canvas=createCanvas(1,1);const region=originalPosterRegion(identity.id);
 const rx=image.width*region.x/100,ry=image.height*region.y/100,rw=image.width*region.width/100,rh=image.height*region.height/100;
 if(POSTER_TEMPLATES[identity.id].placeholder !== false){
 const texture=createCanvas(Math.ceil(rw*.13),Math.ceil(rh*.78));
 texture.getContext('2d').drawImage(image,rx+rw*.42,ry+rh*.02,rw*.13,rh*.78,0,0,texture.width,texture.height);
 await writeFile(`examples/rival-reaper/assets/${identity.id}-roster-texture.png`,await texture.encode('png'));
 }
 const layout=drawPoster(canvas,team,identity,image,region);
 assert.equal(layout.entries.length,team.roster.length);
 for(let i=0;i<layout.entries.length;i++)assert.equal(layout.entries[i].lines.join(''),team.roster[i].name);
 const base=createCanvas(canvas.width,canvas.height);base.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
 const original=base.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
 const rendered=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
 const left=Math.floor(layout.region.x)-1,right=Math.ceil(layout.region.x+layout.region.width)+1;
 const top=Math.floor(layout.region.y)-1,bottom=Math.ceil(layout.region.y+layout.region.height)+1;
 let outsideChanges=0;
 for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
  if(x>=left&&x<=right&&y>=top&&y<=bottom)continue;
  const at=(y*canvas.width+x)*4;
  if(original[at]!==rendered[at]||original[at+1]!==rendered[at+1]||original[at+2]!==rendered[at+2]||original[at+3]!==rendered[at+3])outsideChanges++;
 }
 assert.equal(outsideChanges,0);
 const bytes=await canvas.encode('png');const filename=`FAKE${count}-${identity.id}.png`;await writeFile(`${out}/${filename}`,bytes);
 const preview=createCanvas(1200,Math.round(1200*canvas.height/canvas.width));preview.getContext('2d').drawImage(canvas,0,0,preview.width,preview.height);await writeFile(`${out}/PREVIEW${count}-${identity.id}.jpg`,await preview.encode('jpeg',88));
 preview.width=1;preview.height=1;
 report.push({team:identity.id,fakeNames:team.roster.length,width:canvas.width,height:canvas.height,fontSize:layout.fontSize,panel:region,outsidePanelPixelChanges:outsideChanges,sha256:createHash('sha256').update(bytes).digest('hex'),filename});
 canvas.width=1;canvas.height=1;base.width=1;base.height=1;
}
await writeFile(`${out}/verification.json`,JSON.stringify({kind:'Native Skia canvas executes actual app drawPoster; NOT browser/device acceptance; all names fake',results:report},null,2));
console.log(JSON.stringify(report));
