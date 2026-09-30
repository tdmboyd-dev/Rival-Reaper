# Rival Reaper cinematic direction and production prompts
30 September 2026

Recommended direction: The Barbershop Fate Press. A real, tactile ticket machine owns the foreground; the block party owns the atmosphere. Warm daylight, polished metal, barber-shop details, good-natured competitive energy, and a ticket you can actually read. The Corner Store Oracle is the strongest alternate. The Block Crown is the most ambitious real-3D option.

These are original creative proposals for MGR and Rival Day. They are not copied MotionSites prompts or unlocked 21st source. They have not been generated or implemented. Exact video duration, resolution, camera controls, reference-image support, and first/last-frame controls must be mapped to the chosen API model's documented capabilities before a paid call. Lens language is a visual direction, not a guarantee of a physically accurate camera simulation.

## 1. What The References Actually Teach

MotionSites' public scroll-animation lesson is unusually specific: it describes a full layered page, separate editable text, a poster/video/canvas progression, scroll-to-time mapping, a smoothed target, a frame-cache limit, and a seek fallback. It also spells out responsive and acceptance criteria. The useful lesson is prompt structure: visual identity, asset contract, composition, behavior, fallback, and proof. Its example is a marketing page. Our live show needs event-based beats and a stable ticket reading position instead. The example's 90 decoded 960x540 RGBA frames amount to roughly 178 MiB before other allocations; that is not a safe default phone budget.
Source: https://motionsites.ai/lesson/build-scroll-animated-website-with-ai

21st's Hero Scrub publicly describes a pinned canvas frame sequence with a thumbnail-to-fullscreen-to-thumbnail composition. Its usage example supplies frame count and a numbered WebP URL function, and lists GSAP. This is a good reference for an optional machine-introduction page; a 300-frame demo is not a requirement for Rival Day. Its public page did not establish a code license, so source reuse needs separate verification.
Source: https://21st.dev/@jean.duthil13/components/hero-scrub

21st's Animated Video on Scroll exposes separate scroll, sticky, inset-media, animated-text, and action components in its public usage example. It lists Motion and MIT. This demonstrates useful separation of layout and motion, but the visible usage alone does not prove that video time itself is scrubbed. Full component code encountered elsewhere on 21st was unlock-gated; no restricted implementation was copied.
Source: https://21st.dev/@youcefbnm/components/animated-video-on-scroll

21st's own video guide distinguishes decorative loops, click-to-play previews, and full players. It recommends compact muted decorative clips, a poster, and delaying heavier players until requested. Its under-2MB/under-10-second guidance is a useful aspirational website budget, not a universal codec law. For our local event, approved assets should be bundled locally rather than introducing a hosted playback dependency.
Source: https://21st.dev/blog/react-video-components

Runway's official camera reference separates framing, angle, movement, focus, and composition. Its Gen-4 guide favors clear positive motion descriptions and recommends describing one coherent action rather than stuffing several scene changes into a short generation. Those are transferable writing principles; they are not a claim that Higgsfield uses the same parameters or supports a negative-prompt field. Keep the full art direction in the still-image brief, then make the image-to-video instruction shorter and motion-specific.
Sources: https://help.runwayml.com/hc/en-us/articles/47313504791059-Camera-Terms-Prompts-Examples
https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide

## 2. The Shared Camera And Art Contract

Environment: late-afternoon neighborhood block party outside a barber shop. People are visible and socially engaged in the midground. They are fictional adults, not likenesses of actual participants. Generations receive no private roster, household information, real child images, player names, or host credentials. The approved visual references establish the warmth, surreal urban character, and current team art; use only references the owner has authorized for the selected provider.

Brand: confident street-event craftsmanship rather than generic sci-fi HUDs. Brass or brushed chrome, ink, thick ticket stock, lacquered enamel, stitched vinyl, weathered brick, barber-pole striping, hand-painted texture, and restrained team-color light. Keep logo plates and ticket faces blank during generation. Approved logo, badge artwork, team spelling, and all player text are composited afterward as exact assets or editable UI. Never ask a video model to invent team names.

Composition: the ticket slot and final ticket are always the operational focal point. In the live scene, machine center is approximately x=58%, y=50% in a landscape composition, with a quieter left strip for status. All irreplaceable machine geometry remains inside the central 60% width; the portrait variant is separately composed rather than blindly cropping a widescreen image. Background people may frame the machine but cannot cross its ticket zone. Reserve a flat, high-contrast ticket rectangle for the DOM overlay.

Camera grammar:
- Dolly: change camera position toward or away from the machine; this creates parallax. A zoom only changes field of view. Specify which is intended.
- Truck: slide laterally while keeping the machine at roughly the same size. Use a short reveal from behind a barber pole or door frame.
- Arc: a limited orbit around the machine, such as 15-25 degrees, ending square to its front. Avoid a full 360-degree loop in the live reveal.
- Tilt: rotate up or down from a fixed camera position. A small tilt from the ticket slot to the badge can be a teaser shot; stop moving before name reading.
- Rack focus: change the focal plane from a foreground detail to the machine. Use only in an intro; keep the final ticket and badge sharply readable.
- Locked hero view: camera position, field of view, focus, and horizon stay fixed. This is the live-show default and the easiest basis for a seamless ambient loop.

Shot planning values below are creative targets, not claims of API support. For a 35mm-equivalent view, use a modest perspective without wide-angle stretching; for a 50mm-equivalent hero, keep the machine and ticket flatter; for an 85mm-equivalent detail, isolate material and mechanism. Keep camera roll zero and horizon level. Camera moves ease into a complete stop before the reading beat.

Continuity: approve one machine reference first. Reuse its silhouette, trim, slot, lever, feet, surfaces, and badge mount across every shot. Generate or render clips separately with explicit start/end poses. An eight-second multishot storyboard is an editing plan, not a request that one short model call perfectly perform five cuts.

Global rejection checklist, used in review or a dedicated negative field only when documented: misspelled or generated text; invented logos; changed approved badge shapes; night or nightclub lighting; horror gore; threatening weapons; photoreal actual family likenesses; unreadable smoke; random neon interfaces; wet roads replacing the crowd; excessive lens distortion; floating support feet; flickering geometry; duplicated people; morphing machinery; rapid camera spin; flashing full-screen white; cropped ticket; UI hidden behind spectacle. For models preferring positive phrasing, translate these into the desired conditions instead of pasting a long negative list.

## 3. Direction One: The Barbershop Fate Press

### The feeling

An old-school barber chair and a custom street arcade machine had an expensive, slightly unreasonable child. The machine is built with real weight: a deep enamel cabinet, curved chrome shoulder pieces, a brass knurled pull handle, stitched oxblood vinyl side panels, and a paper slot that looks capable of arguing back. Behind it, friends lean out of the shop, someone laughs from a folding chair, and a spectator has the face of a person already preparing excuses. The people give it life; the machine gives it authority.

### Live UI copy proposals, rendered as editable text

Idle: The block is watching.
Locked: Talk all you want. That ticket is locked.
Before final pull: One more pull. Keep that same energy.
Final: You called for competition. Here it is.
Save action: Keep your receipt.

Use these sparingly. Critical button labels remain direct: Select competitor, Lock fate, Reveal badge, Pull 1 of 3, Pull 2 of 3, Final pull, Save ticket. Humor must never replace recovery instructions.

### Original reference-image prompt

Create a premium cinematic hero reference for a fictional neighborhood field-day ticket-draw machine outside a lively barber shop in warm late-afternoon daylight. The machine is a physically believable custom-built object combining a vintage barber-chair base, an enamel arcade cabinet, curved brushed-chrome trim, a knurled brass pull handle, stitched oxblood vinyl side pads, and a precise mechanical ticket slot. It has one blank upper badge mounting plate and one clearly visible blank ticket emerging straight toward the viewer. Its construction is substantial and grounded: four stable feet, consistent seams, real fasteners, coherent reflections, and a clean silhouette. The broad ticket face is matte ivory stock and contains no writing or symbols.

Frame the machine in a three-quarter view with a natural 35mm-equivalent perspective, camera near chest height, level horizon. It occupies the center-right of a 16:9 composition with its complete body visible and clean breathing room above and below. Leave the leftmost quarter visually quieter for later interface text. Keep the ticket slot and blank ticket inside the central safe area. Show a warmly lit barber-shop doorway, striped pole, brickwork, folding chairs, coolers, and fictional adult spectators in the midground. Their gestures suggest friendly trash talk and anticipation, with natural variety and believable anatomy. Human presence is more important than empty pavement.

Use tactile materials, sunlight grazing the chrome, soft bounced light on the ticket, warm neutral shadows, restrained dust in sunbeams, and small unlettered color accents. The image should feel like a carefully art-directed live event with a little urban fantasy. Preserve legible object structure and unprinted surfaces. Deliver a sharp production reference, not a finished web page or a poster with baked typography.

### Original eight-second intro storyboard

0.0-2.0 seconds: 85mm-equivalent detail of the brass handle and ivory paper edge. Locked frame, tiny mechanical vibration, sun glint moves naturally across the metal. Foreground detail only, no text.
2.0-4.5 seconds: cut to a 35mm-equivalent medium-wide view. A controlled 0.5m lateral truck clears the barber-pole foreground and reveals the whole machine. The background spectators stay midground and unobtrusive.
4.5-6.5 seconds: cut to a 50mm-equivalent front three-quarter hero. Slow 8% dolly-in. The slot opens and advances a blank ticket a small distance. The camera settles before the ticket completes its travel.
6.5-8.0 seconds: locked front hero hold. The machine and ticket are completely stable. The web app may place its exact badge and heading in this composition, but no participant name belongs in the rendered clip.

### Original image-to-video prompt for the hero shot

Use the approved machine reference as the exact visual starting point. A controlled, slow dolly moves 8% closer to the machine, maintaining chest-height framing, a level horizon, and the complete ticket area. The brass mechanism gives one small deliberate movement and advances the blank ivory ticket by a few centimeters. The camera eases to a complete stop before the ticket settles. Background adults make subtle natural gestures within their existing positions. Warm sunlight, material colors, cabinet geometry, and the blank badge plate remain consistent. End on a steady, sharply focused front hero pose suitable for holding while interface text is displayed. One continuous shot.

### Original seamless idle-loop prompt

Locked camera on the approved final hero composition. The cabinet, handle, badge plate, ticket, lighting direction, and camera remain fixed. Only gentle ambient motion occurs: a distant fabric pennant lifts and settles, faint light shimmers in a small internal glass window, and two background spectators make tiny relaxed movements without changing position. The movement returns naturally to its starting state. The ticket stays fully still and blank. Preserve steady exposure and sharp focus. Create a calm loop with matching beginning and ending composition.

Loop production note: a prompt cannot guarantee a mathematically seamless result. Prefer exact first/last reference frames when supported; otherwise trim at matching poses and verify a short crossfade in an editor. Do not reverse footage of people, smoke, or paper ejection to fake a loop. A static background with isolated deterministic CSS light motion is a valid low-power fallback.

### Real 3D version

This is the strongest candidate for a genuine GLB hero asset. Model cabinet, lever pivot, slot shutter, ticket carrier, upper badge surface, and three ink-cover strips as separate named parts. Use a simple scripted ticket deformation or a mostly rigid ticket with a slight curl; keep final text in DOM. Author five short animation clips: awaken, color tension, badge settle, ticket eject, and celebration. The host controls the three ink states independently. Accurate text and approved badge decals remain replaceable, not embedded into an AI-generated mesh.

## 4. Direction Two: The Corner Store Oracle

### The feeling

A corner-store receipt printer has become a neighborhood monument. A compact, beautifully overbuilt machine sits at a service window between barber-shop brick and hand-painted plywood. Layered paper edges, a thick clear glass chamber, brass rollers, and colored translucent resin make it feel handmade and valuable. It carries the attitude of a person who has seen every excuse and is unmoved. Less ornate than the Fate Press, with stronger ticket-as-receipt storytelling.

### Live UI copy proposals

Idle: Step up. The block has questions.
Locked: No exchanges. No cousin discounts.
Pull: The machine heard all that talking.
Final: Your team. Your problem. Your people.

### Original reference-image prompt

Design a physically convincing premium street-event ticket machine at a neighborhood corner-shop service window during bright late afternoon. The object combines a vintage receipt printer, a mechanical raffle dispenser, and a custom art-gallery sculpture. Its lower body is deep warm-black powder-coated steel with brushed brass edges; its upper chamber is thick clear glass containing six neatly separated abstract colored ribbon forms. A horizontal roller mechanism presents one wide blank ivory ticket with a softly torn lower edge. Place a single blank medallion mount above the slot. The cabinet has stable supports, simple consistent construction, and beautiful tactile imperfections. All sign plates, ticket areas, stickers, and clothing remain unlettered for later exact graphic overlays.

Compose a 16:9 production still with a 50mm-equivalent lens, level horizon, the machine occupying the central 55% of the frame. Frame it with a barber-shop window edge and a shallow awning; keep these out of the ticket reading zone. Warm bounced daylight illuminates the paper face without clipping its white tones. Behind the object, fictional adult neighbors in folding chairs and at the shop entrance trade amused reactions, with expressive but believable body language. Use sunlit brick, enamel paint, subtle glass refraction, paper fibers, and warm charcoal shadows. Keep the visual density at the edges while the ticket and medallion zone stay simple and high contrast. The scene feels celebratory, clever, urban, and slightly magical, with a real mechanism that could work. Preserve an uncluttered slot and a full visible ticket; the final frame should support precise composited typography.

### Original eight-second intro storyboard

0.0-2.0 seconds: 50mm-equivalent locked front medium shot. Focus begins on the glass chamber, with the ticket slot slightly soft.
2.0-4.0 seconds: rack focus from chamber to brass rollers. A small shutter opens. Camera remains locked; movement is mechanical and localized.
4.0-6.0 seconds: 35mm-equivalent short 15-degree arc from left-front toward straight-on. A blank ticket slides forward in one smooth action; no whip pan.
6.0-8.0 seconds: squared-up 50mm-equivalent front reading pose. Ticket and medallion mount sharply focused. Hold this composition for the real reveal layer.

### Original image-to-video prompt

Animate the approved corner-store ticket-machine reference as one controlled shot. The camera begins slightly left of center and travels through a small 15-degree arc to a straight-on view, maintaining the machine's size and a level horizon. The brass rollers turn once and feed a wide blank paper ticket toward the viewer. The glass chamber shows a gentle, contained movement of the six abstract ribbons. As the camera reaches the front, the ribbons become calm, the rollers stop, and the ticket settles into a flat readable plane. Keep the machine's silhouette, glass thickness, paper proportions, and warm daylight unchanged. Background people remain peripheral and make small natural gestures. Finish on a stable frontal composition with all writing surfaces blank.

### Original seamless idle-loop prompt

Maintain the approved straight-on composition with a completely locked camera, fixed exposure, and fixed ticket position. Inside the glass chamber, the abstract ribbons make a slow closed circular motion and return to their initial arrangement. Outside the chamber, the mechanism is stationary. Background gestures are minimal and stay within the same silhouettes. The blank paper remains flat and sharply focused throughout. Beginning and ending frames match in camera, lighting, object position, and ribbon phase.

### Real 3D version

Use one transparent chamber only after measuring its GPU cost. Favor convincing baked reflections and an opaque stylized glass alternative on phones. Ribbons can be preauthored mesh strips or lightweight shader shapes rather than a physical fluid simulation. Use an explicit shutter, roller rotation, and a ticket translation track. This design can look excellent with a restrained fixed camera, making it a practical compromise between spectacle and mobile performance.

## 5. Direction Three: The Block Crown

### The feeling

The draw machine becomes the centerpiece of a neighborhood championship ceremony. A raised barber-chair-inspired pedestal supports six sculptural color fins around a mechanical ticket core. A suspended crown-like ring frames the existing team badge without replacing it. The machine is extravagant, but its mechanical logic is clear. People gather in a semicircle; the central ticket space stays open. This is the direction for genuinely spatial choreography and real 3D.

### Live UI copy proposals

Idle: Everybody tough before the ticket.
Locked: The block picked a side.
Pull: Pull it like you meant all that.
Final: Welcome to your problem.

### Original reference-image prompt

Create a premium cinematic reference for an extraordinary but physically coherent neighborhood championship ticket machine at an outdoor barber-shop block party in warm daylight. A sturdy sculptural pedestal, inspired by a vintage barber-chair hydraulic base, supports a central enamel-and-chrome ticket core. Six distinct curved color fins form a restrained open crown around the upper core. Their arrangement is balanced and visibly attached to the structure. A single blank circular badge plate sits in the center, with enough clear space to composite an existing team emblem later. Below it, a precise horizontal slot holds one broad blank ivory ticket facing the viewer. The object is bold and ceremonial, with brushed metal, lacquer, stitched vinyl accents, visible joints, and real weight.

Use a natural 35mm-equivalent perspective from slightly below the core, camera roll zero. Show the complete pedestal and crown, with the ticket zone near the center of the composition. The machine occupies the center of a 16:9 frame; keep a calm perimeter for interface labels and preserve the entire machine inside a portrait-safe central region where possible. Behind it, fictional adult spectators form a loose open semicircle, wearing varied casual block-party clothing with no text. Include barber-shop brick, a striped pole, folding chairs, warm shade from an awning, and small celebratory fabric details. Faces and gestures communicate playful competitive anticipation rather than menace. Sunlight defines the chrome edges and colored fins; soft fill keeps the ticket bright and readable. The result should feel like a handcrafted neighborhood trophy brought to life. All logos, names, labels, numbers, and ticket printing are left blank for exact compositing.

### Original ten-second intro storyboard

0.0-2.5 seconds: 35mm-equivalent medium-wide, low but level camera. Slow 20-degree arc reveals the depth of the six attached fins. Keep the whole object visible.
2.5-5.0 seconds: cut to a 50mm-equivalent front three-quarter shot. Fins make one small coordinated outward tilt, opening a clear view of the badge mount.
5.0-7.0 seconds: cut to an 85mm-equivalent ticket-core detail. The mechanism advances a blank ticket; soft daylight catches its paper fibers.
7.0-10.0 seconds: cut to a front hero pose at 50mm-equivalent. The crown settles. All camera and structural movement stops; a restrained color reflection remains. This is the bridge into the interactive app.

### Original image-to-video prompt

Using the approved Block Crown reference, make a slow 20-degree camera arc from front-left toward the center while preserving the machine's full silhouette and a level horizon. The six attached crown fins perform one small synchronized outward tilt around their visible joints, then settle. The central badge plate remains blank and stable. A broad blank ticket advances from the core and stops in a clear front-facing position. Warm daylight and realistic material reflections stay consistent. Fictional adult spectators remain behind the machine and make subtle anticipatory movements. Ease the camera into a complete stop in the final third of the shot. End with the machine front, blank badge plate, and ticket all sharp and readable. One coherent continuous action, with no scene change.

### Original seamless idle-loop prompt

Locked front hero camera on the approved machine. All solid geometry, crown fins, pedestal, badge plate, and ticket remain stationary. A soft internal light reflection slowly travels around the crown and completes exactly one gentle cycle, returning to its initial phase. Background fabric makes a tiny repeating sway. The crowd remains composed and stable. Preserve fixed daylight, sharp materials, steady exposure, and a blank readable ticket throughout.

### Real 3D version

Model each fin with a real pivot, fixed limit, and nonintersecting path. A perspective camera makes the shallow arc controllable and repeatable; a reduced-motion pose can be evaluated immediately. Use the exact approved badge as a texture/decal or DOM overlay. It is worth genuine geometry here because the depth and articulation are the point. Avoid adding a fully explorable neighborhood; a strong hero asset with a curated background will deliver most of the value. A static poster fallback should preserve the same visual identity.

## 6. Choosing The Rendering Path

### Path A: normal local video clips

Best for an opening, idle atmosphere, and a short noninteractive transition. They offer rich light/materials without realtime scene complexity. Use small local clips, explicit posters, muted inline playback, and an opt-in sound control. They cannot be re-lit or freely re-angled. The camera movement is already baked into pixels. A CSS scale of the video is not a new camera angle. The final ticket must remain editable outside the clip.

### Path B: video time controlled by scroll

Best for a short optional "Meet the Reaper" preview. Setting video.currentTime seeks to a chosen time; the media pipeline still has to decode the relevant frame. Frequent or backward seeks may lag, depending on encoding and device. Coalesce seeks, wait for metadata, track the newest target, and keep a poster available. A smaller seek-friendly encode can trade download size against scrubbing latency; verify on the real Windows browser and a phone instead of assuming all-intra encoding is always better.

### Path C: pre-extracted image sequence on canvas

Best when exact frame selection and reversible progress matter. Extract frames offline during asset preparation rather than decoding an entire clip into memory on the attendee's phone. Use a manifest with actual dimensions, frame count, duration, and a frame URL list. Draw the nearest available frame, load around the current target, limit concurrent decoding, and evict unused bitmaps. Compressed file size is not decoded memory size: width x height x 4 is a useful lower-bound estimate for ordinary RGBA frame storage, and browser overhead can be higher. Twelve 640x360 frames are about 10.5 MiB; ninety 960x540 frames are about 178 MiB. These are calculations, not measured browser usage.

Initial test targets: keep a 12-frame neighborhood at 640x360 on mobile and a byte-limited cache around 48 MiB on desktop; cap pending decode jobs and call ImageBitmap.close() for evicted frames. Treat these as starting budgets for profiling, not guarantees. Do not preload hundreds of full-resolution frames. A first-frame poster should be visible before any sequence is ready.

### Path D: realtime Three.js GLB scene

Best when the actual machine needs meaningful camera arcs, lever articulation, changing team accents, and correctly synchronized ticket mechanics. It can coexist with the current native app; React is not required. One self-hosted, version-pinned Three.js module and a bounded scene is a viable design. It adds an asset pipeline, loading, material/shadow tuning, context-loss recovery, and GPU testing. Keep authoritative state in the current engine and ordinary DOM controls above the canvas. Do not put private names in textures or the canvas before name-revealed.

For performance: measure draw calls and frame time, merge static parts where appropriate, use instancing for repeated decorative objects, limit transparent layers, bake most lighting, cap drawing-buffer pixels, and render on demand when idle. Do not merge parts that need independent animation. The camera aspect follows the actual canvas CSS size; internal rendering resolution is separately capped. On hidden tabs, pause decorative animation. On context loss, show the exact phase's poster plus live DOM ticket and controls.

Primary technical sources:
https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback
https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close
https://threejs.org/manual/pages/responsive.html
https://threejs.org/manual/pages/rendering-on-demand.html
https://threejs.org/manual/pages/optimize-lots-of-objects.html
https://threejs.org/docs/pages/AnimationMixer.html

## 7. Exact Integration Plan For The Current App

Keep src/rival-reaper/reveal.ts, session logic, receipts, assignment fairness, host authentication, and the privacy boundary authoritative. The inspected source has these presentation phases: idle, machine-awakens, colors-fight, badge-selected, ticket-ejects, ink-1, ink-2, ink-3, name-revealed, team-explosion, roster-updated. Revalidate names and behavior against the latest repaired checkout before implementation.

Add a presentation adapter behind the existing arena DOM, with three interchangeable outputs: static poster/CSS, local media, optional WebGL. Its conceptual contract is renderPhase(publicState, options), resize(bounds), pauseMotion(enabled), and dispose(). It receives only the already authorized public state. It does not import the draw engine or hold host credentials, and it cannot issue state-changing commands. A separate preview adapter receives synthetic fixture state only.

### Phase treatment:
- idle: stable hero poster or low-amplitude ambient loop, blank/sealed ticket area.
- machine-awakens: one mechanism movement; finish in a stable waiting pose.
- colors-fight: six abstract accents move inside the machine without implying a new random selection.
- badge-selected: show the exact approved badge from the authoritative public team value.
- ticket-ejects: short outward movement ending at a fixed ticket reading plane.
- ink-1, ink-2, ink-3: remove decorative mask portions in three discrete host-confirmed steps. The real name remains absent from public client data until its authorized phase.
- name-revealed: write the authorized name into stable high-contrast DOM text and announce it once. No continuing camera movement while reading.
- team-explosion: brief contained color celebration around, not over, the name. No full-screen flash.
- roster-updated: return attention to the six-team board; preserve ticket save access where supported.

Duration is a local visual embellishment, not a state transition. Finishing a clip never draws, advances, prints, saves, or changes a team. A newer server revision cancels stale work. A reconnect applies the final pose of the current phase directly instead of replaying prior suspense. If a chosen renderer or media asset fails, the existing static state remains usable.

### Optional scroll preview:
Use a separate read-only preview surface with a bounded sticky section, a visible skip link, a progress slider/keyboard alternative, and synthetic data. Never attach it to host draw commands. Compute progress from that section's start/end, not the whole document: p = clamp((scrollPosition - start) / max(1, end - start), 0, 1). For frame sequences select round(p x (frameCount - 1)); for video select p x the validated duration. Optional damping should be time-based, such as alpha = 1 - exp(-deltaTime/tau), rather than a fixed per-frame multiplier that feels different on 60Hz and 144Hz displays. Render only while progress changes or decoding finishes.

CSS scroll timelines can drive supported CSS/WAAPI properties but do not automatically seek a video's currentTime. GSAP ScrollTrigger can manage pinning and scrub progress if its addition is justified, but native scroll observation plus sticky positioning is sufficient for this bounded preview. Feature-detect and retain a static/slider fallback. Prevent scroll pinning from trapping keyboard navigation or covering critical content.
Sources: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
https://gsap.com/docs/v3/Plugins/ScrollTrigger/

### Mobile and reduced motion:
Use a separate portrait-safe camera composition or a deliberate contain fit, not an object-cover crop that amputates the slot. A scene layer may crop background, while the DOM ticket uses its own responsive layout. Respect prefers-reduced-motion and the existing pause switch immediately: show stable phase poses, skip camera travel and ink shaking, and keep names and actions fully available. Honor explicit low-motion choice even if hardware is powerful. Audio is off until user activation; narration, if introduced later, needs reviewed captions. Core operation must work with no audio and no animation.

## 8. Original Master Implementation Prompt

Purpose: paste this into an authorized coding task after a direction and its assets have been approved. It is a proposed specification, not permission to run a new pipeline or make paid calls.

Extend the existing Rival-Reaper app with the approved cinematic machine presentation while preserving its current native HTML/CSS/JavaScript architecture and authoritative TypeScript server. Work within the existing repo and first inspect the latest local changes. Do not scaffold a replacement app, migrate to React, alter fairness rules, change roster data, expose host credentials, or replace approved team assets. Use the selected direction's machine and daylight block-party art. Keep exact logos, badges, team names, player names, and ticket fields outside generated video. The current reveal phase machine remains the sole source of truth.

Begin with a source and visual audit of the actual arena and host views at the user's Windows browser dimensions and scaling. Identify viewport constraints, controls, media layers, ticket reading space, and existing reduced-motion behavior. Preserve working repairs. Build one presentation adapter that can render a stable fallback, a local video/frame-sequence treatment, and an optional real-3D scene without changing the server contract. Add only the smallest dependency justified by the approved rendering path and pin it. New asset-generation calls, credential setup, paid spend, security changes, and deployment require their own authorization.

For the arena, keep a readable header, a bounded scene region, an accessible ticket, all six team identities, and status/footer content. Scale the machine region to available width and height, not the whole page. Keep decorative layers pointer-events:none. Leave actual controls as semantic DOM buttons with visible keyboard focus and accurate disabled reasons. The audience display has view controls only. The private host has a single clear next-action control, state text, and recovery actions. Preserve idempotency and existing replay-safe transitions.

Implement machine-awakens, colors-fight, badge-selected, ticket-ejects, three ink stages, name-revealed, team-explosion, and roster-updated as presentation responses to server state. Never infer the team from color animation, never send unrevealed names to the public client, and never advance a draw on animationend, video ended, scroll, or a WebGL callback. On reconnect, apply the current settled state without replaying earlier beats. On rapid newer revisions, cancel obsolete animation and media work. End every effect at a stable pose that can be paused indefinitely.

If using video, use approved same-origin assets, posters, muted inline playback, bounded loading, and media-error fallback. Avoid per-frame seek spam; coalesce targets and verify decoded frames when needed. If using sequences, preload only a bounded local neighborhood, cap memory and parallel decodes, dispose evicted ImageBitmaps, and never black out the scene while frames load. If using Three.js, isolate the scene in its own module, match camera aspect to its CSS container, cap drawing-buffer resolution, render on demand when idle, handle context loss, and dispose textures/geometries/materials on teardown. Keep mechanical parts independently animated and all critical text in DOM.

Add the optional cinematic scroll preview only as a separate read-only experience with synthetic data, a skip link, keyboard/slider alternative, and reduced-motion fallback. Its progress function must be pure presentation. It must not access private event data or issue commands. Do not impose scrolling on the live reveal.

Treat an individual keepsake ticket, the in-scene ticket, completed-team posters, and the private audit as separate outputs. If individual Save ticket and Print ticket are in the approved scope, generate them from the same persisted assignment and approved art. Never reroll or leak private audit fields. Give visible, honest completion and error messages. A button click alone does not prove delivery.

Verify the current Windows viewport, compact desktop, portrait phone, landscape phone, and projector sizes. Test every reveal phase, long synthetic names, all six teams, keyboard-only operation, reduced motion, audio off, reload between ink-3 and name reveal, rapid double commands, network disconnect/reconnect, media decode failure, and WebGL context loss where applicable. Check screenshots for clipping, hidden controls, illegible names, excessive background contrast, and incorrect badges. Inspect public payloads for unrevealed data. Measure frame time and loading memory on the actual target hardware; do not call static inspection a performance test. Keep local tests and evidence, and do not trigger hosted CI for every small change. Report the actual files changed, checks passed, remaining limitations, and a direct way to inspect the result.

## 9. Original Asset Handoff Prompt

Prepare a reusable cinematic asset package for the chosen Rival-Reaper direction. Start with an approved reference still and a written shot list. Produce assets only through the authorized provider/model and budget. Record each generation's provider, model, parameters, source references, job ID, rights/provenance, dimensions, duration, and checksum. Keep private participant data out of all prompts and uploads. Treat the machine reference as immutable across attempts unless a revision is explicitly selected.

Deliver a landscape master, a separately composed portrait version, a still poster for each required settled phase, a short idle loop, and any approved transition clips. Each file must show the same machine silhouette, ticket slot, trim, badge mount, and light direction. The ticket and logo surfaces remain blank. For a sequence path, extract and compress frames offline and provide a dimensioned manifest with actual frame count. For a 3D path, provide GLB, source scene, named moving parts, clip names, material/texture inventory, scale, pivot coordinates, and a static fallback render. Do not silently substitute a rendered video for a requested real-3D asset.

Reject temporal warping, extra limbs, duplicated spectators, changing cabinet geometry, broken mechanical connections, unreadable ticket framing, newly invented text, badge mutations, and severe loop discontinuities. Review the first, middle, last, and transition frames, then play the full clip and its loop. A good first frame does not prove a usable clip. Keep the best approved assets local and separate from the source-of-truth draw logic.

## 10. How To Use The Installed Tools

Product Design can compare these directions against the existing interface and approved art, then audit the real host and audience flow from screenshots. It should support the chosen implementation rather than replace it with a generic prototype.

Remotion can assemble independently generated shots, exact logo overlays, sound cues, captions, and a frame-accurate event opener. It can also produce verified poster frames or a consistent sequence from a composition. Its React Player is optional; a rendered local clip avoids adding React to the live app. The authoritative draw and participant names stay outside that rendered opener.

Game Development Studio becomes useful for the real-3D path: inspect/normalize the machine mesh, preserve license/provenance, admit a verified asset package, diagnose render defects, and measure performance against a reproducible scene. Build 3D Game Rooms contributes stronger composition and approval gates if the project grows into a spatial barber-shop environment. For a single machine, use a bounded prop/hero scene rather than creating an explorable room by default. Neither tool's installed presence proves local CLI, Blender, GPU, provider credentials, or paid budget readiness.

Recommended production order: choose one direction; approve a machine reference and final reading pose; test the DOM ticket over that still at actual viewport sizes; generate or model a single short movement; validate continuity and performance; then expand the remaining beats. This keeps the ambitious visual result tied to a working name-puller rather than an attractive video that cannot run the event.
