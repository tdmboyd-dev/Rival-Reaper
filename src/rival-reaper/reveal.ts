import type { DrawReceipt } from "./receipts.js";
import type { ReaperTeam } from "./engine.js";
import { verifyReceiptChain, hashReceipt } from "./receipts.js";

export type RevealPhase =
  | "idle"
  | "machine-awakens"
  | "colors-fight"
  | "badge-selected"
  | "ticket-ejects"
  | "ink-1"
  | "ink-2"
  | "ink-3"
  | "name-revealed"
  | "team-explosion"
  | "roster-updated";

export interface RevealState {
  phase: RevealPhase;
  drawIndex: number | null;
  playerId: string | null;
  teamId: ReaperTeam["id"] | null;
  teamName: string | null;
  receiptHash: string | null;
  updatedAt: string;
}

export const revealOrder: RevealPhase[] = [
  "machine-awakens",
  "colors-fight",
  "badge-selected",
  "ticket-ejects",
  "ink-1",
  "ink-2",
  "ink-3",
  "name-revealed",
  "team-explosion",
  "roster-updated",
];

export class RevealController {
  private value: RevealState = {
    phase: "idle",
    drawIndex: null,
    playerId: null,
    teamId: null,
    teamName: null,
    receiptHash: null,
    updatedAt: new Date(0).toISOString(),
  };
  current() {
    return { ...this.value };
  }
  begin(
    receipt: DrawReceipt,
    team: ReaperTeam,
    now = new Date().toISOString(),
  ) {
    if (!receipt) throw new Error("Locked receipt required");
    const { receiptHash, ...base } = receipt;
    if (hashReceipt(base) !== receiptHash || team.id !== receipt.teamId)
      throw new Error("Reveal must match locked receipt");
    if (this.value.phase !== "idle" && this.value.phase !== "roster-updated")
      throw new Error("Reveal already active");
    this.value = {
      phase: "machine-awakens",
      drawIndex: receipt.drawIndex,
      playerId: receipt.playerId,
      teamId: team.id,
      teamName: team.name,
      receiptHash: receipt.receiptHash,
      updatedAt: now,
    };
    return this.current();
  }
  advance(now = new Date().toISOString()) {
    if (this.value.phase === "idle") throw new Error("No reveal active");
    const i = revealOrder.indexOf(this.value.phase);
    if (i < 0 || i === revealOrder.length - 1) return this.current();
    this.value = { ...this.value, phase: revealOrder[i + 1], updatedAt: now };
    return this.current();
  }
  restore(state: RevealState, receipts: DrawReceipt[], teams: ReaperTeam[]) {
    if (!verifyReceiptChain(receipts))
      throw new Error("Invalid reveal receipt chain");
    const last = receipts.at(-1);
    if (!last) {
      if (
        state.phase !== "idle" ||
        state.drawIndex !== null ||
        state.playerId !== null ||
        state.teamId !== null ||
        state.receiptHash !== null
      )
        throw new Error("Reveal without locked fate");
    } else if (
      !revealOrder.includes(state.phase) ||
      state.drawIndex !== last.drawIndex ||
      state.playerId !== last.playerId ||
      state.teamId !== last.teamId ||
      state.receiptHash !== last.receiptHash ||
      state.teamName !== teams.find((t) => t.id === last.teamId)?.name
    )
      throw new Error("Reveal does not match locked fate");
    this.value = { ...state };
    return this.current();
  }
}
