import { $, connect, renderTeams, phases } from "./shared.js";
import { createPosterControls } from "./roster-posters.js";
let token = "",
  state = null,
  busy = false,
  online = false,
  pending = null,
  bundle = null,
  privateRevision = -1,
  authGeneration = 0,
  hostAuthConfirmed = false;
const posters = createPosterControls(document.querySelector("#poster-panel"));
const privateRequests = new Set();
function staleAuthentication() {
  const error = new Error("Host authentication changed");
  error.stale = true;
  return error;
}
function invalidatePrivateRequests() {
  authGeneration++;
  hostAuthConfirmed = false;
  for (const controller of privateRequests) controller.abort();
  privateRequests.clear();
  privateRevision = -1;
  pending = null;
  bundle = null;
}
const nextLabels = {
  "machine-awakens": "LET THE COLORS FIGHT",
  "colors-fight": "REVEAL THE TEAM BADGE",
  "badge-selected": "EJECT THE TICKET",
  "ticket-ejects": "YANK THE TICKET · 1 OF 3",
  "ink-1": "YANK THE TICKET · 2 OF 3",
  "ink-2": "YANK THE TICKET · 3 OF 3",
  "ink-3": "REVEAL THE NAME",
  "name-revealed": "UNLEASH THE TEAM WORLD",
  "team-explosion": "PUT THEM ON THE BOARD",
};
function message(text) {
  $("#message").textContent = text;
}
function controls() {
  posters.update({ state, authenticated: hostAuthConfirmed, online });
  const active =
    state && !["idle", "roster-updated"].includes(state.reveal.phase);
  $("#draw").disabled =
    busy ||
    !online ||
    !token ||
    !state?.healthy ||
    active ||
    !!pending ||
    !state?.remaining;
  $("#player").disabled = $("#draw").disabled;
  $("#advance").disabled =
    busy || !online || !token || !state?.healthy || !active || !!pending;
  $("#retry").hidden = !pending;
  $("#retry").disabled = busy || !online || !token;
  $("#advance-label").textContent = busy
    ? "SAVING THE MOMENT…"
    : state
      ? (nextLabels[state.reveal.phase] ??
        (state.remaining ? "READY FOR THE NEXT FATE" : "ALL FATES LOCKED"))
      : "WAITING FOR CONNECTION";
  if (state) {
    $("#host-phase").textContent = state.reveal.phase
      .replaceAll("-", " ")
      .toUpperCase();
    $("#host-draw").textContent =
      "DRAW " + String(state.drawCount).padStart(2, "0");
    const step = phases.indexOf(state.reveal.phase);
    document
      .querySelectorAll(".ink-progress i")
      .forEach((e, i) => e.classList.toggle("done", step >= 5 + i));
  }
}
async function api(path, options = {}) {
  if (!token) throw staleAuthentication();
  const generation = authGeneration;
  const controller = new AbortController();
  privateRequests.add(controller);
  try {
    const res = await fetch(path, {
      ...options,
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + token,
        ...options.headers,
      },
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]),
    });
    if (generation !== authGeneration) throw staleAuthentication();
    const data = await res.json();
    if (generation !== authGeneration) throw staleAuthentication();
    if (!res.ok) {
      const error = new Error(data.error ?? "Request failed");
      error.status = res.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (generation !== authGeneration) throw staleAuthentication();
    throw error;
  } finally {
    privateRequests.delete(controller);
  }
}
function checkSession(sessionId) {
  if (state && sessionId !== state.sessionId) {
    logout();
    message("The server session changed. Unlock the host again to continue.");
    throw staleAuthentication();
  }
}
async function privateState() {
  if (!token) throw staleAuthentication();
  const value = await api("/api/host/state");
  checkSession(value.sessionId);
  if (value.revision < privateRevision) return;
  privateRevision = value.revision;
  const chosen = $("#player").value;
  $("#player").replaceChildren(new Option("Select a competitor", ""));
  for (const p of value.players) $("#player").append(new Option(p.name, p.id));
  if (value.players.some((p) => p.id === chosen)) $("#player").value = chosen;
  $("#receipt").textContent = value.lastReceiptHash ?? "No fate locked yet.";
  if (!state || value.revision >= state.revision) {
    const { players, lastReceiptHash, ...publicValue } = value;
    state = publicValue;
    renderTeams(state, true);
  }
  controls();
}
$("#auth-form").onsubmit = async (event) => {
  event.preventDefault();
  if (busy) return;
  invalidatePrivateRequests();
  const generation = authGeneration;
  busy = true;
  token = $("#token").value;
  controls();
  try {
    await privateState();
    if (generation !== authGeneration) return;
    hostAuthConfirmed = true;
    $("#auth-panel").hidden = true;
    $("#controls").hidden = false;
    $("#audit-panel").hidden = false;
    $("#token").value = "";
    message("Host unlocked. The arena stays read-only.");
    $("#player").focus();
  } catch (error) {
    if (error.stale || generation !== authGeneration) return;
    logout();
    message(error.message);
  } finally {
    if (generation === authGeneration) {
      busy = false;
      controls();
    }
  }
};
function logout() {
  invalidatePrivateRequests();
  token = "";
  busy = false;
  $("#controls").hidden = true;
  $("#audit-panel").hidden = true;
  $("#auth-panel").hidden = false;
  $("#receipt").textContent = "";
  $("#audit-text").textContent = "";
  $("#audit-status").textContent = "";
  $("#token").value = "";
  $("#player").replaceChildren();
  $("#audit-dialog").close();
  message("Host locked. Reveal state is safely held by the machine.");
  $("#token").focus();
  controls();
}
$("#logout").onclick = logout;
async function execute(command) {
  if (!token) return;
  const generation = authGeneration;
  busy = true;
  pending = command;
  controls();
  message("");
  try {
    const result = await api(command.path, {
      method: "POST",
      body: JSON.stringify(command.input),
    });
    checkSession(result.state.sessionId);
    pending = null;
    if (!state || result.state.revision >= state.revision) state = result.state;
    message(
      result.replayed
        ? "The original command was recovered. No duplicate action."
        : "Saved. Fate stays locked.",
    );
    await privateState();
    if (generation !== authGeneration) return;
    // Third physical yank breaks the last ink, then reveals the name. Each durable
    // beat still has its own revision and replay-safe command; reload can resume ink-3.
    if (
      command.path.endsWith("/advance") &&
      result.state.reveal.phase === "ink-3" &&
      result.appliedRevision === result.state.revision &&
      state.revision === result.appliedRevision &&
      state.reveal.phase === "ink-3"
    ) {
      const continuation = {
        path: command.path,
        input: {
          commandId: command.input.commandId + "_name",
          expectedRevision: state.revision,
          expectedSessionId: state.sessionId,
        },
      };
      busy = false;
      await execute(continuation);
      return;
    }
  } catch (error) {
    if (error.stale || generation !== authGeneration) return;
    if (error.status) {
      pending = null;
      if (error.status === 401) {
        logout();
        message(error.message);
        return;
      }
      await privateState().catch(() => {});
      if (generation !== authGeneration) return;
      message(error.message);
    } else
      message(
        "Connection interrupted. Retry this SAME command to recover its result safely.",
      );
  } finally {
    if (generation === authGeneration) {
      busy = false;
      controls();
    }
  }
}
$("#draw-form").onsubmit = (event) => {
  event.preventDefault();
  if ($("#draw").disabled) return;
  const playerId = $("#player").value;
  if (!playerId) {
    message("Choose a competitor first.");
    return;
  }
  execute({
    path: "/api/host/draw",
    input: {
      commandId: crypto.randomUUID(),
      expectedRevision: state.revision,
      expectedSessionId: state.sessionId,
      playerId,
    },
  });
};
function advance() {
  if ($("#advance").disabled) return;
  execute({
    path: "/api/host/reveal/advance",
    input: {
      commandId: crypto.randomUUID(),
      expectedRevision: state.revision,
      expectedSessionId: state.sessionId,
    },
  });
}
$("#advance").onclick = advance;
$("#retry").onclick = () => pending && execute(pending);
let startY = null,
  pulled = false;
$("#advance").addEventListener("pointerdown", (e) => {
  if ($("#advance").disabled) return;
  startY = e.clientY;
  pulled = false;
  $("#advance").setPointerCapture(e.pointerId);
});
$("#advance").addEventListener("pointermove", (e) => {
  if (startY === null) return;
  const distance = Math.max(0, Math.min(42, e.clientY - startY));
  $("#advance .pull-grip").style.transform = `translateY(${distance / 2}px)`;
  if (distance >= 40 && !pulled) {
    pulled = true;
    advance();
  }
});
$("#advance").addEventListener("pointerup", () => {
  startY = null;
  $("#advance .pull-grip").style.transform = "";
  if (pulled) {
    $("#advance").onclick = () => {};
    setTimeout(() => {
      $("#advance").onclick = advance;
    }, 0);
  }
});
$("#advance").addEventListener("pointercancel", () => {
  startY = null;
  $("#advance .pull-grip").style.transform = "";
});
$("#audit-open").onclick = async () => {
  const generation = authGeneration;
  try {
    const value = await api("/api/host/audit");
    checkSession(value.payload.sessionId);
    bundle = value;
    $("#audit-text").textContent = JSON.stringify(
      {
        sessionId: bundle.payload.sessionId,
        revision: bundle.payload.revision,
        draws: bundle.payload.receipts.length,
        phase: bundle.payload.reveal.phase,
        lastReceipt: bundle.payload.receipts.at(-1)?.receiptHash ?? null,
        bundleHash: bundle.bundleHash,
      },
      null,
      2,
    );
    $("#audit-status").textContent =
      "Export is a snapshot of the current locked state.";
    $("#audit-dialog").showModal();
  } catch (error) {
    if (error.stale || generation !== authGeneration) return;
    if (error.status === 401) logout();
    message(error.message);
  }
};
$("#audit-close").onclick = () => $("#audit-dialog").close();
$("#export").onclick = () => {
  if (!token || !bundle) return;
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "rival-reaper-audit.private.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("#audit-status").textContent = "Private audit download requested.";
};
connect(
  (value) => {
    if (state && value.sessionId !== state.sessionId) {
      logout();
      message("The server session changed. Unlock the host again to continue.");
    }
    if (
      state &&
      value.sessionId === state.sessionId &&
      value.revision < state.revision
    )
      return;
    state = value;
    renderTeams(value, true);
    controls();
    if (token)
      privateState().catch((error) => {
        if (error.stale) return;
        if (error.status === 401) logout();
        else
          message(
            "Private roster could not refresh. Reconnect before drawing.",
          );
      });
  },
  (value) => {
    online = value;
    controls();
  },
);
