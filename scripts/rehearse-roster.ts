import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildFiveTeamState } from "../src/rival-reaper/roster.js";
import { drawPlayer, auditSnapshot } from "../src/rival-reaper/engine.js";

// A throwaway preflight. Never starts a server, creates a session, emits names,
// writes an audit, or changes the real event's locked fates.
const path = process.argv[2] ?? process.env.RIVAL_REAPER_ROSTER;
if (!path) throw new Error("Supply an absolute private roster JSON path: npm run rehearse -- /path/to/roster.json");
const entries = JSON.parse(await readFile(resolve(path), "utf8"));
const { state, blackout } = buildFiveTeamState(entries);
if (!state.players.length) throw new Error("The roster has no competitors");
for (let seed = 1; seed <= 12; seed++) {
  const copy = structuredClone(state);
  let value = seed;
  const rng = () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 2 ** 32; };
  const order = [...copy.players];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (const player of order) drawPlayer(copy, player.id, rng);
  const teams = auditSnapshot(copy);
  console.log(JSON.stringify({ rehearsal: seed, competitors: state.players.length,
    supportExcluded: blackout.length, teams: teams.map(({ teamName, size, capacity, male, female, households }) =>
      ({ teamName, size, capacity, male, female, householdCollisions: size - households })) }));
}
console.log("PASS: 12 throwaway complete-draw rehearsals. Real event session untouched. This is not physical-device or visual approval.");
