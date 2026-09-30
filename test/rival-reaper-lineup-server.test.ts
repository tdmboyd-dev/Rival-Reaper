import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildFiveTeamState,buildLineupState} from '../src/rival-reaper/roster.js';
import {entries} from './fixtures.js';
import {createRivalReaperServer} from '../src/rival-reaper/server.js';
import {verifyReceiptChain} from '../src/rival-reaper/receipts.js';
test('six-team fate survives every reveal restart and replay; old/new lineup mismatch never changes saved bytes',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'six-lineup-'));let app:Awaited<ReturnType<typeof createRivalReaperServer>>|undefined;
 const initialState=buildLineupState(entries(47),'six-v1').state;
 const options={port:0,hostToken:'fake-lineup-host-token-32-characters',secret:'fake-lineup-encryption-key-32-characters',dataPath:join(dir,'event.enc.json'),initialState};
 let base='',state:any;
 const start=async()=>{app=await createRivalReaperServer(options);await app.listen();base=`http://127.0.0.1:${(app.server.address() as any).port}`;};
 const get=()=>fetch(base+'/api/state').then(r=>r.json());
 const post=(path:string,input:any)=>fetch(base+path,{method:'POST',headers:{authorization:'Bearer '+options.hostToken,'content-type':'application/json'},body:JSON.stringify(input)});
 try{
  await start();state=await get();assert.equal(state.lineup,'six-v1');
  const draw={commandId:'six-first-fate',expectedRevision:0,expectedSessionId:state.sessionId,playerId:'fake-1'};
  assert.equal((await post('/api/host/draw',draw)).status,200);
  state=await get();
  for(let step=0;step<10;step++){
   const before=state;await app!.close();app=undefined;await start();state=await get();assert.deepEqual(state,before);
   const replay=await post('/api/host/draw',draw);assert.equal(replay.status,200);assert.equal((await replay.json()).replayed,true);assert.equal((await get()).drawCount,1);
   if(step<9){assert.equal((await post('/api/host/reveal/advance',{commandId:`six-advance-${step}`,expectedRevision:state.revision,expectedSessionId:state.sessionId})).status,200);state=await get();}
  }
  assert.equal(verifyReceiptChain(app!.session.receipts),true);
  assert.equal(JSON.stringify(state).includes('householdId'),false);
  await app!.close();app=undefined;const before=await readFile(options.dataPath);
  await assert.rejects(createRivalReaperServer({...options,initialState:buildFiveTeamState(entries(47)).state}),/differs from the saved session/);
  assert.deepEqual(await readFile(options.dataPath),before);
  const oldOptions={...options,dataPath:join(dir,'old-five.enc.json'),initialState:buildFiveTeamState(entries(47)).state};
  app=await createRivalReaperServer(oldOptions);await app.listen();await app.close();app=undefined;
  const old=await readFile(oldOptions.dataPath);
  await assert.rejects(createRivalReaperServer({...oldOptions,initialState}),/differs from the saved session/);
  assert.deepEqual(await readFile(oldOptions.dataPath),old);
 }finally{if(app)await app.close();await rm(dir,{recursive:true,force:true});}
});

test('complete fictional 47-player six-team HTTP show preserves privacy, terminal rosters and restart', async () => {
 const dir=await mkdtemp(join(tmpdir(),'six-complete-'));
 const initialState=buildLineupState(entries(47),'six-v1').state;
 const options={port:0,hostToken:'fake-complete-host-token-32-characters',secret:'fake-complete-encryption-key-32-characters',dataPath:join(dir,'event.enc.json'),initialState};
 let app:Awaited<ReturnType<typeof createRivalReaperServer>>|undefined;
 let base='',state:any,sequence=0;
 const start=async()=>{app=await createRivalReaperServer(options);await app.listen();base=`http://127.0.0.1:${(app.server.address() as any).port}`;};
 const get=()=>fetch(base+'/api/state').then(r=>r.json());
 const post=async(path:string,extra:Record<string,unknown>={})=>{
  const input={commandId:`complete-fake-${++sequence}`,expectedRevision:state.revision,expectedSessionId:state.sessionId,...extra};
  const send=()=>fetch(base+path,{method:'POST',headers:{authorization:'Bearer '+options.hostToken,'content-type':'application/json'},body:JSON.stringify(input)});
  const response=await send();assert.equal(response.status,200);const result=await response.json();state=result.state;
  if(sequence%71===0){const retry=await send();assert.equal(retry.status,200);const recovered=await retry.json();assert.equal(recovered.replayed,true);assert.deepEqual(recovered.state,state);}
 };
 try{
  await start();state=await get();
  for(const [index,player] of initialState.players.entries()){
   await post('/api/host/draw',{playerId:player.id});
   assert.equal(state.reveal.playerName,null);
   assert.equal(state.teams.reduce((n:number,t:any)=>n+t.roster.length,0),index);
   for(let beat=0;beat<9;beat++){
    await post('/api/host/reveal/advance');
    if(beat<6)assert.equal(state.reveal.playerName,null);
    assert.equal(JSON.stringify(state).includes('householdId'),false);
    assert.equal(JSON.stringify(state).includes('gender'),false);
   }
   assert.equal(state.reveal.phase,'roster-updated');
   assert.equal(state.teams.reduce((n:number,t:any)=>n+t.roster.length,0),index+1);
  }
  assert.equal(state.remaining,0);assert.equal(state.drawCount,47);assert.equal(state.revision,470);
  assert.deepEqual(state.teams.map((t:any)=>t.roster.length),[8,8,8,8,8,7]);
  const names=state.teams.flatMap((t:any)=>t.roster.map((p:any)=>p.name));
  assert.equal(new Set(names).size,47);
  assert.equal(verifyReceiptChain(app!.session.receipts),true);
  const before=state;await app!.close();app=undefined;await start();assert.deepEqual(await get(),before);
  const auditResponse=await fetch(base+'/api/host/audit',{headers:{authorization:'Bearer '+options.hostToken}});
  assert.equal(auditResponse.status,200);const audit=await auditResponse.json();assert.equal(audit.payload.receipts.length,47);
  assert.equal(audit.payload.commands.length,470);assert.equal(verifyReceiptChain(audit.payload.receipts),true);
  assert.equal((await fetch(base+'/api/host/audit')).status,401);
 }finally{if(app)await app.close();await rm(dir,{recursive:true,force:true});}
});
