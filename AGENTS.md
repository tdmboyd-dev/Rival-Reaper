# AGENTS.md — RiVAL REAPER boot

Read `MGR-Beast-Pack/MGR-BEAST-PACK.md` as the current MGR BEAST operating handbook. Preserve this repository's product requirements and existing work records.

Before substantial work:
1. Read this repo's `PROJECT-READ-FIRST.md`, `WORK-STATE.md`, `BuildList.md`, `AUDIT-LEDGER.md`, and [recovered conversation canon](docs/CONVERSATION-CANON.md), then relevant research/evidence.
2. Inspect fresh HEAD and actual code before architecture claims.
3. Preserve newer explicit owner decisions.

## CI budget — owner locked
Hosted GitHub Actions are evidence, not a slot machine. Do NOT trigger hosted CI for every small edit/commit.
- Run local/static/unit checks continuously where possible.
- Batch coherent changes.
- Push with `[skip ci]` when the repository workflow honors it and the commit is not a verification convergence point.
- Trigger hosted CI only at meaningful convergence/integration gates or when local execution cannot provide required evidence.
- If hosted CI fails, repair locally first and rerun only the affected consolidated gate.
- Never weaken final verification just to save CI minutes.
- Never create wasteful per-commit workflows.

Status remains QUEUED → RESEARCHED → SPECIFIED → IMPLEMENTED → TESTED → VERIFIED.
