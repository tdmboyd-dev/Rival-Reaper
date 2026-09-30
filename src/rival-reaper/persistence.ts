import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { mkdir, readFile, rename, open, unlink } from "node:fs/promises";
import { dirname } from "node:path";
import type { ReaperSnapshot } from "./receipts.js";
import { verifyReceiptChain } from "./receipts.js";
import { RivalReaperSession } from "./session.js";

const FORMAT = "rival-reaper-aes256gcm-v1";

function keyFromSecret(secret: string) {
  if (secret.length < 16)
    throw new Error("RIVAL_REAPER_SECRET must be at least 16 characters");
  return createHash("sha256").update(secret, "utf8").digest();
}

export function encryptSnapshot(snapshot: ReaperSnapshot, secret: string) {
  if (!verifyReceiptChain(snapshot.receipts))
    throw new Error("Refusing to persist invalid receipt chain");
  RivalReaperSession.restore(snapshot);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFromSecret(secret), iv);
  const plaintext = Buffer.from(JSON.stringify(snapshot), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    format: FORMAT,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  });
}

export function decryptSnapshot(
  payload: string,
  secret: string,
): ReaperSnapshot {
  const parsed = JSON.parse(payload) as {
    format: string;
    iv: string;
    tag: string;
    ciphertext: string;
  };
  if (parsed.format !== FORMAT)
    throw new Error("Unsupported Rival Reaper snapshot format");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    keyFromSecret(secret),
    Buffer.from(parsed.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(parsed.tag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(parsed.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
  const snapshot = JSON.parse(plaintext) as ReaperSnapshot;
  if (!verifyReceiptChain(snapshot.receipts))
    throw new Error("Snapshot receipt chain is invalid");
  RivalReaperSession.restore(snapshot);
  return snapshot;
}

export class EncryptedFileStore {
  constructor(
    private readonly path: string,
    private readonly secret: string,
  ) {}

  async save(snapshot: ReaperSnapshot) {
    const payload = encryptSnapshot(snapshot, this.secret);
    await mkdir(dirname(this.path), { recursive: true });
    const temp = `${this.path}.${randomBytes(8).toString("hex")}.tmp`;
    try {
      const file = await open(temp, "wx", 0o600);
      try {
        await file.writeFile(payload, "utf8");
        await file.sync();
      } finally {
        await file.close();
      }
      await rename(temp, this.path);
    } finally {
      await unlink(temp).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      });
    }
  }

  async load(): Promise<ReaperSnapshot | null> {
    try {
      const payload = await readFile(this.path, "utf8");
      return decryptSnapshot(payload, this.secret);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
}
