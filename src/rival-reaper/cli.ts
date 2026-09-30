import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildLineupState, type PrivateRosterEntry } from "./roster.js";
import { parseLineup } from "./lineup.js";
import { createRivalReaperServer } from "./server.js";

const lineupFlag = process.argv.indexOf("--lineup");
if (lineupFlag >= 0 && !process.argv[lineupFlag + 1]) throw new Error("--lineup requires five-v1 or six-v1");
const lineup = parseLineup(lineupFlag >= 0 ? process.argv[lineupFlag + 1] : process.env.RIVAL_REAPER_LINEUP ?? "six-v1");
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
const { state, blackout } = buildLineupState(entries, lineup);
const app = await createRivalReaperServer({
  port: Number(process.env.PORT ?? 8787),
  bind: process.env.RIVAL_REAPER_BIND ?? "127.0.0.1",
  hostToken,
  secret,
  dataPath: process.env.RIVAL_REAPER_DATA ?? (lineup === "six-v1" ? ".rival-reaper/session-six-v1.enc.json" : ".rival-reaper/session.enc.json"),
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
