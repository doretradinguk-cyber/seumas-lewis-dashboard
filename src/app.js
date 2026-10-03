import { startRain } from "./components/rain.js";
const $ = (s) => document.querySelector(s);
const icons = {
  home: "◈",
  game: "⌘",
  photo: "▧",
  assets: "▱",
  audio: "≋",
  settings: "⚙",
};
const pages = {
  home: "Overview",
  game: "Game sandbox",
  photo: "Photo to Game",
  assets: "The Drop Zone",
  audio: "Audio workshop",
  settings: "Studio settings",
};
const repo = "https://github.com/doretradinguk-cyber/";
const defaults = {
  rain: true,
  theme: "emerald",
  game: "",
  photo: "",
  audio: "",
};
let settings = { ...defaults };
try {
  settings = {
    ...defaults,
    ...JSON.parse(localStorage.getItem("sl-studio-v1") || "{}"),
  };
} catch {}
let catalog = { schemaVersion: 1, assets: [] },
  tools = {},
  catalogError = "",
  catalogOrigin = "Repository catalogue";
const escape = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function validUrl(value) {
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol) &&
      !u.username &&
      !u.password
      ? u.href
      : "";
  } catch {
    return "";
  }
}
function save() {
  try {
    localStorage.setItem("sl-studio-v1", JSON.stringify(settings));
    return true;
  } catch {
    toast("Browser storage unavailable. Changes apply for this session.");
    return false;
  }
}
function toast(t) {
  $("#toast").textContent = t;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ($("#toast").textContent = ""), 4500);
}
function route() {
  const key = location.hash.slice(1).split("?")[0] || "home";
  return key in pages ? key : "home";
}
function link(url, label, cls = "button secondary") {
  return `<a class="${cls}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
}
function launch(key) {
  const url = validUrl(settings[key] || tools[key]?.url);
  return url
    ? link(
        url,
        "Launch " + escape(tools[key]?.label || pages[key]),
        "button primary",
      )
    : `<a class="button primary" href="#settings">Set launch address <span>→</span></a>`;
}
function card(key, no, title, text, status) {
  return `<a class="tool-card ${key}" href="#${key}"><div class="card-top"><span class="tool-symbol">${icons[key]}</span><span class="badge">${status}</span></div><span class="eyebrow">WORKSPACE / ${no}</span><h3>${title}</h3><p>${text}</p><span class="card-foot">Open workspace <span>↗</span></span></a>`;
}
function overview() {
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow"><i class="dot"></i> SEUMAS & LEWIS / DEVELOPMENT STUDIO</span><h1>Your next world.<br><em>Starts here.</em></h1><p>A home for strange worlds, original visuals and the sounds that bring them to life.</p><div class="actions"><a href="#game" class="button primary">Enter game sandbox <span>↗</span></a><a href="#assets" class="button secondary">Explore Drop Zone</a></div><div class="hero-note"><span>01 / BUILD</span><span>02 / EXPERIMENT</span><span>03 / PLAY</span></div></div><div class="portal" aria-hidden="true"><div class="portal-grid"></div><div class="portal-door door-back"></div><div class="portal-door door-mid"></div><div class="portal-door door-front"></div><div class="portal-floor"></div><span class="portal-label">A WORLD WAITING TO OPEN</span></div></section><section class="section-head"><div><span class="eyebrow">CONNECTED WORKSPACES</span><h2>Pick up where ideas begin.</h2></div><span class="quiet">Four spaces. One studio.</span></section><section class="cards">${card("game", "01", "Retro Wave Game", "Explore the first-person horror project and launch your test build.", "FOUNDATION")}${card("photo", "02", "Photo to Game", "Open the image tool and shape the visual language of your world.", validUrl(settings.photo || tools.photo?.url) ? "ADDRESS CONFIGURED" : "LINK REQUIRED")}${card("assets", "03", "The Drop Zone", "Find source material, track ready assets and keep builds lean.", "ASSET LIBRARY")}${card("audio", "04", "Audio Workshop", "A dedicated home for the future sound and music tool.", "PLANNED")}</section><section class="pipeline-banner"><span class="tool-symbol">▱</span><div><h3>Keep the source. Ship only what you need.</h3><p>Drop files → catalogue originals → prepare exports → select for a build.</p></div><a href="#assets" class="text-link">See asset workflow →</a></section>`;
}
function workspace(key) {
  const data = {
    game: [
      "01 / GAME DEVELOPMENT",
      "Retro Wave Game",
      "Step into the world you’re building.",
      "First-person exploration, eerie corridors and neon comic visuals. This page launches a separately running build; the game itself has not been built yet.",
      [
        "Windows · keyboard + mouse",
        "Mobile · touch controls",
        "Small-room prototype first",
      ],
    ],
    photo: [
      "02 / IMAGE CREATION",
      "Photo to Game",
      "Turn source images into a visual direction.",
      "Connect your existing photo-to-game tool here. It runs separately from the dashboard, keeping processing and updates independent.",
      [
        "Existing tool, separate project",
        "Launch in a new tab",
        "Bring chosen exports into Drop Zone",
      ],
    ],
    audio: [
      "04 / SOUND DESIGN",
      "Audio Workshop",
      "Give your world a voice.",
      "Reserved for your later audio tool. This page is ready to link to it when available; audio generation and editing are not implemented here.",
      ["Sound effects", "Music and atmosphere", "Dialogue and narration"],
    ],
  }[key];
  return `<section class="page-heading"><span class="eyebrow">${data[0]}</span><h1>${data[1]}</h1><p>${data[2]}</p></section><div class="workspace-layout"><section class="panel launch-panel"><span class="big-symbol">${icons[key]}</span><span class="badge">${validUrl(settings[key] || tools[key]?.url) ? "ADDRESS CONFIGURED · NOT HEALTH-CHECKED" : key === "audio" ? "PLANNED" : "LAUNCH ADDRESS NEEDED"}</span><h2>${data[1]}</h2><p>${data[3]}</p><div class="actions">${launch(key)}${tools[key]?.repo ? link(tools[key].repo, "View repository") : ""}</div></section><aside class="panel"><span class="eyebrow">WORKSPACE NOTES</span><h2>Built to stay independent.</h2><ul class="feature-list">${data[4].map((x) => `<li>${x}</li>`).join("")}</ul><p class="quiet">Local test addresses work on the device running that tool. A phone needs a reachable LAN or hosted address.</p><a class="text-link" href="#settings">Configure connections →</a></aside></div>`;
}
function assets() {
  return `<section class="page-heading"><span class="eyebrow">03 / ASSET LIBRARY</span><h1>The Drop Zone<span class="title-dot">.</span></h1><p>Originals stay archived. Selected exports travel light.</p></section><div class="stats"><div><strong>${catalog.assets.length}</strong><span>Catalogued assets</span></div><div><strong>${catalog.assets.reduce((n, a) => n + (a.exports?.length || 0), 0)}</strong><span>Prepared exports</span></div><div><strong>3</strong><span>Separate repositories</span></div></div><section class="panel"><div class="section-head"><div><h2>Asset catalogue</h2><p class="quiet">${escape(catalogOrigin)}${catalogError ? " · " + escape(catalogError) : ""}</p></div><div class="actions">${link(repo + "the-drop-zone", "Open repository")}<label class="button secondary file-label">Load catalogue<input id="catalog-file" type="file" accept=".json,application/json"></label></div></div><div class="filters"><label class="search">Search assets<input id="asset-search" type="search" placeholder="Name, category or tag…"></label><label>Category<select id="asset-category"><option value="">All categories</option>${["textures", "models", "shaders", "audio", "hdri", "sprites", "animations", "backgrounds", "blueprints", "text", "fonts", "references", "packages"].map((x) => `<option>${x}</option>`).join("")}</select></label></div><div id="asset-results"></div></section><section class="workflow"><article><b>01</b><h3>Drop</h3><p>Copy source files into <code>inbox/</code> in your local Drop Zone clone.</p></article><article><b>02</b><h3>Archive</h3><p>The pipeline preserves originals, records checksums and indexes metadata.</p></article><article><b>03</b><h3>Prepare</h3><p>Create an optimised export and explicitly mark its destination.</p></article><article><b>04</b><h3>Sync</h3><p>Only selected exports enter the dashboard or game. No raw asset downloads.</p></article></section><p class="quiet">Loading a catalogue only changes this browser view. It does not upload, archive or modify files. Use GitHub Desktop and the pipeline scripts for file operations.</p>`;
}
function preferences() {
  return `<section class="page-heading"><span class="eyebrow">STUDIO / PREFERENCES</span><h1>Make it your workspace.</h1><p>Connections and display preferences stay in this browser.</p></section><form id="settings-form" class="panel settings-form"><h2>Tool launch addresses</h2><p class="quiet">Use the address of a running web tool or hosted build, not its GitHub code page. Blank entries remain unconnected.</p>${["game", "photo", "audio"].map((k) => `<label>${pages[k]}<input name="${k}" type="url" placeholder="http://localhost:8001/" value="${escape(settings[k])}"></label>`).join("")}<div class="setting-row"><div><h2>Symbol rain</h2><p class="quiet">A subtle animated layer behind the studio. Respects reduced-motion settings.</p></div><label class="toggle"><input type="checkbox" name="rain" ${settings.rain ? "checked" : ""}> Enable</label></div><label>Accent palette<select name="theme"><option value="emerald" ${settings.theme === "emerald" ? "selected" : ""}>Emerald Grid</option><option value="violet" ${settings.theme === "violet" ? "selected" : ""}>Neon Violet</option></select></label><div class="actions"><button class="button primary" type="submit">Save preferences</button><button class="button secondary" type="button" id="reset-settings">Reset</button></div></form>`;
}
function renderResults() {
  const area = $("#asset-results");
  if (!area) return;
  const term = $("#asset-search").value.toLowerCase(),
    cat = $("#asset-category").value;
  const rows = catalog.assets.filter(
    (a) =>
      (!cat || a.category === cat) &&
      `${a.name} ${a.category} ${(a.tags || []).join(" ")}`
        .toLowerCase()
        .includes(term),
  );
  area.innerHTML = rows.length
    ? `<div class="asset-list">${rows.map((a) => `<article class="asset-row"><span class="asset-glyph">▧</span><div><h3>${escape(a.name)}</h3><p>${escape(a.category)} · ${escape(a.id)} · ${((a.bytes || 0) / 1048576).toFixed(2)} MB</p></div><span class="badge">${a.exports?.length ? "EXPORT PREPARED" : "SOURCE ARCHIVED"}</span></article>`).join("")}</div>`
    : `<div class="empty"><span>▱</span><h3>${catalog.assets.length ? "No matching assets" : "Your next idea belongs here."}</h3><p>${catalog.assets.length ? "Try another category or search." : "The catalogue is empty. Drop your first files into the repository, run the pipeline, then load its catalogue here."}</p></div>`;
}
function validateCatalog(data) {
  if (
    data?.schemaVersion !== 1 ||
    !Array.isArray(data.assets) ||
    data.assets.length > 10000
  )
    throw Error("Expected a version 1 catalogue with up to 10,000 assets.");
  for (const a of data.assets) {
    if (
      !a ||
      typeof a.id !== "string" ||
      typeof a.name !== "string" ||
      typeof a.category !== "string" ||
      !Number.isFinite(a.bytes) ||
      a.bytes < 0 ||
      (a.tags && !Array.isArray(a.tags)) ||
      (a.exports && !Array.isArray(a.exports))
    )
      throw Error("Invalid asset record.");
  }
  return data;
}
function render() {
  const current = route();
  document.title = pages[current] + " — Seumas & Lewis";
  document.documentElement.dataset.theme =
    settings.theme === "violet" ? "violet" : "emerald";
  $("#app").innerHTML =
    `<aside class="sidebar"><a href="#home" class="brand"><span class="brand-mark">SL<span>✦</span></span><span>SEUMAS<br><span class="brand-sub">& LEWIS</span></span></a><span class="nav-label">THE STUDIO</span><nav aria-label="Studio pages">${Object.entries(
      pages,
    )
      .map(
        ([k, v]) =>
          `<a href="#${k}" ${k === current ? 'aria-current="page"' : ""}><span class="nav-icon">${icons[k]}</span>${v}${k === "audio" ? '<span class="soon">SOON</span>' : ""}</a>`,
      )
      .join(
        "",
      )}</nav><div class="sidebar-bottom"><span class="dot"></span> BUILD SOMETHING ORIGINAL<p>Independent tools.<br>One creative home.</p>${link(repo + "seumas-lewis-dashboard", "Dashboard repository", "repo-link")}</div></aside><div class="content"><header class="topbar"><div><span class="quiet">Studio</span><span class="crumb">/</span>${pages[current]}</div><div class="top-actions"><span class="dev-pill">DEVELOPMENT</span><button id="rain-toggle" class="icon-button" aria-pressed="${settings.rain}" aria-label="Toggle symbol rain">Rain ${settings.rain ? "on" : "off"}</button></div></header><main id="main" tabindex="-1">${current === "home" ? overview() : current === "assets" ? assets() : current === "settings" ? preferences() : workspace(current)}</main><footer>SEUMAS & LEWIS <span>CREATIVE TOOLS / ORIGINAL WORLDS</span></footer></div>`;
  $("#rain-toggle").onclick = () => {
    settings.rain = !settings.rain;
    save();
    render();
    updateRain();
  };
  if (current === "settings") {
    $("#settings-form").onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      for (const k of ["game", "photo", "audio"]) {
        const v = String(f.get(k) || "").trim();
        if (v && !validUrl(v)) {
          toast("Use an HTTP or HTTPS address without credentials.");
          return;
        }
        settings[k] = v;
      }
      settings.rain = f.has("rain");
      settings.theme = f.get("theme");
      const ok = save();
      render();
      updateRain();
      if (ok) toast("Preferences saved.");
    };
    $("#reset-settings").onclick = () => {
      settings = { ...defaults };
      save();
      render();
      updateRain();
      toast("Preferences reset.");
    };
  }
  if (current === "assets") {
    renderResults();
    $("#asset-search").oninput = renderResults;
    $("#asset-category").onchange = renderResults;
    $("#catalog-file").onchange = async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        if (f.size > 10 * 1024 * 1024)
          throw Error("Catalogue must be under 10 MB.");
        catalog = validateCatalog(JSON.parse(await f.text()));
        catalogOrigin = "Loaded: " + f.name;
        catalogError = "";
        render();
        toast("Catalogue loaded for this session.");
      } catch (err) {
        toast("Could not load catalogue: " + err.message);
      }
    };
  }
}
const updateRain = startRain($("#rain"), () => settings.rain);
addEventListener("hashchange", () => {
  render();
  $("#main").focus({ preventScroll: true });
  scrollTo(0, 0);
});
render();
Promise.allSettled([
  fetch("./public/data/tools.json")
    .then((r) => {
      if (!r.ok) throw Error();
      return r.json();
    })
    .then((d) => (tools = d)),
  fetch("./public/data/catalog.json")
    .then((r) => {
      if (!r.ok) throw Error();
      return r.json();
    })
    .then((d) => (catalog = validateCatalog(d))),
]).then((results) => {
  if (results[1].status === "rejected")
    catalogError = "Catalogue unavailable; load one manually";
  render();
});
