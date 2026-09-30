import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildFiveTeamState,buildLineupState} from '../src/rival-reaper/roster.js';
import {parseLineup,identifyLineup} from '../src/rival-reaper/lineup.js';
import {drawPlayer,auditSnapshot} from '../src/rival-reaper/engine.js';
import {entries} from './fixtures.js';
import {createRivalReaperServer} from '../src/rival-reaper/server.js';
import {verifyReceiptChain} from '../src/rival-reaper/receipts.js';

test('lineup selection is explicit, versioned, and preserves the five-team default',()=>{
 assert.equal(parseLineup(),'five-v1');assert.throws(()=>parseLineup('six'));
 assert.deepEqual(buildFiveTeamState(entries(47)),buildLineupState(entries(47),'five-v1'));
 assert.equal(identifyLineup(buildLineupState(entries(47),'six-v1').state.teams),'six-v1');
 const support=entries(1).map(p=>({...p,id:'fake-support',status:'blackout' as const}));
 const built=buildLineupState([...entries(47),...support],'six-v1');
 assert.equal(built.state.players.length,47);assert.equal(built.blackout.length,1);
 assert.deepEqual(built.state.teams.map(t=>t.capacity),[8,8,8,8,8,7]);
 assert.equal(built.state.teams.at(-1)?.name,'BELT 2 ASS');
});
for(const lineup of ['five-v1','six-v1'] as const)for(const count of [47,48])
 test(`${lineup} ${count} complete synthetic draws preserve capacity, gender and minimum household repeats`,()=>{
  for(const scenario of ['balanced','minority','one-home'])for(let seed=1;seed<=3;seed++){
   const input=entries(count);if(scenario==='minority')input.forEach((p,i)=>p.gender=i<7?'female':'male');
   if(scenario==='one-home')input.forEach(p=>p.householdId='single-fake-home');
   const state=buildLineupState(input,lineup).state;let n=seed;const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/2**32;};
   const order=[...state.players];for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
   for(const p of order)drawPlayer(state,p.id,random);
   const audit=auditSnapshot(state);assert.equal(state.assignments.length,count);
   assert.deepEqual(audit.map(t=>t.size),state.teams.map(t=>t.capacity));
   for(const key of ['male','female'] as const)assert.ok(Math.max(...audit.map(t=>t[key]))-Math.min(...audit.map(t=>t[key]))<=1);
   assert.equal(audit.reduce((n,t)=>n+t.size-t.households,0),scenario==='one-home'?count-state.teams.length:0);
  }
 });

test('backend, arena and poster identity registries agree and every team has a finite sound frequency',async()=>{
 const vm=await import('node:vm');
 const shared=vm.createContext({});vm.runInContext((await readFile('examples/rival-reaper/shared.js','utf8')).replaceAll('export ','')+'\nthis.values=worlds;',shared);
 const posters=vm.createContext({});vm.runInContext((await readFile('examples/rival-reaper/roster-posters.js','utf8')).replaceAll('export ','')+'\nthis.values=POSTER_TEAMS;',posters);
 const expected=buildLineupState(entries(48),'six-v1').state.teams.map(t=>t.id).sort();
 assert.deepEqual(Array.from(shared.values,(w:any)=>w.id).sort(),expected);
 assert.deepEqual(Array.from(posters.values,(w:any)=>w.id).sort(),expected);
 for(const world of shared.values)assert.ok(Number.isFinite(world.tone)&&world.tone>0);
});

test("normal event and former demo entry require configured input and default to six teams", async () => {
  const {readFile} = await import("node:fs/promises");
  const pkg=JSON.parse(await readFile("package.json","utf8"));
  assert.equal(pkg.scripts.demo,pkg.scripts.start);
  const cli=await readFile("src/rival-reaper/cli.ts","utf8");
  assert.match(cli,/RIVAL_REAPER_LINEUP \?\? "six-v1"/);
  assert.match(cli,/if \(!rosterPath \|\| !hostToken \|\| !secret\)/);
  assert.doesNotMatch(cli,/Fake Player|Array\.from/);
  const preflight=await readFile("scripts/rehearse-roster.ts","utf8");
  assert.match(preflight,/RIVAL_REAPER_LINEUP \?\? "six-v1"/);
});
