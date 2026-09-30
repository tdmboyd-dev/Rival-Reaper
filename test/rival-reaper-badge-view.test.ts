import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=(await readFile('examples/rival-reaper/badge-art.js','utf8')).replaceAll('export ','');
function setup(){
 const root:any={hidden:false,children:[],replaceChildren(...children:any[]){this.children=children;}},symbol:any={},note:any={},images:any[]=[];
 const scope=vm.createContext({root,symbol,note,makeImage:()=>{const image:any={naturalWidth:1254,naturalHeight:1254};images.push(image);return image;}});
 vm.runInContext(source+'\nthis.badges=REVEAL_BADGES;this.view=createBadgeView(root,symbol,note,makeImage);',scope);
 return{root,symbol,note,images,scope};
}
test('badge registry excludes obsolete names, posters and competitive Blackout',()=>{
 const h=setup();assert.equal(Object.keys(h.scope.badges).length,4);
 assert.equal(h.scope.badges['pressure-gang'],undefined);assert.equal(h.scope.badges['high-society'],undefined);
 assert.equal(h.scope.badges['blackout-krew'],undefined);
 assert.ok(Object.values(h.scope.badges).every(path=>String(path).endsWith('-badge.png')&&!String(path).includes('roster')));
});
test('standalone badge appears only for released team and stale loads cannot expose previous fate',()=>{
 const h=setup();h.scope.view.show({id:'blood-bloom',name:'Blood Bloom',symbol:'BB'});assert.equal(h.root.hidden,true);
 h.scope.view.show(null);h.images[0].onload();assert.equal(h.root.hidden,true);assert.equal(h.symbol.textContent,'R');
 h.scope.view.show({id:'belt-2-ass',name:'BELT 2 ASS',symbol:'B2A'});h.images[1].onload();
 assert.equal(h.root.hidden,false);assert.equal(h.symbol.hidden,true);assert.equal(h.images[1].src,'/assets/belt-2-ass-badge.png');
 h.scope.view.show({id:'pressure-gang',name:'Pressure Gang',symbol:'PG'});assert.equal(h.root.hidden,true);assert.equal(h.note.textContent,'BADGE ART PENDING');
});
test('badge loading failure retains readable identity and cannot alter fate',()=>{
 const h=setup();h.scope.view.show({id:'pink-venom',name:'Pink Venom',symbol:'PV'});h.images[0].onerror();
 assert.equal(h.root.hidden,true);assert.equal(h.symbol.hidden,false);assert.equal(h.symbol.textContent,'PV');
 assert.ok(h.note.textContent.includes('FATE UNCHANGED'));
});
