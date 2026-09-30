import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createRivalReaperServer } from "../src/rival-reaper/server.js";
import { buildFiveTeamState } from "../src/rival-reaper/roster.js";
const dir = resolve(".rival-reaper/demo");
await mkdir(dir, { recursive: true });
const hostToken = randomBytes(24).toString("hex");
// Demo encryption key is stable only in this local private directory.
const { readFile } = await import("node:fs/promises");
let secret: string;
try {
  secret = await readFile(resolve(dir, "secret"), "utf8");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  secret = randomBytes(32).toString("hex");
  await writeFile(resolve(dir, "secret"), secret, { mode: 0o600 });
}
await writeFile(resolve(dir, "host-token"), hostToken, { mode: 0o600 });
const entries = Array.from({ length: 45 }, (_, i) => ({
  id: `fake-${i + 1}`,
  name: `Fake Player ${String(i + 1).padStart(2, "0")}`,
  householdId: `fake-home-${Math.floor(i / 3)}`,
  gender: (i % 2 ? "female" : "male") as "male" | "female",
}));
const app = await createRivalReaperServer({
  port: Number(process.env.PORT ?? 8787),
  hostToken,
  secret,
  dataPath: resolve(dir, "session.enc.json"),
  initialState: buildFiveTeamState(entries).state,
});
await app.listen();
console.log(
  "FAKE-ROSTER DEMO: http://127.0.0.1:" + String(process.env.PORT ?? 8787),
);
console.log(
  "Host token is in ignored local file .rival-reaper/demo/host-token. It is never printed or committed.",
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
