import test from "node:test";
import assert from "node:assert/strict";
import {
  encryptSnapshot,
  decryptSnapshot,
} from "../src/rival-reaper/persistence.js";
import type { ReaperSnapshot } from "../src/rival-reaper/receipts.js";
import { RivalReaperSession } from "../src/rival-reaper/session.js";
import { fixture } from "./fixtures.js";
test("corrupt snapshot ciphertext and unsupported envelope are rejected", () => {
  const s = new RivalReaperSession(fixture(5));
  s.drawAndLock("fake-1");
  const encrypted = encryptSnapshot(
    s.snapshot(),
    "fake-test-secret-at-least-32-characters",
  );
  const payload = JSON.parse(encrypted);
  payload.ciphertext = Buffer.alloc(100).toString("base64");
  assert.throws(() =>
    decryptSnapshot(
      JSON.stringify(payload),
      "fake-test-secret-at-least-32-characters",
    ),
  );
  assert.throws(() =>
    decryptSnapshot("{", "fake-test-secret-at-least-32-characters"),
  );
  assert.throws(() =>
    decryptSnapshot(
      '{"format":"wrong"}',
      "fake-test-secret-at-least-32-characters",
    ),
  );
});

test("encrypted snapshot round-trips and rejects wrong secret", () => {
  const snapshot: ReaperSnapshot = {
    version: 1,
    sessionId: "s",
    state: { players: [], teams: [], assignments: [] },
    receipts: [],
  };
  const encrypted = encryptSnapshot(snapshot, "this-is-a-long-test-secret");
  assert.equal(encrypted.includes('"sessionId":"s"'), false);
  assert.deepEqual(
    decryptSnapshot(encrypted, "this-is-a-long-test-secret"),
    snapshot,
  );
  assert.throws(() => decryptSnapshot(encrypted, "this-is-the-wrong-secret"));
});
