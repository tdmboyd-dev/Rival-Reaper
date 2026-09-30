# Local lock recovery: causal repair and verification

Date: 2026-09-30 UTC. Scope: single-machine Rival Reaper session ownership on a local filesystem. No real roster, publication, hosted Actions, or deployment was used.

## Finding and provenance

`src/rival-reaper/lock.ts` admitted multiple writers when concurrent startups reclaimed a stopped process's lock. The original sequence was read old owner → prove PID absent → reread bytes → unlink pathname. A competing recovery could delete the old file and create its own lock between the final read and unlink; the first recovery then deleted the new live owner's lock.

A synthetic-only probe with 16 concurrent calls reproduced **two successful acquisitions** on its second round. More importantly, a deterministic probe against the pre-repair HEAD `3915e2dae769f87ed77791cf2c9be3b5f94bf926` implementation paused the first recovery immediately after its second read and allowed the second recovery to finish. It observed:

```json
{"baseline":"HEAD","deterministicInterleaving":"pause-first-recovery-after-byte-recheck","first":"fulfilled","second":"fulfilled","activeWriters":2}
```

This is a local mutual-exclusion failure, not a hypothetical distributed-lock concern. Two writers could load the same snapshot and overwrite independently advanced fate histories.

## Capability decomposition and research disposition

Target: restore one stopped local session while retaining at most one active writer.

- Identify owner: existing PID and unique lock-owner ID
- Determine liveness: signal-zero process probe; only ESRCH permits recovery
- Acquire ownership: filesystem exclusive creation
- Recover stale ownership: serialize all ownership-acquisition transitions, recheck current owner inside the recovery critical section
- Release ownership: exactly one release promise per returned owner
- Fail safely: malformed owner, permission-denied probe, or interrupted recovery retains evidence and refuses reclamation
- Verify: controlled interleaving, many concurrent calls, independent child processes, existing killed-process server restart, and unchanged snapshot behavior

Research lifecycle: discovered → queued → sourced → end-to-end API-contract review → researched → specified → implemented → tested → verified for the local scope below. Disposition: MGR-NATIVE bounded repair using existing Node primitives; no added dependency.

## Primary evidence and alternatives

The Node filesystem API specifies that `wx` fails when the path already exists, warns that separate checks and actions race, and cautions that exclusive behavior may be unreliable on network filesystems. These contracts support an exclusive recovery guard, not a claim of distributed correctness. [Node v24 filesystem documentation](https://nodejs.org/docs/latest-v24.x/api/fs.html#file-system-flags)

The process API documents signal zero as an existence probe. This repair treats only ESRCH as evidence of absence; other errors remain ambiguous and fail closed. [Node v24 process.kill documentation](https://nodejs.org/docs/latest-v24.x/api/process.html#processkillpid-signal)

Alternatives considered:

- Repeat the byte check immediately before unlink: rejected; another asynchronous operation can still intervene
- Automatically reclaim the new recovery guard: rejected; that recreates the same compare/delete race at another pathname
- Use a new native OS-lock dependency or distributed lock service: deferred; unnecessary for this bounded local application and adds platform/runtime requirements
- Serialize ownership-acquisition transitions through a separate exclusive guard and retain ambiguous guards: adopted; small portability-preserving change with explicit crash limits

No model, dataset, hardware accelerator, hosted provider, paid API, or third-party code is required. Licensing is unchanged. Runtime is the existing Node version; executed here on Node v24.19.0/Linux. Cost is short local filesystem operations and tests. No external architecture/library adoption was made.

## Repair specification

1. Every acquisition first exclusively creates `<data-path>.lock.recovery`, including fresh starts with no normal lock
2. Normal ownership uses exclusive creation of `<data-path>.lock` with owner PID and random ID; the guard is released before ownership is returned
3. Recovery requires a fully formed owner and proof its PID is absent
4. Under that guard, it rereads the original lock and removes it only if the bytes still match and the PID is still absent
5. No other cooperating writer can attempt fresh creation or stale removal while the first acquisition holds the guard
6. Cleanup closes and removes only this caller's recovery guard; existing guards are never automatically reclaimed
7. Normal release is idempotent, tolerates an already absent file, and cannot remove a later successor on a repeated call
8. Neither path touches the encrypted snapshot, chooses a draw, rewrites the roster, or changes receipt/reveal state

Existing locks with the normal PID/ID format remain compatible. Incomplete or malformed lock files are preserved for inspection. A startup can still fail while another writer is initially writing its ownership file; failing closed is preferable to claiming ownership during ambiguity.

## Operational recovery boundary

If a process is killed while its acquisition/recovery guard exists, subsequent startup stops with an inspection error, even if the normal lock was not created or was removed before the crash. The guard is deliberately not self-reclaimed. The same guard covers fresh creation so there is no separate existence-check race.

For the inspection error:

1. Stop all Reaper processes that could be using the same session and prevent concurrent starts
2. Preserve the encrypted snapshot unchanged
3. Inspect `<data-path>.lock` and `<data-path>.lock.recovery`; establish that no recorded writer or recovery process is live, accounting for PID reuse
4. Only after that check may an operator remove the stale `.lock.recovery` guard and retry with the same roster, data path, and secret
5. Do not remove or reset the encrypted snapshot, invent a new secret, or erase a live/ambiguous normal lock

This remains a cooperative single-machine local-filesystem lock. It is not a distributed lock, power-loss guarantee, protection against arbitrary external file deletion, or proof on untested operating systems. PID reuse remains fail-closed.

## Executed acceptance and evidence

`test/rival-reaper-lock.test.ts` contains nine executed regressions:

| Acceptance criterion | Observed result |
|---|---|
| Paused stale-owner recheck cannot remove another recovery's new writer | PASS; competing recovery rejected and exactly one owner remains |
| Forty rounds of sixteen simultaneous recovery calls | PASS; exactly one winner per round |
| Eight independent child processes start recovery together | PASS; exactly one winner; next owner succeeds after its release |
| Existing recovery guard | PASS; acquisition refused, both original files unchanged |
| Concurrent/repeated release and later successor | PASS; one release operation, successor retained |
| Malformed/incomplete owner files | PASS; refused and bytes unchanged |
| Permission-denied process probe | PASS; no reclamation |
| Already missing normal lock at release | PASS; repeat release safe and successor retained |
| Orphan recovery guard with absent normal lock | PASS; fresh startup refused; no normal lock created; guard unchanged |

Executed after final source/test edits:

```text
npm run typecheck
node --test --import tsx test/rival-reaper-lock.test.ts test/rival-reaper-persistence.test.ts test/rival-reaper-session.test.ts test/rival-reaper-server.test.ts
```

Result: typecheck PASS; **31 tests PASS, 0 failed, 0 skipped, 0 canceled**. This includes encrypted corruption/wrong-secret handling, unchanged-roster recovery, every reveal phase, command replay, save failure, second writer refusal, and killed CLI process restart without reroll. The final consolidated whole-project run is recorded by the parent verification wave separately.

Changed artifacts for this repair:

- `src/rival-reaper/lock.ts`
- `test/rival-reaper-lock.test.ts`
- This research/specification/evidence record

No remaining defect in the tested local lock-recovery contract is known. Platform/device rehearsal remains outside this software proof.
