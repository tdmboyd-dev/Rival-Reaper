# REAPER MACHINE EFFECTS HANDOFF

Recovered/current-state handoff for RiVAL REAPER machine presentation, Control Room, Arena, War Board, sounds, interactions, and cinematic extensions.

**Repository:** `tdmboyd-dev/Rival-Reaper`  
**Baseline inspected for this handoff:** `main@6764f52e701ec0dbe87ac0bbdb43f81ac8c4eb09`  
**Privacy boundary:** no real participant names, genders, households, minors, credentials, or private roster links appear in this document.

---

## 0. Status legend

Use these labels literally when continuing work:

- **OWNER-APPROVED** — explicitly accepted/corrected by owner.
- **BUILT** — exists in current source.
- **TESTED-HISTORICAL** — executed successfully on an earlier tested implementation; not automatically proof of later frontend changes.
- **TESTED-CURRENT-SOFTWARE** — covered by newer Node/HTTP/VM evidence at the published software commit.
- **PARTIAL** — some of the behavior exists, but the final cinematic/physical version is not complete.
- **PROMPT-ONLY / IDEA** — discussed/researched/planned, not implemented.
- **MISSING-ASSET** — implementation hook exists but approved visual file is absent.
- **NOT VERIFIED** — no executed evidence for the final current visual/device behavior.

---

# 1. Owner-approved product personality and machine identity

## 1.1 Field Day personality

**OWNER-APPROVED DIRECTION / conversation-derived:** the Arena should feel like a loud urban family field day rather than a generic website or esports dashboard.

The machine lives inside:
- loud family/friends Field Day energy;
- cookout/fish-fry/grill smoke;
- DJ/speaker-wall atmosphere;
- folding chairs, tents, coolers, team shirts, referees, games and crowd reactions;
- colorful fantasy energy bleeding through a grounded outdoor daylight/late-afternoon environment;
- people and culture more prominent than empty pavement;
- competitive shit-talking energy while still reading as family/friends.

Public-safe recovered canon: `docs/CONVERSATION-CANON.md`.

## 1.2 Machine itself

**OWNER-APPROVED:** the machine is a **neutral RiVAL REAPER / Rival Day fate machine**, not a Purple/BELT 2 ASS machine.

**OWNER CORRECTION:** BELT 2 ASS is a real competitive sixth team. Purple must appear as one equal possible fate, not own the machine.

**OWNER-APPROVED VISUAL DIRECTION:** horribly unorthodox urban fantasy; large physical machine; magic/energy in the middle; colors/creatures appear to fight when the machine activates/pulls; heavy physical lever/ticket mechanism.

The official Rival Reaper logo supplied by owner is a separate machine/brand identity reference. Do not substitute a team badge as the machine logo.

---

# 2. Authoritative reveal sequence

**OWNER-APPROVED + BUILT**

The server-side presentation sequence is:

`idle`
→ `machine-awakens`
→ `colors-fight`
→ `badge-selected`
→ `ticket-ejects`
→ `ink-1`
→ `ink-2`
→ `ink-3`
→ `name-revealed`
→ `team-explosion`
→ `roster-updated`

Authoritative code:
- `src/rival-reaper/reveal.ts`
- `src/rival-reaper/server.ts`

Rules:
- fate is locked before theatrical presentation;
- presentation cannot change the player/team;
- no second draw before current reveal reaches terminal state;
- reconnect/restart must restore the same locked fate;
- public arena withholds team until badge phase and player name until name-revealed;
- roster changes only at terminal roster-updated.

Evidence:
- historical successful browser evidence: `evidence/browser-results.json`;
- historical unit/integration evidence: `evidence/final-tests.log`;
- newer software evidence: `evidence/FINAL-COMPLETION-2026-09-30.md`;
- publication receipt: `evidence/FINAL-COMPLETION-RECEIPT.md`.

---

# 3. Machine awakening

## Behavior

**OWNER-APPROVED CONCEPT + BUILT BASIC VERSION + CINEMATIC VERSION PROMPT-ONLY**

When fate locks:
- machine wakes from idle;
- cabinet moves toward the audience / visually powers on;
- lights/gauges/speakers/mechanics should come alive;
- low-frequency bass/mechanical wake feeling;
- crowd/environment remains visible around it;
- team result is still hidden.

### Current built behavior

Files:
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/styles.css`

Current CSS:
- machine scales/straightens during `machine-awakens`;
- glow intensifies;
- phase label changes;
- synthetic sound cue can trigger if sound is enabled.

Relevant selectors/effects:
- `[data-phase="machine-awakens"] .machine`
- `.machine`
- `.portal`
- `cue(phase, team)` in `arena.js`

### Evidence

**TESTED-HISTORICAL:** earlier browser rehearsal covered authoritative phase progression, reconnect/recovery and visual screenshots.  
Evidence: `evidence/browser-results.json`.

**NOT FINAL-CINEMATIC VERIFIED:** later frontend changes do not have a complete final browser pass.

### Still missing

- the heavy cinematic hydraulic/mechanical wake described in the newer promptbook;
- real physical-looking speaker flex / sequential lamps / gauge movement;
- optional Higgsfield wake clip integration;
- final owner approval of the motion.

Prompt research:
- `research/CINEMATIC-PROMPTBOOK-2026-09-30.md`
- media-prep branch: `media/higgsfield-cinematic-build-2026-09-30`
- scene manifest there: `config/higgsfield-scenes-v2.json`

---

# 4. Six colors fighting

## Behavior

**OWNER-APPROVED PRIORITY + BUILT BASIC CSS + HIGGSFIELD PROMPT PREPARED**

All six competitive worlds fight/bleed into each other before the chosen team is revealed:

1. Blood Bloom — red rose/thorns/Rose Panther energy
2. Pressure Gang — blue water/hydraulic pressure
3. High Society — green smoke/gold/street-fantasy
4. Heat Mob — orange fire/Fire Lion
5. Pink Venom — hot-pink venom/black chrome/serpent movement
6. BELT 2 ASS — purple crystal/ram/belt-force energy

The owner specifically rejected isolated colored boxes as the main visual metaphor; colors should look like they are **fighting/competing**.

### Current built behavior

Files:
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/shared.js`

Built:
- animated energy ribbons;
- faster/more intense color motion during `colors-fight`;
- active team count switches to FIVE/SIX based on server lineup;
- current six-team world registry exists in `shared.js`.

Relevant:
- `.energy-ribbons`
- `.energy-ribbons i`
- `[data-phase="colors-fight"] .energy-ribbons i`
- `worlds` in `shared.js`.

### Evidence

**TESTED-HISTORICAL:** five-world effects were captured in earlier browser evidence before the sixth-team update.  
**TESTED-CURRENT-SOFTWARE:** six-team lineup/server behavior is covered in later software tests, but the final six-way cinematic browser effect is not fully browser-verified.

### Still missing

- true magical collision instead of simple blurred ribbons;
- creatures/elemental forms visibly interacting;
- six-way lighting response on machine/crowd;
- optional O3 Higgsfield `colors-fight` clip integration;
- final live browser inspection after integration.

---

# 5. Badge reveal

## Behavior

**OWNER-APPROVED + BUILT + PARTIAL ASSET COVERAGE**

At `badge-selected`:
- competing energy collapses;
- selected team badge becomes the hero;
- badge should slam/strike into visual focus;
- no player identity yet;
- badge is exact approved team art, not AI-generated replacement text.

### Current built behavior

Files:
- `examples/rival-reaper/badge-art.js`
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/styles.css`

Built:
- badge view swaps based on authoritative public team state;
- badge slam animation;
- fallback symbol when asset missing;
- badge cannot choose fate;
- ticket can reuse team badge view.

Relevant:
- `REVEAL_BADGES`
- `createBadgeView()`
- `[data-phase="badge-selected"] .badge`
- `[data-phase="badge-selected"] .energy-window`.

### Current badge asset truth on main

Present:
- `examples/rival-reaper/assets/blood-bloom-badge.png`
- `examples/rival-reaper/assets/heat-mob-badge.png`
- `examples/rival-reaper/assets/pink-venom-badge.png`
- `examples/rival-reaper/assets/belt-2-ass-badge.png`

Support-only:
- `examples/rival-reaper/assets/blackout-krew-support-badge.png`

**MISSING-ASSET:**
- Pressure Gang final standalone reveal badge
- High Society final standalone reveal badge

Their roster-world templates exist but must not be silently used as reveal badges:
- `pressure-gang-roster-template.png`
- `high-society-roster-template.png`

### Evidence

Historical browser sequence verified that badge precedes ticket/name.  
Evidence: `evidence/browser-results.json`.

---

# 6. Lever / pull interaction

## Behavior

**OWNER-APPROVED + BUILT BASIC PHYSICAL PULL + PARTIAL VISUAL QUALITY**

The lever/pull must feel heavy and physical, not like a normal web button.

Discussed behavior:
- press/drag downward;
- resistance/tension;
- spring-back;
- machine/ticket reacts to pull;
- touch-first on phone;
- keyboard/tap fallback;
- no duplicate command from double interaction;
- later visual concept includes giant metal lever on machine plus private Control Room pull.

### Current built host interaction

File:
- `examples/rival-reaper/host.js`

Built:
- pointerdown captures starting Y;
- pointermove translates pull grip;
- crossing 40px threshold advances exactly once;
- pointer capture;
- pointerup/cancel resets grip;
- command IDs are replay-safe;
- tap/click path also exists.

Relevant code:
- `#advance` pointer handlers;
- `advance()`;
- `newCommandId()`.

### Current visual lever

Files:
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/arena.html`

Built decorative lever:
- `.lever-decoration`

### Evidence

**TESTED-HISTORICAL:** browser rehearsal explicitly tested a physical pointer yank and confirmed the third yank revealed the locked name.  
Evidence wording in `evidence/browser-results.json`: “Third physical yank reveals exact locked name.”

**TESTED-CURRENT-SOFTWARE:** replay/idempotency/private-command behavior has newer regression coverage.

### Still missing

- premium spring physics;
- synchronized machine lever movement on public Arena;
- haptic vibration as optional progressive enhancement;
- 3D lever geometry / GLB animation;
- stronger sound layers tied to lever resistance.

---

# 7. Ticket ejection

## Behavior

**OWNER-APPROVED + BUILT CSS + CINEMATIC CLOSEUP PROMPT PREPARED**

Desired:
- rollers/gears physically engage;
- ticket jerks out in stages;
- team identity may appear on ticket;
- player identity remains sealed;
- camera can drop into mechanical close-up;
- ticket becomes primary reading plane.

### Current built behavior

Files:
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/arena.html`
- `examples/rival-reaper/arena.js`

Built:
- ticket is hidden during earlier phases;
- ticket becomes visible after ticket phase;
- perspective/rotation;
- physical-paper styled clipping;
- ticket badge/team rendered separately from player identity;
- “IDENTITY SEALED” behavior before authorized reveal.

Relevant:
- `.ticket-bay`
- `.ticket`
- phase selectors for hidden ticket;
- ticket badge view in `arena.js`.

### Evidence

Historical browser rehearsal:
- badge first;
- ticket;
- player name absent before reveal;
- reload restores ink phase.

Evidence: `evidence/browser-results.json`.

### Still missing

- true animated gears/rollers;
- staged mechanical paper feed;
- camera closeup;
- optional Higgsfield ticket-bay clip integration.

---

# 8. Three pulls / ink removal

## Behavior

**OWNER-APPROVED SIGNATURE INTERACTION + BUILT + TESTED-HISTORICAL**

The player name is concealed under heavy black “invisible ink” / scratch-style mask.

Sequence:
- Pull 1 removes first irregular portion;
- Pull 2 removes more;
- Pull 3 breaks final ink;
- then name is authorized/revealed;
- name must not exist in public state early enough to leak.

### Current built behavior

Files:
- `src/rival-reaper/reveal.ts`
- `src/rival-reaper/server.ts`
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/host.js`
- `examples/rival-reaper/arena.js`

CSS masks:
- `[data-phase="ink-1"] .ink-cover`
- `[data-phase="ink-2"] .ink-cover`
- `[data-phase="ink-3"] .ink-cover`

Host:
- labels explicitly track pull 1/3, 2/3, 3/3;
- third physical yank persists ink-3 then executes separate replay-safe name continuation.

Server:
- public name remains null until authorized stage.

### Evidence

**TESTED-HISTORICAL:**
- first ink phase survives arena reload;
- host reload resumes same reveal;
- third physical yank reveals exact locked name;
- name absent before reveal.

Evidence: `evidence/browser-results.json`.

**TESTED-CURRENT-SOFTWARE:** newer tests cover third-yank continuation/replay safety.

---

# 9. Name reveal

## Behavior

**OWNER-APPROVED + BUILT + TESTED-HISTORICAL**

Desired:
- huge readable player name;
- rack-focus / visual attention shift from badge to name;
- hold approximately 600–900ms before celebration;
- readable from across event space;
- crowd/team lighting responds;
- no early leakage.

### Current built behavior

Files:
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/styles.css`
- `src/rival-reaper/server.ts`

Built:
- `#player-name` is “IDENTITY SEALED” before name authorization;
- real public name is only sent/rendered at name-revealed;
- ticket enlarges/straightens around name reveal;
- ink fades out.

Relevant:
- `[data-phase="name-revealed"] .ink-cover`
- `[data-phase="name-revealed"] .ticket`.

### Evidence

Historical browser test explicitly verifies exact locked name appears after third pull.  
Evidence: `evidence/browser-results.json`.

### Still missing

- true cinematic rack focus;
- stronger hold timing/spotlight treatment;
- real crowd-light reaction;
- final physical projector readability test.

---

# 10. Team celebrations / magical worlds

## Global behavior

**OWNER-APPROVED + BUILT BASIC PER-TEAM EFFECTS + CINEMATIC VIDEO PROMPTS PREPARED**

At `team-explosion`, celebration is unique by team. It should feel magical/fantasy, not generic confetti.

Current files:
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/shared.js`

Current built base:
- `.world-burst`
- per-team `data-team` styling;
- synthesized sound tone varies by team.

## Blood Bloom

**OWNER-APPROVED IDENTITY:** Rose Panther world.

Effects discussed:
- crimson rose petals;
- black thorn vines;
- red/gold magical energy;
- Rose Panther silhouette/presence;
- chain/gold material language.

Built basic:
- Blood Bloom burst particles use petal-like shape.

Prompt-only extension:
- Higgsfield cinematic celebration with petals/thorns/Panther world.

Assets:
- reveal badge exists;
- roster template exists.

## Pressure Gang

**OWNER-APPROVED IDENTITY:** Water/Pressure King world.

Effects:
- cobalt liquid pressure;
- hydraulic rings;
- compressed water shockwaves;
- dark blue chrome;
- pressure gauge / deep-water power feeling.

Built basic:
- world burst becomes blue ring-like pressure particles.

Prompt-only extension:
- O3 multi-reference pressure celebration.

Asset problem:
- roster template exists;
- corrected final standalone reveal badge still missing.

## High Society

**OWNER-APPROVED IDENTITY:** Smoke King / elevated green fantasy.

Effects:
- thick emerald smoke;
- gold sparks;
- haze/topiary/green fantasy luxury;
- cannabis-adjacent High Society identity without reducing the world to a plain leaf icon.

Built basic:
- world burst becomes large blurred smoke clouds.

Prompt-only extension:
- O3 emerald smoke/gold celebration.

Asset problem:
- roster template exists;
- corrected final standalone reveal badge still missing.

## Heat Mob

**OWNER-APPROVED IDENTITY:** Fire Lion.

Effects:
- molten orange steel;
- heat distortion;
- flames/embers;
- Fire Lion silhouette.

Built basic:
- tall flame-like particle shapes.

Prompt-only extension:
- O3 Fire Lion celebration.

Assets:
- reveal badge exists;
- roster template exists.

## Pink Venom

**OWNER-APPROVED IDENTITY:** Venom Kingdom; versatile across genders.

Effects:
- hot-pink venom;
- black chrome;
- serpent/liquid ribbons;
- sharp magenta lighting;
- powerful, dangerous, not feminine-only.

Built basic:
- long pink streak particles.

Prompt-only extension:
- O3 Pink Venom celebration.

Assets:
- reveal badge exists;
- roster template exists.

## BELT 2 ASS

**OWNER-APPROVED ACTIVE SIXTH TEAM.**

Effects:
- purple crystal shockwaves;
- ram/horn energy;
- gold belt hardware;
- violet lightning/crystal magic;
- heavy impact/power identity.

Built:
- six-team world definition exists in `shared.js`;
- six-team backend lineup exists in `src/rival-reaper/lineup.ts`;
- badge exists;
- roster template exists.

Prompt-only extension:
- O3 Purple team celebration.

Do not make the machine itself Purple.

---

# 11. Sound

## Current built sound

**BUILT + CONTROLS TESTED-HISTORICAL + ACOUSTIC OUTPUT NOT VERIFIED**

File:
- `examples/rival-reaper/arena.js`

Uses Web Audio oscillators:
- each team has a base tone in `shared.js`;
- ink phases use triangle-ish cue;
- team explosion uses multi-note ratios;
- user must explicitly enable sound;
- hidden tab suspends audio;
- sound failure cannot affect draw.

Controls:
- SOUND ON/OFF;
- browser autoplay-safe because user clicks to enable.

Evidence:
- historical browser test verified sound toggle/mute controls;
- it explicitly did **not** verify audible speaker output.

Missing:
- layered real-world samples: hydraulic hiss, heavy latch, paper rip, crowd swell, speaker thump, crystal crack, water burst, smoke bass, fire roar, venom whip;
- actual speaker/acoustic event test;
- per-team professional sound stings.

---

# 12. Arena / public page

## Purpose

**OWNER-APPROVED + BUILT**

Public 16:9 show surface:
- read-only;
- no private roster metadata;
- no host token;
- no unrevealed name;
- reacts only to server state;
- machine, ticket, badge, team effects and War Board visible.

Files:
- `examples/rival-reaper/arena.html`
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/shared.js`

Built controls:
- Sound toggle
- Pause Motion
- Fullscreen
- live/reconnecting status

Historical viewport testing:
- 1920×1080
- 1280×720
- 390×844
- no horizontal overflow in that historical tested implementation
- projector ticket/board overlap repair was verified then.

Evidence:
- `evidence/browser-results.json`
- `evidence/README.md`

Caution:
later frontend/poster changes require a new final browser pass.

---

# 13. Control Room / private host

## Personality

**OWNER-APPROVED CONCEPT + BUILT FUNCTIONAL VERSION + PREMIUM VISUAL IDEA PARTIAL**

Owner direction: private Control Room should feel like:
- underground fight promoter;
- DJ booth;
- casino pit boss;
- event control desk;
- urban fantasy command station.

Not a generic admin dashboard.

## Current built functions

Files:
- `examples/rival-reaper/host.html`
- `examples/rival-reaper/host.js`
- `examples/rival-reaper/styles.css`

Functions:
- host token login/unlock;
- connection status;
- private competitor selector;
- Lock Fate;
- current phase;
- draw number;
- physical reveal/pull control;
- same-command retry;
- logout/private state clearing;
- audit dialog/download;
- completed-team poster controls;
- mobile layout;
- event/session identity protections;
- command replay/idempotency.

Server endpoints:
- `GET /api/host/state`
- `POST /api/host/draw`
- `POST /api/host/reveal/advance`
- `GET /api/host/audit`

Evidence:
- historical browser host unlock/mobile/retry/yank/audit tests;
- newer Node/HTTP/VM tests cover auth generation, delayed response races, event identity and replay safety.

Current premium visual concept:
- owner-approved generated Control Room reference exists in chat/prompt pack;
- not yet fully integrated into live host HTML/CSS.

---

# 14. War Board

## Behavior

**OWNER-APPROVED + BUILT**

After terminal reveal:
- player appears under assigned team;
- team count updates;
- board shows every active team dynamically;
- should feel like competing territories/worlds rather than isolated spreadsheet boxes.

Files:
- `examples/rival-reaper/shared.js`
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/arena.html`

Built:
- dynamic team count;
- five/six lineups;
- names appear only after terminal state;
- team title/count/world text;
- active team visual color.

Relevant:
- `renderTeams()`
- `.war-board`
- `.board-teams`
- `.board-team`
- `.roster-names`.

Missing / desired:
- more aggressive territory bleeding between teams;
- team-specific material treatment for names:
  - Blood Bloom sprayed/thorned/petal;
  - Pressure etched/wet/hydraulic;
  - High Society smoke/gold;
  - Heat burned/molten;
  - Pink venom/chrome;
  - Purple crystal/belt impact;
- stronger scoreboard/leaderboard visual hierarchy;
- final completed-team poster handoff using approved poster templates.

Poster system:
- `examples/rival-reaper/roster-posters.js`
- `examples/rival-reaper/roster-posters.css`

Newer software includes reconstructed poster-export logic, but final visual acceptance requires actual approved art region confirmation and a successful final browser run.

---

# 15. Mouse / pointer effects

## Spotlight on machine glass

**BUILT + HISTORICALLY BROWSER-TESTED AS PART OF UI**

File:
- `examples/rival-reaper/arena.js`

Origin:
- technique adapted from MIT Motion Primitives Spotlight discovered via 21st.dev;
- no React/Motion runtime added;
- attribution: `THIRD-PARTY-NOTICES.md`.

Behavior:
- fine-pointer mouse movement changes a radial material light over machine glass;
- disabled for reduced motion/touch;
- no draw-state authority.

## Pointer yank

**BUILT + TESTED-HISTORICAL**

File:
- `examples/rival-reaper/host.js`

See Lever section.

---

# 16. Scroll effects

## Discussed/researched

**PROMPT-ONLY / OPTIONAL INTRO — NOT PART OF AUTHORITATIVE LIVE DRAW**

MotionSites / 21st research covered:
- scroll-locked video;
- Hero Scrub;
- pinned image/video sequences;
- Scroll Choreography;
- Hero Scroll Video Pin Reveal.

Files:
- `research/RIVAL-REAPER-MOTIONSITES-2026-09-29.md`
- `research/RIVAL-REAPER-21ST-CODEX-2026-09-29.md`
- `research/CINEMATIC-PROMPTBOOK-2026-09-30.md`

Locked architectural decision:
**do not make live raffle progress scroll-driven.**

Scroll can be used for:
- an intro page;
- marketing/exploration;
- optional pre-show cinematic;
- nonessential camera scrub.

The actual reveal stays event/host-controlled.

---

# 17. 3D / GLB / Three.js

## Discussed direction

**PROMPT-ONLY / FUTURE PREMIUM UPGRADE**

MotionSites research specifically suggested:
- machine GLB;
- named animatable machine parts;
- Three.js;
- 1K–2K textures;
- tone mapping;
- optional short clips/animations:
  - awaken
  - color tension
  - badge settle
  - ticket eject
  - celebration.

Promptbook:
- `research/CINEMATIC-PROMPTBOOK-2026-09-30.md`

Recommended part separation if modeled:
- cabinet
- lever pivot
- ticket-slot shutter
- rollers/carrier
- ticket
- badge mount
- glass chamber
- six energy elements
- speakers/gauges/lights.

## Current truth

**NOT BUILT.**

No production GLB is in current repo.  
No Three.js runtime currently owns the machine.

Tonight strategy previously approved in planning:
- use cinematic still/video shells + existing DOM mechanics;
- do not block event delivery on a from-scratch GLB;
- architecture can support GLB later.

---

# 18. Higgsfield cinematic media plan

## Status

**PROMPTS/WORKER PREPARED ON SEPARATE MEDIA BRANCH; NO PAID GENERATION EXECUTED IN THIS CONVERSATION**

Branch prepared earlier:
`media/higgsfield-cinematic-build-2026-09-30`

That branch contains:
- `config/higgsfield-scenes-v2.json`
- `config/higgsfield.env.example`
- `scripts/higgsfield-build.ts`
- `docs/HIGGSFIELD-CINEMATIC-BUILD.md`
- `research/higgsfield-prompt-pack/SCENE-BREAKDOWN.md`
- `research/higgsfield-prompt-pack/APPROVED-REFERENCES.md`

Ten-scene tonight plan:
1. Field Day idle loop
2. Machine Awakens
3. Ticket Bay Closeup
4. Six Colors Fight
5. Blood Bloom Celebration
6. Pressure Gang Celebration
7. High Society Celebration
8. Heat Mob Celebration
9. Pink Venom Celebration
10. BELT 2 ASS Celebration

What remains native instead of Higgsfield:
- fate selection
- exact badge overlay
- ticket text
- three-yank mechanics
- ink masks
- exact player name
- War Board
- audit/recovery
- reduced-motion
- private Control Room logic.

Generated video is decorative/reusable and cannot alter fate.

No password/key belongs in public Git.

---

# 19. Creature / magic priorities

**OWNER-APPROVED PRIORITY**

Urban fantasy magic should be **major**, not a tiny accent.

Required visual vocabulary across Arena:
- creatures;
- fire;
- smoke;
- water pressure;
- venom;
- thorns/roses;
- crystals;
- gold/chrome;
- lighting thrown onto machine/crowd;
- magical energy collisions;
- physical mechanical response.

Creature identities:
- Blood Bloom → Rose Panther
- Pressure Gang → Water/Pressure King
- High Society → Smoke King
- Heat Mob → Fire Lion
- Pink Venom → Venom Kingdom / serpent energy
- BELT 2 ASS → Purple Ram Titan / crystal-belt force
- Blackout Krew → Gorilla + dog support identity, not a competitive draw world.

---

# 20. Motion/accessibility

## Built

Files:
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/styles.css`

Features:
- explicit Pause Motion;
- `prefers-reduced-motion`;
- pointer spotlight disables under reduced motion;
- state remains readable without animation;
- fullscreen;
- sound opt-in.

Historical evidence:
- reduced-motion animation disabled in browser test;
- axe A/AA scans returned zero violations in the historical tested frontend.

Caution:
not a complete accessibility certification and not proof for every later visual change.

---

# 21. What is finished vs not finished

## Finished / strong functional core

- server-authoritative reveal phases;
- fate locking;
- team/name privacy timing;
- replay-safe host commands;
- encrypted persistence/recovery;
- host/arena separation;
- SSE synchronization;
- ticket and three-pull interaction;
- progressive ink masks;
- name reveal;
- terminal roster update;
- six-team backend support;
- Blackout exclusion;
- audit export;
- basic team-specific burst effects;
- basic synthesized per-team sound;
- pointer spotlight;
- pause/reduced-motion controls;
- basic War Board;
- mobile host functionality.

## Built but needs current final visual/browser acceptance

- current latest Arena frontend after later changes;
- six-team cinematic treatment;
- completed-team poster export with final approved regions;
- current host/arena visual state after newest asset additions.

## Still missing / incomplete

1. **Pressure Gang final standalone reveal badge**
2. **High Society final standalone reveal badge**
3. final neutral Rival Reaper logo/machine asset integrated into Arena
4. approved cinematic machine/Field Day/reference images copied from prompt pack into the other session's local workspace as needed
5. Higgsfield generated clips themselves — prompts are prepared, generation not proven here
6. full magical six-way “colors fighting” visual
7. polished mechanical machine awakening
8. real gears/rollers/ticket feed animation
9. premium synchronized public lever motion
10. cinematic rack-focus name reveal
11. full team-creature celebrations
12. professional layered sound effects
13. physical speaker/projector/phone rehearsal
14. full final browser test against the final visual integration
15. optional GLB/Three.js machine
16. optional scroll-based intro/pre-show only.

---

# 22. Do-not-break rules for the next Codex session

1. Do not replace or re-randomize the draw engine for visual work.
2. Do not let video, CSS, WebGL, 21st.dev, MotionSites or Higgsfield select fate.
3. Do not expose unrevealed player identity.
4. Do not put private roster or credentials in public assets/logs.
5. Do not convert roster posters into reveal badges.
6. Do not invent Pressure Gang/High Society final standalone badges and call them approved.
7. BELT 2 ASS is team six; do not make Purple the machine's neutral identity.
8. Blackout Krew is support, not a competitive team.
9. Keep reduced-motion/readable fallback.
10. Preserve replay/recovery/idempotency.
11. Run local tests first; do not waste GitHub Actions per edit.
12. Any new visual acceptance claim needs actual browser/device evidence.

---

# 23. Exact evidence pointers

Historical browser proof:
- `evidence/browser-results.json`
- `evidence/README.md`

Historical 34-test proof:
- `evidence/final-tests.log`

Newer software proof:
- `evidence/FINAL-COMPLETION-2026-09-30.md`
- `evidence/FINAL-COMPLETION-RECEIPT.md`

Architecture:
- `docs/ARCHITECTURE.md`

Event recovery:
- `docs/EVENT-RUNBOOK.md`

Conversation/product canon:
- `docs/CONVERSATION-CANON.md`

Visual/cinematic research:
- `research/CINEMATIC-PROMPTBOOK-2026-09-30.md`
- `research/RIVAL-REAPER-MOTIONSITES-2026-09-29.md`
- `research/RIVAL-REAPER-21ST-CODEX-2026-09-29.md`
- `research/HIGGSFIELD-API-BUDGET-2026-09-30.md`

Core machine/runtime files:
- `src/rival-reaper/reveal.ts`
- `src/rival-reaper/server.ts`
- `src/rival-reaper/session.ts`
- `src/rival-reaper/lineup.ts`
- `examples/rival-reaper/arena.html`
- `examples/rival-reaper/arena.js`
- `examples/rival-reaper/host.html`
- `examples/rival-reaper/host.js`
- `examples/rival-reaper/styles.css`
- `examples/rival-reaper/shared.js`
- `examples/rival-reaper/badge-art.js`
- `examples/rival-reaper/roster-posters.js`

---

# 24. Immediate recommended next order

1. recover/supply corrected Pressure Gang + High Society standalone badges;
2. integrate approved neutral Rival Reaper logo/machine reference;
3. complete six-way magical color fight;
4. integrate machine awakening/ticket mechanical cinematic shell;
5. preserve native three-pull ink/name sequence;
6. add six team-specific celebrations;
7. improve layered sound;
8. finish War Board territory treatment;
9. run current browser acceptance;
10. run physical phone/projector/speaker rehearsal;
11. only then consider the GLB upgrade.

This order preserves the working machine while pushing the visual experience into the horribly-unorthodox urban-fantasy direction the owner approved.
