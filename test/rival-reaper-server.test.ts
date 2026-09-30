import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { createRivalReaperServer } from "../src/rival-reaper/server.js";
import { canonical, verifyReceiptChain } from "../src/rival-reaper/receipts.js";
import { fixture } from "./fixtures.js";
const token = "fake-host-test-token-32-characters";
const secret = "fake-encryption-secret-32-characters";
async function setup(t: any, count = 10) {
  const dir = await mkdtemp(join(tmpdir(), "reaper-test-"));
  const options = {
    port: 0,
    hostToken: token,
    secret,
    dataPath: join(dir, "session.enc.json"),
    initialState: fixture(count),
  };
  let app = await createRivalReaperServer(options);
  await app.listen();
  let base = `http://127.0.0.1:${(app.server.address() as any).port}`;
  t.after(async () => {
    await app.close();
    await rm(dir, { recursive: true, force: true });
  });
  const state = () => fetch(base + "/api/state").then((r) => r.json());
  const post = (
    path: string,
    input: any,
    auth: string | undefined = "Bearer " + token,
  ) =>
    fetch(base + path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(auth ? { authorization: auth } : {}),
      },
      body: typeof input === "string" ? input : JSON.stringify(input),
    });
  let sequence = 0;
  const command = async (path: string, extra: any = {}) =>
    post(path, {
      commandId: `command-${++sequence}`,
      expectedRevision: (await state()).revision,
      ...extra,
    });
  const audit = () =>
    fetch(base + "/api/host/audit", {
      headers: { authorization: "Bearer " + token },
    }).then((r) => r.json());
  return {
    state,
    post,
    command,
    audit,
    options,
    get app() {
      return app;
    },
    get base() {
      return base;
    },
    restart: async () => {
      await app.close();
      app = await createRivalReaperServer(options);
      await app.listen();
      base = `http://127.0.0.1:${(app.server.address() as any).port}`;
    },
  };
}
test("host routes reject missing, bare, malformed and incorrect auth", async (t) => {
  const x = await setup(t);
  for (const auth of ["", token, "Basic " + token, "Bearer wrong"]) {
    assert.equal((await x.post("/api/host/draw", {}, auth)).status, 401);
    assert.equal(
      (
        await fetch(x.base + "/api/host/audit", {
          headers: auth ? { authorization: auth } : {},
        })
      ).status,
      401,
    );
  }
  assert.equal((await x.state()).drawCount, 0);
});
test("malformed body, missing command and oversized request are rejected", async (t) => {
  const x = await setup(t);
  for (const input of ["{", "[]", "null", "{}"])
    assert.equal((await x.post("/api/host/draw", input)).status, 400);
  assert.equal(
    (
      await x.post(
        "/api/host/draw",
        JSON.stringify({ huge: "x".repeat(65000) }),
      )
    ).status,
    413,
  );
  assert.equal((await x.state()).revision, 0);
});
test("reveal without fate and unknown player fail without mutation", async (t) => {
  const x = await setup(t);
  assert.equal((await x.command("/api/host/reveal/advance")).status, 409);
  assert.equal(
    (await x.command("/api/host/draw", { playerId: "unknown" })).status,
    409,
  );
  assert.equal((await x.state()).revision, 0);
});
test("parallel identical commands lock once and replay once", async (t) => {
  const x = await setup(t);
  const input = {
    playerId: "fake-1",
    commandId: "double-click-01",
    expectedRevision: 0,
  };
  const responses = await Promise.all([
    x.post("/api/host/draw", input),
    x.post("/api/host/draw", input),
  ]);
  assert.deepEqual(
    responses.map((r) => r.status),
    [200, 200],
  );
  const values = await Promise.all(responses.map((r) => r.json()));
  assert.equal(values.filter((v) => v.replayed).length, 1);
  assert.equal((await x.audit()).payload.receipts.length, 1);
});
test("parallel different commands and second draw cannot consume another fate", async (t) => {
  const x = await setup(t);
  const responses = await Promise.all([
    x.post("/api/host/draw", {
      playerId: "fake-1",
      commandId: "race-0001",
      expectedRevision: 0,
    }),
    x.post("/api/host/draw", {
      playerId: "fake-2",
      commandId: "race-0002",
      expectedRevision: 0,
    }),
  ]);
  assert.deepEqual(responses.map((r) => r.status).sort(), [200, 409]);
  assert.equal(
    (await x.command("/api/host/draw", { playerId: "fake-3" })).status,
    409,
  );
  assert.equal((await x.audit()).payload.receipts.length, 1);
});
test("replay advance is idempotent; command reuse and stale revisions fail", async (t) => {
  const x = await setup(t);
  await x.command("/api/host/draw", { playerId: "fake-1" });
  const input = { commandId: "advance-0001", expectedRevision: 1 };
  assert.equal((await x.post("/api/host/reveal/advance", input)).status, 200);
  assert.equal((await x.post("/api/host/reveal/advance", input)).status, 200);
  assert.equal((await x.state()).reveal.phase, "colors-fight");
  assert.equal(
    (
      await x.post("/api/host/reveal/advance", {
        ...input,
        expectedRevision: 2,
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await x.post("/api/host/reveal/advance", {
        ...input,
        commandId: "stale-0001",
      })
    ).status,
    409,
  );
});
test("presentation redacts fate and private metadata until their authorized phases", async (t) => {
  const x = await setup(t);
  await x.command("/api/host/draw", { playerId: "fake-1" });
  let s = await x.state();
  assert.equal(s.reveal.teamId, null);
  assert.equal(s.reveal.playerName, null);
  assert.ok(!JSON.stringify(s).includes("household"));
  assert.ok(!JSON.stringify(s).includes("fake-1"));
  assert.ok(!("assignments" in s));
  assert.ok(!("lastReceiptHash" in s));
  await x.command("/api/host/reveal/advance");
  await x.command("/api/host/reveal/advance");
  s = await x.state();
  assert.ok(s.reveal.teamId);
  assert.equal(s.reveal.playerName, null);
  for (let i = 0; i < 5; i++) await x.command("/api/host/reveal/advance");
  s = await x.state();
  assert.equal(s.reveal.phase, "name-revealed");
  assert.equal(s.reveal.playerName, "Fake Player 01");
  assert.equal(
    s.teams.reduce((n: number, t: any) => n + t.assigned, 0),
    0,
  );
  await x.command("/api/host/reveal/advance");
  await x.command("/api/host/reveal/advance");
  s = await x.state();
  assert.equal(
    s.teams.reduce((n: number, t: any) => n + t.assigned, 0),
    1,
  );
});
test("restart at every reveal phase preserves fate and command journal", async (t) => {
  const x = await setup(t);
  const input = {
    commandId: "restart-draw",
    expectedRevision: 0,
    playerId: "fake-1",
  };
  await x.post("/api/host/draw", input);
  const hash = (await x.audit()).payload.receipts[0].receiptHash;
  for (let i = 0; i < 10; i++) {
    const before = await x.state();
    await x.restart();
    assert.deepEqual(await x.state(), before);
    assert.equal((await x.audit()).payload.receipts[0].receiptHash, hash);
    assert.equal((await x.post("/api/host/draw", input)).status, 200);
    if (i < 9)
      assert.equal((await x.command("/api/host/reveal/advance")).status, 200);
  }
  assert.equal(
    (await x.command("/api/host/draw", { playerId: "fake-1" })).status,
    409,
  );
  assert.equal(
    (await x.command("/api/host/draw", { playerId: "fake-2" })).status,
    200,
  );
});
test("SSE initial connection and reconnect supply current authoritative state", async (t) => {
  const x = await setup(t);
  async function event() {
    const abort = new AbortController();
    const r = await fetch(x.base + "/api/events", { signal: abort.signal });
    const read = await r.body!.getReader().read();
    abort.abort();
    return new TextDecoder().decode(read.value);
  }
  assert.match(await event(), /"phase":"idle"/);
  await x.command("/api/host/draw", { playerId: "fake-1" });
  assert.match(await event(), /"phase":"machine-awakens"/);
  await x.restart();
  assert.match(await event(), /"phase":"machine-awakens"/);
});
test("audit export is integrity-checkable and encrypted file contains no clear roster", async (t) => {
  const x = await setup(t);
  await x.command("/api/host/draw", { playerId: "fake-1" });
  const bundle = await x.audit();
  assert.equal(
    bundle.bundleHash,
    createHash("sha256").update(canonical(bundle.payload)).digest("hex"),
  );
  assert.equal(verifyReceiptChain(bundle.payload.receipts), true);
  const payload = await readFile(x.options.dataPath, "utf8");
  assert.ok(!payload.includes("Fake Player"));
  assert.ok(!payload.includes("fake-home"));
});
test("save failure publishes no new fate and disables all further mutations", async (t) => {
  let calls = 0;
  const app = await createRivalReaperServer({
    port: 0,
    hostToken: token,
    secret,
    dataPath: "unused",
    initialState: fixture(5),
    store: {
      load: async () => null,
      save: async () => {
        if (++calls > 1) throw new Error("disk full");
      },
    },
  });
  await app.listen();
  t.after(() => app.close());
  const base = `http://127.0.0.1:${(app.server.address() as any).port}`;
  for (let i = 0; i < 2; i++) {
    const r = await fetch(base + "/api/host/draw", {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        commandId: "diskfail-0001",
        expectedRevision: 0,
        playerId: "fake-1",
      }),
    });
    assert.equal(r.status, 503);
  }
  const s = await fetch(base + "/api/state").then((r) => r.json());
  assert.equal(s.drawCount, 0);
  assert.equal(s.healthy, false);
});
test("cross-origin commands are rejected and static traversal is not served", async (t) => {
  const x = await setup(t);
  const r = await fetch(x.base + "/api/host/draw", {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      origin: "https://evil.invalid",
    },
    body: "{}",
  });
  assert.equal(r.status, 403);
  assert.equal((await fetch(x.base + "/package.json")).status, 404);
});

// The original 8 tests did not exercise independent processes or durable reveal.
import { spawn, type ChildProcess } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { once } from "node:events";
import { entries } from "./fixtures.js";
test("second local writer is refused without touching the existing snapshot", async (t) => {
  const x = await setup(t);
  await x.command("/api/host/draw", { playerId: "fake-1" });
  await assert.rejects(
    () => createRivalReaperServer(x.options),
    /active writer/,
  );
  assert.equal((await x.state()).drawCount, 1);
});
test("killed CLI process recovers encrypted fate and ink phase without reroll", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "reaper-process-"));
  const roster = join(dir, "fake-roster.json");
  await writeFile(roster, JSON.stringify(entries(10)));
  let child: ChildProcess | undefined;
  const env = {
    ...process.env,
    PORT: "0",
    RIVAL_REAPER_ROSTER: roster,
    RIVAL_REAPER_HOST_TOKEN: token,
    RIVAL_REAPER_SECRET: secret,
    RIVAL_REAPER_DATA: join(dir, "session.enc.json"),
  };
  async function start() {
    child = spawn(
      process.execPath,
      ["--import", "tsx", "src/rival-reaper/cli.ts"],
      { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
    );
    let output = "";
    await new Promise<void>((done, reject) => {
      const timeout = setTimeout(
        () => reject(Error("CLI startup timeout")),
        15000,
      );
      child!.once("exit", (code) => {
        clearTimeout(timeout);
        reject(Error("CLI exited " + code));
      });
      child!.stdout!.on("data", (chunk) => {
        output += chunk.toString();
        if (output.includes("listening on")) {
          clearTimeout(timeout);
          done();
        }
      });
    });
    const url = output.match(/http:\/\/localhost:(\d+)/)?.[1];
    if (!url || url === "0")
      throw Error("CLI did not report its actual listening port");
    return "http://127.0.0.1:" + url;
  }
  t.after(async () => {
    if (child && child.exitCode === null) {
      const exited = once(child, "exit");
      child.kill("SIGKILL");
      await exited;
    }
    await rm(dir, { recursive: true, force: true });
  });
  let base = await start();
  const command = async (path: string, input: any) => {
    const r = await fetch(base + path, {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
    });
    assert.equal(r.status, 200);
    return r.json();
  };
  await command("/api/host/draw", {
    commandId: "process-draw",
    expectedRevision: 0,
    playerId: "fake-1",
  });
  for (let i = 1; i <= 4; i++)
    await command("/api/host/reveal/advance", {
      commandId: "process-advance-" + i,
      expectedRevision: i,
    });
  const before = await fetch(base + "/api/state").then((r) => r.json());
  assert.equal(before.reveal.phase, "ink-1");
  const exited = once(child!, "exit");
  child!.kill("SIGKILL");
  await exited;
  base = await start();
  assert.deepEqual(
    await fetch(base + "/api/state").then((r) => r.json()),
    before,
  );
  const replay = await command("/api/host/draw", {
    commandId: "process-draw",
    expectedRevision: 0,
    playerId: "fake-1",
  });
  assert.equal(replay.replayed, true);
  assert.equal(replay.state.drawCount, 1);
});
