import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const templates:Record<string,string>={
 'blood-bloom':'1b407af0f04c52a2cd7e047ec439ee03ce9da52973f2be0e1eb29d1987165d1d',
 'pressure-gang':'b29e351c6e04d8b9da0a5e15166485614c9e732477b94201b9e3579ce93129d6',
 'high-society':'8d96e48a7821740e5b4299d12dace671d099710cc91c56e9fe74293ee147f236',
 'heat-mob':'d9488abb49d2adda94ba36eb7735fd5f0c5405eb2917661221722138d7eefcc9',
 'pink-venom':'6b0f82e457ebff80af4b77238379af653edea7c8708fa305da4e2ae9f8795c02',
 'belt-2-ass':'84cf959db6b10fd05bb085d5d88d35769573de1e887bb3d207d58787535a018b',
};
test('all six approved roster source images are byte-identical to recovered or owner-approved originals',async()=>{
 for(const[id,hash]of Object.entries(templates)){
  const bytes=await readFile(`examples/rival-reaper/assets/${id}-roster-template.png`);
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),hash,id);
  assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],id==='heat-mob'?[1374,1145]:[1145,1374]);
 }
});
test('installed standalone badges preserve correct original and approved source bytes',async()=>{
 const hashes:Record<string,string>={
  'blood-bloom':'2117e5d8e24145b62dfed96100088a0d5287e98dafe9c8773f98c728c4fc82fc',
  'heat-mob':'417854d5779f05d0c00e70ae54a9979658af60a2a07c308480beb3921152b8ac',
  'pink-venom':'60a813f8eacc168ced94010e844bcda47c7fb00da779c6510c17e20f54d26ce9',
  'belt-2-ass':'d6a55819be69a4fb6a11e77d301ac629bf2f4e87bcd9c8ce9dc5f1b6bafd70ce',
  'blackout-krew-support':'9dcb4c7d8c6feb599ad1f15e4c7152199618ba412ecf9800a35cca0b77dc85db',
 };
 for(const[id,hash]of Object.entries(hashes)) assert.equal(createHash('sha256').update(await readFile(`examples/rival-reaper/assets/${id}-badge.png`)).digest('hex'),hash,id);
});
