# Rival Reaper visual build research — MotionSites
Date: 2026-09-29
Disposition: ADAPT

## Primary-source findings
MotionSites Academy documents a workflow of choosing a visual direction, preparing a short MP4 or image sequence, copying the full design prompt, replacing/customizing assets and instructing an AI coding tool to preserve detailed layout/animation behavior. It explicitly recommends keeping text/UI editable rather than baking text into the video. For scroll-controlled cinematic backgrounds, MP4 is easier while image sequences provide tighter frame control.

MotionSites' 3D tutorial recommends creating multi-view image references, converting them to a GLB with 1K–2K textures, then giving the GLB plus a reference video to the coding agent and implementing interaction with Three.js. It also calls out tone mapping for dark/muddy GLB renders.

MotionSites exposes an MCP for Claude/Cursor/Codex that can retrieve its prompt library. This can reduce manual prompt transcription but is not required for Rival Reaper.

Sources:
- https://motionsites.ai/academy
- https://motionsites.ai/lesson/build-scroll-animated-website-with-ai
- https://motionsites.ai/lesson/build-3d-scroll-animated-website-with-ai
- https://motionsites.ai/mcp

## What this means for Rival Reaper
The owner's description of the common workflow is materially correct: select a MotionSites reference/prompt, copy the detailed prompt, then replace the reference media/assets and refine focused instructions. We should ADAPT that workflow, not make the raffle depend on a pre-rendered scroll video.

### Keep realtime
These interactions must be code-driven because the host controls their timing:
- lever/yank
- reel cycling
- team selection state
- ticket ejection
- repeated ticket yanks
- hidden-ink reveal
- lock/next controls
- roster counters
- audit receipts

### Use cinematic media as a shell
Good candidates for MP4/image-sequence/3D reference treatment:
- crowd/stadium establishing shot
- machine awakening / camera push-in
- ambient smoke, sparks, team-color energy
- idle loops around the machine
- transition into final War Board

### Production prompt pattern
When a final reference is chosen, preserve its prompt structure but replace all brand/media references with approved Rival Day assets. Specify:
1. React/TypeScript/Three.js stack.
2. exact two-view architecture: private host and public arena.
3. realtime state machine and controls.
4. exact camera beats and responsive crops.
5. no text baked into video.
6. team badge assets remain editable layers.
7. reduced-motion fallback.
8. phone/tablet host controls and 16:9 projector display.
9. deterministic draw engine is authoritative; visuals never choose outcomes.
10. crash recovery resumes locked receipts without reroll.

## Acceptance
A reference/prompt is useful only if the resulting implementation preserves readable controls, mobile host usability, projector legibility, responsive crop safety and deterministic draw truth. Visual similarity alone is insufficient.
