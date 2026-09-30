import {
  buildFiveTeamState,
  type PrivateRosterEntry,
} from "../src/rival-reaper/roster.js";
export const entries = (count = 45): PrivateRosterEntry[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `fake-${i + 1}`,
    name: `Fake Player ${String(i + 1).padStart(2, "0")}`,
    householdId: `fake-home-${Math.floor(i / 3)}`,
    gender: i % 2 ? "female" : "male",
    status: "competitor",
  }));
export const fixture = (count = 45) => buildFiveTeamState(entries(count)).state;
