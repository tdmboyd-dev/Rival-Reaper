import test from "node:test";
import assert from "node:assert/strict";
import { RevealController } from "../src/rival-reaper/reveal.js";
import { makeReceipt } from "../src/rival-reaper/receipts.js";
import type { ReaperAssignment } from "../src/rival-reaper/engine.js";
import { RivalReaperSession } from "../src/rival-reaper/session.js";
import { fixture } from "./fixtures.js";
test("reveal refuses missing fate, wrong team, forged receipt and invalid restored phase", () => {
  const c = new RevealController();
  assert.throws(() => c.advance(), /No reveal/);
  assert.throws(() => c.begin(undefined as any, {} as any), /receipt/);
  const s = new RivalReaperSession(fixture(5));
  const r = s.drawAndLock("fake-1");
  assert.throws(
    () => c.begin({ ...r.receipt, playerId: "fake-2" }, r.team),
    /locked receipt/,
  );
  assert.throws(
    () => c.begin(r.receipt, { ...r.team, id: "blackout" as any }),
    /locked receipt/,
  );
  c.begin(r.receipt, r.team);
  assert.throws(() => c.begin(r.receipt, r.team), /already active/);
  assert.throws(
    () =>
      c.restore({ ...c.current(), phase: "idle" }, s.receipts, s.state.teams),
    /locked fate/,
  );
});

test("reveal walks the locked fate through every theatrical phase", () => {
  const assignment: ReaperAssignment = {
    playerId: "p1",
    teamId: "blood-bloom",
    drawIndex: 1,
    eligibleTeamIds: ["blood-bloom"],
    excluded: {},
    randomUnit: 0.2,
  };
  const receipt = makeReceipt(
    "s",
    assignment,
    null,
    "2026-10-01T12:00:00Z",
    "nonce",
  );
  const reveal = new RevealController();
  assert.equal(
    reveal.begin(receipt, {
      id: "blood-bloom",
      name: "Blood Bloom",
      capacity: 9,
    }).phase,
    "machine-awakens",
  );
  const phases = [];
  while (reveal.current().phase !== "roster-updated")
    phases.push(reveal.advance().phase);
  assert.deepEqual(phases, [
    "colors-fight",
    "badge-selected",
    "ticket-ejects",
    "ink-1",
    "ink-2",
    "ink-3",
    "name-revealed",
    "team-explosion",
    "roster-updated",
  ]);
  assert.equal(reveal.current().receiptHash, receipt.receiptHash);
});
