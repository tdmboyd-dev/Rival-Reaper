import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

test("Back/Forward restoration reconnects live state without duplicate streams", async () => {
  const handlers = new Map<string, () => void>();
  const streams: FakeStream[] = [];
  class FakeStream {
    onerror?: () => void;
    state?: (e: { data: string }) => void;
    closed = false;
    constructor(readonly url: string) { streams.push(this); }
    addEventListener(name: string, fn: typeof this.state) { if (name === "state") this.state = fn; }
    close() { this.closed = true; }
  }
  const status = { textContent: "", classList: { toggle() {} } };
  const scope = vm.createContext({ EventSource: FakeStream,
    window: { addEventListener: (name: string, fn: () => void) => handlers.set(name, fn) },
    document: { querySelector: () => status },
  });
  const source = (await readFile("examples/rival-reaper/shared.js", "utf8")).replaceAll("export ", "");
  vm.runInContext(source, scope);
  const rendered: any[] = [], connected: boolean[] = [];
  scope.render = (state: any) => rendered.push(state);
  scope.connected = (value: boolean) => connected.push(value);
  vm.runInContext("connect(render, connected)", scope);
  const send = (stream: FakeStream, revision: number, sessionId = "one") => stream.state!({ data: JSON.stringify({ sessionId, revision }) });
  send(streams[0], 5);
  handlers.get("pageshow")!();
  assert.equal(streams.length, 1);
  handlers.get("pagehide")!();
  assert.equal(streams[0].closed, true);
  assert.equal(connected.at(-1), false);
  handlers.get("pageshow")!();
  assert.equal(streams.length, 2);
  send(streams[0], 99); // Old callbacks must not re-enable controls.
  assert.equal(connected.at(-1), false);
  send(streams[1], 4);
  assert.equal(rendered.length, 1);
  send(streams[1], 6);
  assert.equal(rendered.at(-1).revision, 6);
  send(streams[1], 0, "new-session");
  assert.equal(rendered.at(-1).sessionId, "new-session");
  handlers.get("pagehide")!();
  handlers.get("pageshow")!();
  assert.equal(streams.length, 3);
  assert.equal(streams[1].closed, true);
});
