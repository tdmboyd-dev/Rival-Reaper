# Full-team, on-art PNG posters

## Implemented contract

The private host has five separate poster cards, one for each competing team. A
card unlocks its download only after confirmed host authentication, a healthy
live connection, the exact team capacity is present in the **public** roster,
and the active reveal is `roster-updated`. A locked fate or a partially revealed
name does not qualify. Blackout Krew is never a poster team.

1. Choose the matching original approved PNG, JPEG or WebP in the team's card.
2. Enter the intended name area's **Left, Top, Width and Height** as percentages
   of the complete original image. There is deliberately no guessed default.
3. Confirm that this is the name area on that approved image. The preview shows
   the bounded name overlay. Check the image and every full name. Changing any
   coordinate or choosing another image clears the confirmation.
4. Download that team's PNG with its own button. This saves a local file; it does
   not publish anything. Review the result before posting it.

The complete original image retains its aspect ratio. Names are drawn **on the
art inside the explicitly confirmed region**, with white fill and a dark outline
for contrast. There is no cropped replacement image, added roster sheet, invented
badge or silent below-art fallback. No names are abbreviated or truncated.

The renderer selects one to three columns and fits a bounded font size of at
least 28 output pixels. If the complete names do not fit readably, export is
blocked and the host must enlarge the intended name area. Output is normally
3000 pixels wide, bounded by 24 megapixels and 10,000 pixels high. The original
aspect ratio and selected region, not an extended below-image panel, determine
its shape. Large exports can take longer on phones; use a desktop if browser
memory prevents encoding.

A 46-competitor session's 10-player team and teams up to 50 players are supported.
Executed layout tests fit all 50 maximum-length 120-character names into a full
square-image region. That does **not** prove that an arbitrary small region in
an unseen approved template can fit them. Too-small regions fail closed. The
accessible name list is retained outside the image preview for easy review.

## Local data and security

Images must be at most 20 MB, 8192 pixels per side and 32 megapixels. File
signatures are checked; SVG and remote image URLs are rejected. Art stays in
browser memory and is cleared on host lock, session change or page refresh.
Nothing is uploaded or committed. The module never receives a host token or
private roster fields. Only names already on the public board are used; no
household metadata, gender, internal player IDs or unrevealed names enter the
image. Downloaded roster images should never enter this public repository.

File names include the team and session. Duplicate clicks cannot start duplicate
exports, different teams encode one at a time to bound memory, and async image loads or PNG encodes cannot complete an export after
host logout, session replacement, lost live connection or a new reveal stage.

## Exact asset and approval boundary

The five original owner-approved team-art files were unavailable to this work
session. This code does not contain them, replace them, establish their approval,
or infer their intended name-placement regions. The host selects the original
file and explicitly identifies its name area. Empty states are clearly labeled
and cannot be exported. Final integration and visual approval against those five
actual templates still require the source images and owner review.

## Verification (2026-09-30)

Executed `node --test --import tsx test/rival-reaper-posters.test.ts`: **14/14
passed**. Tests execute the actual module in a fake-DOM/canvas VM. They cover five
unique PNG downloads, full 10/50 rosters, 120-character wrapping, safe names and
filenames, on-art geometry/aspect ratio, required region confirmation and
reconfirmation, too-small region rejection, raster signatures and limits,
full/public/auth gating, lost connection, session changes, duplicate clicks,
late image decode after logout, and logout during PNG encoding. Canvas draw-call
and blob-download behavior is tested, not actual raster output.

Real browser acceptance is provided by `scripts/poster-browser-checks.ts`, to be
invoked from the existing full fake-roster rehearsal. It produces clearly fake
art only, supplies an explicitly fake test region, verifies five actual PNG
downloads/signatures/dimensions, captures the host preview and tests real canvas
10/50 long-name encoding. These new scenarios have **NOT RUN** in this
environment: browser access was blocked by `ERR_BLOCKED_BY_CLIENT` and Chromium
sandbox socket restrictions. No bypass was attempted. Actual image rendering,
mobile save UI, approved-template match and owner visual approval remain
unverified.

## Integration points

- `host.html`: stylesheet link and `#poster-panel` mount
- `host.js`: `createPosterControls(...)`, then
  `update({state, authenticated, online})` on state/control changes; authentication
  becomes true only after a successful private-host API response
- `server.ts`: allowlist `/roster-posters.js` and `/roster-posters.css`; CSP
  `img-src 'self' data: blob:` permits locally selected art previews
- Optional controller `lock()` clears art and hides the panel immediately
- No server upload route, external assets, new packages, private files or hosted
  CI are required
