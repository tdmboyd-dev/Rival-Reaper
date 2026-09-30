# Rival-Reaper: design inspiration translated into an implementation plan

Research date: 30 September 2026. Scope: the existing local six-team family field-day draw, its host/public split, responsive reveal, and ticket delivery. No application changes, purchases, account creation, or plugin installation were made.

## Recommendation

Keep the existing native HTML/CSS/JavaScript app and authoritative TypeScript draw engine. Borrow a small set of visual ideas: a single hero machine, expressive brand type, clear command hierarchy, short mechanical ticket motion, and a clean saved-ticket outcome. Do not paste a complete landing-page prompt over the app or introduce React solely for a decorative component.

This recommendation is grounded in local checkout `76cffd9`, which predates the latest repair work reported by the coordinating task. It is not a claim about the final Windows build. Reviewed package.json, README.md, examples/rival-reaper/{arena.html,arena.js,host.html,host.js,styles.css}, and src/rival-reaper/receipts.ts. No actual private roster or credential file was read.

## MotionSites: useful direction, limited operational fit

### Urban Jungle

Observed the public detail preview in the cloud browser: a daylight subway interior overgrown with plants, emphatic large white typography, and small navigation pills. This is a strong reference for surreal urban energy and a single memorable environment. For Rival-Reaper, keep its spatial richness in the already approved daylight block-party atmosphere; keep the machine, team identity, player name, and controls as separate readable UI. Do not copy its type scale or tiny navigation into the control room.

Source: https://motionsites.ai/?prompt=urban-jungle-hero

### Playful Idea

Observed the public detail preview: one large soft character is the focal point, with generous breathing room and small supporting text. Borrow the focus discipline, not its pastel character style. Rival-Reaper already has strong machine and team art; secondary decoration should recede whenever the ticket/name appears.

Source: https://motionsites.ai/?prompt=playful-idea

### Actual public prompt inspected

The animated-site lesson includes React/TypeScript/Vite, Tailwind, Framer Motion, fixed navigation, a sticky video, glass layers, mobile menu states, and external media/font URLs. Useful: explicit stacking order and pointer-events:none on decorative overlays. Poor fit: scroll-dependent page storytelling, huge full-screen video, thin translucent controls, remote media as a live-event dependency. Translate only individual treatments and use local approved artwork/system fonts.

Source: https://motionsites.ai/lesson/build-animated-website-with-motionsites

### Access and media caveats

Some gallery entries expose Copy prompt; others require paid access. Urban Jungle was locked. The Playful Idea preview was visible, but the copy attempt did not provide a usable clipboard result, so no claim is made to have obtained its full prompt. Several gallery videos reported unable-to-play, so visual observations concern visible preview frames rather than verified motion timing.

Official pricing page currently lists USD 279/year or USD 399 one-time lifetime access, plus prompt packs starting at USD 49. Those are observations, not a recommendation to buy. The plan mentions personal/client work, but this does not establish unrestricted redistribution rights for every font, video, image, or prompt. No premium material is needed for the proposed changes.

Source: https://motionsites.ai/unlimited

## 21st.dev: shortlist and adaptation rules

### Text Roll, Motion Primitives / Julien Thibeaut

The live detail page and preview were inspected. Rotating individual characters could inspire a short final team-name or draw-count transition. The listing specifies MIT and the `motion` dependency. Prefer a native transform/opacity treatment with a fixed stable text box. Announce the final text once, not every animated letter. Avoid repeated rolling while the host is trying to read the screen.

Source: https://21st.dev/@ibelick/components/text-roll

### Text Scramble, Motion Primitives / Julien Thibeaut

The visible usage example supports a trigger, custom character set, speed, duration, and completion callback; the listing specifies MIT and Framer Motion. Optional for decorative sealed-ticket glyphs only. Do not send the unrevealed name to the public browser so it can scramble it. The animation must operate on harmless placeholder symbols until the server publishes the authorized reveal.

Source: https://21st.dev/@ibelick/components/text-scramble

### Text Reveal Card, Aceternity UI / Manu Arora

The public example reveals text on mouse movement and lists Framer Motion, tailwind-merge, and MIT. Its masking metaphor fits ink peeling from a ticket. Its input contract does not: hovering is unavailable on touch and cannot control a synchronized projector reveal. Implement three server-confirmed ink states in the existing ticket instead. Keep keyboard/tap equivalents and never attach an authoritative action to decorative pointer movement.

Source: https://21st.dev/@manuarora700/components/text-reveal-card

### Switch with description, coss

Useful as a control-label pattern: a clear label and explanatory text next to a toggle. The listing uses Base UI/React and MIT. Adapt the communication, not the dependency: preserve native buttons or checkboxes, visible sound/motion state, and accurate aria-pressed/checked semantics.

Source: https://21st.dev/@coss.com/components/switch/with-description

### Access, license, and version constraints

21st's full Component.tsx source was gated behind an unlock in the cloud browser; public descriptions, live preview, Usage.tsx, dependencies, and license labels were available. No gate was bypassed. The site is a multi-author source registry, not one versioned package. A future code import needs its original license/notice, source link, exact retrieved revision/hash and dependency review. A listing's MIT label does not license every demo image/video or platform preview.

The terms distinguish underlying component rights from marketplace previews and media, and restrict redistribution and circumvention. Link to references rather than copying marketplace screenshots into the product. Public pricing currently shows Builder USD 6/month billed yearly and Builder + AI USD 15/month billed yearly; author-sold templates can cost separately. No subscription is required to use these observations as inspiration.

Sources: https://21st.dev/terms and https://21st.dev/pricing

## Proposed native implementation, in priority order

### 1. Fit the operational content before adding effects

- Arena: a viewport-aware grid with header, minmax(0,1fr) show area, compact six-team summary, and footer. Keep all six team identities visible; reveal full rosters in a dedicated board view if they cannot fit readably.
- Host: allow ordinary scrolling for roster/export detail, but keep competitor selection, current state, next action, and recovery message together. Do not globally hide overflow as a fit fix.
- Scale only the machine artwork region, never the entire page or control text. Use the actual available width and height; a 16:9 desktop assumption is insufficient for Windows browser chrome and display scaling.
- In the checked source, the arena has a 610px minimum show area, a 540px machine, and extra header/board/footer height. Those are concrete dimensions for the repair task to reassess, not proof of the current Windows failure.

### 2. Make public versus host roles unmistakable

- Public header: "Audience display" plus connection, sound, motion, and fullscreen controls.
- Private host: one high-emphasis next-action button with the exact phase action; quieter Lock host, poster exports, and diagnostics.
- Show a plain reason beside disabled controls: select competitor, awaiting server, disconnected, or finish current reveal. Do not rely on color alone.
- A decorative lever must not look like the only working button. If a pull gesture remains, pair it with a real button and keyboard activation; retain existing retry/idempotency behavior.

### 3. Give the ticket a complete product contract

- Distinguish the in-scene ticket, an individual keepsake, a completed-team poster, and the private cryptographic audit. They serve different people and should not share vague "receipt" labels.
- Suggested keepsake fields: already revealed display name, approved team name/art, draw number, and event title. Exclude household data, host token, unrevealed names, and raw private audit payloads.
- Provide explicit local Save ticket / Print ticket outcomes if the approved scope includes them, with visible success/failure states. A rendered on-screen ticket is not evidence of a delivered file, printed paper, SMS, or email.
- Saving again must derive from the same persisted assignment; it must never rerun the draw. Printed CSS and image export should be deterministic and work without CDN assets.

### 4. Choreograph the existing phase machine

Proposed timing targets, subject to visual testing: button acknowledgement 100–150ms; cabinet awakening 250–400ms; badge arrival 250–350ms; ticket slide 350–500ms; each ink peel 150–250ms; final name held until host advances; restrained celebration 400–700ms. The server owns state transitions. Animation completion must never pick a team, commit a draw, or force advancement.

On reconnect, render the current durable phase directly rather than replaying the whole show. Cancel obsolete animation handles when a newer revision arrives. Use transforms/opacity for the main motion and pointer-events:none on decoration. Pausing motion or disabling it must leave the current text and all controls usable.

### 5. Accessibility and local-event reliability

Preserve the existing reduced-motion detection, pause control, audio opt-in, phase status, and host error messaging. Reduced mode should show each settled state without shaking, particles, blur travel, or character scrambling. Keep readable text contrast, visible keyboard focus, meaningful button labels, and stable layout while messages change. Preload local approved assets; do not turn a network video into a requirement for a successful draw.

Source for the platform motion preference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion

## How the installed creative tools fit

Product Design is useful for screenshot-led flow review and comparing the real arena/host views against a specific visual target. Use existing code and approved artwork as the target; the current task does not need a replacement prototype. Review idle, selected, locked, ink-1/2/3, final reveal, disconnected/recovered, and saved-ticket states.

Remotion is useful for an optional locally rendered event opener, intermission loop, or team celebration clip. Its Player can embed parameterized video in React, so it is not limited to exported MP4s, but this app would need a new React integration to use it. A local pre-rendered clip is simpler. Never bake private roster names into externally generated footage or use a video timeline as the authoritative draw state. Browser audio/autoplay restrictions still apply.

Sources: https://www.remotion.dev/docs/player and https://www.remotion.dev/docs/player/autoplay

The current Remotion license allows free use by individuals, nonprofits, and for-profit organizations up to three employees; larger eligible-use cases need a company license. The source also warns of a future Remotion 5 license change. Pin versions and recheck the license before a future integration rather than assuming the installed skill grants all commercial rights.

Source: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md

Game Development Studio is relevant to real mesh production, licensed asset admission, render debugging, and measured 3D performance. Build 3D Game Rooms is a heavier room/prop/Blender/runtime pipeline with explicit design and runtime approval gates and potentially paid Meshy work. A single real-3D ticket machine could be scoped later, but a room pipeline is excessive for fixing buttons, responsive CSS, or file delivery. Keep a readable DOM ticket and controls even if a 3D machine is eventually added. No execution/tooling availability or hardware performance is claimed from reading the skills.

If CSS/Web Animations eventually becomes awkward, Motion has an independent JavaScript animate API; React is not mandatory for Motion itself. Its documented mini API animates native HTML/SVG styles, while hybrid adds sequences and more value types. This is a possible bounded enhancement after profiling, not a dependency recommendation now.

Source: https://motion.dev/docs/animate

## Acceptance evidence before declaring the redesign complete

Test the actual repaired Windows app at its real browser viewport and OS scaling, plus compact desktop, portrait phone, landscape phone, and projector layouts. Verify every phase with fictional fixtures, long names, six teams, maximum expected roster sizes, reduced motion, keyboard-only use, audio off, rapid double activation, reload between ink-3/name, disconnect/reconnect, and local ticket save/print. Assert no essential control or revealed name is clipped, no horizontal overflow, all exports match the persisted assignment, and unrevealed data never appears in the public payload. Local checks and measured screenshots matter more than an attractive demo frame.
