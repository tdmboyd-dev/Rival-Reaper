# AGENTS.md — RiVAL REAPER boot

Before substantial work:
1. Read canonical Universal BEAST v2.1 at `tdmboyd-dev/mgr-perfect-skill`, branch `master`, file `BEAST.md`.
2. Read `tdmboyd-dev/mgr-perfect-skill`, branch `master`, file `CONTINUITY-PROTOCOL.md`.
3. Read this repo's `BEAST-JEV-READ-FIRST.md`, `WORK-STATE.md`, `BuildList.md`, `AUDIT-LEDGER.md`, and [recovered conversation canon](docs/CONVERSATION-CANON.md), then relevant research/evidence.
4. Inspect fresh HEAD and actual code before architecture claims.
5. Preserve newer explicit owner decisions.

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
