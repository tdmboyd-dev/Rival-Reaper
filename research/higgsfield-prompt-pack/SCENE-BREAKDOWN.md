# RiVAL REAPER — Higgsfield prompt pack v2

## Tonight's production decision

Use a **hybrid** instead of asking generative video to run the raffle.

**Higgsfield generates only reusable cinematic shells.**  
**The existing app keeps the lever/yank physics, exact ticket, hidden ink, player name, official badge overlay, roster update, sound controls, accessibility and all authoritative state.**

This avoids paying for clips that must change for every player and prevents a video model from ever revealing or changing a fate.

## Ten required Higgsfield clips

1. Idle Field Day ambience — 5s — cheap 720p Kling 2.5 Standard.
2. Machine Awakens — 5s — cheap 720p Kling 2.5 Standard.
3. Ticket Bay Closeup — 5s — cheap 720p Kling 2.5 Standard.
4. Six Colors Fight — 5s — Kling O3 Image Reference because it needs multiple references.
5. Blood Bloom explosion — 5s — O3.
6. Pressure Gang explosion — 5s — O3.
7. High Society explosion — 5s — O3.
8. Heat Mob explosion — 5s — O3.
9. Pink Venom explosion — 5s — O3.
10. BELT 2 ASS explosion — 5s — O3.

Total generated duration per complete first pass: **50 seconds**.

At the currently displayed API rates:
- 3 × 5s Kling 2.5 Standard at $0.0231/sec = **$0.3465**
- 7 × 5s Kling O3 Image Reference at $0.0462/sec = **$1.6170**
- **First complete pass ≈ $1.9635**
- **Two complete takes of every clip ≈ $3.9270**
- Higgsfield API minimum funding is $5; funding is not the same as usage.

Before paid calls, run the authenticated estimate for every scene. The account-returned USD estimate wins over this planning arithmetic.

## What does NOT go into Higgsfield

These stay native/code-driven because they must react exactly to the server:

- actual fate selection
- official player/team mapping
- exact team badge placement
- ticket text and serial
- the physical three-yank control
- ink-1 / ink-2 / ink-3 masking
- exact player name reveal
- war-board roster update
- audit/recovery/error states
- reduced-motion fallback
- private Control Room state

## GLB decision

A true GLB/Three.js machine is still the highest-end long-term option, but **do not block tonight on modeling one from scratch**. Tonight use the approved cinematic machine still + Higgsfield shells + existing DOM mechanics. After the event build, the same neutral machine design can be modeled as GLB and swapped behind the same phase adapter.

## Approved image references for the prompt pack

The owner approved the newly generated neutral machine/festival/control-room references plus the official Rival Reaper logo supplied in chat. The current connector cannot safely write those binary PNG bytes into GitHub source; use the downloadable prompt-pack folder from this chat or upload them to the exact repo prompt-assets path from the desktop/Codex workspace. Hashes are recorded in `docs/GENERATED-PRODUCTION-REFERENCES.md`.

Purple/BELT 2 ASS is an active sixth competitive team. It is **not** the machine identity.

## API key

Higgsfield's current official docs expect a server-side `KEY_ID:KEY_SECRET` credential. Put the complete value locally in:

`private/higgsfield.env`

as:

`HF_CREDENTIALS=KEY_ID:KEY_SECRET`

Never paste it into chat and never commit the filled file.
