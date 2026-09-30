# Higgsfield production runbook — RiVAL REAPER cinematic shell

Status: prepared, not executed. This branch contains prompts and a local API worker only. No paid request has been sent and no credential is stored in Git.

## Why Higgsfield is a shell, not the raffle brain

The authoritative server phases remain:
`idle → machine-awakens → colors-fight → badge-selected → ticket-ejects → ink-1 → ink-2 → ink-3 → name-revealed → team-explosion → roster-updated`.

Generated video never selects a team, never contains a participant name, and never advances state. The host/server still owns every transition. Higgsfield produces reusable non-personal ambient clips that the arena may play behind editable DOM/3D layers.

## Prepared media pack

Twelve 5-second 16:9 silent scenes are defined in `config/higgsfield-scenes.json`.

- 6 reusable global clips: crowd approach, idle loop, machine wake, six-color fight, ticket-bay closeup, reset.
- 6 team celebration shells: Blood Bloom, Pressure Gang, High Society, Heat Mob, Pink Venom, BELT 2 ASS.
- Ticket ejection, all three physical yanks, invisible-ink removal, exact badge placement, exact team/player text and roster update remain code/3D driven.

At Higgsfield's currently published Kling O3 Image Reference base rate of **$0.0462 per generated second**, one complete 60-second pack costs **$2.772** if each of the 12 first takes succeeds. Two complete takes cost **$5.544**. Three complete takes cost **$8.316**. The API minimum top-up is $5. These are generation-usage amounts before tax and before any account-specific discount; the authenticated estimate response is the final authority before each paid request.

## Local input images

Place approved local references in ignored folder `private/higgsfield-inputs/`:

- `reaper-machine.png` — generated cinematic machine concept, SHA-256 `5e9109828992fd03893fa50e23cc5d25165d200ab39e081f88f743a3e1882a09`.
- `field-day-master.png` — generated late-afternoon Field Day master environment, SHA-256 `b81201ca39ed344c69665cccde1cb3ab8e4c41dc2ffe0fca63fcc031ed2dcd09`.
- optional `control-room-reference.png` — generated host-console visual reference, SHA-256 `60937596d79e5ea0b18ee955ba8d71dc83a74e2b43187ed60d7f8dc3c9d96b21`.

These images contain no private roster data. The approved BELT 2 ASS badge already exists in repository assets; uploaded owner copy SHA-256 observed in this session: `3567cc47158b68d99c13786c1f105d136633ab18909916618f8be3a97db53bfb`.

Pressure Gang and High Society do not currently have proven historical standalone badge originals under their final names. Their approved roster-world templates may be used as *style reference only*. The cinematic clips deliberately do not bake reveal badges; live badge artwork remains a replaceable application layer.

## How to provide the API key safely

Do **not** send the key in ChatGPT.

1. Open Open Higgsfield → API Keys and copy the complete key once.
2. On your own computer create an ignored file such as `private/higgsfield.env`.
3. Put one line in it: `HF_API_KEY=<paste-complete-key-here>`.
4. Do not commit, screenshot, or paste the file into chat.

The official quick start says the copied API key is one complete credential and REST uses:
`Authorization: Key <complete-api-key>`.

## Estimate first

The worker supports an estimate-only mode. It uploads the approved non-personal reference images, asks Higgsfield for the scene estimates, prints the total, and does not submit paid generations.

Run locally after dependencies are installed:

`node --env-file=private/higgsfield.env --import tsx scripts/higgsfield-build.ts --estimate-only`

Review the returned USD total. If it differs materially from this plan, stop.

## Generate

Only after the estimate is acceptable:

`node --env-file=private/higgsfield.env --import tsx scripts/higgsfield-build.ts --generate`

Outputs download to `private/higgsfield-output/`, not public Git. Review each clip for stable geometry, readable safe zones, camera continuity, no invented text, no morphing machine, no distorted people, no early identity exposure. Promote only approved clips into public assets later.

## MotionSites lessons adapted

- separate cinematic media from editable UI/text;
- use a detailed asset/composition/behavior/fallback/acceptance prompt rather than one vague visual sentence;
- use MP4 for easy playback or image sequences when precise scrubbing is truly useful;
- use GLB + Three.js for the machine if real spatial interaction is desired;
- keep the live raffle event-driven. Scroll-scrubbing belongs to optional intro/exploration, never the authoritative draw.

## 21st.dev component strategy

Study/adapt, do not pile components together:
- Scroll Locked Video Hero / Hero Scroll Video Pin Reveal — optional intro only;
- Scroll Choreography — reference for camera/section timing;
- Spotlight — cheap pointer enhancement for desktop machine glass;
- Liquid/metal buttons — reference for the physical host controls, but touch/keyboard must remain obvious;
- shader/particle backgrounds — useful for contained team effects with reduced-motion fallback.

The current app is native HTML/CSS/JS, not React. Do not install a React/Tailwind component tree solely to imitate a visual. Port the useful interaction idea or source technique when licensing permits.

## Success criteria

- arena looks like Field Day first, website second;
- humans/cookout/music/game activity stay visible;
- machine feels physically heavy and consistent between clips;
- all six team energies exist when the backend lineup is six-v1;
- exact team badge and participant name remain live app layers;
- 1920×1080 and 1280×720 preserve the ticket/name safe area;
- reduced-motion can skip every decorative clip and still show the exact state;
- sound is opt-in and independent of raffle truth;
- reload/reconnect jumps to the final pose of the current phase rather than replaying suspense;
- no paid regeneration is used as a runtime dependency.
