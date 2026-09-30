import { randomBytes } from "node:crypto";
import { drawPlayer, validateState, type ReaperState } from "./engine.js";
import {
  canonical,
  makeReceipt,
  verifyReceiptChain,
  type DrawReceipt,
  type ReaperSnapshot,
} from "./receipts.js";

export interface RandomSource {
  next(): number;
  label: string;
}

export class CryptoRandomSource implements RandomSource {
  label = "node:crypto/randomBytes";
  next() {
    const bytes = randomBytes(6);
    const n = bytes.readUIntBE(0, 6);
    return n / 281474976710656; // 2^48
  }
}

export class RivalReaperSession {
  readonly sessionId: string;
  readonly receipts: DrawReceipt[];
  readonly state: ReaperState;
  readonly random: RandomSource;

  constructor(
    state: ReaperState,
    options?: {
      sessionId?: string;
      receipts?: DrawReceipt[];
      random?: RandomSource;
    },
  ) {
    validateState(state);
    this.state = structuredClone(state);
    this.sessionId = options?.sessionId ?? randomBytes(12).toString("hex");
    this.receipts = structuredClone(options?.receipts ?? []);
    this.random = options?.random ?? new CryptoRandomSource();
    if (!verifyReceiptChain(this.receipts))
      throw new Error("Invalid receipt chain");
    if (this.receipts.length !== this.state.assignments.length)
      throw new Error("Receipt/assignment count mismatch");
    this.receipts.forEach((r, i) => {
      const a = this.state.assignments[i];
      if (
        r.sessionId !== this.sessionId ||
        canonical({
          playerId: r.playerId,
          teamId: r.teamId,
          drawIndex: r.drawIndex,
          eligibleTeamIds: r.eligibleTeamIds,
          excluded: r.excluded,
          randomUnit: r.randomUnit,
        }) !== canonical(a)
      )
        throw new Error("Receipt/assignment identity mismatch");
    });
  }

  drawAndLock(playerId: string, createdAt = new Date().toISOString()) {
    const result = drawPlayer(this.state, playerId, () => this.random.next());
    const previous = this.receipts.at(-1)?.receiptHash ?? null;
    const receipt = makeReceipt(
      this.sessionId,
      result.assignment,
      previous,
      createdAt,
    );
    this.receipts.push(receipt);
    return { ...result, receipt, randomSource: this.random.label };
  }

  snapshot(): ReaperSnapshot {
    if (!verifyReceiptChain(this.receipts))
      throw new Error("Invalid receipt chain");
    return structuredClone({
      version: 1 as const,
      sessionId: this.sessionId,
      state: this.state,
      receipts: this.receipts,
    });
  }

  static restore(snapshot: ReaperSnapshot, random?: RandomSource) {
    if (snapshot.version !== 1 || !snapshot.sessionId)
      throw new Error("Unsupported session snapshot");
    if (!verifyReceiptChain(snapshot.receipts))
      throw new Error("Invalid receipt chain");
    return new RivalReaperSession(snapshot.state, {
      sessionId: snapshot.sessionId,
      receipts: snapshot.receipts,
      random,
    });
  }
}
