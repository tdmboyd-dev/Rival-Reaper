// Poster data comes ONLY from the already-revealed public roster. Images stay in
// this host tab; no roster, file, or token is uploaded or persisted by this module.
export const POSTER_TEAMS = [
  { id: "blood-bloom", name: "Blood Bloom", color: "#f34668" },
  { id: "pressure-gang", name: "Pressure Gang", color: "#43b6ff" },
  { id: "high-society", name: "High Society", color: "#99e672" },
  { id: "heat-mob", name: "Heat Mob", color: "#ff954e" },
  { id: "pink-venom", name: "Pink Venom", color: "#ff78d3" },
  { id: "belt-2-ass", name: "BELT 2 ASS", color: "#bd7aff" },
];
// Exact original image bytes and name-only panels recovered from the owner's
// continuation; viewed and independently matched to its provenance hashes.
export const POSTER_TEMPLATES = {
  "blood-bloom": {width:1145,height:1374,panel:[29.5,56.4,43.7,9.9]},
  "pressure-gang": {width:1145,height:1374,panel:[29.3,57.4,44.3,10.6]},
  "high-society": {width:1145,height:1374,panel:[29.4,55.5,43.7,10.7]},
  "heat-mob": {width:1374,height:1145,panel:[31.0,56.1,38.7,12.8]},
  "pink-venom": {width:1145,height:1374,panel:[28.9,56.4,44.5,10.3]},
  "belt-2-ass": {width:1145,height:1374,panel:[20.09,66.52,59.91,13.97],placeholder:false},
};
export function originalPosterRegion(teamId) {
  const template = POSTER_TEMPLATES[teamId];
  if (!template) throw new Error("Unknown original poster template");
  const [x,y,width,height] = template.panel;
  return {x,y,width,height,templateId:teamId};
}
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 32 * 1024 * 1024;
export const MAX_POSTER_HEIGHT = 10000;
const WIDTH = 3000;
const FONT = "Arial, Helvetica, sans-serif";

export function posterGate(state, teamId, access = {}, art = null) {
  const identity = POSTER_TEAMS.find((team) => team.id === teamId);
  const team = state?.teams?.find((team) => team.id === teamId);
  if (!access.authenticated) return { ready: false, reason: "Unlock the host to prepare team posters." };
  if (!access.online || !state?.healthy) return { ready: false, reason: "Reconnect to a healthy live session before downloading." };
  if (!identity || !team || !Number.isSafeInteger(team.capacity) || team.capacity < 1 || team.capacity > 50)
    return { ready: false, reason: "A team needs 1–50 competitors for a poster." };
  if (team.assigned !== team.capacity || !Array.isArray(team.roster) || team.roster.length !== team.capacity)
    return { ready: false, reason: `Waiting for the full public roster (${team.assigned ?? 0} / ${team.capacity}).` };
  const draws = new Set();
  for (const player of team.roster) {
    if (!player || typeof player.name !== "string" || !player.name.trim() || player.name.length > 120 ||
        /[\x00-\x1f]/.test(player.name) || !Number.isSafeInteger(player.drawIndex) || player.drawIndex < 1 || draws.has(player.drawIndex))
      return { ready: false, reason: "The public roster is invalid; reconnect before exporting." };
    draws.add(player.drawIndex);
  }
  const terminalRoster = state.reveal?.phase === "roster-updated" ||
    (Number.isSafeInteger(state.reveal?.drawIndex) && team.roster.every(player => player.drawIndex < state.reveal.drawIndex));
  if (!terminalRoster)
    return {ready:false,reason:"Finish revealing every member of this team before exporting."};
  if (!art?.approved || !art.image || !art.url)
    return { ready: false, reason: "Approved team art is missing. Choose the original approved image below." };
  if (!art.regionConfirmed || !validPosterRegion(art.region))
    return { ready: false, reason: "Set and confirm the name area on the approved art before downloading." };
  return { ready: true, reason: "Full team revealed. Confirmed on-art PNG download is ready.", team, identity };
}

// Preserve every character; even a long unbroken name is wrapped, never clipped
// or shortened. Grapheme segmentation keeps emoji/combining sequences together.
export function wrapPosterName(name, maxWidth, measure) {
  if (!(maxWidth > 0)) throw new Error("Invalid poster text width");
  const graphemes = typeof Intl.Segmenter === "function"
    ? [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(name)].map((part) => part.segment)
    : Array.from(name);
  const lines = [];
  let line = "";
  for (const grapheme of graphemes) {
    if (measure(grapheme) > maxWidth) throw new Error("A name contains a character too wide for the poster");
    if (line && measure(line + grapheme) > maxWidth) { lines.push(line); line = ""; }
    line += grapheme;
  }
  if (line) lines.push(line);
  return lines;
}

export function validPosterRegion(region) {
  return region && ["x", "y", "width", "height"].every((key) => Number.isFinite(region[key])) &&
    region.x >= 0 && region.y >= 0 && region.width > 0 && region.height > 0 &&
    region.x + region.width <= 100 && region.y + region.height <= 100;
}

// Regions are expressed against the WHOLE original image, not a cropped thumbnail.
// Approved originals use verified maps; replacement art requires owner confirmation.
export function layoutPoster(team, measure, options) {
  if (!Array.isArray(team.roster) || team.roster.length < 1 || team.roster.length > 50)
    throw new Error("Poster roster must contain 1–50 names");
  if (!validPosterRegion(options?.region)) throw new Error("Set and confirm the name area on the approved image");
  const ratio = options.imageWidth / options.imageHeight;
  if (!(ratio > 0 && Number.isFinite(ratio))) throw new Error("Approved art dimensions are invalid");
  const width = Math.floor(Math.min(WIDTH, Math.sqrt(24000000 * ratio), MAX_POSTER_HEIGHT * ratio));
  const height = Math.floor(width / ratio);
  if (width < 100 || height < 100) throw new Error("Approved art aspect ratio is too extreme for a readable poster");
  const region = options.region;
  const box = { x: width * region.x / 100, y: height * region.y / 100,
    width: width * region.width / 100, height: height * region.height / 100 };
  const template = POSTER_TEMPLATES[options.region.templateId];
  const padding = template ? 8 : 20;
  let best = null;
  function candidate(fontSize, columns) {
    const lineHeight = Math.ceil(fontSize * 1.22), gap = Math.ceil(fontSize * .4);
    const columnGap = fontSize;
    const columnWidth = (box.width - padding * 2 - columnGap * (columns - 1)) / columns;
    if (columnWidth <= 0 || box.height <= padding * 2) return null;
    const numberWidth = template ? measure("00  ", fontSize) : 0;
    const nameWidth = columnWidth - numberWidth;
    if (nameWidth <= 0) return null;
    const rows = Math.ceil(team.roster.length / columns), entries = [];
    for (let column = 0; column < columns; column++) {
      let y = box.y + padding;
      for (const [offset, player] of team.roster.slice(column * rows, (column + 1) * rows).entries()) {
        let lines;
        try { lines = wrapPosterName(player.name, nameWidth, (text) => measure(text, fontSize)); }
        catch { return null; }
        const textHeight = lines.length * lineHeight;
        if (y + textHeight > box.y + box.height - padding) return null;
        entries.push({ name: player.name, number: column * rows + offset + 1, lines,
          x: box.x + padding + column * (columnWidth + columnGap) + numberWidth,
          numberX: box.x + padding + column * (columnWidth + columnGap), numberWidth,
          y, width: nameWidth, height: textHeight });
        y += textHeight + gap;
      }
    }
    return { width, height, fontSize, lineHeight, entries, columns, region: box };
  }
  for (const columns of template ? [2] : team.roster.length <= 14 ? [1, 2] : [2, 3]) {
    // Bounded font search, with 28px floor. Never truncate names to force a fit.
    let low = 28, high = 92, fitted = null;
    while (low <= high) {
      const size = Math.floor((low + high) / 2), result = candidate(size, columns);
      if (result) { fitted = result; low = size + 1; } else high = size - 1;
    }
    if (fitted && (!best || fitted.fontSize > best.fontSize)) best = fitted;
  }
  if (!best) throw new Error("Every full name will not fit readably in this region. Enlarge the approved name area; no names have been shortened or omitted.");
  return best;
}

export function drawPoster(canvas, team, identity, image, region) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas PNG export is unavailable in this browser");
  const layout = layoutPoster(team, (text, size) => {
    ctx.font = `700 ${size}px ${FONT}`;
    return ctx.measureText(text).width;
  }, { imageWidth: image.naturalWidth || image.width, imageHeight: image.naturalHeight || image.height, region });
  canvas.width = layout.width; canvas.height = layout.height;
  // Preserve the whole approved image and its aspect ratio. Only the explicitly
  // confirmed name region is overlaid; no fabricated art, headers or new panels.
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  if (POSTER_TEMPLATES[region.templateId] && POSTER_TEMPLATES[region.templateId].placeholder !== false) {
    const sourceWidth = image.naturalWidth || image.width, sourceHeight = image.naturalHeight || image.height;
    const rx = sourceWidth * region.x / 100, ry = sourceHeight * region.y / 100;
    const rw = sourceWidth * region.width / 100, rh = sourceHeight * region.height / 100;
    // Reuse the unlettered central gutter of the ORIGINAL panel. Its full
    // vertical grain avoids copying slogan edges from the bottom name slot.
    for (let col = 0; col < 8; col++)
      ctx.drawImage(image, rx + rw * .42, ry + rh * .02, rw * .13, rh * .78,
        layout.region.x + col * layout.region.width / 8,
        layout.region.y, layout.region.width / 8, layout.region.height);
  }
  ctx.textBaseline = "top";
  ctx.fillStyle = "#fff"; ctx.strokeStyle = "#080b12";
  ctx.lineJoin = "round"; ctx.lineWidth = Math.max(3, layout.fontSize / 9);
  ctx.font = `700 ${layout.fontSize}px ${FONT}`;
  for (const entry of layout.entries) {
    if (entry.numberWidth) {
      ctx.fillStyle = "#d9c891";
      ctx.fillText(String(entry.number).padStart(2, "0"), entry.numberX, entry.y);
      ctx.fillStyle = "#fff";
    }
    entry.lines.forEach((line, index) => {
    const y = entry.y + index * layout.lineHeight;
    ctx.strokeText(line, entry.x, y); ctx.fillText(line, entry.x, y);
    });
  }
  return layout;
}

export function posterFilename(teamId, sessionId) {
  if (!POSTER_TEAMS.some((team) => team.id === teamId)) throw new Error("Unknown poster team");
  const session = String(sessionId ?? "session").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "session";
  return `rival-reaper-${teamId}-${session}-full-team.png`;
}

export async function validateArtFile(file) {
  if (!file || !Number.isSafeInteger(file.size) || file.size < 12 || file.size > MAX_FILE_BYTES)
    throw new Error("Choose a PNG, JPEG or WebP image up to 20 MB");
  const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!png && !jpeg && !webp) throw new Error("Only real PNG, JPEG and WebP files are accepted. SVG and external image links are not supported.");
  if (png && bytes.length >= 24) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = view.getUint32(16), height = view.getUint32(20);
    if (!width || !height || width > 8192 || height > 8192 || width * height > MAX_IMAGE_PIXELS)
      throw new Error("Choose approved art no larger than 8192 pixels per side and 32 megapixels");
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth > 8192 || image.naturalHeight > 8192 || image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS)
        reject(new Error("Choose approved art no larger than 8192 pixels per side and 32 megapixels"));
      else resolve(image);
    };
    image.onerror = () => reject(new Error("That image could not be decoded. Choose the original PNG, JPEG or WebP file."));
    image.src = url;
  });
}
function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function canvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    try { canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The browser could not create the PNG. Try again on a desktop.")), "image/png"); }
    catch { reject(new Error("PNG export failed. Choose the original local image file and try again.")); }
  });
}

export function createPosterControls(root, options = {}) {
  if (!root) throw new Error("Poster control mount is missing");
  let current = { state: null, authenticated: false, online: false };
  let generation = 0;
  let exportEpoch = 0;
  let exporting = null;
  const art = new Map(), cards = new Map(), jobs = new Map();
  const previewCache = new Map(), attemptedOriginals = new Set();
  const panel = node("div", "poster-grid");
  root.append(panel);
  function gate(id) { return posterGate(current.state, id, current, art.get(id)); }
  function fingerprint(id) {
    const team = current.state?.teams?.find((team) => team.id === id);
    return JSON.stringify([current.state?.sessionId, team?.capacity, team?.roster]);
  }
  function render() {
    root.hidden = !current.authenticated;
    for (const identity of POSTER_TEAMS) {
      const card = cards.get(identity.id), approved = art.get(identity.id), status = gate(identity.id);
      const team = current.state?.teams?.find((team) => team.id === identity.id);
      card.element.hidden = !team;
      card.download.hidden = !team;
      card.status.textContent = status.reason;
      let layout = null;
      const previewKey = JSON.stringify([fingerprint(identity.id), approved?.url, approved?.region, approved?.regionConfirmed]);
      if (approved?.regionConfirmed && team?.roster?.length) {
        let cached = previewCache.get(identity.id);
        if (!cached || cached.key !== previewKey) {
          const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
          try {
            layout = layoutPoster(team, (text, size) => { ctx.font = `700 ${size}px ${FONT}`; return ctx.measureText(text).width; },
              {imageWidth: approved.image.naturalWidth, imageHeight: approved.image.naturalHeight, region: approved.region});
            cached = {key:previewKey, layout};
          } catch (error) { cached = {key:previewKey, error:error.message}; }
          previewCache.set(identity.id,cached);
        }
        layout = cached.layout;
        if (cached.error) card.status.textContent = cached.error;
      }
      card.download.disabled = !status.ready || !layout || jobs.has(identity.id) || exporting !== null;
      card.overlay.replaceChildren();
      if (layout && approved?.template && POSTER_TEMPLATES[identity.id].placeholder !== false) {
        const mask = node("span", "poster-overlay-mask");
        mask.style.left = `${approved.region.x}%`; mask.style.top = `${approved.region.y}%`;
        mask.style.width = `${approved.region.width}%`; mask.style.height = `${approved.region.height}%`;
        mask.style.backgroundImage = `url("/assets/${identity.id}-roster-texture.png")`;
        mask.style.backgroundSize = "12.5% 100%";
        card.overlay.append(mask);
      }
      if (layout) for (const entry of layout.entries) {
        if (entry.numberWidth) {
          const number = node("span", "poster-overlay-number", String(entry.number).padStart(2,"0"));
          number.style.left = `${entry.numberX / layout.width * 100}%`;
          number.style.top = `${entry.y / layout.height * 100}%`;
          number.style.fontSize = `${layout.fontSize / layout.width * 100}cqw`;
          card.overlay.append(number);
        }
        const name = node("span", "poster-overlay-name");
        name.style.left = `${entry.x / layout.width * 100}%`;
        name.style.top = `${entry.y / layout.height * 100}%`;
        name.style.fontSize = `${layout.fontSize / layout.width * 100}cqw`;
        name.style.lineHeight = String(layout.lineHeight / layout.fontSize);
        for (const line of entry.lines) name.append(node("span", "poster-overlay-line", line));
        card.overlay.append(name);
      }
      const region = approved?.region;
      card.selection.hidden = !!approved?.template || !validPosterRegion(region);
      card.regionControls.hidden = !!approved?.template;
      if (validPosterRegion(region)) {
        card.selection.style.left = `${region.x}%`; card.selection.style.top = `${region.y}%`;
        card.selection.style.width = `${region.width}%`; card.selection.style.height = `${region.height}%`;
      }
      card.confirm.checked = !!approved?.regionConfirmed;
      card.confirm.disabled = !approved || !validPosterRegion(region) || jobs.has(identity.id);
      for (const field of card.fields.values()) field.disabled = !approved || jobs.has(identity.id);
      card.download.textContent = jobs.has(identity.id) ? "PREPARING PNG…" : "DOWNLOAD FULL-TEAM PNG";
      card.input.disabled = !current.authenticated || jobs.has(identity.id);
      card.remove.disabled = !current.authenticated || jobs.has(identity.id);
      card.source.textContent = approved ? (approved.template ? "Original approved template · existing name panel mapped automatically" : `Host-selected approved art: ${approved.name}`) : "Approved art not loaded · no replacement artwork will be exported";
      card.placeholder.hidden = !!approved;
      card.image.hidden = !approved;
      if (approved && card.image.src !== approved.url) card.image.src = approved.url;
      if (!approved) card.image.removeAttribute("src");
      card.list.replaceChildren();
      // Public names only; textContent prevents roster strings becoming markup.
      for (const player of Array.isArray(team?.roster) ? team.roster : []) card.list.append(node("li", "", player.name));
      card.empty.hidden = !!team?.roster?.length;
    }
  }
  function clear() {
    generation++;
    for (const value of art.values()) URL.revokeObjectURL(value.url);
    art.clear();
    previewCache.clear();
    attemptedOriginals.clear();
    exporting = null;
    jobs.clear();
    for (const card of cards.values()) {
      card.input.value = ""; card.notice.textContent = "";
      for (const field of card.fields.values()) field.value = "";
    }
  }
  async function loadOriginal(id) {
    if (!current.authenticated || art.has(id) || jobs.has(id) || attemptedOriginals.has(id)) return;
    attemptedOriginals.add(id);
    const started = generation, job = Symbol();
    jobs.set(id, job); render();
    const card = cards.get(id), template = POSTER_TEMPLATES[id];
    try {
      const url = `/assets/${id}-roster-template.png`;
      const image = await loadImage(url);
      if (started !== generation || !current.authenticated) return;
      if (image.naturalWidth !== template.width || image.naturalHeight !== template.height)
        throw new Error("Original template dimensions changed; export blocked until the correct source is restored");
      const region = originalPosterRegion(id);
      art.set(id,{image,url,name:`${id}-roster-template.png`,approved:true,region,regionConfirmed:true,template:true});
      for (const [key,field] of card.fields) field.value = String(region[key]);
      card.notice.textContent = "Original poster ready. Names replace only its original roster slots, including a tenth slot when needed.";
    } catch (error) {
      if (started === generation) card.notice.textContent = error.message;
    } finally {
      if (jobs.get(id) === job) jobs.delete(id);
      if (started === generation) render();
    }
  }
  for (const identity of POSTER_TEAMS) {
    const card = node("article", `poster-card poster-${identity.id}`);
    const title = node("h3", "", identity.name);
    const status = node("p", "poster-status");
    const preview = node("div", "poster-preview");
    const image = node("img", "poster-art");
    image.alt = `${identity.name} host-selected approved team art`;
    const placeholder = node("p", "poster-placeholder", `${identity.name} approved art is missing`);
    const list = node("ol", "poster-names");
    list.setAttribute("aria-label", `${identity.name} publicly revealed roster`);
    const empty = node("p", "fine", "Names appear here after they reach the public board.");
    const stage = node("div", "poster-art-stage"), overlay = node("div", "poster-overlay"), selection = node("div", "poster-region-selection");
    overlay.setAttribute("aria-hidden", "true"); selection.setAttribute("aria-hidden", "true");
    stage.append(image, overlay, selection);
    preview.append(stage, placeholder, list, empty);
    const regionControls = node("fieldset", "poster-region-controls");
    regionControls.append(node("legend", "", "Position names on the approved art"));
    regionControls.append(node("p", "fine", "Enter the name area's position and size as percentages of the whole image. There is no default approved area."));
    const fields = new Map();
    for (const [key, title] of [["x", "Left (%)"], ["y", "Top (%)"], ["width", "Width (%)"], ["height", "Height (%)"]]) {
      const label = node("label", "", title), field = node("input", `poster-region-${key}`);
      field.type = "number"; field.min = "0"; field.max = "100"; field.step = "0.1";
      field.id = `poster-region-${identity.id}-${key}`; label.htmlFor = field.id;
      label.append(field); fields.set(key, field); regionControls.append(label);
      field.addEventListener("input", () => {
        const value = art.get(identity.id);
        if (!value || jobs.has(identity.id)) return;
        value.regionConfirmed = false;
        const region = Object.fromEntries([...fields].map(([key, field]) => [key, field.value === "" ? NaN : Number(field.value)]));
        value.region = validPosterRegion(region) ? region : null;
        notice.textContent = "Check the name area, then confirm it to enable the on-art preview.";
        render();
      });
    }
    const confirmLabel = node("label", "poster-region-confirm-label", "I confirm this is the name area on this approved art"), confirm = node("input", "poster-region-confirm");
    confirm.type = "checkbox"; confirm.id = `poster-region-confirm-${identity.id}`; confirmLabel.htmlFor = confirm.id;
    confirmLabel.append(confirm); regionControls.append(confirmLabel);
    confirm.addEventListener("change", () => {
      const value = art.get(identity.id);
      if (!value || jobs.has(identity.id)) return;
      value.regionConfirmed = confirm.checked && validPosterRegion(value.region);
      notice.textContent = value.regionConfirmed ? "Review every name over the art above. Adjusting any region value requires confirmation again." : "Name area is not confirmed.";
      render();
    });
    const source = node("p", "fine");
    const label = node("label", "poster-file-label", `Choose ${identity.name} approved art`);
    const input = node("input", "poster-art-input");
    input.type = "file"; input.accept = "image/png,image/jpeg,image/webp";
    input.id = `poster-art-${identity.id}`; label.htmlFor = input.id;
    const remove = node("button", "secondary small", "RESTORE ORIGINAL TEMPLATE"); remove.type = "button";
    const download = node("button", "poster-download", "DOWNLOAD FULL-TEAM PNG"); download.type = "button";
    const notice = node("p", "poster-notice"); notice.setAttribute("role", "status");
    status.id = `poster-status-${identity.id}`; download.setAttribute("aria-describedby", status.id);
    const advanced = node("details", "poster-advanced");
    advanced.append(node("summary", "", "Advanced: replace artwork"), label, input, remove, regionControls);
    card.append(title, status, preview, source, advanced, download, notice);
    panel.append(card);
    cards.set(identity.id, { element:card, status, image, placeholder, list, empty, source, input, remove, download, notice, fields, confirm, overlay, selection, regionControls });
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file || !current.authenticated || jobs.has(identity.id)) return;
      const started = generation, job = Symbol();
      jobs.set(identity.id, job); notice.textContent = "Checking the local image…"; render();
      let url;
      try {
        await validateArtFile(file);
        if (started !== generation || !current.authenticated) return;
        url = URL.createObjectURL(file);
        const image = await loadImage(url);
        if (started !== generation || !current.authenticated) { URL.revokeObjectURL(url); return; }
        const previous = art.get(identity.id);
        if (previous) URL.revokeObjectURL(previous.url);
        art.set(identity.id, { image, url, name: file.name, approved: true, region: null, regionConfirmed: false });
        for (const field of fields.values()) field.value = "";
        notice.textContent = "Approved art loaded in this tab. Review the image and all names before posting.";
      } catch (error) {
        if (url) URL.revokeObjectURL(url);
        if (started === generation) notice.textContent = error.message;
      } finally {
        if (jobs.get(identity.id) === job) jobs.delete(identity.id);
        if (started === generation) { input.value = ""; render(); }
      }
    });
    remove.addEventListener("click", () => {
      if (jobs.has(identity.id)) return;
      const previous = art.get(identity.id);
      if (previous) URL.revokeObjectURL(previous.url);
      art.delete(identity.id); attemptedOriginals.delete(identity.id);
      notice.textContent = "Restoring the original poster template…";
      void loadOriginal(identity.id); render();
    });
    download.addEventListener("click", async () => {
      const allowed = gate(identity.id);
      if (!allowed.ready || jobs.has(identity.id) || exporting !== null) return;
      const started = generation, epoch = exportEpoch, expected = fingerprint(identity.id), job = Symbol();
      exporting = job;
      jobs.set(identity.id, job); notice.textContent = "Preparing every name at full resolution…"; render();
      let canvas;
      try {
        if (document.fonts?.ready) await document.fonts.ready;
        if (started !== generation || epoch !== exportEpoch || !gate(identity.id).ready || fingerprint(identity.id) !== expected) return;
        canvas = document.createElement("canvas");
        const selected = art.get(identity.id);
        const layout = drawPoster(canvas, allowed.team, allowed.identity, selected.image, selected.region);
        const blob = await canvasBlob(canvas);
        // Lock/logout/navigation/session changes while toBlob runs cannot download.
        if (started !== generation || epoch !== exportEpoch || !gate(identity.id).ready || fingerprint(identity.id) !== expected) {
          if (started === generation) notice.textContent = "The live state changed. Reconnect and try again.";
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = node("a");
        link.href = url; link.download = posterFilename(identity.id, current.state.sessionId);
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        notice.textContent = `PNG download requested (${layout.width} × ${layout.height}), including all ${allowed.team.roster.length} names. Check your browser's downloads before posting.`;
      } catch (error) {
        if (started === generation) notice.textContent = error.message;
      } finally {
        if (canvas) { canvas.width = 1; canvas.height = 1; }
        if (exporting === job) exporting = null;
        if (jobs.get(identity.id) === job) jobs.delete(identity.id);
        if (started === generation) render();
      }
    });
  }
  render();
  return {
    update(value) {
      if ((current.online && value.online !== true) || (current.state?.healthy && !value.state?.healthy)) exportEpoch++;
      const sessionChanged = current.state && value.state && current.state.sessionId !== value.state.sessionId;
      if (sessionChanged || (current.authenticated && !value.authenticated)) clear();
      current = { state: value.state ?? null, authenticated: value.authenticated === true, online: value.online === true };
      render();
      if (current.authenticated && options.loadOriginals !== false)
        for (const identity of POSTER_TEAMS)
          if (current.state?.teams?.some(team => team.id === identity.id)) void loadOriginal(identity.id);
    },
    lock() { clear(); current = { ...current, authenticated: false }; render(); },
  };
}
