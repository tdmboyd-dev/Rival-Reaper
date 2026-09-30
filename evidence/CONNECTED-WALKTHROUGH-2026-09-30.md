# Connected Windows verification — 2026-09-30

Base commit: `76cffd955df920c333cb3f9d107853f06ad8556f`.
Runtime: Node 22.19.0; Chrome 153.0.8010.48; Windows.
Scope: isolated fictional 47-player six-team rehearsal. No private roster,
official event, production credentials, deployment or hosted Actions used.

## Reproduced defects and scoped repairs

1. Windows checkout line endings left imports inside the host VM harness.
   All 13 host tests failed before exercising behavior with `Cannot use import
   statement outside a module`; the other 81 passed. The import-stripping
   expression now accepts LF and CRLF. Application host code is unchanged.
2. At 1280x720 with six full rosters, the ticket bottom was 473.8625793457031
   and the board top was 472.5: a 1.3625793457031px overlap. The six-team roster
   rows consume additional vertical space. The existing short-screen cabinet
   scale changes from 0.66 to 0.60. The original strict no-overlap assertion
   remains unchanged and passes. Corrected output was visually inspected.

## Executed results

- `npm ci --no-audit --no-fund`: installed 11 locked packages successfully.
- `npm run typecheck`: passed.
- `npm test`, after the harness repair: 94 tests, 94 passed, 0 failed,
  0 cancelled, 0 skipped, 0 todo; duration 19569.2486ms.
- `REAPER_TEST_LINEUP=six-v1 REAPER_TEST_COUNT=47 npm run test:browser`,
  after both repairs: 23/23 checks passed, no unexpected browser errors.
  Complete check receipt: `browser-results.json`, timestamp
  `2026-09-30T13:43:54.122Z`.
- `git diff --check`: passed.

The initial browser attempt completed 17 checks, including all six poster
downloads and server recovery, before the strict 720p geometry assertion
failed. The complete browser suite was rerun after repair, not bypassed.

## Coverage and artifacts

First two draws exercise real browser host controls; remaining participants
exercise authenticated HTTP and durable state. Terminal capacities are
8/8/8/8/8/7. Checks include authentication rejection, ordered concealed reveal,
third pointer yank, next-draw lock, host reauthentication, arena reload,
server restart/reconnect with identical public state, response-loss replay
without a duplicate fate, and audit chain/hash download.

All six original-template PNG downloads succeeded. Width is 3000px for all;
Heat Mob is 2500px high, others 3600px. Each preview contains the complete
public fictional roster. Canvas boundary tests retain 10 and 50 names of
120 characters. Screenshots and downloaded posters were retained locally
outside the repository, not added as event data.

1920x1080, 1280x720 and 390x844 layouts pass no-horizontal-overflow checks;
desktop checks also enforce ticket/board separation and viewport height.
Host and arena axe WCAG A/AA scans report zero violations. Sound toggle,
motion pause and reduced-motion checks pass. A separate visible Chrome
session was left open with synthetic names for owner inspection.

## Acceptance boundaries

Automated acceptance: 94/94 tests and 23/23 browser checks for this scoped
candidate. These denominators are not an overall production-readiness score.
Physical phone, projector and speaker proof remains pending. Owner visual
acceptance and outstanding standalone badge approvals remain pending.
No artwork bytes, draw rules, private inputs or normal event startup behavior
were changed. The visible walkthrough uses a separate memory-only test
session; the automated restart test uses encrypted temporary persistence.
