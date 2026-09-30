# Final recovery review — 2026-09-30

Read coverage: canonical BEAST v2.1, boot and continuity; local AGENTS, read-first, WORK-STATE, BuildList, audit, both execution contracts (historical one treated as superseded), architecture, asset provenance, all three existing visual research dossiers; all runtime source modules and host/arena/shared scripts. No new architecture or replacement of the authoritative draw engine.

## Findings and disposition

- REPAIR: restart previously restored any saved session while silently ignoring changed input roster/team configuration. This can leave removed or Blackout-reclassified competitors in the draw. Startup now compares normalized roster/team identity and stops without rewriting saved fate on mismatch. Row ordering alone does not prevent resume.
- REPAIR: pending private HTTP responses could refill audit data after host lock/logout. Authentication-generation checks and aborts prevent stale results from restoring private controls/data or auto-advancing name reveal after locking.
- REPAIR: the public stream was closed on pagehide but never reopened for a restored Back/Forward document. It now disconnects controls on hide and opens one fresh stream on show, ignoring callbacks from replaced streams.
- REPAIR: local scripts used tsx CLI IPC unnecessarily. Node's `--import tsx` loader avoids that extra process socket while preserving the TypeScript entry point. Existing Chrome runner default remains; an explicit executable option supports already installed Chromium.
- KEEP: cryptographic fate, serialized command journal, encrypted snapshots, bounded exact completion search and read-only public projection. Their scope is local, not a distributed lock, external signature, arbitrary-size solver proof or public-hosting security certification.
- IMPLEMENT: previously requested downloadable completed-team posters absent from remote main. Prior continuation artifacts were reported by history but not recoverable in this environment; new implementation is clearly a reconstruction, not recovered work. Official artwork is not invented.

## Primary lifecycle source

MDN Window pageshow event: https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event — describes restoration of a frozen mobile page and Back/Forward cache, including a document whose module does not rerun. MDN pagehide: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event — lifecycle counterpart. Accessed 2026-09-30. ADAPT browser lifecycle handling; no source code dependency copied. Free browser API, no provider calls, token charges or additional package required.

## Verification boundary

Node/HTTP/VM regressions execute actual project source; a VM's simulated DOM/EventSource/fetch/canvas is not a rendered browser or physical-device test. The current environment's managed browser rejected the local preview with ERR_BLOCKED_BY_CLIENT; system Chromium launch failed at a required Unix socket, including the reviewed escalation attempt. Neither is a passing browser check, and no alternate network route, tunnel or public deployment was created to evade the restriction. Earlier repository Chrome evidence applies to its earlier implementation commit only.

## Local poster primitives

Primary browser API references read 2026-09-30:
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob — PNG output is standardized; conversion may fail or return null, and cross-origin-tainted canvas can throw. ADAPT: explicit error path, local decoded image only, generation recheck after asynchronous conversion.
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText — text metrics support fitting actual full names to explicit layout bounds. ADAPT: measure all strings, wrap without truncation, stop when a safe fit is impossible. Font/rendered-pixel review still required.
- https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static — release object URLs after use. ADAPT: cleanup on art replacement/logout and after downloads.

These are browser-platform contracts, not copied component source or artwork. No added library, provider fee, network image service or image-generation bill. Tests simulate canvas calls and do not establish the pixels of the final approved templates.
