import { mkdir, open, readFile, unlink } from "node:fs/promises";
import { dirname } from "node:path";
import { randomBytes } from "node:crypto";

async function readLock(path: string) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

function writerStopped(text: string) {
  let other: { pid: number; id: string };
  try {
    other = JSON.parse(text);
    if (
      !Number.isSafeInteger(other.pid) || other.pid <= 0 ||
      typeof other.id !== "string" || !other.id
    ) throw 0;
  } catch {
    throw new Error("Invalid session lock; inspect local lock before recovery");
  }
  try {
    process.kill(other.pid, 0);
    return false;
  } catch (probe) {
    if ((probe as NodeJS.ErrnoException).code === "ESRCH") return true;
    throw new Error("Cannot prove session writer is stopped");
  }
}

/** Single local writer, including processes on different ports. Stale locks are
 * reclaimed only after the recorded PID is proven absent. PID reuse fails closed.
 * The exclusive recovery guard serializes every ownership-acquisition transition,
 * including a fresh create. An interrupted guard requires inspection; it is never
 * automatically removed, which would recreate the same compare/delete race. */
export async function acquireSessionLock(dataPath: string) {
  const path = dataPath + ".lock";
  const recoveryPath = path + ".recovery";
  await mkdir(dirname(path), { recursive: true });
  const owner = { pid: process.pid, id: randomBytes(16).toString("hex") };
  let recovery;
  try {
    recovery = await open(recoveryPath, "wx", 0o600);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST")
      throw new Error(
        "Session recovery is in progress or was interrupted; inspect the local recovery lock before retrying",
      );
    throw error;
  }
  try {
    await recovery.writeFile(JSON.stringify(owner));
    await recovery.sync();
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const handle = await open(path, "wx", 0o600);
        try {
          await handle.writeFile(JSON.stringify(owner));
          await handle.sync();
        } finally {
          await handle.close();
        }
        // All calls share one release operation. A delayed second release must
        // never unlink a successor that acquired the path after the first release.
        let releasing: Promise<void> | undefined;
        return () => releasing ??= (async () => {
          const text = await readLock(path);
          if (text && JSON.parse(text).id === owner.id) await unlink(path);
        })();
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      }

      const text = await readLock(path);
      if (text === null) continue;
      if (!writerStopped(text))
        throw new Error("Session already has an active writer");

      // Every cooperating acquisition holds this guard. None can replace the
      // lock between the decisive reread and removal, or enter if a prior
      // acquisition crashed after removing the normal lock but before completion.
      const current = await readLock(path);
      if (current === text && writerStopped(current)) await unlink(path);
    }
    throw new Error("Session lock contention; no state changed");
  } finally {
    try {
      await recovery.close();
    } finally {
      await unlink(recoveryPath);
    }
  }
}
