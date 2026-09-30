import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = (await readFile(
  new URL("../examples/rival-reaper/host.js", import.meta.url),
  "utf8",
)).replace(/^import .*\n/gm, "");
function hostState(overrides: Record<string, unknown> = {}) {
  return {
    sessionId: "session-a",
    revision: 0,
    healthy: true,
    remaining: 5,
    drawCount: 0,
    teams: [],
    reveal: { phase: "idle" },
    players: [{ id: "private-player", name: "Private Player" }],
    lastReceiptHash: "private-receipt",
    ...overrides,
  };
}
function deferredResponse() {
  let resolve!: (value: unknown) => void;
  const promise = new Promise((done) => { resolve = done; });
  return {
    promise,
    resolve: (value: unknown, status = 200) => resolve({
      ok: status < 400,
      status,
      json: async () => value,
    }),
  };
}
async function harness() {
  const nodes = new Map<string, any>();
  function $(selector: string): any {
    if (!nodes.has(selector)) nodes.set(selector, {
      value: "", hidden: false, textContent: "", disabled: false,
      open: false, children: [], style: {},
      addEventListener() {}, focus() {},
      append(child: any) { this.children.push(child); },
      replaceChildren(...children: any[]) { this.children = children; this.value = ""; },
      close() { this.open = false; }, showModal() { this.open = true; },
    });
    return nodes.get(selector);
  }
  let render!: (value: any) => void;
  let connection!: (value: boolean) => void;
  let responder: (path: string, options: any) => any = async () => ({
    ok: true, json: async () => hostState(),
  });
  const requests: Array<{path: string; options: any}> = [];
  let exports = 0;
  const context = vm.createContext({
    $, renderTeams() {}, phases: ["idle", "ink-2", "ink-3"],
    connect(onState: typeof render, onConnection: typeof connection) {
      render = onState; connection = onConnection;
    },
    document: {
      querySelector: $,
      querySelectorAll: () => [],
      createElement: () => ({ click() { exports++; } }),
    },
    createPosterControls: () => ({ update() {} }),
    Option: function(this: any, name: string, id: string) { this.text = name; this.value = id; },
    AbortController, AbortSignal, Blob,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    setTimeout: () => 0,
    crypto: { randomUUID: () => "test-command-uuid" },
    fetch: (path: string, options: any) => {
      requests.push({ path, options });
      return responder(path, options);
    },
  });
  vm.runInContext(source, context);
  connection(true);
  render(hostState());
  return {
    $, requests, render,
    setResponder(next: typeof responder) { responder = next; },
    inspect: (expression: string) => vm.runInContext(expression, context),
    exports: () => exports,
    login: async (token = "fake-token") => {
      $("#token").value = token;
      await $("#auth-form").onsubmit({ preventDefault() {} });
    },
    logout: () => $("#logout").onclick(),
  };
}
const settle = () => new Promise<void>((done) => setImmediate(done));

test("logout aborts an audit fetch and ignores a response delivered afterward", async () => {
  const h = await harness();
  await h.login();
  const delayed = deferredResponse();
  h.setResponder(() => delayed.promise);
  const audit = h.$("#audit-open").onclick();
  h.logout();
  assert.equal(h.requests.at(-1)!.options.signal.aborted, true);
  delayed.resolve({ payload: { ...hostState(), receipts: [] }, bundleHash: "private-bundle" });
  await audit;
  assert.equal(h.$("#audit-dialog").open, false);
  assert.equal(h.$("#audit-text").textContent, "");
  assert.equal(h.inspect("bundle"), null);
  h.$("#export").onclick();
  assert.equal(h.exports(), 0);
  assert.match(h.$("#message").textContent, /Host locked/);
});

test("logout prevents a delayed private roster refresh from restoring private DOM", async () => {
  const h = await harness();
  await h.login();
  const delayed = deferredResponse();
  h.setResponder(() => delayed.promise);
  h.render(hostState({ revision: 1 }));
  h.logout();
  delayed.resolve(hostState({ revision: 1 }));
  await settle();
  assert.equal(h.$("#player").children.length, 0);
  assert.equal(h.$("#receipt").textContent, "");
  assert.equal(h.$("#controls").hidden, true);
  assert.equal(h.$("#draw").disabled, true);
});

for (const status of [200, 401])
  test(`an old login response (${status}) cannot change a newer login`, async () => {
    const h = await harness();
    const delayed = deferredResponse();
    h.setResponder(() => delayed.promise);
    const oldLogin = h.login("old-token");
    h.logout();
    h.setResponder(async () => ({ ok: true, json: async () => hostState() }));
    await h.login("new-token");
    delayed.resolve(status === 200 ? hostState() : { error: "old token expired" }, status);
    await oldLogin;
    assert.equal(h.inspect("token"), "new-token");
    assert.equal(h.$("#auth-panel").hidden, true);
    assert.equal(h.$("#controls").hidden, false);
    assert.match(h.$("#message").textContent, /Host unlocked/);
  });

test("logout during the third yank prevents automatic name-reveal continuation", async () => {
  const h = await harness();
  const active = hostState({ reveal: { phase: "ink-2" }, revision: 6, drawCount: 1 });
  h.render(active);
  h.setResponder(async () => ({ ok: true, json: async () => active }));
  await h.login();
  const delayed = deferredResponse();
  h.setResponder(() => delayed.promise);
  h.$("#advance").onclick();
  assert.equal(JSON.parse(h.requests.at(-1)!.options.body).expectedSessionId, "session-a");
  h.logout();
  delayed.resolve({ state: { ...active, revision: 7, reveal: { phase: "ink-3" } } });
  await settle();
  assert.equal(h.requests.filter((r) => r.options.method === "POST").length, 1);
  assert.equal(h.inspect("pending"), null);
  assert.equal(h.$("#controls").hidden, true);
  assert.match(h.$("#message").textContent, /Host locked/);
});

test("a new server session locks the host and resets private revision before reauthentication", async () => {
  const h = await harness();
  const old = hostState({ revision: 30 });
  h.render(old);
  h.setResponder(async () => ({ ok: true, json: async () => old }));
  await h.login();
  const next = hostState({ sessionId: "session-b", players: [{ id: "new-id", name: "New Person" }] });
  h.render(next);
  assert.equal(h.$("#controls").hidden, true);
  assert.equal(h.$("#player").children.length, 0);
  assert.equal(h.inspect("privateRevision"), -1);
  h.setResponder(async () => ({ ok: true, json: async () => next }));
  await h.login();
  assert.equal(h.inspect("privateRevision"), 0);
  assert.equal(h.$("#player").children[1].text, "New Person");
  assert.equal(h.$("#controls").hidden, false);
});

test("another host reaching ink-3 does not turn an earlier beat into a name reveal", async () => {
  const h = await harness();
  const before = hostState({ revision: 1, reveal: { phase: "machine-awakens" } });
  h.render(before);
  h.setResponder(async () => ({ ok: true, json: async () => before }));
  await h.login();
  h.setResponder(async (_path, options) => ({
    ok: true,
    json: async () => options.method === "POST"
      ? { appliedRevision: 2, state: hostState({ revision: 2, reveal: { phase: "colors-fight" } }) }
      : hostState({ revision: 7, reveal: { phase: "ink-3" } }),
  }));
  await h.inspect('execute({path:"/api/host/reveal/advance",input:{commandId:"earlier-beat",expectedRevision:1}})');
  assert.equal(h.requests.filter((r) => r.options.method === "POST").length, 1);
  assert.equal(h.$("#advance-label").textContent, "REVEAL THE NAME");
});

test("the third yank still automatically reveals the name when its own revision is current", async () => {
  const h = await harness();
  let current = hostState({ revision: 6, reveal: { phase: "ink-2" } });
  h.render(current);
  h.setResponder(async () => ({ ok: true, json: async () => current }));
  await h.login();
  h.setResponder(async (_path, options) => {
    if (options.method === "POST") {
      current = hostState({
        revision: current.revision + 1,
        reveal: { phase: current.revision === 6 ? "ink-3" : "name-revealed" },
      });
      return { ok: true, json: async () => ({ appliedRevision: current.revision, state: current }) };
    }
    return { ok: true, json: async () => current };
  });
  await h.inspect('execute({path:"/api/host/reveal/advance",input:{commandId:"third-yank",expectedRevision:6}})');
  assert.equal(h.requests.filter((r) => r.options.method === "POST").length, 2);
  const continuation = JSON.parse(h.requests.filter((r) => r.options.method === "POST")[1].options.body);
  assert.equal(continuation.expectedSessionId, "session-a");
  assert.equal(h.inspect("state.reveal.phase"), "name-revealed");
});

test("official draw commands bind the session observed when the host submits", async () => {
  const h = await harness();
  await h.login();
  const delayed = deferredResponse();
  h.setResponder(() => delayed.promise);
  h.$("#player").value = "private-player";
  h.$("#draw-form").onsubmit({ preventDefault() {} });
  const request = h.requests.at(-1)!;
  const input = JSON.parse(request.options.body);
  assert.equal(request.path, "/api/host/draw");
  assert.equal(input.expectedSessionId, "session-a");
  assert.equal(input.expectedRevision, 0);
  // A newer server may share the revision and player ID; the old payload must
  // retain the old identity so the server can reject it before consuming fate.
  h.render(hostState({ sessionId: "session-b" }));
  assert.equal(input.expectedSessionId, "session-a");
  delayed.resolve({ error: "Session changed" }, 409);
  await settle();
  assert.equal(h.inspect("token"), "");
});
