# Current engineering checkpoint - September 30, 2026

## Native-window complaint repair

See `evidence/NATIVE-WINDOW-REPAIR-2026-09-30.md`: current-screen observation found leftover emulated viewport settings, ambiguous public/host access and a missing badge on the physical ticket. Native-window recovery, scroll fallback, direct role navigation, disabled-state explanation and ticket badge/slot fixes pass 94 tests and 25 browser checks. This supersedes screenshot-only fit assumptions; owner visual and physical-device acceptance remain open.

Repository: `tdmboyd-dev/Rival-Reaper`, branch `main`.
Historical integration base: `9503073349b1f60f37c0bba36db436b21f3ab5e8`.
Tested source baseline: `7d66aa86a98ef834bc0f06c34b6bd6fd997d2298`; this consolidated candidate adds current documentation and three nonfunctional poster-instruction/comment corrections.

## Bounded local evidence

The local candidate passed clean dependency installation, TypeScript checking, and 94 automated tests. Typecheck and all 94 tests passed again after the final instruction/comment corrections. These results describe local software checks only. Interactive browser acceptance and physical-device rehearsal remain pending. Remote publication must be verified separately against the resulting main commit.

## Publication work claim

- Engineering session: current Rival-Reaper integration session
- Local branch: `finish/reaper-2026-09-30`
- Scope: reconcile the tested candidate against fresh main; publish approved artwork and associated source, tests and documentation
- Paths: `examples/rival-reaper/`, `src/rival-reaper/`, `scripts/`, `test/`, `docs/`, `evidence/`, and relevant root package/continuity files
- Reviewed main base: `3b30335c58c96a3c540664773f691dd72994504c`; reread before publication
- Claimed: 2026-09-30T08:42:00Z
- Latest publication review: 2026-09-30T13:15:00Z
- Status: prepared for reviewed publication; no remote candidate publication claimed

The current launch uses actual configured input for the single six-team event. Fictional fixtures are isolated to tests. Interrupted PNG exports remain canceled after reconnection.

All 17 operational PNGs were verified byte-for-byte on staging commit `d3b5d5982f02ba93f1ae8f23c946b09f5a093433`. The consolidated main update reuses those exact blobs without merging unrelated history. The six fictional JPEG inspection copies remain local-only. This checkpoint is prepared before the main reference update; verify the containing commit on main before claiming publication.

## Remaining gates

- Approval and integration of the outstanding standalone artwork corrections
- Interactive browser acceptance of the changed interface
- Physical-device rehearsal
- Successful reviewed publication and verification of the resulting remote commit

The next batch must preserve unrelated remote work, use a non-forced update and leave hosted Actions and deployment inactive. Private input and runtime data must stay outside public Git.

## References

Read `AGENTS.md`, `PROJECT-READ-FIRST.md`, `docs/CONVERSATION-CANON.md`, `BuildList.md` and `AUDIT-LEDGER.md`. Existing evidence records retain their historical scope; they do not establish current browser or device acceptance. Earlier versions of this checkpoint remain in Git history.

## Latest local reliability checkpoint

The bounded reliability wave fixed host command-ID API compatibility and a reproduced concurrent stale-lock recovery race. All 94 automated tests, typecheck, 75-test unit subset and 19-test HTTP integration subset pass. A complete fictional 47-player show executed 470 persisted commands and completed-state restart. See `evidence/RELIABILITY-2026-09-30.md` for defined acceptance denominators, evidence and limits. Artwork bytes remain unchanged. An interrupted ownership-acquisition guard is retained for operator inspection rather than automatically erased.


## Shared API/MCP connector resume update — 2026-11-08

Documentation-only integration plan. Source baseline: `6764f52e701ec0dbe87ac0bbdb43f81ac8c4eb09`. Review branch: `docs/mgr-connector-handoff-2026-11-08`. Existing content above is preserved. This update does not deploy, enable a connector, change credentials or certify live connectivity.

### Verified inspection and existing ownership

`src/rival-reaper/server.ts` already provides /api/state and /api/events plus host-token-protected /api/host/state, /api/host/audit and draw/reveal commands. It preserves encrypted session state, command fingerprints and expectedRevision checks. The locked-fate and private-host/public-arena boundaries must survive any connector.

### Work on this application's side

1. Prefer read-only event/session health and redacted public projection for the first connector. Keep private roster and host controls behind the existing authorization boundary.
2. Bind service access to an exact event/session and return the current sessionId/revision with each response. Do not confuse a new event's reset revision with an existing event replay.
3. If host execution is later authorized, retain commandId, exact fingerprint, expectedRevision, persistence lock and immutable fate receipts. Reconnect/retry must resume the same fate, never redraw.
4. Do not expose raw host tokens, encrypted-store secrets or unrestricted roster exports through tools. Preserve event host approval for consequential draw/reveal changes.

### Work on the shared MGR-API-MCP side

1. Add only allowlisted projection/status calls first, bounded event streaming/reconnect if required. No generic host-route proxy.
2. For a future command tool map approval to session and exact command payload, and reconcile uncertain responses using audit/state before retry. Arena reads must never grant host rights.

Use one versioned capability contract: capability ID/schema version, authenticated actor/tenant/resource scope, request/trace ID, bounded deadline, typed domain payload and authoritative result/evidence. Mutation lanes additionally need exact approval where required, stable idempotency key plus canonical input digest, and status/readback before retrying an unknown outcome. Capability discovery is not permission. Endpoint/secret configuration is operator-controlled, never an arbitrary caller-supplied proxy destination.

### Next acceptance gate and limits

Use synthetic rosters to test wrong event/token, stale revision, identical replay, changed-payload replay, crash/reopen and slow event consumers. Verify no premature private-name/reveal leakage and no silent reroll. Physical-event/owner acceptance stays separate.

This pass inspected committed source/documents and checks preservation/readback of the documentation change only. It did not execute product tests, contact live domain services, deploy, or promote any existing completion-ledger status. At resume, reconcile fresh HEAD, active implementation branches and local work before coding; preserve unrelated concurrent changes. Historical proofs remain valid only for their recorded source/runtime scope. Readiness must distinguish source implementation, local test, real integration and live/owner acceptance.

### Source pointers at the inspected baseline

- [WORK-STATE.md](https://github.com/tdmboyd-dev/Rival-Reaper/blob/6764f52e701ec0dbe87ac0bbdb43f81ac8c4eb09/WORK-STATE.md)
- [src/rival-reaper/server.ts](https://github.com/tdmboyd-dev/Rival-Reaper/blob/6764f52e701ec0dbe87ac0bbdb43f81ac8c4eb09/src/rival-reaper/server.ts)
- [PROJECT-READ-FIRST.md](https://github.com/tdmboyd-dev/Rival-Reaper/blob/6764f52e701ec0dbe87ac0bbdb43f81ac8c4eb09/PROJECT-READ-FIRST.md)
