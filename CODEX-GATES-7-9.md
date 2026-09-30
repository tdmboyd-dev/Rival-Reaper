# CODEX — PASTE/EXECUTE CONTRACT FOR RiVAL REAPER

Owner: Timebeunus Boyd / Money Grind Religion
Target repository: `tdmboyd-dev/Rival-Reaper`
Target branch: `main`

You are not starting a new design exercise. You are continuing an existing RiVAL REAPER implementation and migrating its product-owned code out of MGR Creation OS into its correct standalone repository.

## 1. REPOSITORY RECORDS

Then in `tdmboyd-dev/Rival-Reaper` read, in order:
1. `AGENTS.md`
2. `PROJECT-READ-FIRST.md`
3. `WORK-STATE.md`
4. `BuildList.md`
5. `AUDIT-LEDGER.md`

Treat the newest explicit owner decisions as product authority and executed evidence as verification authority. Do not assume another ChatGPT/Codex window shares hidden context.

## 2. UNIVERSAL CI/GITHUB ACTIONS COST LOCK

The owner is explicitly ordering you NOT to burn GitHub Actions minutes on every small commit.


Rules:
- run local typecheck/lint/unit/integration/browser checks first whenever possible;
- batch coherent work before pushing;
- do not use hosted GitHub Actions as an edit-by-edit feedback loop;
- do not add workflows that run expensive suites on every trivial docs/prompt/formatting/intermediate commit;
- use `[skip ci]` only if the configured workflow/provider actually honors it and hosted evidence is unnecessary for that commit;
- use hosted CI at meaningful convergence/integration/release gates;
- if hosted CI finds a defect, reproduce and repair locally first, then rerun the affected consolidated gate;
- never weaken final verification to save money.


## 3. SOURCE IMPLEMENTATION TO MIGRATE

The existing prototype is here:
- repo: `tdmboyd-dev/MGR-CREATE-Os`
- branch: `feature/rival-reaper-2026-09-29`
- draft PR: #1

Inspect fresh HEAD before copying.

Migrate ONLY RiVAL REAPER-owned artifacts, including the relevant:
- `src/rival-reaper/`
- `test/rival-reaper*.test.ts`
- `examples/rival-reaper/`
- `research/RIVAL-REAPER-MOTIONSITES-2026-09-29.md`
- `research/RIVAL-REAPER-21ST-CODEX-2026-09-29.md`
- `docs/RIVAL-REAPER-CODEX-EXECUTION-PROMPT.md` as historical source if useful

Do NOT copy unrelated Creation OS source. If a Reaper module truly depends on a shared Creation OS contract, preserve that as an explicit package/interface/adaptor boundary instead of dragging the whole repo over.

After migration, Creation OS may retain history/adapters, but `tdmboyd-dev/Rival-Reaper` becomes the product source of truth.

## 4. OWNER-LOCKED PRODUCT RULES

Five competing teams:
- RED — Blood Bloom — Rose Panther world
- BLUE — Pressure Gang — water/pressure world
- GREEN — High Society — smoke/green fantasy world
- ORANGE — Heat Mob — fire lion world
- PINK — Pink Venom — venom kingdom, versatile across genders

Blackout Krew:
- support/referee/help-cook/grill/serve/setup/cleanup/food/drinks/media/sideline crew;
- NEVER enters the competitive raffle;
- NEVER affects five-team size/gender balancing.

Derive team capacities from the actual validated roster. Do not hard-code a historical headcount: roster counts can change.

Privacy:
- repository is public;
- never commit the actual private roster file, secrets, tokens, phone numbers, addresses or sensitive household metadata;
- fake/sample nicknames are allowed for tests/examples;
- real roster must be runtime/local/private input.

Fairness:
- enforce capacity;
- balance male/female counts;
- prefer household separation and relax only when mathematically unavoidable;
- randomness only breaks equally valid placements;
- no silent rerolls.

Draw truth:
- fate is cryptographically locked before theatrical reveal;
- reveal cannot mutate player/team outcome;
- each locked fate has a tamper-evident receipt;
- restart/recovery must resume locked state without rerolling.

Views:
- private authenticated host phone/tablet control room;
- read-only 16:9 arena/projector display.

## 5. GATE 7 — EXECUTE, BREAK, REPAIR

After standalone migration, establish the correct package/build/test config and RUN the code locally.

At minimum execute:
- dependency install
- typecheck
- unit tests
- integration tests
- local server boot
- API smoke tests

Add/execute tests for:
- unauthorized host call
- malformed/missing auth
- duplicate player draw
- concurrent/double-click draw attempt
- team full/no capacity
- dynamic capacities (45 -> 9/9/9/9/9; 43 -> 9/9/9/8/8)
- household separation
- unavoidable household collision fallback
- male/female balancing
- Blackout exclusion
- malformed roster/duplicate IDs
- receipt tampering
- wrong encryption secret
- corrupt encrypted snapshot
- restart from encrypted snapshot
- idempotent/replayed commands
- reveal cannot begin without locked fate
- reveal cannot alter locked team/player
- second draw blocked until reveal terminal state
- audit export integrity

Fix proven defects and add regression tests.

Do not mark TESTED unless tests actually ran.
Do not mark VERIFIED without acceptance criterion + observed result + evidence pointer.

## 6. GATE 8 — COMPLETE SYNCHRONIZED THEATRICAL REVEAL

Preserve this authoritative sequence:

IDLE
→ MACHINE_AWAKENS
→ COLORS_FIGHT
→ BADGE_SELECTED
→ TICKET_EJECTS
→ INK_1
→ INK_2
→ INK_3
→ NAME_REVEALED
→ TEAM_EXPLOSION
→ ROSTER_UPDATED

Required:
- fate locks exactly once before presentation;
- host advances presentation but cannot change fate;
- arena receives state live;
- browser reconnect restores current presentation state;
- process restart restores locked draw AND safe reveal state;
- no next draw until current reveal reaches terminal state;
- repeated/replayed host commands cannot duplicate a draw;
- current receipt hash visible in private audit view;
- final audit bundle export exists;
- use fake roster for committed tests.

The desired human interaction:
1. machine wakes up and team colors visibly fight;
2. team/badge emerges first;
3. physical-looking ticket ejects;
4. name is hidden under black/invisible ink;
5. host/user performs repeated yank motion;
6. each yank removes more ink;
7. final yank reveals name;
8. team world explodes/celebrates;
9. roster board updates.

## 7. GATE 9 — HORRIBLY UNORTHODOX VISUAL PRODUCTION

This cannot look like a generic SaaS dashboard or five colored cards.

Use:
- MotionSites research for cinematic prompt structure, camera choreography, video/image-sequence/GLB reference workflow;
- 21st.dev for source-level UI primitives, shaders, interactions and polished components;
- Codex to integrate them;
- MGR/Reaper engine remains state authority.

### 21st.dev
Use the CURRENT official 21st MCP/Codex instructions. Search before inventing.
Search multiple candidates for:
- shader/energy backgrounds
- physical lever/pull controls
- ticket/card material
- text/invisible-ink reveal
- animated counters
- audit drawer
- spotlight/reveal effects
- projector-safe animated hero
- reduced-motion alternatives

Review code/dependencies/accessibility/responsiveness before adopting. Copy/adapt only useful source. Do not install random component spam.

### MotionSites
Use the existing research dossier. If selecting a MotionSites reference:
- inspect/copy the detailed prompt;
- preserve useful camera/animation structure;
- replace reference video/image/GLB assets with Rival Reaper assets;
- keep UI/text editable and outside baked video;
- use focused refinements instead of repeated whole-page redesign;
- realtime draw/ticket interaction remains code-driven.

### Visual world
Build an urban fantasy/metaverse Game Day machine:
- massive physical slot/raffle cabinet;
- stadium/block-party atmosphere;
- Black urban family/friends energy with diverse supporting crowd;
- five team energies bleed/fight into each other instead of rectangular color boxes;
- locked badges are huge reveal moments;
- ticket feels physical;
- yank has weight/spring/jerk;
- invisible ink burns/scratches/recedes over three yanks;
- final name readable across a room;
- team explosion unique per team;
- Blackout Krew support presence with gorilla + dog identity, but not in raffle;
- audio hooks, mute control, browser autoplay-safe behavior;
- prefers-reduced-motion fallback;
- keyboard/focus/contrast basics;
- mobile host and 16:9 arena are both first-class.

If the approved badge image files are not present, create clearly labeled replaceable placeholders. Do NOT invent new official badges.

## 8. RESEARCH / ASSET RULE

Do not assume this prompt contains everything:
- inspect what already exists;
- research current official docs where uncertain;
- use primary sources;
- repair stale assumptions;
- record important findings in this repo.

Do not expose secrets or private family data in research/docs.

## 9. WORK STYLE

Work in one substantial wave. Do not stop and report after every tiny milestone.
You may research, code, test, break, repair, inspect UI and update docs in the same wave.
Do not merge automatically.
Do not force-push.
Do not overwrite unrelated work.
Do not spend hosted CI minutes repeatedly.

## 10. REQUIRED HANDOFF

Before stopping, update:
- `WORK-STATE.md`
- `BuildList.md`
- `AUDIT-LEDGER.md`
- evidence/test records

Report:
- exact repo/branch/HEAD
- source commit migrated from Creation OS
- files changed
- commands actually executed
- exact test counts/results
- runtime/browser checks actually performed
- visual artifacts/screenshots if generated
- CI runs used and WHY each hosted run was necessary
- remaining defects/blockers
- score against all 10 Reaper gates
- exact next action

Do not say done unless the evidence satisfies the gate.
