# Rival-Reaper — AI ecosystem handoff

Baseline: `6764f52e701ec0dbe87ac0bbdb43f81ac8c4eb09`. Existing default: `main`. Repository: https://github.com/tdmboyd-dev/Rival-Reaper.

Read existing AGENTS/work order/current handoff first. This file is integration context, not an additional work order or grant.

## Architecture and source anchors

Role: event-specialist. Venue/physical-device acceptance is separate from local/browser emulation.

Source anchors: `src/rival-reaper`, `test/rival-reaper-persistence.test.ts`, `test/rival-reaper-server.test.ts`. Paths are source locators, not an assertion that all internals were read. See the central path/hash ledger for inventory; human-read scope is narrower.

Inputs: Authorized event/session, roster, draw/reveal controls and venue presentation state.

Outputs: Authoritative draw, persisted reveal/session, synchronized arena and event receipts.

Declared root package scripts (source declarations; not all were executed):

```json
{
  "typecheck": "tsc --noEmit",
  "test": "node --test --import tsx test/*.test.ts",
  "test:unit": "node --test --import tsx test/rival-reaper.test.ts test/rival-reaper-session.test.ts test/rival-reaper-roster.test.ts test/rival-reaper-reveal.test.ts test/rival-reaper-receipts.test.ts test/rival-reaper-persistence.test.ts test/rival-reaper-lock.test.ts test/rival-reaper-connection.test.ts test/rival-reaper-host.test.ts test/rival-reaper-posters.test.ts test/rival-reaper-lineup.test.ts test/rival-reaper-badge-view.test.ts test/rival-reaper-assets.test.ts",
  "test:integration": "node --test --import tsx test/rival-reaper-server.test.ts test/rival-reaper-lineup-server.test.ts",
  "test:browser": "node --import tsx scripts/browser-rehearsal.ts",
  "start": "node --import tsx src/rival-reaper/cli.ts",
  "rival-reaper": "node --import tsx src/rival-reaper/cli.ts",
  "demo": "node --import tsx src/rival-reaper/cli.ts",
  "rehearse": "node --import tsx scripts/rehearse-roster.ts"
}
```

## Current repair and proof

Identified as existing specialist product, not merged into core; previous source/test evidence retained, no fresh event/device run in this cycle.

No fresh application test execution is claimed for this repository in this cycle.

## Next implementation contract

Work item `ECO-016`: Expose event status/read-only receipts first; keep operator-scoped draw/reveal authority and prove durable atomic publication.

Before dispatch bind principal, tenant/workspace/resource, canonical domain action, input/artifact revision digest, idempotency/correlation, account/recipient/cost ceiling and grant expiration where applicable. Resolve risk using server-owned action policy, not caller labels. Exact fields must adapt to existing ONE/domain contracts, not duplicate them.

Negative acceptance: wrong actor/tenant/scope, modified payload/target, expired/replayed approval, duplicate request, lost response, cancellation and restart. Domain owner retains authoritative receipt; unknown outcomes are reconciled before retry. Rights and consent follow the actual artifact/model/use.

Rollback: Preserve original source/data; revert only owned source change; reconcile external effects before retry or compensation.

## Integration truth

The new source catalog lists this repository as catalogued, with runtimeVerified=false and no executable tools. Local read-only discovery through ONE/API-MCP has separate integration proof. No discovery response authorizes execution or proves this domain is deployed. No callable MCP endpoint is asserted here; add an admitted adapter only after domain acceptance.

Highest-value measured upgrade: Event operations specialist consuming one shared authorization/evidence contract while preserving deterministic event authority.
