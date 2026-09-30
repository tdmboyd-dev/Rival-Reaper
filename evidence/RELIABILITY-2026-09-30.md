# Six-team reliability acceptance — September 30, 2026

Scope: the existing standalone application, with a 47-person **fictional** fixture. This is not an official assignment, not a new app and not a deployment. Source baseline: `3915e2dae769f87ed77791cf2c9be3b5f94bf926`. Changes are a bounded command-ID compatibility repair, stale-writer recovery repair and stronger integrated verification. Approved art bytes are unchanged.

## Defined software acceptance gates

1. Host command IDs: draw and advance work when randomUUID is absent, generate 128-bit Web Crypto IDs, preserve the same request on retry, and issue no POST when entropy is unavailable. Actual host JavaScript executed under the Node VM harness; rendered phone behavior remains unverified.
2. Single local writer: concurrent recovery of a dead owner's lock admits at most one writer; alive/malformed/ambiguous ownership fails closed; interrupted recovery guard requires operator inspection. See dedicated lock-recovery research and regressions.
3. Full six-team HTTP workflow: all 47 fictional players complete 470 durable draw/reveal steps; selected repeated requests replay without changing state; unrevealed identities/private attributes stay out of public responses; final capacities are 8/8/8/8/8/7; 47 receipts validate; completed-state restart and private audit authorization succeed.

These three requirements form this wave's software denominator only. Test counts are evidence granularity, not an overall application completion percentage. All 3/3 defined software gates passed the executed local scope; 0 failed. This does not close the separately listed device, art approval or publication gates.

## Separate acceptance boundaries

- Completed-team original images: 6/6 previously recovered and verified; unchanged in this wave
- Native fictional poster visual/raster evidence: 6/6 earlier V3 outputs; not new browser-export proof
- Approved correctly named competitive badges integrated: 4/6; blue and green corrections still need owner approval, then integration
- Final browser/phone/projector/speaker gates: 0/4 newly verified for this candidate
- Official private draw: not run; no real identities in fixtures/evidence
- Publication: separate checkpoint; a local commit is not remote publication

The current environment previously blocked managed-browser local navigation and Chromium's required socket. This wave respects those restrictions; no tunnel, remote deployment or alternate bypass was used. Interactive rendering, physical controls, audible sound and final actual-browser PNG inspection remain unverified. Use `docs/EVENT-RUNBOOK.md` in the authorized target environment to establish those gates.

## Final consolidated execution

Executed against the final source and tests on Node v24.19.0/Linux:

- `npm run typecheck`: PASS
- `npm test`: 94/94 PASS, 0 failed/skipped/canceled
- `npm run test:unit`: 75/75 PASS
- `npm run test:integration`: 19/19 PASS
- `git diff --check`: PASS
- Approved asset tree versus source baseline: unchanged

Logs: `evidence/reliability-2026-09-30/{typecheck,tests,unit,integration}.log`. Full-show standalone log: `full-six-team-http.log`; final full-suite/integration logs repeat it against final lock code. Source/test hash receipt: `source-hashes.sha256`. Machine-readable wave ledger: `task-ledger.json`.

Before → after: 80 existing automated checks → 94 passing checks; direct UUID dependency → origin-compatible byte-generation contract with fail-closed UI; demonstrated two-writer stale recovery → guarded one-writer acquisition under deterministic, stress and multi-process regressions. Historical browser evidence is unchanged and cannot certify this candidate.

Next evidence needed, in dependency order: approve/integrate the two pending standalone badges; verify the exact published candidate; run current interactive-browser and final PNG export acceptance on an authorized machine; complete actual phone/projector/speaker rehearsal with approved input, preserving private files outside Git. No hosted Actions, deployment, forced update or private roster publication occurred in this local wave.
