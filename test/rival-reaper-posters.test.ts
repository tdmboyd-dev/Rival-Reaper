import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = (await readFile(new URL("../examples/rival-reaper/roster-posters.js", import.meta.url), "utf8")).replaceAll("export ", "");
const ids = ["blood-bloom", "pressure-gang", "high-society", "heat-mob", "pink-venom"];
function state(count = 10) {
  return { sessionId: "fake-session", revision: 100, healthy: true, reveal: { phase: "roster-updated" },
    teams: ids.map((id, team) => ({ id, capacity: count, assigned: count,
      roster: Array.from({length: count}, (_, index) => ({ name: `Fake Player ${team + 1}-${index + 1}`, drawIndex: team * count + index + 1 })) })),
  };
}
function pngFile(name = "approved.fake.png", overrides: any = {}) {
  const header = new Uint8Array(32);
  header.set([137,80,78,71,13,10,26,10]);
  const view = new DataView(header.buffer); view.setUint32(16, 100); view.setUint32(20, 100);
  return { name, size: 32, slice: () => new Blob([header]), ...overrides };
}
function harness() {
  const elements: any[] = [], downloads: any[] = [], created: any[] = [], revoked: string[] = [], timers: any[] = [];
  const images: any[] = [], texts: any[] = [], drawnImages: any[] = [];
  let deferImage = false, deferBlob = false;
  const blobCallbacks: Array<(blob: Blob | null) => void> = [];
  class Element {
    children: any[] = []; attrs: Record<string,string> = {}; listeners = new Map<string, any>();
    hidden = false; disabled = false; textContent = ""; className = ""; id = "";
    style: any = {}; checked = false; value = ""; src = ""; width = 0; height = 0; files: any[] = []; href = ""; download = "";
    ctx = { font: "10px Arial", fillStyle: "", textBaseline: "",
      fillRect() {}, strokeText() {}, measureText(text: string) { return { width: Array.from(text).length * parseInt(this.font.match(/(\d+)px/)![1]) }; },
      fillText(text: string, x: number, y: number) { texts.push({text,x,y,font:this.font}); },
      drawImage(...args: any[]) { drawnImages.push(args); },
    };
    constructor(readonly tag: string) { elements.push(this); }
    append(...children: any[]) { this.children.push(...children); }
    replaceChildren(...children: any[]) { this.children = children; }
    setAttribute(key: string, value: string) { this.attrs[key] = value; }
    removeAttribute(key: string) { delete this.attrs[key]; if (key === "src") this.src = ""; }
    addEventListener(key: string, callback: any) { this.listeners.set(key, callback); }
    async dispatch(key: string) { await this.listeners.get(key)?.({ target: this }); }
    click() { if (this.tag === "a") downloads.push({ name: this.download, href: this.href }); }
    remove() {}
    getContext(type: string) { return type === "2d" ? this.ctx : null; }
    toBlob(callback: (blob: Blob | null) => void, mime: string) {
      if (deferBlob) blobCallbacks.push(callback); else callback(new Blob(["fake pixel bytes"], {type: mime}));
    }
  }
  const root = new Element("section"), body = new Element("body");
  class Image {
    naturalWidth = 100; naturalHeight = 100; width = 100; height = 100;
    onload: any; onerror: any; private value = "";
    constructor() { images.push(this); }
    set src(value: string) { this.value = value; if (!deferImage) queueMicrotask(() => this.onload()); }
    get src() { return this.value; }
  }
  const scope = vm.createContext({
    document: { createElement: (tag: string) => new Element(tag), body, fonts: {ready: Promise.resolve()} },
    Image, Blob, root,
    URL: { createObjectURL: (value: any) => { const url = `blob:fake-${created.length}`; created.push({url,value}); return url; }, revokeObjectURL: (url: string) => revoked.push(url) },
    setTimeout: (callback: any) => timers.push(callback),
  });
  vm.runInContext(source + "\nthis.controller = createPosterControls(root); this.identities = POSTER_TEAMS;", scope);
  return {
    scope, root, elements, downloads, created, revoked, timers, images, texts, drawnImages, blobCallbacks,
    controller: scope.controller,
    gate: (s: any, id = ids[0], access: any = {authenticated:true,online:true}, art: any = {approved:true,image:{},url:"blob:fake",regionConfirmed:true,region:{x:0,y:0,width:100,height:100}}) => scope.posterGate(s, id, access, art),
    query: (className: string) => elements.filter((element) => element.className.split(" ").includes(className)),
    input: (id = ids[0]) => elements.find((element) => element.id === `poster-art-${id}`),
    load: async (id = ids[0]) => { const input = elements.find((element) => element.id === `poster-art-${id}`); input.files = [pngFile()]; await input.dispatch("change"); },
    confirmRegion: async (id = ids[0], region = {x:0,y:0,width:100,height:100}) => {
      for (const [key,value] of Object.entries(region)) {
        const field = elements.find((element) => element.id === `poster-region-${id}-${key}`);
        field.value = String(value); await field.dispatch("input");
      }
      const confirm = elements.find((element) => element.id === `poster-region-confirm-${id}`);
      confirm.checked = true; await confirm.dispatch("change");
    },
    deferImage: () => { deferImage = true; }, deferBlob: () => { deferBlob = true; },
    canvas: () => new Element("canvas"),
  };
}
const settle = () => new Promise<void>((done) => setImmediate(done));

test("posters gate all five identities on confirmed auth, connection, full public roster and completed reveal", () => {
  const h = harness(), full = state();
  for (const id of ids) assert.equal(h.gate(full, id).ready, true);
  assert.equal(h.gate(full, ids[0], {authenticated:false,online:true}).ready, false);
  assert.equal(h.gate(full, ids[0], {authenticated:true,online:false}).ready, false);
  assert.equal(h.gate({...full,healthy:false}).ready, false);
  assert.equal(h.gate(full, ids[0], undefined, null).ready, false);
  for (const phase of ["idle", "machine-awakens", "name-revealed", "team-explosion"]) assert.equal(h.gate({...full,reveal:{phase}}).ready, false);
  const pending = state(); pending.teams[0].assigned = 9; pending.teams[0].roster.pop();
  assert.equal(h.gate(pending).ready, false);
  const inconsistent = state(); inconsistent.teams[0].roster.pop(); assert.equal(h.gate(inconsistent).ready, false);
  assert.equal(h.gate(state(0)).ready, false); assert.equal(h.gate(state(51)).ready, false);
  assert.equal(h.gate(full,"blackout").ready, false);
});

test("posters reject malformed names and duplicate draw identities", () => {
  const h = harness();
  for (const name of ["", " ", "bad\nname", "x".repeat(121)]) {
    const s = state(); s.teams[0].roster[0].name = name; assert.equal(h.gate(s).ready,false);
  }
  const duplicate = state(); duplicate.teams[0].roster[1].drawIndex = duplicate.teams[0].roster[0].drawIndex;
  assert.equal(h.gate(duplicate).ready, false);
});

test("layout preserves all 10 names for a 46-person team and all 50 maximum-length names", () => {
  const h = harness();
  for (const count of [1,9,10,14,15,49,50]) {
    const s = state(count);
    s.teams[0].roster.forEach((person, index) => { person.name = index % 2 ? "界".repeat(120) : `${index} ${"W".repeat(116)}`; });
    const layout = h.scope.layoutPoster(s.teams[0], (text: string, size: number) => Array.from(text).length * size, {imageWidth:100,imageHeight:100,region:{x:0,y:0,width:100,height:100}});
    assert.equal(layout.entries.length, count); assert.equal(layout.width,3000);
    assert.ok(layout.height <= 10000); assert.equal(layout.height,3000);
    layout.entries.forEach((entry: any,index: number) => {
      assert.equal(entry.lines.join(""),s.teams[0].roster[index].name);
      assert.ok(entry.y + entry.height < layout.height);
      for (const line of entry.lines) assert.ok(Array.from(line).length * layout.fontSize <= entry.width);
    });
  }
});

test("wrapping preserves emoji, combining text, long words and every space", () => {
  const h = harness();
  for (const name of ["A👨‍👩‍👧‍👦B", "e\u0301".repeat(20), "Long-Unbroken-Name".repeat(5), "A  name with extra  spaces", "<img src=x onerror=evil()>"]) {
    const lines = h.scope.wrapPosterName(name, 100, (text: string) => Array.from(text).length * 5);
    assert.equal(lines.join(""), name);
  }
  assert.throws(() => h.scope.wrapPosterName("A", 0, () => 0));
});

test("canvas contains all roster text and complete art, with deterministic safe PNG names", () => {
  const h = harness(), s = state(50), canvas = h.canvas();
  const layout = h.scope.drawPoster(canvas, s.teams[0], h.scope.identities[0], {naturalWidth:300,naturalHeight:600},{x:0,y:0,width:100,height:100});
  const image = h.drawnImages[0];
  assert.equal(image[3]/image[4], 0.5); // Same aspect ratio, no source cropping arguments.
  assert.equal(image.length,5); assert.equal(image[4],canvas.height);
  assert.equal(h.texts.map((entry) => entry.text).join(""), s.teams[0].roster.map((player) => player.name).join(""));
  assert.ok(h.texts.every((entry) => entry.y < canvas.height));
  assert.equal(h.scope.posterFilename(ids[0], "../../session?q=x"), "rival-reaper-blood-bloom-sessionqx-full-team.png");
  assert.throws(() => h.scope.posterFilename("../bad", "one"));
});

test("only bounded raster file signatures are accepted; SVG and disguised external markup fail", async () => {
  const h = harness();
  await h.scope.validateArtFile(pngFile());
  await assert.rejects(h.scope.validateArtFile(pngFile("x.png", {size:21*1024*1024})));
  await assert.rejects(h.scope.validateArtFile(pngFile("x.png", {size:8})));
  await assert.rejects(h.scope.validateArtFile(pngFile("evil.png",{slice: () => new Blob(['<svg><image href="https://example.invalid/secret"/></svg>'])})));
  const huge = new Uint8Array(32); huge.set([137,80,78,71,13,10,26,10]);
  new DataView(huge.buffer).setUint32(16,9000); new DataView(huge.buffer).setUint32(20,9000);
  await assert.rejects(h.scope.validateArtFile(pngFile("huge.png",{slice:() => new Blob([huge])})));
});

test("actual host controller renders five text-only previews and downloads a full-team image/png", async () => {
  const h = harness(), s = state(); s.teams[0].roster[0].name = '<img src=x onerror="evil()">';
  assert.equal(h.root.hidden,true);
  h.controller.update({state:s,authenticated:true,online:true});
  assert.equal(h.query("poster-card").length,5);
  assert.equal(h.query("poster-download")[0].disabled,true);
  assert.equal(h.query("poster-names")[0].children[0].tag,"li");
  assert.equal(h.query("poster-names")[0].children[0].textContent,s.teams[0].roster[0].name);
  await h.load();
  assert.equal(h.query("poster-download")[0].disabled,true); // Art alone never guesses the name area.
  await h.confirmRegion();
  assert.equal(h.query("poster-download")[0].disabled,false);
  await h.query("poster-download")[0].dispatch("click");
  assert.equal(h.downloads.length,1);
  assert.equal(h.downloads[0].name,"rival-reaper-blood-bloom-fake-session-full-team.png");
  assert.equal(h.created.at(-1).value.type,"image/png");
  assert.ok(h.query("poster-notice")[0].textContent.includes("including all 10 names"));
  h.timers.forEach((fn) => fn()); assert.ok(h.revoked.includes(h.downloads[0].href));
});

test("all five independently configured full-team buttons generate uniquely named PNG downloads", async () => {
  const h = harness(); h.controller.update({state:state(50),authenticated:true,online:true});
  for (const [index,id] of ids.entries()) { await h.load(id); await h.confirmRegion(id); await h.query("poster-download")[index].dispatch("click"); }
  assert.equal(h.downloads.length,5); assert.equal(new Set(h.downloads.map((d) => d.name)).size,5);
  assert.ok(h.query("poster-notice").every((n) => n.textContent.includes("all 50 names")));
});

test("logout wipes art URLs and late image decoding cannot restore the art", async () => {
  const h = harness(), s = state(); h.controller.update({state:s,authenticated:true,online:true});
  await h.load(); const prior = h.created[0].url;
  h.deferImage(); const pending = h.load(ids[1]); await settle();
  h.controller.update({state:s,authenticated:false,online:true});
  h.images.at(-1).onload(); await pending;
  assert.equal(h.root.hidden,true); assert.ok(h.revoked.includes(prior));
  h.controller.update({state:s,authenticated:true,online:true});
  assert.ok(h.query("poster-download").every((button) => button.disabled));
  assert.ok(h.query("poster-art").every((image) => !image.src));
});

test("async export is cancelled by logout, disconnect, changed session or nonterminal reveal", async () => {
  for (const changed of ["logout","offline","session","phase"]) {
    const h = harness(), s = state(); h.controller.update({state:s,authenticated:true,online:true}); await h.load(); await h.confirmRegion();
    h.deferBlob(); const pending = h.query("poster-download")[0].dispatch("click"); await settle();
    const next = structuredClone(s);
    if (changed === "session") next.sessionId = "new-session";
    if (changed === "phase") next.reveal.phase = "machine-awakens";
    h.controller.update({state:next,authenticated:changed!=="logout",online:changed!=="offline"});
    h.blobCallbacks[0](new Blob(["fake png"], {type:"image/png"})); await pending;
    assert.equal(h.downloads.length,0,changed);
  }
});

test("rapid duplicate download clicks cannot create duplicate exports", async () => {
  const h = harness(); h.controller.update({state:state(),authenticated:true,online:true}); await h.load(); await h.confirmRegion(); h.deferBlob();
  const first = h.query("poster-download")[0].dispatch("click"); await settle();
  await h.query("poster-download")[0].dispatch("click");
  assert.equal(h.blobCallbacks.length,1);
  h.blobCallbacks[0](new Blob(["fake png"],{type:"image/png"})); await first;
  assert.equal(h.downloads.length,1);
});


test("on-art regions require explicit confirmation, bounded percentages and room for all names", async () => {
  const h = harness(), full = state(50);
  const bare = {approved:true,image:{},url:"blob:fake"};
  assert.equal(h.gate(full,ids[0],undefined,bare).ready,false);
  for (const region of [{x:-1,y:0,width:100,height:100},{x:1,y:0,width:100,height:100},{x:0,y:0,width:0,height:100},{x:NaN,y:0,width:100,height:100}]) {
    assert.equal(h.scope.validPosterRegion(region),false);
    assert.equal(h.gate(full,ids[0],undefined,{...bare,region,regionConfirmed:true}).ready,false);
  }
  assert.throws(() => h.scope.layoutPoster(full.teams[0],(text:string,size:number)=>text.length*size,
    {imageWidth:100,imageHeight:100,region:{x:20,y:20,width:1,height:1}}),/will not fit/);
  h.controller.update({state:full,authenticated:true,online:true}); await h.load();
  await h.confirmRegion(ids[0],{x:0,y:0,width:100,height:100});
  assert.equal(h.query("poster-download")[0].disabled,false);
  const field = h.elements.find((element) => element.id === `poster-region-${ids[0]}-x`);
  field.value = "1"; await field.dispatch("input");
  assert.equal(h.query("poster-download")[0].disabled,true);
  assert.equal(h.elements.find((element) => element.id === `poster-region-confirm-${ids[0]}`).checked,false);
});

test("names are bounded inside the explicit region and no below-art fallback is used", () => {
  const h = harness(), team = state(10).teams[0], region = {x:10,y:50,width:80,height:40};
  const canvas = h.canvas();
  const layout = h.scope.drawPoster(canvas,team,h.scope.identities[0],{width:600,height:800},region);
  assert.equal(canvas.width/canvas.height,600/800);
  for (const entry of layout.entries) {
    assert.ok(entry.x >= canvas.width * .1); assert.ok(entry.x+entry.width <= canvas.width*.9);
    assert.ok(entry.y >= canvas.height * .5); assert.ok(entry.y+entry.height <= canvas.height*.9);
  }
  assert.equal(h.texts.length,team.roster.length);
  assert.throws(() => h.scope.drawPoster(h.canvas(),team,h.scope.identities[0],{width:600,height:800},null));
});


test("different team exports are serialized to bound mobile canvas memory", async () => {
  const h = harness(); h.controller.update({state:state(),authenticated:true,online:true});
  for (const id of ids.slice(0,2)) { await h.load(id); await h.confirmRegion(id); }
  h.deferBlob(); const first = h.query("poster-download")[0].dispatch("click"); await settle();
  assert.equal(h.query("poster-download")[1].disabled,true);
  await h.query("poster-download")[1].dispatch("click"); assert.equal(h.blobCallbacks.length,1);
  h.blobCallbacks[0](new Blob(["fake png"],{type:"image/png"})); await first;
  assert.equal(h.query("poster-download")[1].disabled,false);
});
