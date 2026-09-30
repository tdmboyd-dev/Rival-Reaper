import test from "node:test";
import assert from "node:assert/strict";
import {
  RivalReaperSession,
  type RandomSource,
} from "../src/rival-reaper/session.js";
import type { ReaperState } from "../src/rival-reaper/engine.js";
import { fixture } from "./fixtures.js";
test("restore rejects assignments diverging from valid receipts", () => {
  const session = new RivalReaperSession(fixture(5));
  session.drawAndLock("fake-1");
  const snapshot = session.snapshot();
  snapshot.state.assignments[0].playerId = "fake-2";
  assert.throws(
    () => RivalReaperSession.restore(snapshot),
    /identity mismatch/,
  );
});
test("snapshots and constructor input cannot mutate locked session", () => {
  const state = fixture(5);
  const session = new RivalReaperSession(state);
  session.drawAndLock("fake-1");
  state.players[0].name = "CHANGED";
  const snap = session.snapshot();
  snap.state.players[0].name = "MUTATED";
  assert.equal(session.state.players[0].name, "Fake Player 01");
});

class FixedRandom implements RandomSource {
  label = "fixed-test";
  constructor(private values: number[]) {}
  next() {
    const value = this.values.shift();
    if (value === undefined) throw new Error("No random value");
    return value;
  }
}

test("session can snapshot and restore locked draw history", () => {
  const state: ReaperState = {
    players: [
      { id: "p1", name: "One", householdId: "h1", gender: "male" },
      { id: "p2", name: "Two", householdId: "h2", gender: "female" },
    ],
    teams: [
      { id: "blood-bloom", name: "Blood Bloom", capacity: 1 },
      { id: "pressure-gang", name: "Pressure Gang", capacity: 1 },
    ],
    assignments: [],
  };
  const session = new RivalReaperSession(state, {
    sessionId: "test-session",
    random: new FixedRandom([0]),
  });
  session.drawAndLock("p1", "2026-10-01T12:00:00Z");
  const restored = RivalReaperSession.restore(
    session.snapshot(),
    new FixedRandom([0]),
  );
  assert.equal(restored.receipts.length, 1);
  assert.equal(restored.state.assignments.length, 1);
  restored.drawAndLock("p2", "2026-10-01T12:01:00Z");
  assert.equal(restored.receipts.length, 2);
});
