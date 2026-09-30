# Higgsfield production runbook — RiVAL REAPER (tonight plan)

Status: prepared, not executed from ChatGPT. No API credential is stored in Git and no paid generation has been submitted.

## The simple version

We need **10 short cinematic clips**, each **5 seconds**. Total media generated: **50 seconds**.

The actual raffle remains native code. Higgsfield does **not** choose a team, reveal a real player name, operate the three yanks, update the roster, or hold private data.

### Three cheap global clips — 720p
Use Kling 2.5 Turbo Standard Image-to-Video:
1. Field Day idle loop
2. machine awakens
3. ticket-bay closeup

Current displayed API rate: $0.0231/sec.

### Seven consistency-heavy clips
Use Kling O3 Image Reference because it can take multiple image references:
4. six colors fight
5. Blood Bloom celebration
6. Pressure Gang celebration
7. High Society celebration
8. Heat Mob celebration
9. Pink Venom celebration
10. BELT 2 ASS celebration

Current displayed API rate: $0.0462/sec.

Planning arithmetic:
- 15 Standard seconds = $0.3465
- 35 O3 seconds = $1.6170
- **one full 10-clip pass ≈ $1.9635**
- **two full takes of all 10 ≈ $3.9270**
- API minimum funding is $5; unused balance remains balance, not generation usage.

Always run the authenticated estimate before paid generation because account-specific pricing/discounts may differ.

## Why not make every interaction a video?

The existing server already controls:
`idle → machine-awakens → colors-fight → badge-selected → ticket-ejects → ink-1 → ink-2 → ink-3 → name-revealed → team-explosion → roster-updated`.

Keep exact badge overlays, ticket text, physical pull interaction, all ink masks, real participant name and roster in code. That makes the app immediate, replay-safe and cheap. Decorative clips can fail and the draw still works.

## Why not stop tonight for a GLB?

A real GLB/Three.js machine remains the premium long-term upgrade. It is not the fastest safe route for tonight because it adds modeling, rigging, UV/material, animation and GPU acceptance work. This prompt pack deliberately leaves the architecture compatible with a later GLB swap.

## Local approved reference folder

Create this ignored folder:

`private/higgsfield-inputs/`

Copy the four approved images from the downloadable prompt pack into it with these exact names:
- `rival-reaper-owner-logo.png`
- `rival-reaper-machine-hero.png`
- `field-day-machine-wide.png`
- `rival-reaper-control-room-reference.png`

The script automatically uploads those references using Higgsfield's documented signed-upload flow. Repo-native team poster/badge files are uploaded directly from their existing paths.

## Put the API key here

Create:

`private/higgsfield.env`

with:

`HF_API_KEY=<paste the complete key copied from open.higgsfield.ai>`

Higgsfield's current Quick Start says to paste the complete copied API key as-is. Never paste it into chat or commit it.

## Step 1 — estimate only, no paid generations

`node --env-file=private/higgsfield.env --import tsx scripts/higgsfield-build.ts --estimate-only`

The script:
- securely requests signed reference uploads;
- uploads the non-private approved images;
- requests a USD estimate for each of the 10 scenes;
- writes `private/higgsfield-output/estimate-report.json`;
- submits **zero** paid generation jobs.

## Step 2 — set a hard spending cap

For the first run, use $2.50 if the estimate is close to the current plan.

On Windows PowerShell:
`$env:HIGGSFIELD_MAX_USD="2.50"`

Then:
`node --env-file=private/higgsfield.env --import tsx scripts/higgsfield-build.ts --generate`

The worker estimates the entire pack again first and refuses to send paid jobs if the total exceeds the cap.

## Review

Generated MP4s stay under ignored `private/higgsfield-output/`.

Reject/retry any clip with:
- changing/melting machine geometry;
- fake/misspelled logos or team names;
- player identities;
- ticket/name safe zone blocked;
- weird duplicate people;
- rapid camera spin;
- full-screen flashes;
- incorrect team visual identity.

Promote only selected clips into public application assets.

## Sources checked 2026-09-30

- Higgsfield Quick Start: complete-key auth, submit/poll/cancel and signed file uploads.
- Kling 2.5 Turbo Standard Image-to-Video: 720p, 5/10 seconds, current displayed $0.0231/sec.
- Kling O3 Image Reference: multiple image references, std/pro/4k modes, 3–15 seconds, current displayed from $0.0462/sec.
