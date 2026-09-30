import { randomInt } from "node:crypto";
import { feasibleTeams } from "./fairness.js";
export type ReaperGender = "male" | "female";
import { TEAM_DEFINITIONS, type TeamId } from "./lineup.js";
export type { TeamId } from "./lineup.js";
export interface ReaperPlayer {
  id: string;
  name: string;
  householdId: string;
  gender: ReaperGender;
}
export interface ReaperTeam {
  id: TeamId;
  name: string;
  capacity: number;
}
export interface ReaperAssignment {
  playerId: string;
  teamId: TeamId;
  drawIndex: number;
  eligibleTeamIds: TeamId[];
  excluded: Partial<Record<TeamId, string[]>>;
  randomUnit: number;
}
export interface ReaperState {
  players: ReaperPlayer[];
  teams: ReaperTeam[];
  assignments: ReaperAssignment[];
}
export interface DrawResult {
  assignment: ReaperAssignment;
  team: ReaperTeam;
}
const identities = new Set<string>(TEAM_DEFINITIONS.map(t => t.id));
export function validateState(state: ReaperState) {
  if (
    !state ||
    !Array.isArray(state.players) ||
    !Array.isArray(state.teams) ||
    !Array.isArray(state.assignments)
  )
    throw new Error("Invalid state");
  if (state.players.length > 250)
    throw new Error("Roster exceeds search safety limit");
  if (new Set(state.players.map((p) => p.id)).size !== state.players.length)
    throw new Error("Duplicate player");
  for (const p of state.players)
    if (
      !p ||
      typeof p.id !== "string" ||
      !p.id ||
      typeof p.name !== "string" ||
      !p.name ||
      typeof p.householdId !== "string" ||
      !p.householdId ||
      !["male", "female"].includes(p.gender)
    )
      throw new Error("Invalid player");
  if (new Set(state.teams.map((t) => t.id)).size !== state.teams.length)
    throw new Error("Duplicate team");
  for (const t of state.teams)
    if (
      !identities.has(t.id) ||
      !Number.isSafeInteger(t.capacity) ||
      t.capacity < 0
    )
      throw new Error("Invalid team");
  if (state.teams.reduce((n, t) => n + t.capacity, 0) !== state.players.length)
    throw new Error("Team capacity must equal player count");
  const ids = new Set<string>();
  for (const [i, a] of state.assignments.entries()) {
    if (
      !state.players.some((p) => p.id === a.playerId) ||
      !state.teams.some((t) => t.id === a.teamId) ||
      ids.has(a.playerId) ||
      a.drawIndex !== i + 1 ||
      !Number.isFinite(a.randomUnit) ||
      a.randomUnit < 0 ||
      a.randomUnit >= 1 ||
      !a.eligibleTeamIds.includes(a.teamId)
    )
      throw new Error("Invalid assignment");
    ids.add(a.playerId);
  }
  for (const t of state.teams)
    if (state.assignments.filter((a) => a.teamId === t.id).length > t.capacity)
      throw new Error("Team over capacity");
}
export function eligibleTeams(state: ReaperState, player: ReaperPlayer) {
  validateState(state);
  if (!state.players.some((p) => p.id === player.id))
    throw new Error("Unknown player");
  if (state.assignments.some((a) => a.playerId === player.id))
    throw new Error("Player already assigned");
  const completion = feasibleTeams(state, player);
  const sizes = completion.teams.map(
    (t) => state.assignments.filter((a) => a.teamId === t.id).length,
  );
  const min = Math.min(...sizes);
  const eligible = completion.teams.filter((_, i) => sizes[i] === min);
  const excluded: ReaperAssignment["excluded"] = {};
  for (const t of state.teams)
    if (!eligible.includes(t))
      excluded[t.id] = [
        state.assignments.filter((a) => a.teamId === t.id).length >= t.capacity
          ? "team-full"
          : "balanced-completion-or-size-preference",
      ];
  return { eligible, excluded };
}
export function drawPlayer(
  state: ReaperState,
  playerId: string,
  random: () => number = () => randomInt(0, 2 ** 48 - 1) / (2 ** 48 - 1),
): DrawResult {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Unknown player");
  const { eligible, excluded } = eligibleTeams(state, player);
  const randomUnit = random();
  if (!Number.isFinite(randomUnit) || randomUnit < 0 || randomUnit >= 1)
    throw new Error("Invalid random source");
  const team = eligible[Math.floor(randomUnit * eligible.length)];
  const assignment: ReaperAssignment = {
    playerId,
    teamId: team.id,
    drawIndex: state.assignments.length + 1,
    eligibleTeamIds: eligible.map((t) => t.id),
    excluded,
    randomUnit,
  };
  state.assignments.push(assignment);
  return { assignment, team };
}
export function auditSnapshot(state: ReaperState) {
  return state.teams.map((team) => {
    const ids = new Set(
      state.assignments
        .filter((a) => a.teamId === team.id)
        .map((a) => a.playerId),
    );
    const roster = state.players.filter((p) => ids.has(p.id));
    return {
      teamId: team.id,
      teamName: team.name,
      size: roster.length,
      capacity: team.capacity,
      male: roster.filter((p) => p.gender === "male").length,
      female: roster.filter((p) => p.gender === "female").length,
      households: new Set(roster.map((p) => p.householdId)).size,
    };
  });
}
