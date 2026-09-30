import { mkdir, open, readFile, unlink } from "node:fs/promises";
import { dirname } from "node:path";
import { randomBytes } from "node:crypto";

/** Single local writer, including processes on different ports. Stale locks are
 * reclaimed only after the recorded PID is proven absent. PID reuse fails closed. */
export async function acquireSessionLock(dataPath: string) {
  const path = dataPath + ".lock";
  await mkdir(dirname(path), { recursive: true });
  const owner = { pid: process.pid, id: randomBytes(16).toString("hex") };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const handle = await open(path, "wx", 0o600);
      try {
        await handle.writeFile(JSON.stringify(owner));
        await handle.sync();
      } finally {
        await handle.close();
      }
      return async () => {
        const current = JSON.parse(await readFile(path, "utf8"));
        if (current.id === owner.id) await unlink(path);
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const text = await readFile(path, "utf8");
      let other: { pid: number };
      try {
        other = JSON.parse(text);
        if (!Number.isSafeInteger(other.pid) || other.pid <= 0) throw 0;
      } catch {
        throw new Error(
          "Invalid session lock; inspect local lock before recovery",
        );
      }
      try {
        process.kill(other.pid, 0);
      } catch (probe) {
        if ((probe as NodeJS.ErrnoException).code === "ESRCH") {
          // Recheck ownership before removing a dead writer's advisory lock.
          if ((await readFile(path, "utf8")) === text)
            await unlink(path).catch((e) => {
              if (e.code !== "ENOENT") throw e;
            });
          continue;
        }
        throw new Error("Cannot prove session writer is stopped");
      }
      throw new Error("Session already has an active writer");
    }
  }
  throw new Error("Session lock contention; no state changed");
}
