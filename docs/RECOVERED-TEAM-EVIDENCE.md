# Recovered Team Evidence — public-safe index

Recovered: 2026-09-30  
Scope: workflow, approval logic, public-safe art provenance, verification evidence, and unresolved requirements only.  
Privacy rule: this file intentionally excludes all real player names, genders, households, minor information, private roster paths/links, contact details, addresses, credentials, and private audit contents.

## 2. Owner approvals and corrections vs assistant suggestions

### Owner-approved / locked behavior

The following are owner-approved product rules recovered from source conversation and later canon:

- official competitive draw results require an actual draw; practice/example/test distributions are never official assignments;
- Blackout/support remains outside competitive balancing and random selection;
- art approval does not approve player assignments;
- later explicit owner corrections supersede earlier assumptions;
- each approved team visual world is distinct rather than one recolored template;
- completed-team roster posters are a different asset class from reveal badges;
- real roster data remains private/local rather than committed to public Git;
- fate locks before theatrical reveal and cannot be silently rerolled;
- host controls are private and arena/projector state is read-only.

### Assistant suggestions / proposals, not owner approval by themselves

The following were assistant-originated implementation recommendations and must not be treated as owner approval unless later explicitly accepted:

- specific architectural choices such as using a standalone local HTTP server, SSE, AES-GCM storage, exact receipt schema, or exact UI component choices;
- exact visual mechanics proposed before explicit owner acceptance;
- any suggested sixth-team activation;
- any proposed team assignment generated for practice, examples, testing, or rehearsals;
- any newly generated correction art unless the owner explicitly approved that exact artifact;
- any inferred operational rule derived only from arithmetic or convenience.

## 3. Tests vs VERIFIED evidence

Recorded status labels:
`QUEUED -> RESEARCHED -> SPECIFIED -> IMPLEMENTED -> TESTED -> VERIFIED`.

A test file existing is not TESTED. A passing test is not automatically full-product VERIFIED. VERIFIED requires an acceptance criterion, executed method, observed result, and evidence pointer.

### Historical successful browser evidence

The earlier successful Windows/Codex wave recorded:
- `npm ci` PASS
- `npm run typecheck` PASS
- `npm test` = 34 PASS
- `npm run test:browser` = 21 acceptance checks PASS
- full fake-roster rehearsal completed evenly for that historical fixture
- zero hosted GitHub Actions

Historical evidence:
- `evidence/README.md`
- `evidence/final-tests.log`
- `evidence/browser-results.json`

Successful browser command:
`npm run test:browser`

Resolved script:
`node --import tsx scripts/browser-rehearsal.ts`

Historical successful local workspace:
`C:\Users\cool\Documents\Codex\2026-09-29\work-on-my-tdmboyd-dev-rival\work\Rival-Reaper`

Historical manual demo:
`npm run demo`
with localhost host/arena routes at port 8787.

### Newer software evidence

A later published software wave is recorded at tested commit:
`60924ad198dfe11a6a37c7138822d66215c3d78d`

Publication evidence:
- `evidence/FINAL-COMPLETION-2026-09-30.md`
- `evidence/FINAL-COMPLETION-RECEIPT.md`

That wave records clean install, typecheck, 62 passing Node/HTTP/VM tests, and repeated aggregate rehearsals. However, its final changed-frontend browser acceptance did **not** complete in the cloud environment. Historical 21-check browser proof must not be used as proof for those later frontend changes.

## 4. Canonical source-of-truth layout

RiVAL REAPER:
- `AGENTS.md` — entry/boot pointer
- `PROJECT-READ-FIRST.md` — local method/product boundary
- `WORK-STATE.md` — current resume/continuity state
- `BuildList.md` — implementation/gate truth
- `AUDIT-LEDGER.md` — defect/repair truth
- `docs/CONVERSATION-CANON.md` — recovered owner decisions and public implementation receipts
- `docs/EVENT-RUNBOOK.md` — event/recovery procedure
- `docs/ASSETS.md` and visual research files — asset/provenance truth
- `evidence/` — executed test/runtime receipts

Private roster, credentials, secrets, and private audit exports are intentionally outside public Git.

## 5. Tools, environment, browser workflow

Recovered tool/environment workflow included:

- GitHub repository inspection/write operations through authenticated GitHub tooling;
- local Node/npm execution for typecheck, unit/integration/runtime tests;
- Playwright-based browser rehearsal in `scripts/browser-rehearsal.ts`;
- installed Chrome in the successful historical Windows run;
- `agent-browser` was also used for manual inspection in the historical Codex workspace, but the exact full command sequence is not preserved well enough to reproduce without guessing;
- MotionSites research for cinematic composition/camera/3D prompt structure;
- 21st.dev public component research; authenticated 21st MCP was unavailable in the recorded wave, so no claim of paid/authenticated retrieval should be made;
- generated/fake data for committed demos and tests; real participant input remains private.

Current launcher defaults to `127.0.0.1`. Exact historical internal preview-forwarding/proxy transport was not recovered and must not be invented. No public tunnel/deployment was proven.

## 6. Batching, publishing, and CI-cost discipline

Owner directive: do not burn GitHub Actions on every small change.

Recovered operating rule:
- local/static/unit/integration/browser checks first;
- batch coherent changes;
- hosted CI only at meaningful convergence/integration/release gates;
- repair locally before rerunning hosted gates when possible;
- no force-push;
- do not merge automatically;
- preserve unrelated work.

The documented Reaper waves report zero hosted GitHub Actions for the cited verification work.

## 7. Public-safe art provenance

### IMPORTANT correction: two newer preview files are **not historical originals**

The following files were recovered from the user's Library as model-generated ImageGen artifacts created on **2026-09-30 at 08:00:39 UTC**. They therefore must **not** be labeled old historical approved originals merely because their filenames match later team names.

#### `pressure-gang-preview.png`
- Library path: `/pressure-gang-preview.png`
- file_id: `file_00000000129c81f5b45f02359b1ef7b3`
- library_file_id: `libfile_7b3328faf5448191a167990c800f7ffe`
- artifact type: `image_gen`
- model_generated: true
- created_at: `2026-09-30T08:00:39+00:00`
- SHA-256: `ab0864cab061270a6478c3322c74188b5da4cb5166a7a501696180c555900ea3`
- exact generation conversation turn: **not recovered**
- status: **newly generated correction/proposal artifact; not proven to be a historical original or historically approved standalone badge**

#### `high-society-preview.png`
- Library path: `/high-society-preview.png`
- file_id: `file_00000000940481f5ab898afc9dbc8654`
- library_file_id: `libfile_80abb70c3ad88191ac2790f9979e1eac`
- artifact type: `image_gen`
- model_generated: true
- created_at: `2026-09-30T08:00:39+00:00`
- SHA-256: `b4b2cf1b51b94bdf03b3df95ba0a243f0cef0e9b61df1297708a966324a935bf`
- exact generation conversation turn: **not recovered**
- status: **newly generated correction/proposal artifact; not proven to be a historical original or historically approved standalone badge**

### Historical recovered originals with obsolete names

These separate recovered files are older-original candidates by file identity/naming, but their labels are obsolete relative to later team-name decisions:

#### `Blue-Pressure-Standalone-Badge-ORIGINAL.png`
- file_id: `file_00000000547082308bf18686f4b14ee8`
- SHA-256: `14e50775e5e2cf284248840d888c5af20461c42a1e4b060f9e9a983d866c7a78`
- recovered label is obsolete: `Blue Pressure`
- do not rename/rewrite history to pretend the original file itself said `Pressure Gang`

#### `Loud-Pack-Standalone-Badge-ORIGINAL.png`
- file_id: `file_000000006d308230819fac67a2c70c17`
- SHA-256: `86fe31d40a14f4a7db11b44110859d2a77fc4bee50175e8c256a8f3de7a726a6`
- recovered label is obsolete: `Loud Pack`
- do not rename/rewrite history to pretend the original file itself said `High Society`

Separate later roster-world originals also exist for the approved completed-team poster worlds; they are not standalone reveal badges.

### Purple art

A later owner statement approves BELT 2 ASS purple badge art and matching EMPTY roster art. That approval concerns art only. It does not by itself activate a sixth draw team and does not approve any participant assignment.

## 8. Unresolved / missing requirements

Public-safe unresolved items:

- exact historical originals for standalone badges under the final names remain unresolved;
- exact original generation/approval turn for the two 2026-09-30 preview artifacts is not recovered;
- five-team versus six-team operational activation still requires explicit owner decision if not already separately approved;
- final changed-frontend browser acceptance against the newest code remains open;
- actual physical phone/projector/speaker rehearsal remains open;
- exact internal preview transport/proxy setup from a prior branch session is not recovered;
- completed-team poster exporter still requires actual approved art and confirmed name-panel regions; regions must not be guessed;
- final owner visual acceptance remains open;
- no deployment/public-hosting proof exists;
- private roster and private audit data must remain outside public Git.

## 9. Recovery boundary

This document records evidence that is public-safe and presently recoverable. It does not claim access to hidden model reasoning, unavailable raw tool payloads, inaccessible local workspaces, private roster contents, or unrecovered source turns. When evidence conflicts, newest explicit owner direction and executed proof take priority over historical assistant summaries.
