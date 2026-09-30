# Architecture and failure contract

Private roster -> validated competitors (Blackout removed) -> capacity/fairness engine -> CSPRNG session -> receipt chain -> encrypted snapshot containing reveal/revision/command journal -> read-only arena projection. No image, component, prompt, AI or browser randomness owns fate.

## Commands

Authenticated POST `/api/host/draw`: playerId, commandId, expectedRevision.
Authenticated POST `/api/host/reveal/advance`: commandId, expectedRevision.

Exact replay returns replayed=true, original appliedRevision and current projection. Reused ID with different input, stale revision and active second draw return 409 before mutation. Missing/malformed auth returns 401; bad input 400; oversize 413; cross-origin mutation 403. Durable-save failure returns 503 and freezes commands until restart.

Commands serialize against cloned session/reveal. Encrypted snapshot is written to exclusive temporary file, fsynced and renamed before publication/acknowledgment. No speculative fate goes to SSE. Advisory PID lock prevents normal independent local writers; this is not a distributed lock or power-loss guarantee.

## Recovery and boundaries

Every phase/revision/accepted command is saved. SSE initial connection supplies complete current public state. Restore requires phase identity to match the last receipt. Legacy snapshots lacking reveal restart presentation of the SAME last fate from machine-awakens. Wrong keys, unsupported or tampered snapshots stop startup, never reset.

Public GET `/api/state` and `/api/events`: capacities/completed rosters, counts and presentation. Team withheld until badge-selected; name until name-revealed. Authenticated `/api/host/state`: remaining IDs/display names and last hash. Authenticated `/api/host/audit`: private snapshot plus canonical hash.

Host token stays in memory, not storage/URLs. Pending controls disable; uncertain network results offer same-command retry. Native audit dialog handles focus/Escape. Pointer pull and keyboard share the endpoint. Pause/reduced-motion changes presentation only.

No deployment, real device/projector, family roster, approved badge art, external audit anchor or production verification is established. Local proof is distinct from these states.

Current host commands also send `expectedSessionId`: the server rejects a different session even if its revision matches. Legacy local v1 API callers may omit it for compatibility; callers should migrate to the session-bound form. The browser invalidates authentication and pending private work when it observes a different event.
