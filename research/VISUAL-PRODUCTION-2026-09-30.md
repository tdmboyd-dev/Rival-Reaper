# Visual production research — 2026-09-30

Status: RESEARCHED; selected source adaptation IMPLEMENTED and covered by browser checks. Hosted 21st MCP is not connected and API_KEY_21ST is absent from this process. No paid code retrieval/generation was attempted. Public catalog search plus the author's publicly licensed upstream source supplied one useful component.

## 21st current entry path and candidate review

Official setup inspected: https://github.com/21st-dev/codex-plugin (README and endpoint/auth instructions). Endpoint https://21st.dev/api/mcp requires API_KEY_21ST; search metadata is free, code retrieval and generation are metered. Do not invoke account writes or paid operations as an installation workaround. The older Magic endpoint is not the chosen path.

Searches executed against 21st.dev, before replacing the original presentation: aurora/shader backgrounds; spring/physical buttons; ticket/card; text reveal/spotlight; animated counters; drawers; projector hero; reduced-motion alternatives. Search pages and component metadata are discovery evidence, not proof of full source review. The shortlist:

| Need | Candidates | Decision / evidence |
|---|---|---|
| Energy | Aurora Flow Shader (Dhileep Kumar GM), Aurora Background (Manu Arora), Valley of the Mind (Dave Katague) | STUDY. three/WebGL on Aurora Flow; extra GPU/runtime cost. Preserve native gradient energy and pause/reduced-motion. Full source not acquired for these. |
| Pull | Expandable Button (Molecule UI), Joly Button, Material Design 3 Button (EaseMize) | STUDY. First two require Motion; expanding labels are not a yank. M3 example exposes active compression/spring-back. Extend existing Reaper pull control with pointer capture, fixed hit area and keyboard alternative. |
| Ticket | Ticket Confirmation Card (Ravi Katiyar), Admit One Ticket, Admit One 3D Holographic Ticket (Shaswat Raj) | STUDY only. Catalog discovered, source/license not acquired. Keep and repair original Reaper paper ticket and progressive mask. |
| Ink/text | Text Reveal Card (Manu Arora), Text Scramble (Julien Thibeaut), Ink Reveal (AAYUSH duhan) | STUDY. Hover/scramble cannot expose a secret name early. Name stays absent from network/DOM until the server's reveal phase. |
| Spotlight | Spotlight (Julien Thibeaut / Motion Primitives) | ADAPT after full source + MIT license read at upstream commit 120f64f6ca60348e251f929e9c81f11ccbe45eda. Native parent-relative light in arena.js, no external runtime. Fine-pointer, reduced-motion and pause guards; decorative only. |
| Counter | Animated Counter (Preet Suthar), Animated Counter (Build UI), Count Up (Unlumen) | STUDY. Need final server count always in DOM. Animate emphasis, never fabricate intermediary raffle counts. |
| Audit drawer | Dialog (Origin UI), Warp Dialog (Molecule UI), native dialog described by 21st | ADAPT semantic guidance: native showModal/Escape/focus return. Warp animation is unnecessary for sensitive audit. |
| Hero/motion | Aurora Background, Background Paths, Shader Background | STUDY. Projector-safe depth and CSS camera beats; no source adoption without license review. |

Primary sources visited:
- https://21st.dev/community/components/explore/aurora-shader
- https://21st.dev/@dhileepkumargm/components/aurora-flow-shader
- https://21st.dev/@davekatague/components/valley-of-the-mind
- https://21st.dev/@molecule-lab-rushil/components/expandable-button
- https://21st.dev/@johuniq/components/joly-button
- https://21st.dev/@easemize/components/material-design-3-button
- https://21st.dev/community/components/s/ticket
- https://21st.dev/community/components/explore/text-animation-react
- https://21st.dev/preetsuthar17/animated-counter
- https://21st.dev/community/builduilabs
- https://21st.dev/community/components/motion-primitives/spotlight
- https://docs.21st.dev/blog/react-animated-background-components
- https://docs.21st.dev/blog/react-progress-stats-components
- https://news.21st.dev/blog/react-modal-dialog-components
- https://news.21st.dev/blog/react-magnetic-cursor-effects
- https://github.com/ibelick/motion-primitives (source components/core/spotlight.tsx, LICENCE.md, package.json read in full)

Accessibility/dependency review: upstream Spotlight uses React + Motion springs and changes parent positioning/overflow. The adaptation retains only the pointer-coordinate/light-layer technique, uses existing clipping container, adds motion/touch guards, and adds no dependency. MIT attribution is in THIRD-PARTY-NOTICES.md. Other candidates are not claimed installed or source-audited.

## MotionSites

Both primary tutorials and the scroll tutorial's full embedded NovaAI prompt were read:
- https://motionsites.ai/lesson/build-scroll-animated-website-with-ai
- https://motionsites.ai/lesson/build-3d-scroll-animated-website-with-ai

ADAPT its separation of ambient media, editable typography, camera timing, responsive crops and focused refinements. STUDY MP4 seeking vs image sequences and multi-view GLB production. No NovaAI video, portrait, branding or private asset URL was copied. No GLB or video pipeline is claimed implemented. The stage is CSS perspective plus a generated daylight environment image; authoritative server phases replace scroll progress.

### Adapted Reaper production direction (original, not a copied proprietary prompt)

A visible late-afternoon urban block party behind a physical green-black metal cabinet. Editable condensed headlines on the left; machine on the right. Establish wide on idle. Move the cabinet toward the audience on awakening. Five irregular color ribbons fight behind glass. Badge slams into focus. Paper drops through a slot. Three host-controlled downward yanks shear off black ink; then the server releases the name. Team particles use petals, pressure rings, smoke, fire slivers or venom streaks. Return focus to the roster board only after terminal reveal. No frame, scroll event, asset or shader can select a team. Motion pause and OS reduced-motion keep all information and controls usable. Refine crop/spacing at 1920x1080, 1280x720 and mobile rather than rebuilding the entire design.

## Asset truth

Approved team badge files were absent in the source and target. Initials are labeled BADGE ART PLACEHOLDER. No new official badges invented. Gorilla/dog appear as fictional environmental sculptures, not official marks. Generated block-party artwork is fictional atmosphere, not a real roster or photos of the owner's family. See docs/ASSETS.md for prompt and provenance.


## Newer owner correction — authoritative

The initial night/empty-court direction was explicitly rejected during the wave. Current direction: visible daylight/late afternoon at latest, crowded urban cookout, unorthodox surreal details, people more prominent than pavement. Ship block-party-daylight.png with localized text contrast, never a full-screen dark overlay. The final asset prompt and remaining owner/approved-badge gates are in docs/ASSETS.md.
