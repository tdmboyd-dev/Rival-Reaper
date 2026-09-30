# Rival Reaper UI research — 21st.dev + Codex
Date: 2026-09-29
Disposition: ADAPT

## Primary-source findings

21st.dev is a source-copy registry rather than a monolithic runtime dependency. Its catalog contains React components, templates, shadcn themes, shaders, gradients and animated heroes from many authors. Components are previewable and copied into the product repository, which is useful for Rival Reaper because the final UI remains ours to edit and audit.

The old Magic MCP has been superseded by the unified 21st MCP. Current setup supports Codex directly:
`npx @21st-dev/cli@latest init --client codex`
or remote MCP at `https://21st.dev/api/mcp` using a 21st API key. The current MCP supports catalog search, code retrieval, themes/templates, bookmarks/team libraries and hosted UI generation when the account enables it.

21st's own guidance is important: use catalog components as presentational building blocks while retaining the application's own state/runtime. This matches Rival Reaper exactly: 21st may supply polished controls, shader backgrounds, animated cards, drawers, counters and effects, but it must never own draw truth, persistence or audit logic.

Sources:
- https://21st.dev/
- https://21st.dev/mcp
- https://github.com/21st-dev/magic-mcp
- https://github.com/21st-dev/codex-plugin
- https://docs.21st.dev/blog/mcp-ui-components
- https://docs.21st.dev/blog/ai-components-for-react

## Recommended use in Rival Reaper

### ADAPT from 21st
Search before inventing these UI primitives:
- cinematic animated hero/background shell
- shader/gradient energy fields for five team worlds
- physical-feeling buttons and lever controls
- ticket/card surfaces
- drawers/sheets for host audit receipts
- animated counters
- spotlight/reveal text effects
- responsive projector/phone layout primitives
- reduced-motion-aware animation primitives

### Do not delegate to 21st
- team assignment
- household/gender/capacity rules
- randomness
- locked receipts
- roster persistence
- authentication/authorization
- crash recovery
- Blackout Krew exclusion

## Codex workflow

1. Connect 21st MCP to Codex with the current 21st CLI/plugin.
2. Ask Codex to SEARCH first and return 3–5 candidate components per visual need; do not install blindly.
3. Preview/review dependencies, reduced-motion behavior, keyboard/focus states and responsive behavior.
4. Copy selected source into Rival Reaper's UI layer.
5. Adapt tokens and visuals to locked team worlds.
6. Keep draw state behind the canonical Rival Reaper engine/API.
7. Run UI regression, accessibility and projector/mobile acceptance checks.

## MotionSites + 21st split

MotionSites: cinematic reference language, camera beats, scroll/video/3D inspiration.
21st: reusable source-level UI primitives, shaders, interactions, responsive surfaces.
Codex: implementation agent that can consume both sources and wire them to MGR-owned contracts.
Rival-Reaper: standalone product authority, contracts, verification and evidence. Creation OS is the historical source. Current access/adaptation research is in VISUAL-PRODUCTION-2026-09-30.md.
Rival Reaper engine: deterministic/randomized draw authority.

This prevents the visual layer from becoming the source of truth.
