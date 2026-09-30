export const $ = (s) => document.querySelector(s);
export const worlds = [
  {
    id: "blood-bloom", tone: 146.83,
    name: "Blood Bloom",
    world: "ROSE PANTHER WORLD",
    symbol: "BB",
    color: "#f34668",
  },
  {
    id: "pressure-gang", tone: 196,
    name: "Pressure Gang",
    world: "WATER / PRESSURE WORLD",
    symbol: "PG",
    color: "#43b6ff",
  },
  {
    id: "high-society", tone: 164.81,
    name: "High Society",
    world: "GREEN FANTASY / SMOKE",
    symbol: "HS",
    color: "#99e672",
  },
  {
    id: "heat-mob", tone: 130.81,
    name: "Heat Mob",
    world: "FIRE LION WORLD",
    symbol: "HM",
    color: "#ff954e",
  },
  {
    id: "pink-venom", tone: 220,
    name: "Pink Venom",
    world: "THE VENOM KINGDOM",
    symbol: "PV",
    color: "#ff78d3",
  },
  {id:"belt-2-ass",tone:246.94,name:"BELT 2 ASS",world:"PURPLE RAM TITAN",symbol:"B2A",color:"#bd7aff"},
];
export const phases = [
  "idle",
  "machine-awakens",
  "colors-fight",
  "badge-selected",
  "ticket-ejects",
  "ink-1",
  "ink-2",
  "ink-3",
  "name-revealed",
  "team-explosion",
  "roster-updated",
];
export function connection(ok) {
  const e = $("#connection");
  e.textContent = ok ? "● LIVE / CONNECTED" : "○ OFFLINE / RECONNECTING";
  e.classList.toggle("offline", !ok);
}
export function connect(render, onConnection = () => {}) {
  let es = null, revision = -1, session;
  function open() {
    if (es) return;
    const stream = new EventSource("/api/events");
    es = stream;
    stream.addEventListener("state", (event) => {
      if (stream !== es) return;
      try {
        const state = JSON.parse(event.data);
        if (state.sessionId !== session) {
          revision = -1;
          session = state.sessionId;
        }
        if (state.revision < revision) return;
        revision = state.revision;
        connection(true);
        onConnection(true);
        render(state);
      } catch {
        connection(false);
        onConnection(false);
      }
    });
    stream.onerror = () => {
      if (stream !== es) return;
      connection(false);
      onConnection(false);
    };
  }
  function close() {
    if (es) es.close();
    es = null;
    connection(false);
    onConnection(false);
  }
  // Back/Forward can restore this same document without rerunning its module.
  // Reopen the closed stream and await fresh state before enabling controls.
  window.addEventListener("pagehide", close);
  window.addEventListener("pageshow", open);
  open();
  return { close };
}
export function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
export function renderTeams(state, host = false) {
  const target = $("#teams");
  target.replaceChildren();
  target.style.setProperty("--team-count",String(state.teams.length));
  for (const world of worlds) {
    const team = state.teams.find((t) => t.id === world.id);
    if (!team) continue;
    const row = el("div", host ? "host-team" : "board-team");
    row.dataset.team = world.id;
    row.style.setProperty("--team-color", world.color);
    const names = el("div", "roster-names");
    if (!host) {
      if (team.roster.length) {
        names.setAttribute("role", "list"); names.setAttribute("aria-label", `${world.name} players`);
        for (const player of team.roster) {
          const name = el("span", "roster-player", player.name); name.setAttribute("role", "listitem"); names.append(name);
        }
      } else names.textContent = "The first name is still out there.";
    }
    if (host) {
      row.append(
        el("strong", "", world.name),
        el("span", "", `${team.assigned} / ${team.capacity}`),
      );
    } else {
      const top = el("div", "team-top");
      const count = el(
        "span",
        "team-count",
        String(team.assigned).padStart(2, "0"),
      );
      count.append(
        el("small", "", ` / ${String(team.capacity).padStart(2, "0")}`),
      );
      top.append(el("span", "team-title", world.name), count);
      row.append(
        top,
        el("div", "team-world", world.world),
        names,
      );
    }
    target.append(row);
  }
}
