/** Approved, explicitly selected lineups. Old events always retain their saved list. */
export const TEAM_DEFINITIONS = [
  {id:"blood-bloom",name:"Blood Bloom"},
  {id:"pressure-gang",name:"Pressure Gang"},
  {id:"high-society",name:"High Society"},
  {id:"heat-mob",name:"Heat Mob"},
  {id:"pink-venom",name:"Pink Venom"},
  {id:"belt-2-ass",name:"BELT 2 ASS"},
] as const;
export type TeamId = typeof TEAM_DEFINITIONS[number]["id"];
export type LineupId = "five-v1" | "six-v1";
export function parseLineup(value: unknown = "five-v1"): LineupId {
  if(value!=="five-v1" && value!=="six-v1") throw new Error("Choose explicit lineup five-v1 or six-v1");
  return value;
}
export function lineupTeams(lineup: LineupId = "five-v1") {
  return TEAM_DEFINITIONS.slice(0,parseLineup(lineup)==="six-v1"?6:5);
}
export function identifyLineup(teams: Array<{id:string}>): LineupId | "custom-legacy" {
  const ids=teams.map(t=>t.id).sort().join(",");
  for(const id of ["five-v1","six-v1"] as const)
    if(ids===lineupTeams(id).map(t=>t.id).sort().join(",")) return id;
  return "custom-legacy";
}
