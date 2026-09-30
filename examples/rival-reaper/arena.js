import { $, worlds, connect, renderTeams } from "./shared.js";
// Adapted from Julien Thibeaut's MIT Motion Primitives Spotlight, discovered on
// 21st.dev. See THIRD-PARTY-NOTICES.md. Rewritten as a native DOM enhancement;
// no React/Motion runtime, touch dependency, frame loop, or draw-state authority.
const surface = $(".energy-window"),
  light = document.createElement("div");
light.className = "material-light";
light.setAttribute("aria-hidden", "true");
surface.append(light);
const pointer = matchMedia("(pointer:fine)"),
  reduced = matchMedia("(prefers-reduced-motion:reduce)");
surface.addEventListener("pointermove", (event) => {
  if (
    !pointer.matches ||
    reduced.matches ||
    document.body.classList.contains("motion-paused")
  ) {
    light.style.opacity = "0";
    return;
  }
  const rect = surface.getBoundingClientRect();
  light.style.transform = `translate(${((event.clientX - rect.left) * surface.clientWidth) / rect.width - 110}px,${((event.clientY - rect.top) * surface.clientHeight) / rect.height - 110}px)`;
  light.style.opacity = "1";
});
surface.addEventListener("pointerleave", () => {
  light.style.opacity = "0";
});
let previous = null,
  audio = null,
  enabled = false;
const labels = {
  idle: "THE MACHINE IS WAITING",
  "machine-awakens": "THE MACHINE AWAKENS",
  "colors-fight": "FIVE WORLDS. ONE FATE.",
  "badge-selected": "YOUR WORLD HAS CHOSEN",
  "ticket-ejects": "PULL THE TICKET. BREAK THE INK.",
  "ink-1": "ONE YANK. KEEP PULLING.",
  "ink-2": "TWO YANKS. NO GOING BACK.",
  "ink-3": "THE INK IS BROKEN",
  "name-revealed": "THAT FATE IS YOURS.",
  "team-explosion": "WELCOME TO YOUR WORLD",
  "roster-updated": "ON THE BOARD. IN THE GAME.",
};
function cue(phase, team) {
  if (!enabled || !audio || audio.state !== "running") return;
  const base = [146.83, 196, 164.81, 130.81, 220][
    Math.max(
      0,
      worlds.findIndex((w) => w.id === team),
    )
  ];
  const offsets =
    phase === "team-explosion"
      ? [1, 1.25, 1.5, 2]
      : phase.startsWith("ink-")
        ? [0.7, 1]
        : [1];
  offsets.forEach((ratio, i) => {
    const o = audio.createOscillator(),
      g = audio.createGain(),
      t = audio.currentTime + i * 0.1;
    o.type = phase.startsWith("ink-") ? "triangle" : "sine";
    o.frequency.setValueAtTime(base * ratio, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g);
    g.connect(audio.destination);
    o.start(t);
    o.stop(t + 0.4);
  });
}
$("#sound").onclick = async () => {
  try {
    if (!audio) audio = new AudioContext();
    if (!enabled) await audio.resume();
    enabled = !enabled;
    $("#sound").textContent = enabled ? "SOUND ON" : "SOUND OFF";
    $("#sound").setAttribute("aria-pressed", String(enabled));
    if (!enabled) await audio.suspend();
  } catch {
    $("#sound").textContent = "SOUND UNAVAILABLE";
  }
};
$("#motion").onclick = () => {
  const paused = document.body.classList.toggle("motion-paused");
  $("#motion").textContent = paused ? "RESUME MOTION" : "PAUSE MOTION";
  $("#motion").setAttribute("aria-pressed", String(paused));
};
$("#fullscreen").onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    $("#fullscreen").textContent = "FULL SCREEN UNAVAILABLE";
  }
};
document.addEventListener("visibilitychange", () => {
  if (audio && document.hidden) audio.suspend();
  else if (audio && enabled) audio.resume().catch(() => {});
});
connect((state) => {
  const r = state.reveal,
    world = worlds.find((w) => w.id === r.teamId);
  document.body.dataset.phase = r.phase;
  document.body.dataset.team = r.teamId ?? "none";
  $("#draw-number").textContent = String(state.drawCount).padStart(2, "0");
  $("#remaining").textContent = `${state.remaining} competitors waiting`;
  $("#phase-label").textContent = state.healthy
    ? labels[r.phase]
    : "SHOW PAUSED · HOST RECOVERY REQUIRED";
  $("#badge-symbol").textContent = world?.symbol ?? "R";
  $("#badge-name").textContent = world?.name ?? "FIVE WORLDS / ONE FATE";
  $("#ticket-team").textContent = r.teamName ?? "YOUR WORLD IS WAITING";
  $("#serial").textContent =
    `ADMIT ONE / ${String(r.drawIndex ?? 0).padStart(3, "0")}`;
  $("#player-name").textContent = r.playerName ?? "IDENTITY SEALED";
  renderTeams(state);
  if (
    previous &&
    (previous.reveal.phase !== r.phase ||
      previous.reveal.drawIndex !== r.drawIndex)
  ) {
    cue(r.phase, r.teamId);
    if (r.phase.startsWith("ink-")) {
      $("#ticket").classList.remove("yank");
      void $("#ticket").offsetWidth;
      $("#ticket").classList.add("yank");
    }
    if (r.phase === "roster-updated")
      document
        .querySelector(`[data-team="${r.teamId}"] .team-count`)
        ?.classList.add("count-pop");
  }
  previous = state;
});
