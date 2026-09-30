> HISTORICAL SOURCE ONLY. Superseded by Rival-Reaper /CODEX-GATES-7-9.md. Old repository/branch write instructions below are not active.

# CODEX EXECUTION PROMPT — RiVAL REAPER gates 7–9

You are taking over an existing implementation. Do not restart it, replace its architecture casually, or put private family data in GitHub.

Repository: tdmboyd-dev/MGR-CREATE-Os
Branch: feature/rival-reaper-2026-09-29
Draft PR: #1

## Mandatory boot
1. Read AGENTS.md.
2. Read WORK-STATE.md, PROJECT-READ-FIRST.md, BuildList.md and AUDIT-LEDGER.md.
3. Read all files under src/rival-reaper/, test/rival-reaper*.test.ts, examples/rival-reaper/, and:
   - research/RIVAL-REAPER-MOTIONSITES-2026-09-29.md
   - research/RIVAL-REAPER-21ST-CODEX-2026-09-29.md
4. Inspect fresh branch HEAD and PR diff before edits. Preserve unrelated work.

## Owner-locked product rules
- Five competitive teams only:
  RED Blood Bloom / Rose Panther
  BLUE Pressure Gang / water-pressure world
  GREEN High Society / smoke world
  ORANGE Heat Mob / fire lion
  PINK Pink Venom / dual-gender venom kingdom
- Blackout Krew is support/ref/cook/setup/cleanup/sideline crew and NEVER enters the competitive raffle.
- Real roster is private/local. Never commit real names to this public repository.
- Draw fairness: capacity + gender balance + household separation preference; randomness only breaks valid ties.
- A fate is cryptographically locked before theatrical reveal. Reveal may NEVER reroll.
- Host screen is private; arena/projector screen is read-only.
- Target experience: urban fantasy/metaverse Game Day, physical slot/raffle machine, badge first, ticket ejection, repeated yank motion, invisible ink slowly revealing the name.
- No generic SaaS dashboard look.

## Gate 7 — execute and break it
Run install/typecheck/tests locally. Fix every real compile/test failure you introduce or discover in Rival Reaper scope.
Add integration tests for:
- unauthorized host calls
- duplicate player draw
- full-team/no-capacity behavior
- 45-player 9/9/9/9/9 rehearsal
- household collision fallback when unavoidable
- gender distribution
- receipt tampering
- wrong encryption secret/corrupt file
- restart from encrypted snapshot
- reveal cannot start without a locked receipt
- reveal cannot change the locked team/player
- malformed roster
- Blackout never enters state.players
Do not mark VERIFIED merely because tests exist. Record commands/results/evidence.

## Gate 8 — finish the synchronized reveal protocol
The current server has RevealController and SSE. Harden it into one authoritative presentation state:
IDLE -> MACHINE_AWAKENS -> COLORS_FIGHT -> BADGE_SELECTED -> TICKET_EJECTS -> INK_1 -> INK_2 -> INK_3 -> NAME_REVEALED -> TEAM_EXPLOSION -> ROSTER_UPDATED.
Requirements:
- lock fate once at draw start
- host can advance but not mutate outcome
- arena receives state live
- reconnect/reload restores the current reveal state
- restart restores locked draw + presentation state safely
- no second draw until current reveal reaches terminal state
- idempotent/replayed host commands cannot duplicate assignments
- export final audit receipt bundle
- use fake test roster only

## Gate 9 — visual production pass
Use 21st.dev MCP SEARCH FIRST for useful source-level components; inspect before installing/copying. Use MotionSites research for cinematic/camera/3D prompt structure. Do not let either own app state.
If 21st MCP is not connected, set it up using current official 21st instructions for Codex, or document the exact blocker rather than inventing components.
Search for candidate primitives for:
- shader/energy background
- physical lever/button
- ticket/card
- spotlight/text reveal
- animated counters
- audit drawer
- projector-safe animated hero
- reduced-motion alternatives
Choose/adapt only what materially improves the experience.

Build a responsive fantasy/metaverse machine:
- 16:9 arena/projector first
- phone/tablet host first-class
- five team energy systems fight/bleed into each other; never simple colored boxes
- badge-selected moment is huge
- ticket visibly ejects
- three yanks progressively remove invisible ink
- final name reveal is readable from across a room
- audio hooks with mute; no autoplay violation
- prefers-reduced-motion fallback
- keyboard/focus/contrast basics
- no text baked into videos
- team assets remain replaceable editable layers

Use fake badge placeholders if approved image files are not actually in the repo; do not invent or scrape replacements.

## MotionSites workflow
When using a reference, copy/adapt the detailed prompt structure, replace its video/image/GLB references with Rival Reaper assets, preserve explicit camera beats, and make focused changes rather than repeatedly redesigning the entire page. Realtime raffle interaction remains code-driven; cinematic media is a shell.

## Completion
Work in a substantial wave. Update BuildList/AUDIT/WORK-STATE with exact truth. Commit coherent changes to this feature branch only. Do not merge PR #1. Do not trigger expensive hosted CI unless necessary; prefer local execution first.
At handoff report:
- exact HEAD
- files changed
- commands/tests actually executed + results
- visual/browser checks actually performed
- screenshots/artifacts if available
- remaining defects/blockers
- completion score against the 10 Rival Reaper gates
- exact next action
