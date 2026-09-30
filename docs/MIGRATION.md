# Migration provenance

Target: tdmboyd-dev/Rival-Reaper, main. Starting HEAD: f9311332070a706f1af000d537e41c33717fa2ca. Scoped claim commit: d78627c5ca12d1eb8f370574e55e3358ac34007c.

Source: tdmboyd-dev/MGR-CREATE-Os, feature/rival-reaper-2026-09-29, f2f14f58fb454ea83706bddfc2371fd2a358b947. Draft PR #1 remained open/unmerged; fresh API HEAD matched clone before migration. No source branch changes.

Read in full: canonical BEAST (blob 8ca4b381010f586e8418bcbd85bd1e2a6b5d21a7), continuity protocol (blob 614e7b3b7076a1ad40dad17e1aa1a8b28e7a5536); target AGENTS, BEAST-JEV-READ-FIRST, WORK-STATE, BuildList, AUDIT-LEDGER, CODEX-GATES-7-9 in order. All 22 scoped source files plus package.json/tsconfig.json were read. This was not a whole-Creation-OS audit.

Migrated and continued:
- src/rival-reaper/{cli,engine,persistence,receipts,reveal,roster,server,session}.ts
- test/rival-reaper.test.ts and rival-reaper-{session,roster,reveal,receipts,persistence}.test.ts
- examples/rival-reaper/{arena.html,host.html,index.html,README.md,roster.sample.json}
- research/RIVAL-REAPER-MOTIONSITES-2026-09-29.md
- research/RIVAL-REAPER-21ST-CODEX-2026-09-29.md
- docs/RIVAL-REAPER-CODEX-EXECUTION-PROMPT.md (historical, superseded)

No Reaper module imported a shared Creation OS runtime. No unrelated source, dependencies or workflows were copied. Compiler configuration derives from the source; package identity/scripts are standalone. Source blob IDs and content hashes are in evidence/migration-manifest.json.

Backwards decisions: KEEP module boundaries and reveal order; REPAIR fairness completion, restore identity, transactional commands, privacy and recovery; RETIRE independent Math.random browser raffle; REPAIR host/arena in place, extracting JS/CSS; ADAPT one MIT Spotlight component discovered on 21st through its author's public upstream. No framework restart, merge or force-push.
