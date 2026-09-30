# Executed verification — 2026-09-30 UTC

Contract: ../CODEX-GATES-7-9.md. Windows PowerShell; Node22.19.0, npm10.9.3, installed Chrome153.0.8010.48. No hosted Actions used/workflow added. All fixture identities fabricated.

| Actual final command | Result | Evidence |
|---|---|---|
| npm ci | PASS;11 added/12 audited/zero reported vulnerabilities | final-install-repair.log |
| npm run typecheck | PASS exit0 | final-typecheck.log |
| npm test | 34PASS/0fail/0cancel/0skip/0todo;20unit+14HTTP/process integration | final-tests.log |
| npm run test:browser | 21acceptance checks PASS | final-browser.log;browser-results.json |
| npm ls --depth=0 | PASS resolved versions | dependencies.log |

Browser-results.json enumerates checks: private mobile host, pointer yanks, badge/name sequence, host/arena reload, server stop/restart live reconnect, lost-response command replay, complete fake45 ending9each, five effect screenshots, valid audit download, sound opt-in/mute, motion pause/reduced motion, viewport/overlap checks, host/arena axe A/AA scans with zero violations and no unexpected browser errors. This is not complete accessibility certification. Sound toggle is not acoustic verification; viewport simulation is not physical hardware verification.

Ignored evidence/screenshots contains local captures. Final1280x720,1920x1080,390x844 were visually inspected; projector tests assert ticket/board non-overlap and viewport height. Selected captures copied to chat outputs. Final image is daylight, rejected night not shipped.

## Break/repair record
- Baseline original8 tests/typecheck passed before expansion.
- integration-first.log: test auth helper default supplied token to unauthorized case; corrected helper invocation.
- unit-adversarial.log: solver search budget exhausted; fixed constrained-player ordering/pruning/memoization. unit-adversarial-repair.log and final suite pass.
- typecheck-full.log: axe default import invalid; named AxeBuilder import repaired.
- browser-first.log: ink aria-label lacked semantic role; added group role.
- browser-second.log: favicon404 console error; intentional204 route repaired.
- Screenshot inspection found paused/reduced-motion scaling caused720p overlap. Repaired grid/scale; browser-projector-repair.log and final explicit overlap assertions pass.
- final-install.log: Windows EPERM replacing esbuild while demo ran. Stopped demo; clean npm ci rerun passed in final-install-repair.log.
- Other intermediate logs remain historical; final logs above are authoritative final run.

## Other executed commands
Repository: git clone --branch main --single-branch https://github.com/tdmboyd-dev/Rival-Reaper.git work/Rival-Reaper; source clone with --branch feature/rival-reaper-2026-09-29; git pull --ff-only; git status --short; git rev-parse HEAD; git ls-remote; git push --dry-run origin main. Canonical docs/source PR/Actions read via GitHub connector/API.

Local: npm install; npm run test:unit; npm run test:integration; npm run demo; npx --yes prettier@3.6.2 --write on source/test/scripts/browser files/config; node ../../work/create-migration-manifest.mjs. npx --yes agent-browser used session reaper and installed Chrome for open/snapshot/screenshot. Browser script/test sources preserve the executable actions and assertions. Integration includes actual CLI kill/restart. Commands were not substituted with static code inspection.

Migration-manifest.json records22 source paths/blob IDs/SHA256. Research limitations and exact asset prompts are in research/VISUAL-PRODUCTION-2026-09-30.md and docs/ASSETS.md. COMMIT-RECEIPT.md pins implementation SHA and exact file manifest after commit creation. No production/deployment/real-roster claim.

Log whitespace was normalized at handoff (trailing spaces/blank EOF lines only); result text was preserved.

## Newer software completion wave

See [FINAL-COMPLETION-2026-09-30.md](FINAL-COMPLETION-2026-09-30.md) for62current tests and explicit final-browser limits. The Windows/Chrome21-check evidence above remains historical, not proof of the changed frontend or approved poster-template placement.
