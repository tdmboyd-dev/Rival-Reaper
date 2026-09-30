import test from "node:test";
import assert from "node:assert/strict";
import {
  makeReceipt,
  verifyReceiptChain,
} from "../src/rival-reaper/receipts.js";
import type { ReaperAssignment } from "../src/rival-reaper/engine.js";

function assignment(
  i: number,
  playerId: string,
  teamId: any,
): ReaperAssignment {
  return {
    playerId,
    teamId,
    drawIndex: i,
    eligibleTeamIds: [teamId],
    excluded: {},
    randomUnit: 0.42,
  };
}

test("receipt chain verifies and detects tampering", () => {
  const first = makeReceipt(
    "session",
    assignment(1, "p1", "blood-bloom"),
    null,
    "2026-10-01T12:00:00Z",
    "n1",
  );
  const second = makeReceipt(
    "session",
    assignment(2, "p2", "pressure-gang"),
    first.receiptHash,
    "2026-10-01T12:01:00Z",
    "n2",
  );
  assert.equal(verifyReceiptChain([first, second]), true);
  const tampered = [{ ...first }, { ...second, playerId: "somebody-else" }];
  assert.equal(verifyReceiptChain(tampered), false);
});
