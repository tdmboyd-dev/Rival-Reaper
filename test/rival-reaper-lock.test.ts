import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { mkdtemp, readFile, rm, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { syncBuiltinESMExports } from "node:module";
import { acquireSessionLock } from "../src/rival-reaper/lock.js";

async function workspace(t: any) {
  const dir = await mkdtemp(join(tmpdir(), "reaper-lock-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return join(dir, "session.enc.json");
}
async function deadOwner() {
  const child = spawn(process.execPath, ["-e", ""], { stdio: "ignore" });
  await once(child, "exit");
  assert.ok(child.pid);
  assert.throws(() => process.kill(child.pid!, 0), { code: "ESRCH" });
  return JSON.stringify({ pid: child.pid, id: "stopped-test-writer" });
}

test("a paused stale-owner recheck cannot unlink another recovery's new writer", async (t) => {
  const path = await workspace(t);
  await writeFile(path + ".lock", await deadOwner());
  const original = fs.readFile;
  let reads = 0;
  let paused!: () => void;
  let resume!: () => void;
  const observed = new Promise<void>((done) => { paused = done; });
  const continued = new Promise<void>((done) => { resume = done; });
  fs.readFile = (async (...args: Parameters<typeof fs.readFile>) => {
    const result = await original(...args);
    if (args[0] === path + ".lock" && ++reads === 2) {
      paused();
      await continued;
    }
    return result;
  }) as typeof fs.readFile;
  syncBuiltinESMExports();
  let releaseFirst: (() => Promise<void>) | undefined;
  let second: PromiseSettledResult<() => Promise<void>> | undefined;
  try {
    const first = acquireSessionLock(path);
    await observed;
    [second] = await Promise.allSettled([acquireSessionLock(path)]);
    resume();
    releaseFirst = await first;
    assert.equal(second.status, "rejected", "second recovery must not admit another writer");
    if (second.status === "rejected") assert.match(second.reason.message, /recovery/);
    await assert.rejects(acquireSessionLock(path), /active writer/);
  } finally {
    resume();
    fs.readFile = original;
    syncBuiltinESMExports();
    if (releaseFirst) await releaseFirst();
    if (second?.status === "fulfilled") await second.value();
  }
});

test("stale-lock stress admits exactly one of 16 contenders", async (t) => {
  const path = await workspace(t);
  const stopped = await deadOwner();
  for (let round = 0; round < 40; round++) {
    await writeFile(path + ".lock", stopped);
    const results = await Promise.allSettled(
      Array.from({ length: 16 }, () => acquireSessionLock(path)),
    );
    const winners = results.filter((result) => result.status === "fulfilled");
    try {
      assert.equal(winners.length, 1, `round ${round} admitted ${winners.length} writers`);
      const owner = JSON.parse(await readFile(path + ".lock", "utf8"));
      assert.equal(owner.pid, process.pid);
      await assert.rejects(acquireSessionLock(path), /active writer/);
    } finally {
      for (const winner of winners) await winner.value();
    }
  }
});

test("independent processes recovering one stale lock admit one live writer", { timeout: 15000 }, async (t) => {
  const path = await workspace(t);
  await writeFile(path + ".lock", await deadOwner());
  const children: ChildProcess[] = [];
  t.after(async () => {
    await Promise.all(children.map(async (child) => {
      if (child.exitCode === null && child.signalCode === null) {
        const exited = once(child, "exit");
        child.kill("SIGKILL");
        await exited;
      }
    }));
  });
  const source = `
    import { acquireSessionLock } from './src/rival-reaper/lock.ts';
    process.send('ready');
    process.once('message', async () => {
      try {
        const release = await acquireSessionLock(process.argv[1]);
        process.send('acquired');
        process.once('message', async () => { await release(); process.exit(0); });
      } catch (error) { process.send('rejected'); process.disconnect(); }
    });
  `;
  const ready = Array.from({ length: 8 }, () => {
    const child = spawn(process.execPath,
      ["--import", "tsx", "--input-type=module", "-e", source, path],
      { stdio: ["ignore", "ignore", "pipe", "ipc"] });
    children.push(child);
    return once(child, "message");
  });
  await Promise.all(ready);
  const outcomes = children.map(child => once(child, "message"));
  children.forEach(child => child.send("start"));
  const results = await Promise.all(outcomes);
  const winnerIndices = results.flatMap(([result], index) => result === "acquired" ? [index] : []);
  assert.equal(winnerIndices.length, 1);
  await assert.rejects(acquireSessionLock(path), /active writer/);
  const winner = children[winnerIndices[0]];
  const exited = once(winner, "exit");
  winner.send("release");
  await exited;
  const next = await acquireSessionLock(path);
  await next();
});

test("an existing recovery guard fails closed without changing stale lock bytes", async (t) => {
  const path = await workspace(t);
  const stopped = await deadOwner();
  await writeFile(path + ".lock", stopped);
  await writeFile(path + ".lock.recovery", stopped);
  await assert.rejects(acquireSessionLock(path), /recovery.*interrupted/);
  assert.equal(await readFile(path + ".lock", "utf8"), stopped);
  assert.equal(await readFile(path + ".lock.recovery", "utf8"), stopped);
});

test("release is idempotent and cannot remove a successor's lock", async (t) => {
  const path = await workspace(t);
  const release = await acquireSessionLock(path);
  await Promise.all([release(), release(), release()]);
  const successor = await acquireSessionLock(path);
  try {
    const before = await readFile(path + ".lock", "utf8");
    await release();
    assert.equal(await readFile(path + ".lock", "utf8"), before);
    await assert.rejects(acquireSessionLock(path), /active writer/);
  } finally {
    await successor();
  }
});


test("malformed or incomplete lock owners are preserved for inspection", async (t) => {
  const path = await workspace(t);
  const stopped = JSON.parse(await deadOwner());
  for (const content of ["", "{", "null", "{}", JSON.stringify({ pid: stopped.pid }),
    JSON.stringify({ pid: -1, id: "invalid" })]) {
    await writeFile(path + ".lock", content);
    await assert.rejects(acquireSessionLock(path), /Invalid session lock/);
    assert.equal(await readFile(path + ".lock", "utf8"), content);
  }
});

test("a process-probe denial never authorizes lock reclamation", async (t) => {
  const path = await workspace(t);
  const owner = JSON.stringify({ pid: process.pid, id: "protected-writer" });
  await writeFile(path + ".lock", owner);
  t.mock.method(process, "kill", () => { throw Object.assign(new Error("denied"), { code: "EPERM" }); });
  await assert.rejects(acquireSessionLock(path), /Cannot prove session writer is stopped/);
  assert.equal(await readFile(path + ".lock", "utf8"), owner);
});


test("release tolerates an already missing lock path", async (t) => {
  const path = await workspace(t);
  const release = await acquireSessionLock(path);
  await unlink(path + ".lock");
  await Promise.all([release(), release()]);
  const successor = await acquireSessionLock(path);
  try {
    await release();
    await assert.rejects(acquireSessionLock(path), /active writer/);
  } finally {
    await successor();
  }
});


test("an orphan recovery guard blocks fresh acquisition when the normal lock is absent", async (t) => {
  const path = await workspace(t);
  const stopped = await deadOwner();
  await writeFile(path + ".lock.recovery", stopped);
  await assert.rejects(acquireSessionLock(path), /recovery.*interrupted/);
  await assert.rejects(readFile(path + ".lock"), { code: "ENOENT" });
  assert.equal(await readFile(path + ".lock.recovery", "utf8"), stopped);
});
