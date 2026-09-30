import {
  createServer,
  type ServerResponse,
  type IncomingMessage,
} from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash, timingSafeEqual } from "node:crypto";
import { RivalReaperSession } from "./session.js";
import { EncryptedFileStore } from "./persistence.js";
import type { ReaperState } from "./engine.js";
import { RevealController, revealOrder } from "./reveal.js";
import { canonical, type ReaperSnapshot } from "./receipts.js";
import { acquireSessionLock } from "./lock.js";

export interface ReaperServerOptions {
  port?: number;
  bind?: string;
  hostToken: string;
  secret: string;
  dataPath: string;
  initialState: ReaperState;
  publicDir?: string;
  store?: {
    load(): Promise<ReaperSnapshot | null>;
    save(snapshot: ReaperSnapshot): Promise<void>;
  };
}
class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
function json(res: ServerResponse, status: number, value: unknown) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(value));
}
async function body(req: IncomingMessage) {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    const b = Buffer.from(chunk);
    size += b.length;
    if (size > 64000) throw new HttpError(413, "Request too large");
    chunks.push(b);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || Array.isArray(value) || typeof value !== "object") throw 0;
    return value as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "JSON object required");
  }
}
export async function createRivalReaperServer(options: ReaperServerOptions) {
  if (options.hostToken.length < 24 || options.secret.length < 32)
    throw new Error(
      "Use a host token of 24+ characters and encryption secret of 32+ characters",
    );
  const store =
    options.store ?? new EncryptedFileStore(options.dataPath, options.secret);
  const release = options.store
    ? async () => {}
    : await acquireSessionLock(options.dataPath);
  try {
    const restored = await store.load();
    let session = restored
      ? RivalReaperSession.restore(restored)
      : new RivalReaperSession(options.initialState);
    let reveal = new RevealController();
    let revision = restored?.revision ?? 0;
    let commands = restored?.commands ?? [];
    if (restored?.reveal)
      reveal.restore(restored.reveal, session.receipts, session.state.teams);
    else if (session.receipts.length) {
      // Legacy migration: restart presentation of the last SAME locked fate, never redraw.
      const receipt = session.receipts.at(-1)!;
      reveal.begin(
        receipt,
        session.state.teams.find((t) => t.id === receipt.teamId)!,
      );
    }
    if (
      !Number.isSafeInteger(revision) ||
      revision < 0 ||
      !Array.isArray(commands) ||
      new Set(commands.map((c) => c.id)).size !== commands.length
    )
      throw new Error("Invalid command journal");
    const listeners = new Set<ServerResponse>();
    let queue: Promise<unknown> = Promise.resolve();
    let unhealthy = false;
    const publicDir = options.publicDir ?? resolve("examples/rival-reaper");
    const snapshot = (): ReaperSnapshot => ({
      ...session.snapshot(),
      reveal: reveal.current(),
      revision,
      commands: structuredClone(commands),
    });
    if (!restored || !restored.reveal) await store.save(snapshot());
    function publicState() {
      const r = reveal.current();
      const stage = revealOrder.indexOf(r.phase);
      const badge = stage >= 2,
        named = stage >= 7;
      const completed = session.state.assignments.filter(
        (a) =>
          a.drawIndex < (r.drawIndex ?? Infinity) ||
          r.phase === "roster-updated",
      );
      return {
        sessionId: session.sessionId,
        revision,
        healthy: !unhealthy,
        teams: session.state.teams.map((t) => ({
          ...t,
          assigned: completed.filter((a) => a.teamId === t.id).length,
          roster: completed
            .filter((a) => a.teamId === t.id)
            .map((a) => ({
              name: session.state.players.find((p) => p.id === a.playerId)!
                .name,
              drawIndex: a.drawIndex,
            })),
        })),
        remaining: session.state.players.length - session.receipts.length,
        drawCount: session.receipts.length,
        reveal: {
          phase: r.phase,
          drawIndex: r.drawIndex,
          teamId: badge ? r.teamId : null,
          teamName: badge ? r.teamName : null,
          playerName: named
            ? session.state.players.find((p) => p.id === r.playerId)?.name
            : null,
          updatedAt: r.updatedAt,
        },
      };
    }
    function broadcast() {
      const data = JSON.stringify(publicState());
      for (const res of listeners) {
        if (res.writableLength > 256000) {
          res.destroy();
          listeners.delete(res);
        } else res.write(`id: ${revision}\nevent: state\ndata: ${data}\n\n`);
      }
    }
    function authorized(req: IncomingMessage) {
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer ")) return false;
      const a = Buffer.from(header.slice(7)),
        b = Buffer.from(options.hostToken);
      return a.length === b.length && timingSafeEqual(a, b);
    }
    async function mutate(path: string, input: Record<string, unknown>) {
      if (unhealthy)
        throw new HttpError(
          503,
          "Persistence unavailable; restart and recover before continuing",
        );
      if (
        typeof input.commandId !== "string" ||
        !/^[a-zA-Z0-9_-]{8,100}$/.test(input.commandId)
      )
        throw new HttpError(400, "commandId required (8–100 safe characters)");
      if (
        !Number.isSafeInteger(input.expectedRevision) ||
        Number(input.expectedRevision) < 0
      )
        throw new HttpError(400, "expectedRevision required");
      const fingerprint = createHash("sha256")
        .update(canonical({ path, ...input }))
        .digest("hex");
      const prior = commands.find((c) => c.id === input.commandId);
      if (prior) {
        if (prior.fingerprint !== fingerprint)
          throw new HttpError(409, "Command ID reused with different input");
        return {
          replayed: true,
          appliedRevision: prior.revision,
          state: publicState(),
        };
      }
      if (input.expectedRevision !== revision)
        throw new HttpError(
          409,
          "State changed; refresh before issuing a new command",
        );
      const candidate = RivalReaperSession.restore(session.snapshot());
      const nextReveal = new RevealController();
      nextReveal.restore(
        reveal.current(),
        session.receipts,
        session.state.teams,
      );
      if (path === "/api/host/draw") {
        if (!["idle", "roster-updated"].includes(reveal.current().phase))
          throw new HttpError(
            409,
            "Finish the active reveal before drawing again",
          );
        if (typeof input.playerId !== "string" || !input.playerId.trim())
          throw new HttpError(400, "playerId required");
        try {
          const result = candidate.drawAndLock(input.playerId);
          nextReveal.begin(result.receipt, result.team);
        } catch (error) {
          throw new HttpError(409, (error as Error).message);
        }
      } else {
        if (["idle", "roster-updated"].includes(reveal.current().phase))
          throw new HttpError(409, "No reveal to advance");
        nextReveal.advance();
      }
      const nextRevision = revision + 1;
      const nextCommands = [
        ...commands,
        { id: input.commandId, fingerprint, revision: nextRevision },
      ];
      const nextSnapshot = {
        ...candidate.snapshot(),
        reveal: nextReveal.current(),
        revision: nextRevision,
        commands: nextCommands,
      };
      try {
        await store.save(nextSnapshot);
      } catch {
        unhealthy = true;
        broadcast();
        throw new HttpError(
          503,
          "Persistence failed; controls locked until restart and recovery",
        );
      }
      session = candidate;
      reveal = nextReveal;
      revision = nextRevision;
      commands = nextCommands;
      broadcast();
      return {
        replayed: false,
        appliedRevision: revision,
        state: publicState(),
      };
    }
    const server = createServer(async (req, res) => {
      res.setHeader("x-content-type-options", "nosniff");
      res.setHeader("referrer-policy", "no-referrer");
      res.setHeader(
        "content-security-policy",
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      );
      try {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (req.method === "GET" && url.pathname === "/favicon.ico") {
          res.writeHead(204);
          res.end();
          return;
        }
        if (url.pathname.startsWith("/api/host/") && !authorized(req))
          return json(res, 401, { error: "unauthorized" });
        if (req.method === "GET" && url.pathname === "/api/state")
          return json(res, 200, publicState());
        if (req.method === "GET" && url.pathname === "/api/events") {
          if (listeners.size >= 32)
            throw new HttpError(503, "Arena connection limit reached");
          res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            connection: "keep-alive",
            "x-accel-buffering": "no",
          });
          listeners.add(res);
          res.write(
            `retry: 1000\nid: ${revision}\nevent: state\ndata: ${JSON.stringify(publicState())}\n\n`,
          );
          const heartbeat = setInterval(
            () => res.write(": heartbeat\n\n"),
            15000,
          );
          heartbeat.unref();
          res.on("close", () => {
            clearInterval(heartbeat);
            listeners.delete(res);
          });
          return;
        }
        if (
          req.method === "POST" &&
          ["/api/host/draw", "/api/host/reveal/advance"].includes(url.pathname)
        ) {
          if (
            req.headers.origin &&
            req.headers.origin !== `http://${req.headers.host}` &&
            req.headers.origin !== `https://${req.headers.host}`
          )
            throw new HttpError(403, "Cross-origin command rejected");
          const input = await body(req);
          const task = queue.then(() => mutate(url.pathname, input));
          queue = task.catch(() => {});
          return json(res, 200, await task);
        }
        if (req.method === "GET" && url.pathname === "/api/host/state")
          return json(res, 200, {
            ...publicState(),
            players: session.state.players
              .filter(
                (p) =>
                  !session.state.assignments.some((a) => a.playerId === p.id),
              )
              .map((p) => ({ id: p.id, name: p.name })),
            lastReceiptHash: session.receipts.at(-1)?.receiptHash ?? null,
          });
        if (req.method === "GET" && url.pathname === "/api/host/audit") {
          const payload = snapshot();
          const bundleHash = createHash("sha256")
            .update(canonical(payload))
            .digest("hex");
          res.setHeader(
            "content-disposition",
            'attachment; filename="rival-reaper-audit.private.json"',
          );
          return json(res, 200, {
            format: "rival-reaper-audit-v1",
            payload,
            bundleHash,
          });
        }
        const files: Record<string, string> = {
          "/": "index.html",
          "/index.html": "index.html",
          "/host": "host.html",
          "/host.html": "host.html",
          "/arena": "arena.html",
          "/arena.html": "arena.html",
          "/styles.css": "styles.css",
          "/arena.js": "arena.js",
          "/host.js": "host.js",
          "/shared.js": "shared.js",
          "/assets/block-party-daylight.png": "assets/block-party-daylight.png",
        };
        if (req.method === "GET" && files[url.pathname]) {
          const file = files[url.pathname];
          const content = await readFile(resolve(publicDir, file));
          res.writeHead(200, {
            "content-type": file.endsWith(".png")
              ? "image/png"
              : file.endsWith(".css")
                ? "text/css; charset=utf-8"
                : file.endsWith(".js")
                  ? "text/javascript; charset=utf-8"
                  : "text/html; charset=utf-8",
            "cache-control": file.endsWith(".png")
              ? "public, max-age=3600"
              : "no-store",
          });
          return res.end(content);
        }
        return json(res, 404, { error: "not found" });
      } catch (error) {
        return json(res, error instanceof HttpError ? error.status : 500, {
          error:
            error instanceof HttpError
              ? error.message
              : "Internal error; operation not confirmed",
        });
      }
    });
    server.requestTimeout = 10000;
    server.headersTimeout = 10000;
    return {
      get session() {
        return session;
      },
      store,
      server,
      listen: () =>
        new Promise<void>((done, reject) => {
          server.once("error", reject);
          server.listen(
            options.port ?? 8787,
            options.bind ?? "127.0.0.1",
            () => {
              server.off("error", reject);
              done();
            },
          );
        }),
      close: async () => {
        await queue;
        for (const r of listeners) r.end();
        try {
          await new Promise<void>((done, reject) =>
            server.close((e) => (e ? reject(e) : done())),
          );
        } finally {
          await release();
        }
      },
    };
  } catch (error) {
    await release();
    throw error;
  }
}
