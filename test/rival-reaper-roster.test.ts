import test from "node:test";
import assert from "node:assert/strict";
import { buildFiveTeamState } from "../src/rival-reaper/roster.js";
import { entries } from "./fixtures.js";
test("malformed roster and duplicate IDs fail closed", () => {
  for (const value of [
    null,
    {},
    [null],
    [{ id: 42 }],
    entries(2).map((p) => ({ ...p, id: "same" })),
    [{ ...entries(1)[0], status: "blackot" }],
    [{ ...entries(1)[0], id: " padded " }],
  ])
    assert.throws(() => buildFiveTeamState(value as any));
});

test("45 competitors become five teams of nine and blackout stays outside", () => {
  const entries = Array.from({ length: 47 }, (_, i) => ({
    id: `p${i}`,
    name: `Person ${i}`,
    householdId: `h${Math.floor(i / 3)}`,
    gender: (i % 2 ? "female" : "male") as "male" | "female",
    status: (i >= 45 ? "blackout" : "competitor") as "competitor" | "blackout",
  }));
  const { state, blackout } = buildFiveTeamState(entries);
  assert.equal(state.players.length, 45);
  assert.deepEqual(
    state.teams.map((t) => t.capacity),
    [9, 9, 9, 9, 9],
  );
  assert.equal(blackout.length, 2);
});

test("uneven counts distribute capacities by at most one", () => {
  const entries = Array.from({ length: 43 }, (_, i) => ({
    id: `p${i}`,
    name: `Person ${i}`,
    householdId: `h${i}`,
    gender: (i % 2 ? "female" : "male") as "male" | "female",
  }));
  const { state } = buildFiveTeamState(entries);
  assert.deepEqual(
    state.teams.map((t) => t.capacity),
    [9, 9, 9, 8, 8],
  );
});
