# RiVAL REAPER

Standalone Rival Day team-draw machine. One six-team event, one durable fate, separate private host and read-only arena. Migrated from the existing Creation OS prototype; see [migration provenance](docs/MIGRATION.md).

## Launch the event

Requires Node 22.19+ and npm. Run `npm ci`, configure the actual private input below, then `npm start`. There is no built-in fake event roster. The old `npm run demo` command now uses this same launcher and also requires configured input.

Open http://127.0.0.1:8787/arena and http://127.0.0.1:8787/host. `/` chooses a view. Only the host can operate the event. Automated tests use isolated fictional fixtures; they do not populate the actual app.

## Real local roster

Use `examples/rival-reaper/roster.sample.json` for the schema, but save real input OUTSIDE this public repository. Configure the launcher environment securely:

- `RIVAL_REAPER_ROSTER`: absolute private JSON file path.
- `RIVAL_REAPER_HOST_TOKEN`: private random token, 24+ characters; prefer 32 random bytes.
- `RIVAL_REAPER_SECRET`: separate random encryption key, 32+ characters; retain securely for recovery.
- `RIVAL_REAPER_DATA`: private encrypted session path, default `.rival-reaper/session-six-v1.enc.json`.
- `PORT`: default 8787.
- `RIVAL_REAPER_BIND`: default `127.0.0.1` (same computer only).

Run `npm start`. The launcher reports its actual port. Only one local writer may use a session. A dead process lock is reclaimed only when its PID is absent; corrupt/ambiguous locks fail closed for inspection. Snapshot failure freezes commands until restart/recovery.

Phone/projector access across devices is NOT verified. Explicitly binding `0.0.0.0` exposes the arena to the LAN. Provision trusted TLS/network boundaries before real multi-device operation; bearer auth over plain HTTP is not public-hosting security. No firewall rule, public tunnel, deployment or paid service was created.

## Show and privacy

Fate locks and persists before awakening. Host advances colors, badge, ticket, three yanks, name, team effect, roster. Third yank persists ink-3 then name as separate replay-safe beats. A reload between them exposes a resume-name control. No next draw before roster-updated. Reconnecting SSE restores the current presentation.

The arena never receives household metadata, unrevealed IDs/names, receipt payloads or host credentials. Names become intentionally public at name-revealed. Board rosters change at roster-updated. Private audit download includes roster/household information and belongs outside Git.

## Verification

Run `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm test`, and `npm run test:browser`.
The browser script uses installed Chrome, creates a separate temporary fake session, and cleans that session afterward. Screenshots are in ignored `evidence/screenshots/`. See [evidence](evidence/README.md), [ten gates](BuildList.md), and [defects](AUDIT-LEDGER.md). No hosted workflow is required for these local checks.

## Fairness and evidence boundary

Hard capacity plus per-gender floor/ceiling quotas; bounded exact search minimizes additional household collisions across the remaining complete draw. Randomness breaks equally valid placements after least-filled preference. Memoization, symmetry pruning and most-constrained-first ordering reduce search. If 500,000 visits are exhausted, no draw occurs; rules are never silently relaxed. Unusual/large rosters require rehearsal. The 250-entry input limit is not a claim that all such configurations are practical.

CSPRNG sessions produce canonical SHA-256 receipt chains. These detect alteration relative to a trusted retained hash; they are NOT digital signatures and cannot defeat an attacker rewriting the entire chain and every anchor. AES-256-GCM protects snapshots. Retain private audit and bundle hash independently. No power-loss durability, distributed locking, independent fairness certification or production security audit is claimed.

## Visual direction

Owner correction: visible daylight/late-afternoon urban block party, surreal/unorthodox energy, people more prominent than pavement. Rejected night art is not shipped. Generated atmosphere sits behind editable machine, badges, ticket and name. Six approved completed-team poster templates are bundled separately from reveal badges. Four correctly named competitive badges are integrated; the blue and green corrections remain pending approval. Pending art is a visible acceptance blocker, not finished placeholder artwork. See [assets](docs/ASSETS.md), [research](research/VISUAL-PRODUCTION-2026-09-30.md), and [attribution](THIRD-PARTY-NOTICES.md).

## Final event preparation

Follow [the event and recovery runbook](docs/EVENT-RUNBOOK.md). `npm run rehearse -- /absolute/private/roster.json` runs twelve throwaway complete draws without modifying an event or outputting participant names. A changed input roster now stops startup when it disagrees with a saved session, rather than silently drawing from stale input.

For an already installed Chromium instead of Chrome, set `REAPER_BROWSER_EXECUTABLE` to its executable before `npm run test:browser`. Browser/physical acceptance must run against the final code; historical screenshots are not proof of newer changes.

## One six-team event

BELT 2 ASS (purple) is the sixth competing team. `npm start` uses the six-team lineup and actual configured input. Old test saves are not loaded by default; no saved file is erased automatically. See [lineup and recovery rules](docs/LINEUPS.md).

The approved original roster templates are bundled and mapped automatically; no coordinate entry is required for them. Completed-team PNGs preserve names and surrounding art. Corrected blue/green standalone reveal badges are still awaiting owner approval; obsolete Blue Pressure/Loud Pack lettering is not installed under the current names.

Current integration evidence and remaining acceptance are in [the six-team wave record](evidence/SIX-TEAM-2026-09-30.md). Do not substitute historical browser checks for the final interactive run.
