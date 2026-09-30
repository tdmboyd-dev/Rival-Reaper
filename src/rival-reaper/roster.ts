import type {
  ReaperGender,
  ReaperPlayer,
  ReaperState,
  ReaperTeam,
  TeamId,
} from "./engine.js";

export interface PrivateRosterEntry {
  id: string;
  name: string;
  householdId: string;
  gender: ReaperGender;
  status?: "competitor" | "blackout";
}

import { lineupTeams, type LineupId } from "./lineup.js";

export function validatePrivateRoster(entries: PrivateRosterEntry[]) {
  if (!Array.isArray(entries) || entries.length > 250)
    throw new Error("Roster must be an array of at most 250 entries");
  const ids = new Set<string>();
  const errors: string[] = [];
  for (const [index, entry] of entries.entries()) {
    if (!entry || typeof entry !== "object") {
      errors.push(`row ${index + 1}: object required`);
      continue;
    }
    for (const key of ["id", "name", "householdId"] as const) {
      if (
        typeof entry[key] !== "string" ||
        !entry[key].trim() ||
        entry[key].length > 120 ||
        entry[key] !== entry[key].trim() ||
        /[\x00-\x1f]/.test(entry[key])
      )
        errors.push(`row ${index + 1}: invalid ${key}`);
    }
    if (
      entry.status !== undefined &&
      entry.status !== "competitor" &&
      entry.status !== "blackout"
    )
      errors.push(`row ${index + 1}: invalid status`);
    if (entry.gender !== "male" && entry.gender !== "female")
      errors.push(`row ${index + 1}: gender must be male/female`);
    if (ids.has(entry.id))
      errors.push(`row ${index + 1}: duplicate id ${entry.id}`);
    ids.add(entry.id);
  }
  if (errors.length) throw new Error(errors.join("; "));
  return entries;
}

export function buildLineupState(entries: PrivateRosterEntry[], lineup: LineupId = "five-v1"): {
  state: ReaperState;
  blackout: PrivateRosterEntry[];
} {
  validatePrivateRoster(entries);
  const competitors = entries.filter((e) => e.status !== "blackout");
  const blackout = entries.filter((e) => e.status === "blackout");
  const identities = lineupTeams(lineup);
  const base = Math.floor(competitors.length / identities.length);
  let remainder = competitors.length % identities.length;
  const teams: ReaperTeam[] = identities.map(({id, name}) => ({
    id,
    name,
    capacity: base + (remainder-- > 0 ? 1 : 0),
  }));
  const players: ReaperPlayer[] = competitors.map(
    ({ id, name, householdId, gender }) => ({ id, name, householdId, gender }),
  );
  return { state: { players, teams, assignments: [] }, blackout };
}

/** Compatibility entry point: never silently upgrades a five-team event. */
export function buildFiveTeamState(entries: PrivateRosterEntry[]) {
  return buildLineupState(entries, "five-v1");
}
