import type { ReaperPlayer, ReaperState } from "./engine.js";

/** Bounded exact completion search. Never relax household separation just because
 * a greedy earlier placement painted us into a corner. A budget exhaustion fails
 * closed before consuming randomness or changing state. */
export function feasibleTeams(state: ReaperState, player: ReaperPlayer) {
  const n = state.teams.length;
  const assigned = new Set(state.assignments.map((a) => a.playerId));
  const remaining = state.players.filter(
    (p) => !assigned.has(p.id) && p.id !== player.id,
  );
  const households = [...new Set(state.players.map((p) => p.householdId))];
  const h = (p: ReaperPlayer) => households.indexOf(p.householdId);
  const g = (p: ReaperPlayer) => (p.gender === "male" ? 0 : 1);
  const counts = Array.from({ length: n }, () => [0, 0]);
  const homes = Array.from({ length: n }, () => households.map(() => 0));
  const totals = [
    state.players.filter((p) => p.gender === "male").length,
    state.players.filter((p) => p.gender === "female").length,
  ];
  const lo = totals.map((v) => Math.floor(v / n)),
    hi = totals.map((v) => Math.ceil(v / n));
  for (const a of state.assignments) {
    const p = state.players.find((p) => p.id === a.playerId)!;
    const t = state.teams.findIndex((t) => t.id === a.teamId);
    counts[t][g(p)]++;
    homes[t][h(p)]++;
  }
  remaining.sort(
    (a, b) =>
      state.players.filter((p) => p.householdId === b.householdId).length -
        state.players.filter((p) => p.householdId === a.householdId).length ||
      a.id.localeCompare(b.id),
  );
  let visits = 0;
  const failed = new Set<string>();
  const open = (p: ReaperPlayer, t: number) =>
    counts[t][0] + counts[t][1] < state.teams[t].capacity &&
    counts[t][g(p)] < hi[g(p)];
  function search(at: number, budget: number): boolean {
    if (++visits > 500_000)
      throw new Error("Fairness search budget exhausted; no draw was made");
    if (at === remaining.length)
      return counts.every((c) => c[0] >= lo[0] && c[1] >= lo[1]);
    // Prune gender deficits and household collisions that are already unavoidable.
    const rest = remaining.slice(at);
    const restG = [
      rest.filter((p) => g(p) === 0).length,
      rest.filter((p) => g(p) === 1).length,
    ];
    for (let t = 0; t < n; t++) {
      const slots = state.teams[t].capacity - counts[t][0] - counts[t][1];
      if (
        Math.max(0, lo[0] - counts[t][0]) + Math.max(0, lo[1] - counts[t][1]) >
        slots
      )
        return false;
      if (counts[t][0] + restG[0] < lo[0] || counts[t][1] + restG[1] < lo[1])
        return false;
    }
    for (const gender of [0, 1]) {
      const available = rest.filter((p) => g(p) === gender).length;
      if (
        counts.reduce((s, c) => s + Math.max(0, lo[gender] - c[gender]), 0) >
        available
      )
        return false;
      if (
        counts.reduce(
          (s, c, t) =>
            s +
            Math.min(
              hi[gender] - c[gender],
              state.teams[t].capacity - c[0] - c[1],
            ),
          0,
        ) < available
      )
        return false;
    }
    let bound = 0;
    for (let household = 0; household < households.length; household++) {
      const members = rest.filter((p) => h(p) === household);
      const free = state.teams.filter(
        (_, t) => !homes[t][household] && members.some((p) => open(p, t)),
      ).length;
      bound += Math.max(0, members.length - free);
    }
    if (bound > budget) return false;
    // Most constrained player first avoids exploring huge symmetric dead ends
    // when the remaining minority-gender slots have become scarce.
    let selected = at,
      fewest = Infinity;
    for (let i = at; i < remaining.length; i++) {
      const p = remaining[i];
      const count = state.teams.filter(
        (_, t) => open(p, t) && Number(homes[t][h(p)] > 0) <= budget,
      ).length;
      if (count < fewest) {
        fewest = count;
        selected = i;
      }
    }
    if (fewest === 0) return false;
    const activeH = [...new Set(rest.map(h))];
    const key = JSON.stringify([
      budget,
      rest.map((p) => `${h(p)}:${g(p)}`).sort(),
      state.teams
        .map((team, t) => [
          team.capacity,
          counts[t],
          activeH.map((i) => homes[t][i]),
        ])
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    ]);
    if (failed.has(key)) return false;
    [remaining[at], remaining[selected]] = [remaining[selected], remaining[at]];
    const p = remaining[at];
    const choices = state.teams
      .map((_, t) => t)
      .filter((t) => open(p, t))
      .sort(
        (a, b) =>
          Number(homes[a][h(p)] > 0) - Number(homes[b][h(p)] > 0) ||
          counts[a][g(p)] - counts[b][g(p)] ||
          counts[a][0] + counts[a][1] - (counts[b][0] + counts[b][1]),
      );
    const symmetric = new Set<string>();
    for (const t of choices) {
      const signature = JSON.stringify([
        state.teams[t].capacity,
        counts[t],
        activeH.map((i) => homes[t][i]),
      ]);
      if (symmetric.has(signature)) continue;
      symmetric.add(signature);
      const cost = Number(homes[t][h(p)] > 0);
      if (cost > budget) continue;
      counts[t][g(p)]++;
      homes[t][h(p)]++;
      const ok = search(at + 1, budget - cost);
      counts[t][g(p)]--;
      homes[t][h(p)]--;
      if (ok) {
        [remaining[at], remaining[selected]] = [
          remaining[selected],
          remaining[at],
        ];
        return true;
      }
    }
    [remaining[at], remaining[selected]] = [remaining[selected], remaining[at]];
    failed.add(key);
    return false;
  }
  const candidates = state.teams
    .map((_, t) => t)
    .filter((t) => open(player, t));
  if (!candidates.length)
    throw new Error(
      "No team has capacity or a valid gender-balanced completion",
    );
  // Optimize household collisions across the complete remaining draw, with hard
  // floor/ceiling gender quotas. Randomness only selects among equal optima.
  for (let budget = 0; budget <= remaining.length + 1; budget++) {
    const valid: number[] = [];
    for (const t of candidates) {
      const cost = Number(homes[t][h(player)] > 0);
      if (cost > budget) continue;
      counts[t][g(player)]++;
      homes[t][h(player)]++;
      const ok = search(0, budget - cost);
      counts[t][g(player)]--;
      homes[t][h(player)]--;
      if (ok) valid.push(t);
    }
    if (valid.length)
      return {
        teams: valid.map((t) => state.teams[t]),
        collisionBudget: budget,
      };
  }
  throw new Error("No valid balanced completion; no draw was made");
}
