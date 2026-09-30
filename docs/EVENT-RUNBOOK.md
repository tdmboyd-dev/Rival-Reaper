# RiVAL REAPER: event rehearsal and recovery

This checklist distinguishes software tests from the actual event. Do not start the real draw until its inputs and physical setup are approved.

## Before the event

1. Confirm the complete competitor roster, display names, genders and household grouping. Mark every Blackout support person `blackout`. Do not invent missing input.
2. Keep the real JSON outside the public repository. Follow `roster.sample.json` for structure only.
3. Run `npm ci`, `npm run typecheck`, `npm test` and `npm run test:browser` in the target machine. Chromium installations can set `REAPER_BROWSER_EXECUTABLE` to their existing browser executable. A browser launch error means browser verification did not pass.
4. Run `npm run rehearse -- /absolute/private/roster.json` using the same six-team default as the event. This performs twelve shuffled throwaway complete draws, prints only aggregate counts, and never changes the real event session. A failure must be fixed before showtime. It is not a guarantee for every possible draw order.
5. Configure the existing launcher with the private roster path, private encryption secret, private host token and a NEW private session path. Retain the secret and encrypted file securely. Do not paste either credential into chat or Git.
6. Run `npm start` for the single six-team event, using actual configured input. The old demo alias uses this same launcher and cannot create a fake roster. On the same computer open `/host` and `/arena` at the reported localhost port. Unlock host with the locally held token. Project only the arena.
7. Six approved completed-team poster templates load automatically with mapped name panels. They are separate from reveal badges. Four correctly named competitive badges are bundled; the blue and green corrections must be approved and integrated before final acceptance. No substitute placeholder is considered final art. See `docs/TEAM-POSTERS.md`.


## Physical dress rehearsal (separate fake session)

- Connect the actual projector and speakers. Inspect every name and roster from the farthest seat, including a ten-person team and longest real display name.
- Enable sound with a deliberate click and set room volume. Toggle mute, pause motion and fullscreen; check all six team effects.
- Run the host on the intended device over an approved secure setup. The default localhost server serves only its computer. A phone cannot reach another computer's localhost. Do not open a public tunnel or weaken firewall/TLS/security for convenience.
- Lock one fake fate; advance to badge, ticket and all three yanks. Confirm no name appears before reveal, and board updates only afterward.
- Refresh, navigate away/back and simulate a disconnect. Confirm the same fate resumes. Try a double tap and same-command retry; never create a new draw to recover a missing response.
- Complete all fake players. Download each completed team's poster with approved art and inspect the actual PNG for names, clipping, spelling and resolution. Save the private audit separately.
- Restart the application with the SAME fake data path and encryption secret. Confirm the completed show remains completed. Do not delete event history to fix an error.

## During the event

Select the next competitor on the private host. Lock their fate once. Advance colors, badge and ticket. Use three physical yanks, taps or Enter presses; let the name, team celebration and board finish before the next draw. Only the host controls state; the arena is read-only.

If a response is lost, use RETRY THE SAME COMMAND. If the machine says storage failed, stop advancing and recover; do not reroll. If sound or animation fails while state remains healthy, preserve the locked draw and use the readable reduced-motion display.

## Recovery

- Stop the old server first. Do not run two writers against the same session.
- Reopen with exactly the same roster, data path and encryption secret. Reload and reauthenticate the host. Resume the saved reveal.
- A changed-roster startup error is intentional: saved fates are preserved. Correct the supplied roster back to the saved one to resume. A genuinely new event requires a separate data path and another rehearsal; it must not silently replace the old show.
- Wrong-key, corrupted snapshot or ambiguous lock errors require inspection. Do not erase the snapshot or generate a replacement secret.
- If recovery is reported as in progress or interrupted, stop every Reaper process using that session and preserve the encrypted snapshot. Inspect the session’s `.lock` and `.lock.recovery` files and confirm neither recorded process is alive. Only after that check may an operator remove the `.lock.recovery` guard, then retry with the unchanged roster, session path and secret. Never delete the encrypted snapshot or blindly remove an active writer lock.
- Keep the final private audit and its hash independently. The hash chain detects alteration against a trusted retained anchor; it is not an external signature or certification.

## Still required for final acceptance

Approval/integration of the remaining badge corrections, owner acceptance of the running arena, final browser exports, real phone/projector/speaker rehearsal, and a verified delivery/run location. Automated tests do not substitute for any of these.
