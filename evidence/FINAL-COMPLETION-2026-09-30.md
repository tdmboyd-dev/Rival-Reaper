# Final-completion software wave — 2026-09-30

Base: Rival-Reaper main `3bd5f474f761c830005574a7d40f8cc4e1c1e0b8`. Remote scoped claim: `01a873e9cd81cf65558a1043da021a43ef5dc758`. Node24.19.0/Linux cloud execution. All roster fixtures are fictional. No actual private roster or approved poster image was available.

## Executed

| Check | Observed result | Evidence |
|---|---|---|
| `npm ci --cache /tmp/reaper-npm-cache` | PASS,11packages installed | final-completion-2026-09-30/install.log |
| `npm run typecheck` | PASS | final-completion-2026-09-30/typecheck.log |
| `npm test` |62PASS,0fail | final-completion-2026-09-30/tests.log |
| `npm run test:unit` |45PASS,0fail | final-completion-2026-09-30/unit.log |
| `npm run test:integration` |17PASS,0fail | final-completion-2026-09-30/integration.log |
| `npm run rehearse -- /tmp/reaper-fake46.json` |12complete46-player rehearsals;10/9/9/9/9,gender quotas,zero household collisions in this fixture | final-completion-2026-09-30/fake46.log |
| `node --check` on every frontend JS file |PASS | executed during final wave |
| `git diff --check` |PASS | executed during final wave |

The45 unit/VM tests include14poster and9host-authentication regressions. VM tests execute the actual JS source with simulated browser primitives; they are not screenshots, decoded PNG pixel inspection, or physical browser/device proof.

## Browser boundary

A local browser run was attempted before the final frontend edits. Existing Chrome channel was not installed; system Chromium was explicitly selected through the new optional executable setting. Chromium could not start because its required local Unix socket was denied; reviewed escalation still failed. The managed cloud browser independently rejected `http://127.0.0.1:8787/arena` with `net::ERR_BLOCKED_BY_CLIENT`. No denied-path/network workaround, public tunnel or deployment was used.

The FINAL frontend browser acceptance run has NOT passed in this environment. Its executable runner now targets a complete fake46 draw plus five full-team PNG downloads and real canvas boundary checks. These added scenarios are NOT RUN here. Historical21browser checks in the older evidence directory apply to implementation155dafd, not these new frontend changes.

## What changed

- Fail-closed restart when input roster/team configuration differs from saved fate; encrypted file unchanged on rejection; row-reordered same roster resumes.
- Abort/generation guards stop delayed private responses restoring data after host lock. New event requires reauthentication. Third-yank continuation is bound to its own applied revision.
- Current host sends expectedSessionId; mismatched supplied identity is rejected even at matching revision. Legacy local API callers omitting it remain compatible.
- Back/Forward-restored documents reconnect exactly one public stream; stale callbacks cannot re-enable controls.
- Five authenticated completed-team PNG controls use the actual locally supplied poster image, preserve its full aspect/branding, and overlay all full names inside an explicitly confirmed on-art region. No region is guessed; unsafe fits and stale/offline exports fail closed. Image processing is serialized to bound memory.
- Portable Node loader entry points, explicit browser executable option, launch-failure cleanup, private-roster preflight and event/recovery instructions.

## Recovered-source distinctions

A prior unpushed continuation reportedly exists as commit674a8c43feaf9c7b24813a3a4c3a11ab9994507b on work/gate9-posters-2026-09-30. Neither its workspace nor branch/object could be retrieved here; remote fetch returned `not our ref`. No claim that this wave recovered that code. Poster capability is reconstructed while retaining the existing main implementation.

The five approved image references are POSTER TEMPLATES ONLY, NEVER reveal badges. A proposed generic badge loader was withdrawn from this batch after that newer source was recovered. No official art was generated or substituted. Actual names must occupy the existing original roster panels, including a tenth slot; the configurable region capability does not establish that final template match.

## Remaining acceptance

Actual five image files and their correct name regions; complete reconciled private roster; actual rendered-browser verification against this code; owner visual approval; physical phone/projector/speaker rehearsal; confirmed event run location. No whole-project-complete, production, acoustic, arbitrary250-player, or perfect-accessibility claim.

Hosted Actions:0. Repository workflow/run inspection found no workflows and zero runs. No workflow added, CI dispatched, deployment, PR merge or forced ref update.
