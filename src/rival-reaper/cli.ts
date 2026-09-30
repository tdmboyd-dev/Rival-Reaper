import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildFiveTeamState, type PrivateRosterEntry } from "./roster.js";
import { createRivalReaperServer } from "./server.js";

const rosterPath = process.env.RIVAL_REAPER_ROSTER;
const hostToken = process.env.RIVAL_REAPER_HOST_TOKEN;
const secret = process.env.RIVAL_REAPER_SECRET;
if (!rosterPath || !hostToken || !secret) {
  throw new Error(
    "Set RIVAL_REAPER_ROSTER, RIVAL_REAPER_HOST_TOKEN and RIVAL_REAPER_SECRET",
  );
}
const entries = JSON.parse(
  await readFile(resolve(rosterPath), "utf8"),
) as PrivateRosterEntry[];
const { state, blackout } = buildFiveTeamState(entries);
const app = await createRivalReaperServer({
  port: Number(process.env.PORT ?? 8787),
  bind: process.env.RIVAL_REAPER_BIND ?? "127.0.0.1",
  hostToken,
  secret,
  dataPath: process.env.RIVAL_REAPER_DATA ?? ".rival-reaper/session.enc.json",
  initialState: state,
});
await app.listen();
console.log(
  `RiVAL REAPER listening on http://localhost:${(app.server.address() as import("node:net").AddressInfo).port}`,
);
console.log(
  `Competitors: ${state.players.length}; Blackout Krew excluded: ${blackout.length}`,
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
