import test from "node:test";
import assert from "node:assert/strict";
import {
  auditSnapshot,
  drawPlayer,
  type ReaperState,
} from "../src/rival-reaper/engine.js";
import { fixture, entries } from "./fixtures.js";
import { buildFiveTeamState } from "../src/rival-reaper/roster.js";

for (const count of [43, 45, 46])
  test(`${count} complete draws enforce capacities, gender quotas and household separation`, () => {
    const state = fixture(count);
    for (const p of state.players) drawPlayer(state, p.id, () => 0.73);
    const audit = auditSnapshot(state);
    assert.deepEqual(
      audit.map((t) => t.size),
      count === 46 ? [10, 9, 9, 9, 9] : count === 45 ? [9, 9, 9, 9, 9] : [9, 9, 9, 8, 8],
    );
    assert.ok(
      Math.max(...audit.map((t) => t.male)) -
        Math.min(...audit.map((t) => t.male)) <=
        1,
    );
    assert.ok(
      Math.max(...audit.map((t) => t.female)) -
        Math.min(...audit.map((t) => t.female)) <=
        1,
    );
    for (const t of audit) assert.equal(t.size, t.households);
  });
test("unavoidable household collision is minimized across the complete draw", () => {
  const roster = entries(10).map((p) => ({ ...p, householdId: "one-house" }));
  const state = buildFiveTeamState(roster).state;
  for (const p of state.players) drawPlayer(state, p.id, () => 0);
  assert.deepEqual(
    auditSnapshot(state).map((t) => [t.size, t.male, t.female]),
    Array.from({ length: 5 }, () => [2, 1, 1]),
  );
});
test("duplicate, unknown and no-capacity attempts do not mutate assignments", () => {
  const state = fixture(1);
  drawPlayer(state, "fake-1", () => 0);
  const before = JSON.stringify(state);
  assert.throws(() => drawPlayer(state, "fake-1"), /already assigned/);
  assert.throws(() => drawPlayer(state, "unknown"), /Unknown/);
  assert.equal(JSON.stringify(state), before);
});
test("invalid random values fail before assignment", () => {
  for (const n of [NaN, Infinity, -1, 1]) {
    const state = fixture(5);
    assert.throws(() => drawPlayer(state, "fake-1", () => n), /random/);
    assert.equal(state.assignments.length, 0);
  }
});
test("full teams are excluded while other capacity remains", () => {
  const state = fixture(5);
  const first = drawPlayer(state, "fake-1", () => 0);
  const second = drawPlayer(state, "fake-2", () => 0);
  assert.notEqual(first.team.id, second.team.id);
  assert.deepEqual(second.assignment.excluded[first.team.id], ["team-full"]);
});

const teams = [
  ["blood-bloom", "Blood Bloom"],
  ["pressure-gang", "Pressure Gang"],
  ["high-society", "High Society"],
  ["heat-mob", "Heat Mob"],
  ["pink-venom", "Pink Venom"],
].map(([id, name]) => ({ id: id as any, name, capacity: 2 }));

test("Rival Reaper fills balanced teams without duplicates", () => {
  const players = Array.from({ length: 10 }, (_, i) => ({
    id: `p${i}`,
    name: `Player ${i}`,
    householdId: `h${Math.floor(i / 2)}`,
    gender: (i % 2 ? "female" : "male") as "male" | "female",
  }));
  const state: ReaperState = { players, teams, assignments: [] };
  const sequence = [0.01, 0.91, 0.21, 0.71, 0.41, 0.61, 0.31, 0.81, 0.11, 0.51];
  players.forEach((p, i) => drawPlayer(state, p.id, () => sequence[i]));
  assert.equal(new Set(state.assignments.map((a) => a.playerId)).size, 10);
  assert.deepEqual(
    auditSnapshot(state).map((x) => x.size),
    [2, 2, 2, 2, 2],
  );
  for (const team of auditSnapshot(state)) {
    assert.equal(team.male, 1);
    assert.equal(team.female, 1);
  }
});

test("Black/support crew never enters engine unless explicitly supplied as players", () => {
  const state: ReaperState = {
    players: [
      {
        id: "competitor",
        name: "Competitor",
        householdId: "h1",
        gender: "female",
      },
    ],
    teams: [{ id: "blood-bloom", name: "Blood Bloom", capacity: 1 }],
    assignments: [],
  };
  drawPlayer(state, "competitor", () => 0);
  assert.equal(state.assignments.length, 1);
  assert.equal(state.assignments[0].playerId, "competitor");
});

test("seeded adversarial draw order preserves fairness across twelve full rehearsals", () => {
  for (let seed = 1; seed <= 12; seed++) {
    let value = seed;
    const rng = () => {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      return value / 2 ** 32;
    };
    const count = seed % 2 ? 43 : 45;
    const roster = entries(count);
    if (seed % 3 === 0)
      roster.forEach((p, i) => {
        p.gender = i < 7 ? "female" : "male";
      });
    const state = buildFiveTeamState(roster).state;
    const order = [...state.players];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (const player of order) drawPlayer(state, player.id, rng);
    const audit = auditSnapshot(state);
    for (const team of audit) {
      assert.equal(team.size, team.capacity);
      assert.equal(team.households, team.size);
    }
    for (const key of ["male", "female"] as const)
      assert.ok(
        Math.max(...audit.map((t) => t[key])) -
          Math.min(...audit.map((t) => t[key])) <=
          1,
      );
  }
});
