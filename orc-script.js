"use strict";

const TMDB_KEY  = "5622cafbfe8f8cfe358a29c53e19bba0";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_W500  = "https://image.tmdb.org/t/p/w500";
const IMG_W45   = "https://image.tmdb.org/t/p/w45";
const IMG_ORIG  = "https://image.tmdb.org/t/p/original";
const IMG_W780  = "https://image.tmdb.org/t/p/w780";
const BRAND     = "Osiris Watch";
const ACCENT     = "ffffff";

const PROVIDERS = [
  { id: "vidking", name: "VidKing",
    movie: id => `https://www.vidking.net/embed/movie/${id}?color=${ACCENT}&autoPlay=true`,
    tv: (id, s, e) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}?color=${ACCENT}&autoPlay=true&nextEpisode=true&episodeSelector=true` },
  { id: "vidsrc", name: "VidSrc",
    movie: id => `https://vidsrc-embed.ru/embed/movie/${id}?autoplay=1`,
    tv: (id, s, e) => `https://vidsrc-embed.ru/embed/tv/${id}/${s}/${e}?autoplay=1` },
  { id: "vidsrc2", name: "VidSrc 2",
    movie: id => `https://vidsrc-embed.su/embed/movie/${id}?autoplay=1`,
    tv: (id, s, e) => `https://vidsrc-embed.su/embed/tv/${id}/${s}/${e}?autoplay=1` },
  { id: "111movies", name: "111Movies",
    movie: id => `https://111movies.com/movie/${id}`,
    tv: (id, s, e) => `https://111movies.com/tv/${id}/${s}/${e}` },
  { id: "cinesrc", name: "CineSrc",
    movie: id => `https://cinesrc.st/embed/movie/${id}?color=%23${ACCENT}&autoplay=true`,
    tv: (id, s, e) => `https://cinesrc.st/embed/tv/${id}?s=${s}&e=${e}&color=%23${ACCENT}&autoplay=true` },
];

const PLAYER_HOSTS = [
  "vidking.net", "www.vidking.net",
  "vidsrc-embed.ru", "vidsrc-embed.su", "vidsrcme.su", "vsrc.su",
  "v2.vidsrc.me", "vidsrc.me",
  "111movies.com", "www.111movies.com",
  "cinesrc.st", "www.cinesrc.st",
];

const GENRES = [
  { name: "Action", id: 28 }, { name: "Comedy", id: 35 }, { name: "Horror", id: 27 },
  { name: "Sci-Fi", id: 878 }, { name: "Romance", id: 10749 }, { name: "Drama", id: 18 },
  { name: "Thriller", id: 53 }, { name: "Animation", id: 16 },
];

const ICONS = {
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/></svg>`,
  film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 10h4M3 14h4M17 10h4M17 14h4"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M8 22h8M12 19v3"/></svg>`,
  trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-9"/><path d="M14 6h7v7"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L19 7"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>`,
  clapper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function dedupeItems(items) {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  return items.filter(item => {
    if (!item || !item.id) return false;
    const type = item.media_type || (item.title ? "movie" : "tv");
    const key = `${type}_${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function safeSetItem(key, val) {
  try { localStorage.setItem(key, val); return true; }
  catch { return false; }
}

function prefersReducedMotion() {
  return SETTINGS?.get?.(SETTINGS.reduceMotionKey) === "1"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let modalReturnFocus = null;

function trapModalFocus(modal, label = "Dialog") {
  modalReturnFocus = document.activeElement;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", label);
  requestAnimationFrame(() => modal.querySelector(".modal-close")?.focus());
}

function releaseModalFocus() {
  if (modalReturnFocus?.focus) modalReturnFocus.focus();
  modalReturnFocus = null;
}

const _tmdbCache = new Map();
function tmdb(path) {
  if (_tmdbCache.has(path)) return _tmdbCache.get(path);
  const req = (async () => {
    const sep = path.includes("?") ? "&" : "?";
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(`${TMDB_BASE}${path}${sep}api_key=${TMDB_KEY}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`TMDB ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  })();
  req.catch(() => _tmdbCache.delete(path));
  _tmdbCache.set(path, req);
  return req;
}

function posterUrl(p) { return p ? `${IMG_W500}${p}` : null; }
function year(d) { return d ? d.slice(0, 4) : ""; }
function formatRuntime(m) {
  if (!m) return "";
  const h = Math.floor(m / 60), r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
}
function fmtMoney(n) {
  if (!n) return "";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${Math.round(n / 1e6)}M`;
  return `$${n.toLocaleString()}`;
}
function pickTrailer(videos) {
  const list = videos?.results || videos || [];
  return list.find(v => v.type === "Trailer" && v.site === "YouTube") || list.find(v => v.site === "YouTube");
}
function genreTags(genres, type) {
  return (genres || []).map(g =>
    `<a href="/search?type=${type}&genre=${g.id}" class="tag tag-link">${esc(g.name)}</a>`
  ).join("");
}
function renderWatchProviders(container, providers, country = "US") {
  if (!container) return;
  const reg = providers?.results?.[country];
  if (!reg) { container.innerHTML = ""; container.style.display = "none"; return; }
  const seen = new Set();
  const items = [...(reg.flatrate || []), ...(reg.rent || []), ...(reg.buy || [])].filter(p => {
    if (seen.has(p.provider_id)) return false;
    seen.add(p.provider_id);
    return p.logo_path;
  }).slice(0, 10);
  if (!items.length) { container.style.display = "none"; return; }
  container.style.display = "";
  container.innerHTML = `<div class="watch-providers"><span class="wp-label">Also on</span><div class="wp-logos">${items.map(p =>
    `<img src="${esc(IMG_W45 + (p.logo_path || ""))}" alt="${esc(p.provider_name)}" title="${esc(p.provider_name)}" loading="lazy"/>`
  ).join("")}</div></div>`;
}
const PINNED_SIDEBAR_PAGES = new Set(["settings", "dmca", "search"]);

function renderKeywords(container, keywords, type) {
  if (!container) return;
  const list = keywords?.keywords || keywords?.results || [];
  if (!list.length) { container.innerHTML = ""; container.style.display = "none"; return; }
  container.style.display = "";
  container.innerHTML = `
    <div class="detail-extra-block">
      <h3 class="detail-extra-label">Keywords</h3>
      <div class="keywords-row">${list.slice(0, 10).map(k =>
        `<a href="/search?type=${type}&q=${encodeURIComponent(k.name)}" class="keyword-pill">${esc(k.name)}</a>`
      ).join("")}</div>
    </div>`;
}
function renderCastRow(cast) {
  const section = $("#cast-section");
  const row = $("#cast-row");
  if (!section || !row || !cast.length) return;
  section.style.display = "";
  row.innerHTML = "";
  cast.forEach(a => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "cast-item";
    d.setAttribute("aria-label", `${a.name}${a.character ? `, as ${a.character}` : ""}`);
    d.innerHTML = `${a.profile_path ? `<img src="${esc(IMG_W500 + a.profile_path)}" alt="" loading="lazy" draggable="false"/>` : `<div class="cast-placeholder"></div>`}<div class="name" title="${esc(a.name)}">${esc(a.name)}</div><div class="role" title="${esc(a.character || "")}">${esc(a.character || "")}</div>`;
    d.addEventListener("click", () => openPersonModal(a.id));
    row.appendChild(d);
  });
}
function renderCardRow(sectionSel, rowSel, items, type) {
  const section = $(sectionSel);
  const row = $(rowSel);
  if (!section || !row || !items.length) return;
  section.style.display = "";
  row.innerHTML = "";
  items.forEach(it => row.appendChild(buildCard(it, type)));
}
function ensureRecommendSection() {
  let sec = $("#recommend-section");
  if (sec) return sec.querySelector(".similar-row");
  sec = document.createElement("section");
  sec.id = "recommend-section";
  sec.style.display = "none";
  sec.innerHTML = `<h2 class="section-head">Recommended For You</h2><div class="similar-row" id="recommend-row"></div>`;
  $("#similar-section")?.before(sec);
  return sec.querySelector(".similar-row");
}
function hostAfter(el, id) {
  let node = $(`#${id}`);
  if (!node && el) {
    node = document.createElement("div");
    node.id = id;
    el.after(node);
  }
  return node;
}
async function openPersonModal(id) {
  let modal = $("#person-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "person-modal";
    modal.className = "modal-overlay person-modal";
    modal.innerHTML = `<button class="modal-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="modal-box"><div class="spinner" style="margin:40px auto"></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector(".modal-close").addEventListener("click", closePersonModal);
    modal.addEventListener("click", e => { if (e.target === modal) closePersonModal(); });
  }
  const box = modal.querySelector(".modal-box");
  box.innerHTML = `<div class="spinner" style="margin:40px auto"></div>`;
  modal.classList.add("open");
  trapModalFocus(modal, "Cast member");
  try {
    const p = await tmdb(`/person/${id}?append_to_response=combined_credits`);
    const credits = (p.combined_credits?.cast || []).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 12);
    box.innerHTML = `
      <div class="person-head">
        ${p.profile_path ? `<img src="${esc(IMG_W500 + p.profile_path)}" alt=""/>` : `<div class="person-ph"></div>`}
        <div>
          <h2>${esc(p.name)}</h2>
          <p>${esc(p.known_for_department || "")}${p.place_of_birth ? ` · ${esc(p.place_of_birth)}` : ""}</p>
        </div>
      </div>
      ${p.biography ? `<p style="font-size:0.82rem;color:var(--text-muted);line-height:1.55;margin-bottom:16px">${esc(p.biography.slice(0, 280))}${p.biography.length > 280 ? "…" : ""}</p>` : ""}
      <div class="person-credits">
        <h3>Known for</h3>
        <div class="person-credit-list">${credits.map(c => {
          const kind = c.media_type === "tv" ? "tv" : "movie";
          const href = kind === "tv" ? `/tv?id=${c.id}` : `/movie?id=${c.id}`;
          const title = c.title || c.name || "Untitled";
          return `<a href="${href}"><span>${esc(title)}</span><span>${year(c.release_date || c.first_air_date)}</span></a>`;
        }).join("")}</div>
      </div>`;
  } catch {
    box.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:24px">Couldn't load this profile.</p>`;
  }
}
function closePersonModal() {
  $("#person-modal")?.classList.remove("open");
  releaseModalFocus();
}
function esc(s = "") {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function fmtVotes(n) {
  if (!n) return "";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k votes` : `${n} votes`;
}

function mediaType(item, fallback = "movie") {
  if (item._type) return item._type;
  const mt = item.media_type;
  if (mt === "tv" || mt === "movie") return mt;
  if (item.title) return "movie";
  if (item.name) return "tv";
  return fallback;
}

function homeUrl() {
  return "/";
}

function getProvider() { return localStorage.getItem("orc_provider") || PROVIDERS[0].id; }
function setProvider(id) { safeSetItem("orc_provider", id); }

const SETTINGS = {
  accentKey: "orc_accent",
  reduceMotionKey: "orc_reduce_motion",
  hideWatchedKey: "orc_hide_watched",
  autoplayTrailersKey: "orc_autoplay_trailers",
  prefLangKey: "orc_pref_lang",
  layoutKey: "orc_grid_layout",
  themeKey: "orc_theme",
  get(k, def = "") { return localStorage.getItem(k) ?? def; },
  set(k, v) {
    if (!safeSetItem(k, v)) toast("Couldn't save setting. Storage may be full.");
  },
  toggle(k) {
    const on = localStorage.getItem(k) === "1";
    if (!safeSetItem(k, on ? "0" : "1")) toast("Couldn't save setting. Storage may be full.");
    return !on;
  },
};

const ACCENT_COLORS = [
  { id: "5b99fc", label: "Default" },
  { id: "ffffff", label: "White" },
  { id: "7c5cff", label: "Violet" },
  { id: "3b82f6", label: "Blue" },
  { id: "ef4444", label: "Red" },
  { id: "22c55e", label: "Green" },
  { id: "f97316", label: "Orange" },
  { id: "ec4899", label: "Pink" },
  { id: "06b6d4", label: "Cyan" },
];

function getAccentHex() {
  let hex = SETTINGS.get(SETTINGS.accentKey, ACCENT) || ACCENT;
  hex = String(hex).replace("#", "");
  return /^[0-9a-fA-F]{6}$/.test(hex) ? hex : ACCENT;
}

function applyGlobalSettings() {
  let hex = SETTINGS.get(SETTINGS.accentKey, ACCENT) || ACCENT;
  hex = String(hex).replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) hex = ACCENT;
  document.documentElement.style.setProperty("--accent", `#${hex}`);
  document.documentElement.style.setProperty("--accent-dim", `color-mix(in srgb, #${hex} 78%, #000)`);
  document.documentElement.style.setProperty("--accent-soft", `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, 0.14)`);

  const themePref = SETTINGS.get(SETTINGS.themeKey, "dark") === "light" ? "light" : "dark";
  const rootEl = document.documentElement;
  rootEl.setAttribute("data-theme", themePref);
  rootEl.style.colorScheme = themePref;
  const themeColor = themePref === "light" ? "#f6f6f8" : "#0b0b0d";
  document.querySelectorAll('meta[name="theme-color"]').forEach((m, i) => {
    if (i === 0) { m.removeAttribute("media"); m.setAttribute("content", themeColor); } else { m.remove(); }
  });

  rootEl.classList.toggle("reduce-motion", SETTINGS.get(SETTINGS.reduceMotionKey) === "1");
  rootEl.classList.toggle("grid-backdrop-mode", SETTINGS.get(SETTINGS.layoutKey) === "1");
}

function skeletons(count = 12) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "media-card skeleton-card";
    el.innerHTML = `
      <div class="card-poster-wrap skeleton"></div>
      <div class="skeleton-line skeleton-title skeleton"></div>
      <div class="skeleton-line skeleton-sub skeleton"></div>
    `;
    arr.push(el);
  }
  return arr;
}
function providerUrl(type, id, s, e) {
  const p = PROVIDERS.find(x => x.id === getProvider()) || PROVIDERS[0];
  let url = type === "tv" ? p.tv(id, s, e) : p.movie(id);
  if (p.id === "vidking") url = url.replace(/color=[0-9a-fA-F]+/i, `color=${getAccentHex()}`);
  if (p.id === "cinesrc") url = url.replace(/color=%23[0-9a-fA-F]{6}/i, `color=%23${getAccentHex()}`);
  return url;
}

function isAllowedPlayerUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return PLAYER_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function createPlayerIframe(src) {
  if (!isAllowedPlayerUrl(src)) return null;
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = "Video player";
  iframe.allowFullscreen = true;
  iframe.setAttribute("allowfullscreen", "true");
  iframe.setAttribute("webkitallowfullscreen", "true");
  iframe.setAttribute("mozallowfullscreen", "true");
  iframe.setAttribute("allow", "autoplay *; fullscreen *; encrypted-media *; picture-in-picture *; accelerometer *; gyroscope *; display-capture *");
  return iframe;
}

function isPlayerFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

function togglePlayerFullscreen() {
  const frame = $("#player-frame");
  const iframe = frame?.querySelector("iframe");
  const target = iframe || frame;
  if (!target) return;

  if (isPlayerFullscreen()) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  } else {
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {
        if (frame && frame.requestFullscreen) frame.requestFullscreen().catch(() => {});
      });
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    } else if (target.mozRequestFullScreen) {
      target.mozRequestFullScreen();
    } else if (target.msRequestFullscreen) {
      target.msRequestFullscreen();
    } else if (frame && frame.requestFullscreen) {
      frame.requestFullscreen();
    } else if (frame && frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    }
  }
}

function loadPlayerFrame(frameEl, url) {
  if (!frameEl) return;
  frameEl.innerHTML = `<div class="spinner player-loading" style="position:absolute;top:50%;left:50%;margin:-18px 0 0 -18px" aria-hidden="true"></div>`;
  const iframe = createPlayerIframe(url);
  if (!iframe) {
    frameEl.innerHTML = `<p style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.85rem;padding:20px;text-align:center">Could not load this stream source.</p>`;
    return;
  }
  const clearLoading = () => frameEl.querySelector(".player-loading")?.remove();
  const failTimer = setTimeout(() => {
    clearLoading();
    if (!frameEl.querySelector(".player-fallback-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "player-fallback-overlay";
      overlay.innerHTML = `
        <p>Stream source taking too long or blocked by provider?</p>
        <button type="button" class="player-fallback-btn" id="fallback-switch-btn">Switch Stream Provider</button>
      `;
      overlay.querySelector("#fallback-switch-btn")?.addEventListener("click", () => {
        overlay.remove();
        const cur = getProvider();
        const idx = PROVIDERS.findIndex(p => p.id === cur);
        const next = PROVIDERS[(idx + 1) % PROVIDERS.length];
        setProvider(next.id);
        $$(".provider-tab").forEach(b => b.classList.remove("active"));
        toast(`Switched to ${next.name}`);
        const type = $("#ep-block") ? "tv" : "movie";
        const id = new URLSearchParams(location.search).get("id");
        if (type === "tv") {
          const s = $("#season-select")?.value || 1;
          const epOn = $(".ep-row.on")?.dataset.ep || 1;
          loadPlayerFrame(frameEl, providerUrl("tv", id, s, epOn));
        } else {
          loadPlayerFrame(frameEl, providerUrl("movie", id));
        }
      });
      frameEl.appendChild(overlay);
    }
  }, 10000);

  iframe.addEventListener("load", () => { clearTimeout(failTimer); clearLoading(); });
  frameEl.appendChild(iframe);
}

let playerGuardReady = false;

function initPlayerGuard() {
  if (playerGuardReady) return;
  playerGuardReady = true;

  document.addEventListener("auxclick", e => {
    if (PAGE !== "movie" && PAGE !== "tv") return;
    if (e.button === 1 && $("#player-frame iframe")) e.preventDefault();
  }, true);

  const lockUrl = location.href;
  window.addEventListener("blur", () => {
    if (isPlayerFullscreen() || !$("#player-frame iframe")) return;
    window.__orcBlurAt = Date.now();
  });
  window.addEventListener("focus", () => {
    if (!window.__orcBlurAt || isPlayerFullscreen()) return;
    if (Date.now() - window.__orcBlurAt < 800 && location.href !== lockUrl) {
      history.replaceState(null, "", lockUrl);
    }
    window.__orcBlurAt = 0;
  });
}

const MyList = {
  key: "orc_mylist",
  get() { try { return JSON.parse(localStorage.getItem(this.key) || "[]"); } catch { return []; } },
  has(id, t) { return this.get().some(i => i.id === id && i.type === t); },
  toggle(item) {
    const list = this.get();
    const i = list.findIndex(x => x.id === item.id && x.type === item.type);
    if (i >= 0) {
      list.splice(i, 1);
      if (!safeSetItem(this.key, JSON.stringify(list))) toast("Couldn't update My List. Storage may be full.");
      return false;
    }
    list.unshift(item);
    if (!safeSetItem(this.key, JSON.stringify(list))) toast("Couldn't update My List. Storage may be full.");
    return true;
  },
};

const RecentSearches = {
  key: "orc_recent",
  max: 5,
  get() { try { return JSON.parse(localStorage.getItem(this.key) || "[]"); } catch { return []; } },
  add(q) {
    q = (q || "").trim();
    if (q.length < 2) return;
    const next = [q, ...this.get().filter(x => x.toLowerCase() !== q.toLowerCase())].slice(0, this.max);
    safeSetItem(this.key, JSON.stringify(next));
  },
};

const Progress = {
  key: "orc_progress",
  get() { try { return JSON.parse(localStorage.getItem(this.key) || "{}"); } catch { return {}; } },
  getAll() {
    return Object.values(this.get()).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  },
  getItem(id, type) { return this.get()[`${type}_${id}`]; },
  save(id, type, data) {
    const all = this.get();
    all[`${type}_${id}`] = { ...data, savedAt: Date.now() };
    safeSetItem(this.key, JSON.stringify(all));
  },
};

window.addEventListener("message", e => {
  try {
    let originHost = "";
    try { originHost = new URL(e.origin).hostname.toLowerCase(); } catch { return; }
    if (!PLAYER_HOSTS.some(h => originHost === h || originHost.endsWith(`.${h}`))) return;
    if (typeof e.data !== "string") return;
    const msg = JSON.parse(e.data);
    if (msg.type !== "PLAYER_EVENT" || !msg.data?.id) return;
    const d = msg.data;
    const dur = d.duration || 0;
    const watched = d.currentTime ?? (dur * (d.progress / 100));
    if (dur > 0 && watched >= 10 && d.progress > 1 && d.progress < 98) {
      Progress.save(d.id, d.mediaType || "movie", d);
    }
  } catch (_) {}
});

let PAGE = "home";

function detectPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if ($("#player-frame") && id) return $("#ep-block") ? "tv" : "movie";
  if ($("#list-grid") || document.body.classList.contains("list-page")) return "list";
  if ($("#main-search-input") || document.body.classList.contains("search-page")) return "search";
  if ($(".settings-body") || document.body.classList.contains("settings-page")) return "settings";
  if ($(".legal-body") || document.body.classList.contains("legal-page")) return "dmca";
  if ($("#categories") || $("#hero-title") || $("#splash-screen")) return "home";

  const seg = (location.pathname.split("/").pop() || "").replace(/\.html$/i, "").toLowerCase();
  const bySeg = { movie: "movie", tv: "tv", search: "search", list: "list", settings: "settings", dmca: "dmca", index: "home", osiriscinema: "home" };
  if (bySeg[seg]) return bySeg[seg];

  const p = location.pathname.replace(/\/$/, "") || "/";
  if (p === "/movie" || p.endsWith("/movie")) return "movie";
  if (p === "/tv" || p.endsWith("/tv")) return "tv";
  if (p === "/search" || p.endsWith("/search")) return "search";
  if (p === "/list" || p.endsWith("/list")) return "list";
  if (p === "/settings" || p.endsWith("/settings")) return "settings";
  if (p === "/dmca" || p.endsWith("/dmca")) return "dmca";
  return "home";
}

const normPath = p => (p.replace(/\/$/, "") || "/");

const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
const isMobile = () => matchMedia("(max-width: 768px)").matches;

let ACTIVE_NAV = "home";
function initMobileUI(active) {
  document.documentElement.classList.toggle("is-touch", isTouch());
  ACTIVE_NAV = active || ACTIVE_NAV;
  buildMobilePillNav(ACTIVE_NAV);
  if (!window._pillNavBound) {
    window._pillNavBound = true;
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => buildMobilePillNav(ACTIVE_NAV), 200);
    }, { passive: true });
  }
}

function buildMobilePillNav(active) {
  const existing = $("#mobile-pill-nav");
  if (!isMobile()) { if (existing) existing.remove(); return; }
  const items = [
    { href: homeUrl(), label: "Home", icon: ICONS.home, key: "home" },
    { href: "/search", label: "Browse", icon: ICONS.tv, key: "search" },
    { href: "/list", label: "My List", icon: ICONS.list, key: "list" },
    { href: "/settings", label: "Settings", icon: ICONS.settings, key: "settings" },
  ];
  const nav = existing || document.createElement("nav");
  nav.id = "mobile-pill-nav";
  nav.className = "mobile-pill-nav lg-surface";
  nav.setAttribute("aria-label", "Primary");
  nav.innerHTML = items.map(it => `
    <a href="${it.href}" class="pill-nav-item${active === it.key ? " active" : ""}" aria-label="${it.label}"${active === it.key ? ' aria-current="page"' : ""}>
      <span class="pill-nav-ico">${it.icon}</span>
    </a>`).join("");
  if (!existing) document.body.appendChild(nav);
  if (!nav._lg) {
    nav._lg = true;
    LiquidGlass.apply(nav, { borderRadius: 34, distortionScale: -110, blur: 9, brightness: 58, opacity: 0.9, saturation: 1.55 });
  }
}

function initSidebar(active) {
  const el = $("#topnav") || $("#sidebar");
  if (!el) return;

  const link = (href, label, act) =>
    `<a href="${href}" class="topnav-link${act ? " active" : ""}">${label}</a>`;

  el.className = "topnav";
  el.id = "topnav";
  el.innerHTML = `
    <div class="topnav-inner">
      <a href="${homeUrl()}" class="topnav-logo" aria-label="Osiris Watch home">
        <span class="topnav-word">Osiris<i>Watch</i></span>
      </a>
      <nav class="topnav-links" aria-label="Primary">
        ${link(homeUrl(), "Home", active === "home")}
        ${link("/search?type=movie", "Movies", active === "movies")}
        ${link("/search?type=tv", "Series", active === "tv")}
        ${link("/list", "My List", active === "list")}
        ${link("/settings", "Settings", active === "settings")}
      </nav>
      <div class="topnav-actions">
        <a href="/search" class="topnav-icon${active === "search" ? " active" : ""}" aria-label="Search">${ICONS.search}</a>
        <a href="https://discord.gg/yv8cVk8p4f" target="_blank" rel="noopener" class="topnav-icon" aria-label="Discord">${ICONS.discord}</a>
        <button type="button" class="topnav-burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>`;

  const burger = el.querySelector(".topnav-burger");
  burger?.addEventListener("click", e => {
    e.stopPropagation();
    const open = el.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  el.querySelectorAll(".topnav-link").forEach(a =>
    a.addEventListener("click", () => el.classList.remove("nav-open"))
  );
  document.addEventListener("click", e => {
    if (el.classList.contains("nav-open") && !el.contains(e.target)) el.classList.remove("nav-open");
  });

  if (!el._scrollBound) {
    el._scrollBound = true;
    const onScroll = () => el.classList.toggle("scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (!el._lg) {
    el._lg = true;
    LiquidGlass.apply(el, { id: "lg-topnav", inline: false, noClass: true, borderRadius: 0, distortionScale: -60, blur: 9, brightness: 58, opacity: 0.9 });
  }

  initMobileUI(active);
}

function initSidebarDock() {
  if (isMobile()) return;
  document.body.classList.add("sidebar-dock");
  if ($("#sidebar-edge")) return;

  const edge = document.createElement("div");
  edge.id = "sidebar-edge";
  edge.setAttribute("tabindex", "0");
  edge.setAttribute("role", "button");
  edge.setAttribute("aria-label", "Open navigation menu");
  document.body.appendChild(edge);

  const sidebar = $("#sidebar");
  let closeTimer;

  const open = () => {
    clearTimeout(closeTimer);
    document.body.classList.add("sidebar-open");
  };
  const scheduleClose = () => {
    if (document.body.classList.contains("sidebar-pinned")) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!edge.matches(":hover") && !sidebar?.matches(":hover")) {
        document.body.classList.remove("sidebar-open");
      }
    }, 450);
  };

  edge.addEventListener("mouseenter", open);
  edge.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
      sidebar?.querySelector("a")?.focus();
    }
  });
  sidebar?.addEventListener("mouseenter", open);
  sidebar?.addEventListener("mouseleave", scheduleClose);
  edge.addEventListener("mouseleave", scheduleClose);
  document.addEventListener("mousemove", e => {
    if (e.clientX <= 28) open();
    else if (e.clientX > 110 && document.body.classList.contains("sidebar-open")) scheduleClose();
  }, { passive: true });
}

function toast(msg) {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.setAttribute("aria-live", "polite");
    document.body.appendChild(t);
  }
  t.classList.toggle("toast-mobile", isMobile());
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2400);
}

async function sharePageLink(title) {
  const url = location.href;
  if (navigator.share && isMobile()) {
    try {
      await navigator.share({ title: title || document.title, url });
      return;
    } catch (_) {}
  }
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  } catch {
    toast("Could not copy link");
  }
}

function resumeLabel(prog) {
  if (!prog || prog.progress < 5 || prog.progress >= 98) return "";
  return `Resume · ${Math.round(prog.progress)}% watched`;
}

function initBackToTop() {
  if ($("#back-top")) return;
  const btn = document.createElement("button");
  btn.id = "back-top";
  btn.type = "button";
  btn.className = "back-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19V5M5 12l7-7 7 7"/></svg>`;
  document.body.appendChild(btn);
  LiquidGlass.apply(btn, { borderRadius: 22, distortionScale: -80, blur: 8, brightness: 60, opacity: 0.9, saturation: 1.5 });
  const onScroll = () => btn.classList.toggle("visible", window.scrollY > 480);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "auto" }));
}

function initGlobalShortcuts() {
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeTrailer();
      closePersonModal();
      closePopup();
      return;
    }
    if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) return;
      e.preventDefault();
      location.href = "/search";
    }
  });
}

function initRowDrag(track) {
  if (!track || track.dataset.dragReady || isTouch()) return;
  track.dataset.dragReady = "1";
  let active = false;
  let moved = false;
  let startX = 0;
  let scrollStart = 0;

  track.addEventListener("mousedown", e => {
    if (e.button !== 0 || e.target.closest("button, a")) return;
    active = true;
    moved = false;
    startX = e.pageX;
    scrollStart = track.scrollLeft;
    track.classList.add("is-dragging");
  });
  window.addEventListener("mousemove", e => {
    if (!active) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = scrollStart - dx;
  });
  const end = () => {
    if (!active) return;
    active = false;
    track.classList.remove("is-dragging");
    if (moved) track._dragBlockClick = Date.now();
  };
  window.addEventListener("mouseup", end);
  track.addEventListener("click", e => {
    if (track._dragBlockClick && Date.now() - track._dragBlockClick < 200) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

function initRowKeyboard(track) {
  if (!track || track.dataset.kbReady) return;
  track.dataset.kbReady = "1";
  track.setAttribute("tabindex", "0");
  track.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = Math.min(track.clientWidth * 0.72, 320);
    track.scrollBy({ left: e.key === "ArrowRight" ? step : -step, behavior: "smooth" });
  });
}

function observeRows() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".row-wrapper").forEach(r => {
    obs.observe(r);
    const track = r.querySelector(".row-track");
    if (track) { initRowDrag(track); initRowKeyboard(track); }
  });
}

function buildCard(item, type = "movie", opts = {}) {
  const id = item.id;
  const kind = mediaType(item, type);
  const title = item.title || item.name || "Untitled";
  const img = posterUrl(item.poster_path);
  const href = kind === "tv" ? `/tv?id=${id}` : `/movie?id=${id}`;
  const saved = MyList.has(id, kind);
  const prog = opts.progressValue ?? Progress.getItem(id, kind)?.progress;
  const watched = prog && prog >= 95;
  const y = year(item.release_date || item.first_air_date);

  const card = document.createElement("div");
  card.className = `media-card${watched && SETTINGS.get(SETTINGS.hideWatchedKey) === "1" ? " is-watched" : ""}`;
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", title);
  card.innerHTML = `
    ${opts.rank ? `<span class="rank">${opts.rank}</span>` : ""}
    ${!opts.rank && Number.isFinite(item.vote_average) && item.vote_average >= 6 ? `<span class="card-rating">★ ${item.vote_average.toFixed(1)}</span>` : ""}
    ${img ? `<img src="${esc(img)}" alt="" loading="lazy" draggable="false" decoding="async" />` : `<div class="no-img-poster">${ICONS.film}<span>${esc(title)}</span></div>`}
    ${prog ? `<div class="progress-bar"><span style="width:${Math.min(prog, 100)}%"></span></div>` : ""}
    <div class="card-quick">
      <button type="button" class="card-icon-btn save-btn${saved ? " saved" : ""}" aria-label="Save">${saved ? ICONS.check : ICONS.plus}</button>
    </div>
    <div class="card-foot">
      <div class="card-foot-title">${esc(title)}</div>
      <div class="card-foot-meta">${y ? `${y} · ` : ""}${kind === "tv" ? "Series" : "Movie"}</div>
    </div>`;

    card.addEventListener("click", e => {
    if (e.target.closest(".save-btn")) return;
    const bg = item.backdrop_path ? `${IMG_ORIG}${item.backdrop_path}` : (posterUrl(item.poster_path) || "");
    navigateWithLoader(href, bg, title);
  });

  card.addEventListener("keydown", e => {
    if (e.target.closest(".save-btn")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const bg = item.backdrop_path ? `${IMG_ORIG}${item.backdrop_path}` : (posterUrl(item.poster_path) || "");
      navigateWithLoader(href, bg, title);
    }
  });

  card.addEventListener("keydown", e => {
    if (e.target.closest(".save-btn")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const bg = item.backdrop_path ? `${IMG_ORIG}${item.backdrop_path}` : (posterUrl(item.poster_path) || "");
      navigateWithLoader(href, bg, title);
    }
  });
  
  card.querySelector(".save-btn").addEventListener("click", e => {
    e.stopPropagation();
    const added = MyList.toggle({ id, type: kind, title, poster: item.poster_path });
    const btn = e.currentTarget;
    btn.classList.toggle("saved", added);
    btn.innerHTML = added ? ICONS.check : ICONS.plus;
    toast(added ? "Added to My List" : "Removed from list");
  });

  let timer;
  if (!isTouch()) {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
      timer = setTimeout(() => showPopup(card, item, kind), 1100);
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
      clearTimeout(timer);
      if (activePopup) {
        setTimeout(() => {
          if (activePopup && !activePopup.matches(":hover")) closePopup();
        }, 150);
      }
    });
  }

  return card;
}

function skeletons(n = 8) {
  return Array.from({ length: n }, () => { const d = document.createElement("div"); d.className = "skeleton-card"; return d; });
}

let activePopup = null;
let popupScrollHandler = null;

function closePopup() {
  if (!activePopup) return;
  activePopup.classList.remove("is-visible");
  activePopup.classList.add("closing");
  const el = activePopup;
  setTimeout(() => el.remove(), 240);
  activePopup = null;
  if (popupScrollHandler) {
    document.removeEventListener("scroll", popupScrollHandler, true);
    popupScrollHandler = null;
  }
}

const OVERVIEW_PREVIEW = 95;

function setPopupOverview(el, text) {
  if (!el) return;
  const full = (text || "No summary available.").trim();
  el.dataset.full = full;
  if (full.length <= OVERVIEW_PREVIEW) {
    el.textContent = full;
    el.classList.remove("truncated", "expanded");
    return;
  }
  el.classList.add("truncated");
  el.classList.remove("expanded");
  el.innerHTML = `${esc(full.slice(0, OVERVIEW_PREVIEW).trim())}… <button type="button" class="pp-more">See more</button>`;
  el.querySelector(".pp-more")?.addEventListener("click", e => {
    e.stopPropagation();
    el.textContent = full;
    el.classList.remove("truncated");
    el.classList.add("expanded");
  });
}

function showPopup(card, item, type) {
  if (isTouch() || isMobile()) return;
  closePopup();
  const id = item.id;
  const kind = mediaType(item, type);
  const title = item.title || item.name || "Untitled";
  const thumb = item.backdrop_path ? `${IMG_W500}${item.backdrop_path}` : posterUrl(item.poster_path);
  const href = kind === "tv" ? `/tv?id=${id}` : `/movie?id=${id}`;
  const saved = MyList.has(id, kind);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "";

  const pop = document.createElement("div");
  pop.className = "card-popup";
  pop.innerHTML = `
    <div class="card-popup-thumb" style="background-image:url(${esc(thumb || "")})"></div>
    <div class="card-popup-body">
      <div class="card-popup-title">${esc(title)}</div>
      <div class="card-popup-meta">${year(item.release_date || item.first_air_date)}${rating ? ` · ★ ${rating}` : ""} · ${kind === "tv" ? "Series" : "Film"}</div>
      <p class="card-popup-overview">${esc(item.overview ? "" : "Loading summary…")}</p>
      <div class="card-popup-actions">
        <button type="button" class="pp-play">Play</button>
        <button type="button" class="pp-save${saved ? " saved" : ""}">${saved ? "Saved" : "Save"}</button>
      </div>
    </div>`;

  const overviewEl = pop.querySelector(".card-popup-overview");
  if (item.overview) setPopupOverview(overviewEl, item.overview);
  else overviewEl.textContent = "Loading summary…";

  const rect = card.getBoundingClientRect();
  const pw = 248;
  let left = rect.left + rect.width / 2 - pw / 2;
  let top = rect.top - 10;
  if (left < 8) left = 8;
  if (left + pw > innerWidth - 8) left = innerWidth - pw - 8;
  if (top < 12) top = rect.bottom + 8;
  if (top + 200 > innerHeight) top = innerHeight - 210;

  pop.style.left = left + "px";
  pop.style.top = top + "px";
  document.body.appendChild(pop);
  requestAnimationFrame(() => pop.classList.add("is-visible"));
  activePopup = pop;

  if (!item.overview) {
    tmdb(`/${kind}/${id}`).then(d => {
      if (activePopup === pop) setPopupOverview(overviewEl, d.overview);
    }).catch(() => {
      if (activePopup === pop) setPopupOverview(overviewEl, "No summary available.");
    });
  }

  pop.querySelector(".pp-play").addEventListener("click", () => { closePopup(); location.href = href; });
  pop.querySelector(".pp-save").addEventListener("click", () => {
    const added = MyList.toggle({ id, type: kind, title, poster: item.poster_path });
    const btn = pop.querySelector(".pp-save");
    btn.classList.toggle("saved", added);
    btn.textContent = added ? "Saved" : "Save";
  });
  pop.addEventListener("mouseenter", () => clearTimeout(pop._closeTimer));
  pop.addEventListener("mouseleave", () => { pop._closeTimer = setTimeout(closePopup, 280); });
  popupScrollHandler = () => closePopup();
  document.addEventListener("scroll", popupScrollHandler, { passive: true, capture: true });
}

function buildRow(title, items, type = "movie", opts = {}) {
  const list = (items || []).filter(i => !i.media_type || i.media_type === "movie" || i.media_type === "tv");
  if (!list.length) return null;
  const wrap = document.createElement("div");
  wrap.className = "row-wrapper";
  if (opts.id) wrap.id = opts.id;
  wrap.innerHTML = `
    <div class="row-header">
      <h2 class="row-title">${esc(title)}</h2>
      ${opts.seeAll ? `<a href="${esc(opts.seeAll)}" class="row-see-all">See all →</a>` : ""}
    </div>
    <div class="row-track-container">
      <button class="row-arrow left" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg></button>
      <div class="row-track"></div>
      <button class="row-arrow right" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg></button>
    </div>`;

  const track = wrap.querySelector(".row-track");
  list.forEach((item, i) => {
    const cardOpts = { ...(opts.cardOpts || {}) };
    if (opts.ranks) cardOpts.rank = i + 1;
    if (item._progress) cardOpts.progressValue = item._progress;
    track.appendChild(buildCard(item, mediaType(item, type), cardOpts));
  });
  initRowDrag(track);
  initRowKeyboard(track);

  const scroll = 480;
  wrap.querySelector(".row-arrow.left").addEventListener("click", () => track.scrollBy({ left: -scroll, behavior: "smooth" }));
  wrap.querySelector(".row-arrow.right").addEventListener("click", () => track.scrollBy({ left: scroll, behavior: "smooth" }));

  if (opts.periodKey) attachPeriodDropdown(wrap, opts);
  return wrap;
}

function attachPeriodDropdown(wrap, opts) {
  const header = wrap.querySelector(".row-header");
  if (!header) return;
  const titleEl = header.querySelector(".row-title");
  if (!titleEl) return;
  const rowTitle = titleEl.textContent.trim();

  titleEl.innerHTML = `${esc(rowTitle)} <span class="row-period-wrap">
    <button type="button" class="row-period-btn" aria-haspopup="listbox">This Week ▾</button>
    <div class="row-period-menu" role="listbox">
      <button type="button" data-period="day" data-path="/trending/all/day">Today</button>
      <button type="button" data-period="week" data-path="/trending/all/week" class="active">This Week</button>
    </div>
  </span>`;

  const btn = titleEl.querySelector(".row-period-btn");
  const menu = titleEl.querySelector(".row-period-menu");
  const track = wrap.querySelector(".row-track");

  btn?.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  menu?.querySelectorAll("button").forEach(opt => {
    opt.addEventListener("click", async e => {
      e.stopPropagation();
      menu.classList.remove("open");
      menu.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      opt.classList.add("active");
      btn.textContent = `${opt.textContent} ▾`;
      track.innerHTML = "";
      skeletons(10).forEach(s => track.appendChild(s));
      try {
        const data = await tmdb(opt.dataset.path);
        track.innerHTML = "";
        (data.results || []).slice(0, 20).forEach((it, i) => track.appendChild(buildCard(it, "movie", { rank: i + 1 })));
      } catch {
        track.innerHTML = "";
      }
    });
  });

  document.addEventListener("click", () => menu?.classList.remove("open"));
}

function scrollToEl(el) {
  if (!el) return;
  const offset = isMobile() ? 70 : 90;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo(0, y);
}

function scrollToSelector(sel) {
  scrollToEl($(sel));
}

function initAnchorScroll() {
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href*='#']");
    if (!a) return;
    const raw = a.getAttribute("href") || "";
    const hash = raw.split("#")[1];
    if (!hash) return;
    const dest = new URL(a.href, location.origin);
    if (normPath(dest.pathname) !== normPath(location.pathname)) return;
    const target = document.getElementById(hash);
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.pushState(null, "", `#${hash}`);
    NProgress.done();
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) scrollToEl(target);
  });
}

function injectGlassFilters() {
  if ($("#glass-soft")) return;
  const distortion = `
    <filter id="glass-distortion" x="-12%" y="-12%" width="124%" height="124%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="42" result="turbulence"/>
      <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap"/>
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale="34" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
  const soft = `
    <filter id="glass-soft" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.005 0.009" numOctaves="2" seed="12" result="n"/>
      <feGaussianBlur in="n" stdDeviation="1.4" result="m"/>
      <feDisplacementMap in="SourceGraphic" in2="m" scale="8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
  const existing = $(".splash-filters");
  if (existing) {
    existing.insertAdjacentHTML("beforeend", ($("#glass-distortion") ? "" : distortion) + soft);
    return;
  }
  const wrap = document.createElement("div");
  wrap.className = "glass-filters-root";
  wrap.innerHTML = `
    <svg aria-hidden="true">
      <filter id="orc-glass" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox">
        <feImage id="orc-glass-map" x="-50%" y="-50%" width="200%" height="200%" result="map"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur"/>
        <feDisplacementMap in="blur" in2="map" scale="0.75" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      ${distortion}
      ${soft}
    </svg>`;
  document.body.prepend(wrap);
}

const LiquidGlass = (() => {
  const NS = "http://www.w3.org/2000/svg";
  let SUP = null, idc = 0;

  function detect() {
    const ua = navigator.userAgent || "";
    const isWebkit = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|Android/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    if (isWebkit || isFirefox) return false;
    const d = document.createElement("div");
    try { d.style.backdropFilter = "url(#x)"; } catch (e) { return false; }
    return d.style.backdropFilter !== "";
  }
  function supported() { if (SUP === null) SUP = detect(); return SUP; }
  function init() {
    const on = supported();
    document.documentElement.classList.toggle("lg-on", on);
    document.documentElement.classList.toggle("lg-fallback", !on);
  }
  function defs() {
    let r = document.getElementById("lg-defs");
    if (!r) {
      r = document.createElementNS(NS, "svg");
      r.setAttribute("id", "lg-defs");
      r.setAttribute("aria-hidden", "true");
      r.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none");
      document.body.appendChild(r);
    }
    return r;
  }
  const mk = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };

  function dmap(w, h, o) {
    const edge = Math.min(w, h) * (o.borderWidth * 0.5);
    const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect width="${w}" height="${h}" fill="black"/><rect width="${w}" height="${h}" rx="${o.borderRadius}" fill="url(#r)"/><rect width="${w}" height="${h}" rx="${o.borderRadius}" fill="url(#b)" style="mix-blend-mode:${o.mixBlendMode}"/><rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${o.borderRadius}" fill="hsl(0 0% ${o.brightness}% / ${o.opacity})" style="filter:blur(${o.blur}px)"/></svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function apply(node, opts) {
    if (!node) return;
    const o = Object.assign({
      borderRadius: 24, borderWidth: 0.07, brightness: 56, opacity: 0.9,
      blur: 11, displace: 0.4, saturation: 1.5, distortionScale: -140,
      redOffset: 0, greenOffset: 10, blueOffset: 20, xChannel: "R", yChannel: "G",
      mixBlendMode: "difference", frost: 0, inline: true, noClass: false, id: null
    }, opts);
    if (!o.noClass) node.classList.add("lg-surface");
    if (!supported()) return;

    const id = o.id || ("lg-f-" + (++idc));
    const prev = document.getElementById(id);
    if (prev) prev.remove();
    const f = mk("filter", { id, x: "0%", y: "0%", width: "100%", height: "100%" });
    f.setAttribute("color-interpolation-filters", "sRGB");
    const feImg = mk("feImage", { x: "0", y: "0", width: "100%", height: "100%", preserveAspectRatio: "none", result: "map" });
    f.appendChild(feImg);
    const chans = [
      ["red", o.redOffset, "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"],
      ["green", o.greenOffset, "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"],
      ["blue", o.blueOffset, "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"]
    ];
    chans.forEach(([name, off, mat]) => {
      f.appendChild(mk("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: String(o.distortionScale + off), xChannelSelector: o.xChannel, yChannelSelector: o.yChannel, result: "disp_" + name }));
      f.appendChild(mk("feColorMatrix", { in: "disp_" + name, type: "matrix", values: mat, result: name }));
    });
    f.appendChild(mk("feBlend", { in: "red", in2: "green", mode: "screen", result: "rg" }));
    f.appendChild(mk("feBlend", { in: "rg", in2: "blue", mode: "screen", result: "out" }));
    f.appendChild(mk("feGaussianBlur", { in: "out", stdDeviation: String(o.displace) }));
    defs().appendChild(f);

    if (o.inline) {
      const bf = (o.frost ? `blur(${o.frost}px) ` : "") + `url(#${id}) saturate(${o.saturation})`;
      node.style.backdropFilter = bf;
      node.style.webkitBackdropFilter = bf;
    }
    const upd = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width && rect.height) feImg.setAttribute("href", dmap(Math.round(rect.width), Math.round(rect.height), o));
    };
    upd();
    setTimeout(upd, 80);
    if (window.ResizeObserver) { new ResizeObserver(() => upd()).observe(node); }
    else window.addEventListener("resize", upd, { passive: true });
  }

  function glassify(root) {
    (root || document).querySelectorAll(".btn-ghost:not([data-lg])").forEach(b => {
      b.setAttribute("data-lg", "1");
      apply(b, { borderRadius: 999, distortionScale: -70, blur: 6, brightness: 60, opacity: 0.9, saturation: 1.4 });
    });
  }

  return { init, apply, glassify, supported };
})();

function initGlassFilter() {
  injectGlassFilters();
  const fe = $("#orc-glass-map");
  if (!fe || fe.getAttribute("href")) return;
  fetch("https://essykings.github.io/JavaScript/map.png")
    .then(r => r.blob())
    .then(b => fe.setAttribute("href", URL.createObjectURL(b)))
    .catch(() => {});
}

function initSplash() {
  initGlassFilter();
  const s = $("#splash-screen");
  const main = $("#main-content");
  if (!s) {
    if (main) main.style.opacity = "1";
    return;
  }
  if (sessionStorage.getItem("orc_splash")) {
    s.remove();
    if (main) main.style.opacity = "1";
    return;
  }

  const sg = s.querySelector(".splash-glass");
  if (sg) LiquidGlass.apply(sg, { borderRadius: 80, distortionScale: -140, blur: 16, brightness: 60, opacity: 0.9, saturation: 1.7 });

  const finish = () => {
    s.classList.add("splash-exit");
    if (main) main.style.opacity = "1";
    setTimeout(() => {
      s.remove();
      sessionStorage.setItem("orc_splash", "1");
    }, 700);
  };

  setTimeout(finish, 2600);
}

const HERO_INTERVAL = 7000;
let heroSlides = [];
let heroIndex = 0;
let heroTimer = null;
let heroImgSlot = 0;
let heroFading = false;
let heroDetailCache = {};

function swapHeroBackdrop(url) {
  return new Promise(resolve => {
    const a = $("#hero-backdrop-a");
    const b = $("#hero-backdrop-b");
    if (!url || !a || !b) { resolve(); return; }
    const next = heroImgSlot % 2 === 0 ? b : a;
    const cur = heroImgSlot % 2 === 0 ? a : b;
    const finish = () => {
      cur.classList.remove("is-active");
      next.classList.add("is-active");
      heroImgSlot++;
      resolve();
    };
    if (next.src === url && next.classList.contains("is-active")) { resolve(); return; }
    next.onload = finish;
    next.onerror = finish;
    next.src = url;
    if (next.complete) finish();
  });
}

function pickHeroItems(results) {
  const pool = [];
  results.forEach((res, i) => {
    if (res.status !== "fulfilled") return;
    (res.value.results || []).forEach(item => {
      if (!item.poster_path || item.media_type === "person") return;
      if (item.media_type && item.media_type !== "movie" && item.media_type !== "tv") return;
      pool.push(item);
    });
  });
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const seen = new Set();
  const picks = [];
  for (const item of shuffled) {
    const key = `${mediaType(item)}_${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picks.push(item);
    if (picks.length >= 5) break;
  }
  return picks;
}

function startHeroTimer() {
  if (prefersReducedMotion() || heroSlides.length < 2) return;
  clearInterval(heroTimer);
  heroTimer = setInterval(() => setHeroSlide((heroIndex + 1) % heroSlides.length, true), HERO_INTERVAL);
}

function buildHeroDots() {
  const dots = $("#hero-dots");
  if (!dots || heroSlides.length < 2) {
    if (dots) dots.innerHTML = "";
    return;
  }
  dots.innerHTML = heroSlides.map((_, i) =>
    `<button type="button" class="hero-dot${i === 0 ? " active" : ""}" aria-label="Featured ${i + 1}"><span class="hero-dot-fill"></span></button>`
  ).join("");
  dots.querySelectorAll(".hero-dot").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      clearInterval(heroTimer);
      setHeroSlide(i, true);
      startHeroTimer();
    });
  });
  restartDotFill(0);
}

function restartDotFill(i) {
  $$(".hero-dot").forEach((d, j) => {
    d.classList.toggle("active", j === i);
    const fill = d.querySelector(".hero-dot-fill");
    if (!fill) return;
    fill.style.animation = "none";
    void fill.offsetWidth;
    if (j === i) fill.style.animation = `heroDotFill ${HERO_INTERVAL}ms linear forwards`;
  });
}

async function setHeroSlide(i, animate = false) {
  if (!heroSlides.length || heroFading) return;
  heroIndex = i;
  if (animate) {
    heroFading = true;
    $(".hero")?.classList.add("hero-fading");
    await new Promise(r => setTimeout(r, 420));
  }
  try {
    await loadHero(heroSlides[i]);
    if (animate) {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      $(".hero")?.classList.remove("hero-fading");
    }
  } catch (_) {
    $(".hero")?.classList.remove("hero-fading");
  } finally {
    if (animate) heroFading = false;
  }
  restartDotFill(i);
}

function initHeroCarousel(slides) {
  if (!slides.length) return;
  heroSlides = slides;
  buildHeroDots();
  loadHero(slides[0]);
  startHeroTimer();
}

let heroData = null;
let heroBound = false;

async function loadHero(item) {
  if (!item) return;
  heroData = item;
  const id = item.id;
  const realType = mediaType(item);
  const title = item.title || item.name || "";
  const backdrop = item.backdrop_path ? `${IMG_ORIG}${item.backdrop_path}` : "";

  await swapHeroBackdrop(backdrop);

  if ($("#hero-type")) $("#hero-type").textContent = realType === "tv" ? "Series" : "Film";
  if ($("#hero-desc")) $("#hero-desc").textContent = item.overview || "";

  const cacheKey = `${realType}_${id}`;
  try {
    let d = heroDetailCache[cacheKey];
    if (!d) {
      d = await tmdb(`/${realType}/${id}?append_to_response=images,videos`);
      heroDetailCache[cacheKey] = d;
    }
    heroData._detail = d;
    heroData._type = realType;

    // TMDB Title Logo rendering
    const logos = d.images?.logos || [];
    const logoObj = logos.find(l => l.iso_639_1 === "en") || logos.find(l => !l.iso_639_1) || logos[0];
    const titleEl = $("#hero-title");
    if (titleEl) {
      if (logoObj?.file_path) {
        titleEl.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${logoObj.file_path}" class="hero-title-logo" alt="${esc(title)}" />`;
      } else {
        titleEl.textContent = title;
      }
    }

    const rating = d.vote_average?.toFixed(1);
    const y = year(d.release_date || d.first_air_date);
    const metaParts = [];
    const svgStar = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    const svgCalendar = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    const svgClock = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
    const svgTv = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M8 22h8M12 19v3"/></svg>`;

    if (rating) metaParts.push(`<span class="hero-badge-pill score-pill">${svgStar}${rating}/10</span>`);
    if (y) metaParts.push(`<span class="hero-badge-pill">${svgCalendar}${y}</span>`);
    if (d.runtime) metaParts.push(`<span class="hero-badge-pill">${svgClock}${formatRuntime(d.runtime)}</span>`);
    else if (d.number_of_seasons) metaParts.push(`<span class="hero-badge-pill">${svgTv}${d.number_of_seasons} Season${d.number_of_seasons > 1 ? "s" : ""}</span>`);
    if (d.genres?.length) metaParts.push(`<span class="hero-badge-pill">${esc(d.genres.slice(0, 2).map(g => g.name).join(" · "))}</span>`);
    if ($("#hero-meta")) $("#hero-meta").innerHTML = metaParts.join("");

    const videos = d.videos?.results || [];
    const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos.find(v => v.site === "YouTube");
    if (trailer && SETTINGS.get(SETTINGS.autoplayTrailersKey) === "1" && !prefersReducedMotion() && !window.__orcHeroTrailerPlayed) {
      const play = () => { window.__orcHeroTrailerPlayed = true; setTimeout(() => openTrailer(trailer.key), 400); };
      if (!$("#splash-screen") || sessionStorage.getItem("orc_splash")) play();
      else setTimeout(play, 2700);
    }
  } catch (_) {
    if ($("#hero-title")) $("#hero-title").textContent = title;
  }

  bindHeroActions();
  updateHeroListState();
}

function updateHeroListState() {
  const btn = $("#hero-list-btn");
  if (!btn || !heroData) return;
  const kind = mediaType(heroData);
  const saved = MyList.has(heroData.id, kind);
  btn.innerHTML = saved ? ICONS.check : ICONS.plus;
  btn.classList.toggle("saved", saved);
  btn.setAttribute("title", saved ? "Remove from My List" : "Add to My List");
  btn.setAttribute("aria-label", saved ? "Remove from My List" : "Add to My List");
}

function bindHeroActions() {
  if (heroBound) return;
  heroBound = true;

  const heroContent = $(".hero-content") || $("#hero");
  if (heroContent && !heroContent.dataset.pauseBound) {
    heroContent.dataset.pauseBound = "1";
    heroContent.addEventListener("mouseenter", () => clearInterval(heroTimer));
    heroContent.addEventListener("mouseleave", () => startHeroTimer());
  }

  $("#hero-play-btn")?.addEventListener("click", () => {
    if (!heroData) return;
    const type = mediaType(heroData);
    const href = type === "tv" ? `/tv?id=${heroData.id}` : `/movie?id=${heroData.id}`;
    const backdrop = heroData.backdrop_path ? `${IMG_ORIG}${heroData.backdrop_path}` : "";
    const title = heroData.title || heroData.name || "";
    navigateWithLoader(href, backdrop, title);
  });
  $("#hero-info-btn")?.addEventListener("click", () => {
    if (!heroData) return;
    const type = mediaType(heroData);
    location.href = type === "tv" ? `/tv?id=${heroData.id}` : `/movie?id=${heroData.id}`;
  });
  $("#hero-list-btn")?.addEventListener("click", () => {
    if (!heroData) return;
    const kind = mediaType(heroData);
    const saved = MyList.toggle(heroData.id, kind);
    updateHeroListState();
    toast(saved ? "Added to My List" : "Removed from My List");
  });
}

function openTrailer(youtubeKey) {
  let modal = $("#trailer-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "trailer-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `<button class="modal-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="modal-box"><iframe allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" allow="autoplay *; fullscreen *; encrypted-media *; picture-in-picture *" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
    document.body.appendChild(modal);
    modal.querySelector(".modal-close").addEventListener("click", closeTrailer);
    modal.addEventListener("click", e => { if (e.target === modal) closeTrailer(); });
  }
  modal.querySelector("iframe").src = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0`;
  modal.classList.add("open");
  trapModalFocus(modal, "Video trailer");
}

function closeTrailer() {
  const modal = $("#trailer-modal");
  if (!modal) return;
  modal.classList.remove("open");
  releaseModalFocus();
  setTimeout(() => { const f = modal.querySelector("iframe"); if (f) f.src = ""; }, 300);
}

function initGenreStrip() {
  const strip = $("#genre-strip");
  if (!strip) return;
  GENRES.forEach((g, i) => {
    const btn = document.createElement("button");
    btn.className = `genre-pill${i === 0 ? " active" : ""}`;
    btn.textContent = g.name;
    btn.addEventListener("click", async () => {
      $$(".genre-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const row = $("#genre-row");
      if (!row) return;
      const titleEl = row.querySelector(".row-title");
      if (titleEl) titleEl.textContent = g.name;
      const track = row.querySelector(".row-track");
      track.innerHTML = ""; skeletons(10).forEach(s => track.appendChild(s));
      row.scrollIntoView({ behavior: "auto", block: "nearest" });
      try {
        const data = await tmdb(`/discover/movie?with_genres=${g.id}&sort_by=popularity.desc`);
        track.innerHTML = "";
        (data.results || []).slice(0, 20).forEach(it => track.appendChild(buildCard(it, "movie")));
        initRowDrag(track);
        initRowKeyboard(track);
      } catch (_) {}
    });
    strip.appendChild(btn);
  });
}

function buildSeasonSpotlight(shows) {
  const list = (shows || []).filter(s => s && (s.backdrop_path || s.poster_path));
  if (!list.length) return null;
  const wrap = document.createElement("div");
  wrap.className = "row-wrapper spotlight-wrapper visible";
  wrap.innerHTML = `
    <div class="row-header"><h2 class="row-title">New Seasons Airing Now</h2></div>
    <div class="row-track-container">
      <button class="row-arrow left" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg></button>
      <div class="row-track spotlight-track"></div>
      <button class="row-arrow right" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg></button>
    </div>`;
  const track = wrap.querySelector(".spotlight-track");
  list.forEach(s => {
    const img = s.backdrop_path ? `${IMG_W780}${s.backdrop_path}` : posterUrl(s.poster_path);
    const sn = s._season || s.number_of_seasons;
    const card = document.createElement("div");
    card.className = "spotlight-card";
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", s.name || s.title || "");
    card.innerHTML = `
      ${img ? `<img src="${esc(img)}" alt="" loading="lazy" draggable="false" decoding="async"/>` : `<div class="no-img">\u2014</div>`}
      <div class="spotlight-shade"></div>
      ${sn ? `<span class="spotlight-badge">${ICONS.clapper} Season ${sn}</span>` : ""}
      <div class="spotlight-foot">
        <div class="spotlight-title">${esc(s.name || s.title || "")}</div>
      </div>`;
    const go = () => { location.href = `/tv?id=${s.id}`; };
    card.addEventListener("click", go);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    track.appendChild(card);
  });
  initRowDrag(track);
  initRowKeyboard(track);
  const scroll = 360;
  wrap.querySelector(".row-arrow.left").addEventListener("click", () => track.scrollBy({ left: -scroll, behavior: "smooth" }));
  wrap.querySelector(".row-arrow.right").addEventListener("click", () => track.scrollBy({ left: scroll, behavior: "smooth" }));
  return wrap;
}

function shareTitle(title, text, url) {
  if (navigator.share) {
    navigator.share({ title: title || BRAND, text: text || "", url: url || location.href }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url || location.href);
    toast("Link copied to clipboard!");
  }
}

function setMetaTags(title, desc, img) {
  document.title = `${title} — ${BRAND}`;
  let ogTitle = $('meta[property="og:title"]');
  if (!ogTitle) { ogTitle = document.createElement("meta"); ogTitle.setAttribute("property", "og:title"); document.head.appendChild(ogTitle); }
  ogTitle.setAttribute("content", title);

  let ogDesc = $('meta[property="og:description"]');
  if (!ogDesc) { ogDesc = document.createElement("meta"); ogDesc.setAttribute("property", "og:description"); document.head.appendChild(ogDesc); }
  ogDesc.setAttribute("content", desc || "");

  let ogImg = $('meta[property="og:image"]');
  if (!ogImg) { ogImg = document.createElement("meta"); ogImg.setAttribute("property", "og:image"); document.head.appendChild(ogImg); }
  if (img) ogImg.setAttribute("content", img);
}

function initInstantSearch(inputEl) {
  if (!inputEl || inputEl.dataset.instantBound) return;
  inputEl.dataset.instantBound = "1";
  let timer = null;
  let dropdown = null;

  const closeDropdown = () => {
    dropdown?.remove();
    dropdown = null;
  };

  inputEl.addEventListener("input", () => {
    const q = inputEl.value.trim();
    clearTimeout(timer);
    if (!q || q.length < 2) { closeDropdown(); return; }

    timer = setTimeout(async () => {
      try {
        const data = await tmdb(`/search/multi?query=${encodeURIComponent(q)}`);
        const hits = (data.results || []).filter(i => (i.poster_path || i.backdrop_path) && (i.media_type === "movie" || i.media_type === "tv")).slice(0, 4);
        if (!hits.length) { closeDropdown(); return; }

        if (!dropdown) {
          dropdown = document.createElement("div");
          dropdown.className = "instant-search-dropdown";
          inputEl.parentElement.appendChild(dropdown);
        }

        dropdown.innerHTML = hits.map(item => {
          const type = item.media_type === "tv" ? "tv" : "movie";
          const title = item.title || item.name || "";
          const img = posterUrl(item.poster_path) || "";
          const y = year(item.release_date || item.first_air_date);
          const link = `/${type}?id=${item.id}`;
          return `
            <a href="${link}" class="instant-search-item">
              <img src="${esc(img)}" class="instant-search-poster" alt="" />
              <div>
                <div class="instant-search-title">${esc(title)}</div>
                <div class="instant-search-sub">${type === "tv" ? "TV Series" : "Movie"}${y ? " · " + y : ""}</div>
              </div>
            </a>
          `;
        }).join("");
      } catch (_) { closeDropdown(); }
    }, 200);
  });

  document.addEventListener("click", e => {
    if (!inputEl.contains(e.target) && !dropdown?.contains(e.target)) {
      closeDropdown();
    }
  });

  inputEl.addEventListener("keydown", e => {
    if (e.key === "Escape") closeDropdown();
  });
}

function initGlobalShortcuts() {
  if (window.__orcShortcutsBound) return;
  window.__orcShortcutsBound = true;

  document.addEventListener("keydown", e => {
    const tag = document.activeElement?.tagName?.toUpperCase();
    const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable;

    if (e.key === "/" && !isInput) {
      const searchInput = $("#main-search-input") || $(".topnav-search-input");
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    } else if (e.key === "Escape") {
      closeTrailer();
      $$(".instant-search-dropdown").forEach(d => d.remove());
      if (isPlayerFullscreen()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    }
  });
}

async function renderContinueWatchingRow() {
  const container = $("#categories");
  if (!container) return;
  const items = Progress.getAll();
  if (!items || !items.length) return;

  const validItems = items.filter(it => it && it.id && it.progress > 1 && it.progress < 98);
  if (!validItems.length) return;

  const wrap = document.createElement("div");
  wrap.className = "row-wrapper continue-watching-wrapper visible";
  wrap.innerHTML = `
    <div class="row-header"><h2 class="row-title">Continue Watching</h2></div>
    <div class="row-track-container">
      <button class="row-arrow left" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg></button>
      <div class="row-track continue-watching-track"></div>
      <button class="row-arrow right" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg></button>
    </div>`;
  const track = wrap.querySelector(".continue-watching-track");

  for (const it of validItems.slice(0, 10)) {
    try {
      const type = it.mediaType === "tv" ? "tv" : "movie";
      const d = await tmdb(`/${type}/${it.id}`);
      if (!d) continue;
      const card = buildCard(d, type, { progressValue: it.progress });
      track.appendChild(card);
    } catch (_) {}
  }

  if (track.children.length > 0) {
    container.prepend(wrap);
    initRowDrag(track);
    initRowKeyboard(track);
    const scroll = 360;
    wrap.querySelector(".row-arrow.left")?.addEventListener("click", () => track.scrollBy({ left: -scroll, behavior: "smooth" }));
    wrap.querySelector(".row-arrow.right")?.addEventListener("click", () => track.scrollBy({ left: scroll, behavior: "smooth" }));
  }
}

function initHeroSwipe() {
  const heroEl = $("#hero") || $(".hero");
  if (!heroEl || heroEl.dataset.swipeBound) return;
  heroEl.dataset.swipeBound = "1";

  let touchStartX = 0;
  let touchStartY = 0;

  heroEl.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  heroEl.addEventListener("touchend", e => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      clearInterval(heroTimer);
      if (deltaX < 0) {
        setHeroSlide((heroIndex + 1) % heroSlides.length, true);
      } else {
        setHeroSlide((heroIndex - 1 + heroSlides.length) % heroSlides.length, true);
      }
      startHeroTimer();
    }
    touchStartX = 0;
    touchStartY = 0;
  }, { passive: true });
}

function resumeLabel(progressObj) {
  if (!progressObj) return "";
  if (progressObj.season && progressObj.episode) {
    return `Resumes at S${progressObj.season} E${progressObj.episode}`;
  }
  const watchedSec = progressObj.currentTime;
  if (watchedSec && watchedSec > 10) {
    const m = Math.floor(watchedSec / 60);
    const h = Math.floor(m / 60);
    const rM = m % 60;
    if (h > 0) return `Resumes at ${h}h ${rM}m`;
    return `Resumes at ${rM}m`;
  }
  return "Resumes playback";
}

async function renderRecommendedForYouRow() {
  const container = $("#categories");
  if (!container) return;
  const items = Progress.getAll();
  if (!items || !items.length) return;

  const lastItem = items[0];
  if (!lastItem || !lastItem.id) return;

  const type = lastItem.mediaType === "tv" ? "tv" : "movie";
  try {
    const data = await tmdb(`/${type}/${lastItem.id}/recommendations`);
    const recs = (data.results || []).filter(i => i.poster_path || i.backdrop_path).slice(0, 14);
    if (!recs.length) return;

    const wrap = document.createElement("div");
    wrap.className = "row-wrapper recommended-for-you-wrapper visible";
    wrap.innerHTML = `
      <div class="row-header"><h2 class="row-title">Recommended For You</h2></div>
      <div class="row-track-container">
        <button class="row-arrow left" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg></button>
        <div class="row-track recommended-for-you-track"></div>
        <button class="row-arrow right" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg></button>
      </div>`;
    const track = wrap.querySelector(".recommended-for-you-track");
    recs.forEach(it => track.appendChild(buildCard(it, mediaType(it, type))));

    const contRow = container.querySelector(".continue-watching-wrapper");
    if (contRow) contRow.after(wrap);
    else container.prepend(wrap);

    initRowDrag(track);
    initRowKeyboard(track);
    const scroll = 360;
    wrap.querySelector(".row-arrow.left")?.addEventListener("click", () => track.scrollBy({ left: -scroll, behavior: "smooth" }));
    wrap.querySelector(".row-arrow.right")?.addEventListener("click", () => track.scrollBy({ left: scroll, behavior: "smooth" }));
  } catch (_) {}
}

async function initHomePage() {
  initSplash();
  initSidebar("home");
  initGenreStrip();
  initGlobalShortcuts();
  initHeroSwipe();
  renderContinueWatchingRow();
  renderRecommendedForYouRow();

  const main = $("#main-content");
  if (main && (!$("#splash-screen") || sessionStorage.getItem("orc_splash"))) {
    main.style.opacity = "1";
  }

  const el = $("#categories");
  if (!el) return;
  const cats = [
    { title: "New This Week", path: "/movie/now_playing", type: "movie" },
    { title: "Trending Now", path: "/trending/all/week", type: "movie", id: "trending", ranks: true },
    { title: "Top Rated", path: "/movie/top_rated", type: "movie", seeAll: "/search?type=movie" },
    { title: "Coming Soon", path: "/movie/upcoming", type: "movie" },
    { title: "Popular Movies", path: "/movie/popular", type: "movie", seeAll: "/search?type=movie" },
    { title: "Popular TV", path: "/tv/popular", type: "tv", seeAll: "/search?type=tv" },
    { title: "On The Air", path: "/tv/on_the_air", type: "tv" },
    { title: "Airing Today", path: "/tv/airing_today", type: "tv" },
    { title: "Top Rated TV", path: "/tv/top_rated", type: "tv" },
    { title: "Trending TV", path: "/trending/tv/week", type: "tv" },
  ];

  cats.forEach(c => {
    const w = document.createElement("div");
    w.className = "row-wrapper";
    w.innerHTML = `<div class="row-header"><h2 class="row-title">${esc(c.title)}</h2></div><div class="row-track-container"><div class="row-track"></div></div>`;
    w.querySelector(".row-track").append(...skeletons(10));
    el.appendChild(w);
  });

  const results = await Promise.allSettled(cats.map(c => tmdb(c.path)));
  el.innerHTML = "";

  const progress = Progress.getAll();
  if (progress.length) {
    const cw = await Promise.allSettled(progress.slice(0, 12).map(p =>
      tmdb(p.type === "tv" ? `/tv/${p.id}` : `/movie/${p.id}`).then(d => ({ ...d, _type: p.type, _progress: p.progress }))
    ));
    const items = cw.filter(r => r.status === "fulfilled").map(r => r.value);
    if (items.length) el.appendChild(buildRow("Continue Watching", items, "movie"));
  }

  const list = MyList.get();
  if (list.length) {
    const ml = await Promise.allSettled(list.slice(0, 20).map(i =>
      tmdb(i.type === "tv" ? `/tv/${i.id}` : `/movie/${i.id}`).then(d => ({ ...d, _type: i.type }))
    ));
    const items = ml.filter(r => r.status === "fulfilled").map(r => r.value);
    if (items.length) {
      el.appendChild(buildRow("My List", items, "movie", { id: "my-list" }));
    }
  }

  const heroPool = pickHeroItems(results);
  if (heroPool.length) initHeroCarousel(heroPool);

  results.forEach((res, i) => {
    if (res.status !== "fulfilled") return;
    const items = dedupeItems(res.value.results || []);
    const c = cats[i];
    const row = buildRow(c.title, items, c.type, { id: c.id, ranks: c.ranks, seeAll: c.seeAll, periodKey: c.id === "trending" });
    if (row) el.appendChild(row);
  });

  const gRow = document.createElement("div");
  gRow.id = "genre-row";
  gRow.className = "row-wrapper visible";
  gRow.innerHTML = `<div class="row-header"><h2 class="row-title">${GENRES[0].name}</h2></div><div class="row-track-container"><div class="row-track"></div></div>`;
  try {
    const gd = await tmdb(`/discover/movie?with_genres=${GENRES[0].id}&sort_by=popularity.desc`);
    dedupeItems(gd.results || []).slice(0, 20).forEach(it => gRow.querySelector(".row-track").appendChild(buildCard(it, "movie")));
  } catch (_) {}
  el.prepend(gRow);

  observeRows();
  if (main) main.style.opacity = "1";

  (async () => {
    try {
      const air = await tmdb("/tv/on_the_air");
      const top = (air.results || []).filter(s => s.backdrop_path).slice(0, 12);
      const details = await Promise.allSettled(top.map(s => tmdb(`/tv/${s.id}`)));
      const shows = details
        .filter(r => r.status === "fulfilled")
        .map(r => r.value)
        .filter(s => (s.number_of_seasons || 0) >= 2)
        .slice(0, 10);
      const spot = buildSeasonSpotlight(shows);
      if (spot) el.prepend(spot);
    } catch (_) {}
  })();

  const hash = location.hash.replace("#", "");
  if (hash) {
    const delay = ($("#splash-screen") && !sessionStorage.getItem("orc_splash")) ? 3000 : 500;
    setTimeout(() => scrollToEl(document.getElementById(hash)), delay);
  }
}

function renderProviders(container, type, id, s, e, onChange) {
  if (!container) return;
  container.className = "provider-tabs";
  container.innerHTML = "";
  PROVIDERS.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.className = `provider-tab${getProvider() === p.id ? " active" : ""}`;
    btn.innerHTML = i === 0
      ? `${p.name}<span class="provider-rec" aria-label="Recommended">★</span>`
      : p.name;
    btn.addEventListener("click", () => {
      setProvider(p.id);
      $$(".provider-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      onChange(providerUrl(type, id, s, e));
    });
    container.appendChild(btn);
  });
}

async function initMoviePage() {
  const id = new URLSearchParams(location.search).get("id");
  const header = $("#detail-header");
  const frame = $("#player-frame");
  if (!id) { location.href = homeUrl(); return; }
  if (!header || !frame) return;

  initSidebar("movies");
  checkPlayLoader();
  initPlayerGuard();

  const showErr = msg => {
    if (header) header.innerHTML = `<p style="color:var(--text-muted)">${esc(msg)}</p>`;
    if (frame) frame.innerHTML = `<p style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.85rem;padding:20px;text-align:center">Could not load player.</p>`;
  };

  let m;
  try {
    m = await tmdb(`/movie/${id}?append_to_response=images,credits,similar,videos,recommendations,external_ids,release_dates`);
  } catch (e) {
    console.error(e);
    showErr("Couldn't load this title. Check your connection and try again.");
    return;
  }

  try {
    document.title = `${m.title} — ${BRAND}`;
    const backdrop = m.backdrop_path ? `${IMG_ORIG}${m.backdrop_path}` : "";
    const backdropEl = $("#detail-backdrop");
    if (backdropEl && backdrop) backdropEl.style.backgroundImage = `url(${backdrop})`;

    const saved = MyList.has(m.id, "movie");
    const trailer = pickTrailer(m.videos);
    const cert = (m.release_dates?.results || []).find(r => r.iso_3166_1 === "US")?.release_dates?.map(d => d.certification).find(Boolean);
    const resume = resumeLabel(Progress.getItem(m.id, "movie"));

    const logos = m.images?.logos || [];
    const logoObj = logos.find(l => l.iso_639_1 === "en") || logos.find(l => !l.iso_639_1) || logos[0];
    const titleHtml = logoObj?.file_path
      ? `<div class="detail-logo-wrap"><img src="https://image.tmdb.org/t/p/w500${logoObj.file_path}" class="detail-title-logo" alt="${esc(m.title)}" /></div>`
      : `<h1 class="detail-title">${esc(m.title)}</h1>`;

    header.innerHTML = `
      ${titleHtml}
      ${m.tagline ? `<p class="detail-tagline">${esc(m.tagline)}</p>` : ""}
      ${m.belongs_to_collection ? `<a class="collection-banner" href="/search?type=movie&q=${encodeURIComponent(m.belongs_to_collection.name)}">Part of ${esc(m.belongs_to_collection.name)}</a>` : ""}
      <div class="detail-meta">
        ${m.vote_average ? `<span class="score">★ ${m.vote_average.toFixed(1)}</span>` : ""}
        ${m.vote_count ? `<span>${fmtVotes(m.vote_count)}</span>` : ""}
        <span>${year(m.release_date)}</span>
        ${m.runtime ? `<span>${formatRuntime(m.runtime)}</span>` : ""}
        ${cert ? `<span class="cert">${esc(cert)}</span>` : ""}
        ${genreTags(m.genres, "movie")}
      </div>
      <p class="detail-overview">${esc(m.overview || "")}</p>
      ${resume ? `<p class="detail-resume">${esc(resume)}</p>` : ""}
      <div class="detail-actions">
        <button class="btn-play" id="detail-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> ${resume ? "Resume" : "Play"}</button>
        ${trailer ? `<button class="btn-ghost" id="detail-trailer">Trailer</button>` : ""}
        <button class="btn-ghost" id="detail-save">${saved ? "✓ Saved" : "+ My List"}</button>
        <button class="btn-ghost btn-icon-text" id="detail-share">${ICONS.share}<span>Share</span></button>
      </div>`;

    LiquidGlass.glassify(header);
    $("#detail-play")?.addEventListener("click", () => scrollToSelector("#player-frame"));
    if (trailer) $("#detail-trailer")?.addEventListener("click", () => openTrailer(trailer.key));
    $("#detail-share")?.addEventListener("click", () => sharePageLink(m.title));
    $("#detail-save")?.addEventListener("click", () => {
      const a = MyList.toggle({ id: m.id, type: "movie", title: m.title, poster: m.poster_path });
      const btn = $("#detail-save");
      if (btn) btn.textContent = a ? "✓ Saved" : "+ My List";
      toast(a ? "Added to My List" : "Removed");
    });

    const load = url => loadPlayerFrame(frame, url);
    renderProviders($("#provider-bar"), "movie", id, 1, 1, load);
    load(providerUrl("movie", id, 1, 1));

    const info = $("#detail-info");
    if (info) info.innerHTML = `
      <div class="info-grid">
        ${m.status ? `<div class="info-cell"><label>Status</label><span>${esc(m.status)}</span></div>` : ""}
        ${m.original_title && m.original_title !== m.title ? `<div class="info-cell"><label>Original title</label><span>${esc(m.original_title)}</span></div>` : ""}
        ${m.original_language ? `<div class="info-cell"><label>Language</label><span>${esc(m.original_language.toUpperCase())}</span></div>` : ""}
        ${m.budget ? `<div class="info-cell"><label>Budget</label><span>${fmtMoney(m.budget)}</span></div>` : ""}
        ${m.revenue ? `<div class="info-cell"><label>Box office</label><span>${fmtMoney(m.revenue)}</span></div>` : ""}
        ${m.production_companies?.[0] ? `<div class="info-cell"><label>Studio</label><span>${esc(m.production_companies[0].name)}</span></div>` : ""}
        ${m.production_countries?.[0] ? `<div class="info-cell"><label>Country</label><span>${esc(m.production_countries[0].name)}</span></div>` : ""}
        ${m.external_ids?.imdb_id ? `<div class="info-cell"><label>IMDb</label><a class="ext-link" href="https://www.imdb.com/title/${esc(m.external_ids.imdb_id)}/" target="_blank" rel="noopener">View on IMDb \u2197</a></div>` : ""}
        ${m.homepage ? `<div class="info-cell"><label>Official site</label><a class="ext-link" href="${esc(m.homepage)}" target="_blank" rel="noopener">Website \u2197</a></div>` : ""}
      </div>`;

    renderCastRow(m.credits?.cast?.slice(0, 16) || []);

    const rec = m.recommendations?.results?.slice(0, 14) || [];
    if (rec.length) {
      ensureRecommendSection();
      renderCardRow("#recommend-section", "#recommend-row", rec, "movie");
    }

    const sim = m.similar?.results?.slice(0, 14) || [];
    renderCardRow("#similar-section", "#similar-row", sim, "movie");
  } catch (e) {
    console.error(e);
    showErr("Couldn't display this title.");
    return;
  }

  tmdb(`/movie/${id}?append_to_response=keywords,watch/providers`).then(extras => {
    const anchor = $("#detail-info") || header;
    renderWatchProviders(hostAfter(anchor, "watch-providers-host"), extras["watch/providers"]);
    renderKeywords(hostAfter($("#watch-providers-host") || anchor, "keywords-host"), extras.keywords, "movie");
  }).catch(() => {});
}

async function initTvPage() {
  initSidebar("tv");
  checkPlayLoader();
  initPlayerGuard();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  let season = parseInt(params.get("season") || "1", 10);
  let episode = parseInt(params.get("episode") || "1", 10);
  const header = $("#detail-header");
  const frame = $("#player-frame");
  if (!id) { location.href = homeUrl(); return; }

  const showErr = msg => {
    if (header) header.innerHTML = `<p style="color:var(--text-muted)">${esc(msg)}</p>`;
    if (frame) frame.innerHTML = `<p style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.85rem">Could not load player.</p>`;
  };

  try {
    const show = await tmdb(`/tv/${id}?append_to_response=images,credits,similar,recommendations,videos,external_ids,content_ratings`);
    document.title = `${show.name} — ${BRAND}`;
    const backdropEl = $("#detail-backdrop");
    if (backdropEl && show.backdrop_path) backdropEl.style.backgroundImage = `url(${IMG_ORIG}${show.backdrop_path})`;

    const saved = MyList.has(show.id, "tv");
    const trailer = pickTrailer(show.videos);
    const cert = (show.content_ratings?.results || []).find(r => r.iso_3166_1 === "US")?.rating;
    const creators = (show.created_by || []).map(c => c.name).join(", ");
    const prog = Progress.getItem(show.id, "tv");
    const seasons = (show.seasons || []).filter(s => s.season_number > 0);
    const seasonNums = seasons.map(s => s.season_number);
    if (seasonNums.length && !seasonNums.includes(season)) season = seasonNums[0];
    if (!Number.isFinite(episode) || episode < 1) episode = 1;
    if (prog?.season) {
      season = parseInt(prog.season, 10) || season;
      if (prog.episode) episode = parseInt(prog.episode, 10) || episode;
    }
    const resume = prog?.progress >= 5 && prog.progress < 98
      ? `Resume S${season} E${episode} · ${Math.round(prog.progress)}% watched`
      : "";

    const logos = show.images?.logos || [];
    const logoObj = logos.find(l => l.iso_639_1 === "en") || logos.find(l => !l.iso_639_1) || logos[0];
    const titleHtml = logoObj?.file_path
      ? `<div class="detail-logo-wrap"><img src="https://image.tmdb.org/t/p/w500${logoObj.file_path}" class="detail-title-logo" alt="${esc(show.name)}" /></div>`
      : `<h1 class="detail-title">${esc(show.name)}</h1>`;

    if (header) header.innerHTML = `
      ${titleHtml}
      ${show.tagline ? `<p class="detail-tagline">${esc(show.tagline)}</p>` : ""}
      <div class="detail-meta">
        ${show.vote_average ? `<span class="score">★ ${show.vote_average.toFixed(1)}</span>` : ""}
        ${show.vote_count ? `<span>${fmtVotes(show.vote_count)}</span>` : ""}
        <span>${year(show.first_air_date)}</span>
        ${show.number_of_seasons ? `<span>${show.number_of_seasons} Seasons</span>` : ""}
        ${show.number_of_episodes ? `<span>${show.number_of_episodes} Eps</span>` : ""}
        ${cert ? `<span class="cert">${esc(cert)}</span>` : ""}
        ${genreTags(show.genres, "tv")}
      </div>
      <p class="detail-overview">${esc(show.overview || "")}</p>
      ${resume ? `<p class="detail-resume">${esc(resume)}</p>` : ""}
      <div class="detail-actions">
        <button class="btn-play" id="detail-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> ${resume ? "Resume" : "Play"}</button>
        ${trailer ? `<button class="btn-ghost" id="detail-trailer">Trailer</button>` : ""}
        <button class="btn-ghost" id="detail-save">${saved ? "✓ Saved" : "+ My List"}</button>
        <button class="btn-ghost btn-icon-text" id="detail-share">${ICONS.share}<span>Share</span></button>
      </div>`;

    LiquidGlass.glassify(header);
    $("#detail-play")?.addEventListener("click", () => scrollToSelector("#player-frame"));
    if (trailer) $("#detail-trailer")?.addEventListener("click", () => openTrailer(trailer.key));
    $("#detail-share")?.addEventListener("click", () => sharePageLink(show.name));
    $("#detail-save")?.addEventListener("click", () => {
      const a = MyList.toggle({ id: show.id, type: "tv", title: show.name, poster: show.poster_path });
      $("#detail-save").textContent = a ? "✓ Saved" : "+ My List";
      toast(a ? "Added to My List" : "Removed");
    });

    const updateNextEpBtn = (epsList) => {
      const wrap = $("#next-ep-wrap");
      const btn = $("#next-ep-btn");
      if (!wrap || !btn) return;
      const curEpIndex = epsList.findIndex(e => e.episode_number === episode);
      if (curEpIndex >= 0 && curEpIndex < epsList.length - 1) {
        const nextEpObj = epsList[curEpIndex + 1];
        wrap.style.display = "";
        btn.querySelector("span").textContent = `Next Episode (S${season} E${nextEpObj.episode_number})`;
        btn.onclick = () => {
          episode = nextEpObj.episode_number;
          $$(".ep-row").forEach(x => x.classList.remove("on"));
          const nextRow = $$(".ep-row")[curEpIndex + 1];
          if (nextRow) nextRow.classList.add("on");
          update();
          scrollToSelector("#player-frame");
        };
      } else {
        wrap.style.display = "none";
      }
    };

    const update = () => {
      loadPlayerFrame(frame, providerUrl("tv", id, season, episode));
      const u = new URL(location.href);
      u.searchParams.set("season", season);
      u.searchParams.set("episode", episode);
      history.replaceState(null, "", u);
    };

    async function loadEps(sn) {
      $("#ep-grid").innerHTML = `<div class="spinner" style="margin:20px auto"></div>`;
      try {
        const sd = await tmdb(`/tv/${id}/season/${sn}`);
        $("#ep-grid").innerHTML = "";
        const eps = sd.episodes || [];
        if (eps.length && !eps.some(ep => ep.episode_number === episode)) episode = eps[0].episode_number;
        eps.forEach(ep => {
          const el = document.createElement("button");
          el.type = "button";
          el.className = `ep-row${ep.episode_number === episode && sn === season ? " on" : ""}`;
          el.dataset.ep = ep.episode_number;
          const air = ep.air_date ? new Date(ep.air_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
          const dur = ep.runtime ? `${ep.runtime}m` : "";
          el.innerHTML = `
            <span class="ep-row-num">${ep.episode_number}</span>
            <div class="ep-row-thumb">${ep.still_path ? `<img src="${esc(IMG_W500 + ep.still_path)}" alt="" loading="lazy" draggable="false"/>` : ""}</div>
            <div class="ep-row-body">
              <div class="ep-row-title">${esc(ep.name || `Episode ${ep.episode_number}`)}</div>
              ${air ? `<div class="ep-row-date">${air}</div>` : ""}
              <div class="ep-row-desc">${esc(ep.overview || "")}</div>
            </div>
            ${dur ? `<span class="ep-row-dur">${dur}</span>` : ""}`;
          el.addEventListener("click", () => {
            season = sn; episode = ep.episode_number;
            $$(".ep-row").forEach(x => x.classList.remove("on"));
            el.classList.add("on");
            update();
            updateNextEpBtn(eps);
            scrollToSelector("#player-frame");
          });
          $("#ep-grid").appendChild(el);
        });
        updateNextEpBtn(eps);

        $("#ep-search-input")?.addEventListener("input", e => {
          const q = e.target.value.toLowerCase().trim();
          $$(".ep-row", $("#ep-grid")).forEach(r => {
            const titleText = r.querySelector(".ep-row-title")?.textContent.toLowerCase() || "";
            const numText = r.querySelector(".ep-row-num")?.textContent || "";
            r.style.display = (!q || titleText.includes(q) || numText.includes(q)) ? "" : "none";
          });
        });
      } catch (_) {
        $("#ep-grid").innerHTML = `<p style="color:var(--text-muted);padding:20px;text-align:center">Episodes unavailable.</p>`;
      }
    }

    renderProviders($("#provider-bar"), "tv", id, season, episode, update);

    if (seasons.length && $("#season-select")) {
      $("#ep-block").style.display = "";
      const epHead = $("#ep-block").querySelector(".ep-head") || document.createElement("div");
      if (!epHead.classList.contains("ep-head")) {
        epHead.className = "ep-head";
        epHead.innerHTML = `<h2>Episodes</h2>`;
        $("#ep-block").prepend(epHead);
      }
      const seasonSel = $("#season-select");
      if (seasonSel && seasonSel.parentElement !== epHead) epHead.appendChild(seasonSel);
      seasons.forEach(s => {
        const o = document.createElement("option");
        o.value = s.season_number;
        o.textContent = `Season ${s.season_number}`;
        if (s.season_number === season) o.selected = true;
        $("#season-select").appendChild(o);
      });
      await loadEps(season);
      $("#season-select").addEventListener("change", () => {
        season = +$("#season-select").value;
        episode = 1;
        loadEps(season).then(update);
      });
    }

    update();

    const info = $("#detail-info");
    if (info) {
      info.innerHTML = `
        <div class="info-grid">
          ${show.status ? `<div class="info-cell"><label>Status</label><span>${esc(show.status)}</span></div>` : ""}
          ${creators ? `<div class="info-cell"><label>Created by</label><span>${esc(creators)}</span></div>` : ""}
          ${show.networks?.[0] ? `<div class="info-cell"><label>Network</label><span>${esc(show.networks[0].name)}</span></div>` : ""}
          ${show.original_language ? `<div class="info-cell"><label>Language</label><span>${esc(show.original_language.toUpperCase())}</span></div>` : ""}
          ${show.last_air_date ? `<div class="info-cell"><label>Last aired</label><span>${esc(show.last_air_date)}</span></div>` : ""}
          ${show.external_ids?.imdb_id ? `<div class="info-cell"><label>IMDb</label><a class="ext-link" href="https://www.imdb.com/title/${esc(show.external_ids.imdb_id)}/" target="_blank" rel="noopener">View on IMDb \u2197</a></div>` : ""}
          ${show.homepage ? `<div class="info-cell"><label>Official site</label><a class="ext-link" href="${esc(show.homepage)}" target="_blank" rel="noopener">Website \u2197</a></div>` : ""}
        </div>`;
    }

    renderCastRow(show.credits?.cast?.slice(0, 16) || []);

    const rec = show.recommendations?.results?.slice(0, 14) || [];
    if (rec.length) {
      ensureRecommendSection();
      renderCardRow("#recommend-section", "#recommend-row", rec, "tv");
    }

    const sim = show.similar?.results?.slice(0, 14) || [];
    renderCardRow("#similar-section", "#similar-row", sim, "tv");

    tmdb(`/tv/${id}?append_to_response=keywords,watch/providers`).then(extras => {
      const anchor = $("#detail-info") || header;
      renderWatchProviders(hostAfter(anchor, "watch-providers-host"), extras["watch/providers"]);
      renderKeywords(hostAfter($("#watch-providers-host") || anchor, "keywords-host"), extras.keywords, "tv");
    }).catch(() => {});
  } catch (e) {
    console.error(e);
    showErr("Couldn't load this show. Check your connection and try again.");
  }
}

function initSearchPage() {
  const params = new URLSearchParams(location.search);
  const filter = params.get("type") || "all";
  const genreId = params.get("genre");
  initSidebar(filter === "movie" ? "movies" : filter === "tv" ? "tv" : "search");

  const input = $("#main-search-input");
  const clear = $("#search-clear");
  const status = $("#search-status");
  const grid = $("#search-results");
  const recentBox = $("#search-recent");
  const chips = $$(".filter-chip");
  let current = filter === "movie" || filter === "tv" ? filter : "all";
  let timer, lastQ = "";

  if (input) initInstantSearch(input);

  function setBusy(busy) {
    if (!status) return;
    status.classList.toggle("is-busy", busy);
    if (busy) status.innerHTML = `<span class="search-pending"><span class="spin-dot"></span> Searching…</span>`;
  }

  function renderRecent() {
    if (!recentBox || !input) return;
    const q = input.value.trim();
    if (q || genreId) { recentBox.hidden = true; return; }
    const recent = RecentSearches.get();
    if (!recent.length) { recentBox.hidden = true; return; }
    recentBox.hidden = false;
    recentBox.innerHTML = `<p class="search-recent-label">Recent searches</p><div class="search-recent-pills">${recent.map(term =>
      `<button type="button" class="search-recent-pill" data-q="${esc(term)}">${esc(term)}</button>`
    ).join("")}</div>`;
    recentBox.querySelectorAll(".search-recent-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        input.value = btn.dataset.q;
        if (clear) clear.style.display = "flex";
        doSearch(btn.dataset.q);
      });
    });
  }

  const setPlaceholder = () => {
    if (input) input.placeholder = current === "ai"
      ? "Describe a vibe, plot, era, or movies like…"
      : "Titles, actors, keywords…";
  };
  chips.forEach(c => c.classList.toggle("on", c.dataset.filter === current));
  setPlaceholder();
  chips.forEach(c => c.addEventListener("click", () => {
    current = c.dataset.filter;
    chips.forEach(x => x.classList.toggle("on", x === c));
    setPlaceholder();
    doSearch(lastQ || input?.value.trim() || "");
  }));

  async function doSearch(q) {
    if (!status || !grid) return;
    lastQ = q;
    if (current === "ai") { aiSearch(q); return; }
    status.classList.remove("is-busy");
    if (!q && current === "all" && !genreId) {
      status.textContent = "";
      grid.innerHTML = `<div class="no-results"><h3>What are you looking for?</h3><p>Search by title, or use the Movies and Series tabs to browse.</p></div>`;
      renderRecent();
      return;
    }
    if (recentBox) recentBox.hidden = true;
    status.textContent = "Loading…";
    grid.innerHTML = ""; skeletons(12).forEach(s => grid.appendChild(s));

    try {
      let items = [];
      if (q) {
        RecentSearches.add(q);
        let path = "/search/multi";
        if (current === "movie") path = "/search/movie";
        if (current === "tv") path = "/search/tv";
        const data = await tmdb(`${path}?query=${encodeURIComponent(q)}`);
        items = (data.results || []).filter(i => i.poster_path || i.backdrop_path);
        if (current !== "all") items = items.filter(i => (i.media_type || current) === current);
        status.textContent = `${items.length} results`;
      } else {
        const media = current === "tv" ? "tv" : "movie";
        const g = genreId || "";
        const parts = ["sort_by=popularity.desc", "vote_count.gte=30"];
        if (g) parts.push(`with_genres=${g}`);
        const data = await tmdb(`/discover/${media}?${parts.join("&")}`);
        items = data.results || [];
        const gName = GENRES.find(x => String(x.id) === String(g))?.name;
        status.textContent = `${gName ? gName + " · " : ""}${items.length} ${media === "tv" ? "series" : "films"}`;
      }

      items = dedupeItems(items);

      const eraVal = $("#filter-era")?.value || "all";
      const ratingVal = $("#filter-rating")?.value || "all";
      const sortVal = $("#filter-sort")?.value || "pop";

      if (eraVal !== "all") {
        items = items.filter(it => {
          const y = parseInt(year(it.release_date || it.first_air_date), 10);
          if (!y) return false;
          if (eraVal === "2020s") return y >= 2020;
          if (eraVal === "2010s") return y >= 2010 && y <= 2019;
          if (eraVal === "2000s") return y >= 2000 && y <= 2009;
          if (eraVal === "1990s") return y >= 1990 && y <= 1999;
          if (eraVal === "classic") return y < 1990;
          return true;
        });
      }

      if (ratingVal !== "all") {
        const minRating = parseFloat(ratingVal);
        items = items.filter(it => (it.vote_average || 0) >= minRating);
      }

      if (sortVal === "rating") {
        items.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      } else if (sortVal === "newest") {
        items.sort((a, b) => (b.release_date || b.first_air_date || "").localeCompare(a.release_date || a.first_air_date || ""));
      } else if (sortVal === "pop") {
        items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }

      grid.innerHTML = "";
      if (!items.length) {
        grid.innerHTML = `<div class="no-results"><h3>Nothing matched</h3><p>Try adjusting your search query or filters.</p></div>`;
        if (!genreId) status.textContent = "";
        renderRecent();
        return;
      }
      if (status) status.textContent = `${items.length} ${items.length === 1 ? "result" : "results"}`;
      items.forEach(item => grid.appendChild(buildCard(item, mediaType(item, current === "tv" ? "tv" : "movie"))));
    } catch {
      grid.innerHTML = `<div class="no-results"><p>Search failed. Check your connection.</p></div>`;
      status.textContent = "";
    }
  }

  ["#filter-era", "#filter-rating", "#filter-sort"].forEach(sel => {
    $(sel)?.addEventListener("change", () => doSearch(lastQ || input?.value.trim() || ""));
  });

  const q = params.get("q") || "";
  if (input && !q && !genreId) setTimeout(() => input.focus(), 120);
  if (input) {
    input.value = q;
    input.addEventListener("input", () => {
      if (clear) clear.style.display = input.value ? "flex" : "none";
      if (!input.value.trim()) renderRecent();
      if (current === "ai") { setBusy(false); return; }
      setBusy(true);
      clearTimeout(timer);
      timer = setTimeout(() => doSearch(input.value.trim()), 400);
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && current === "ai") {
        e.preventDefault();
        clearTimeout(timer);
        doSearch(input.value.trim());
      }
    });
    if (q) { clear.style.display = "flex"; doSearch(q); }
    else if (genreId) doSearch("");
    else doSearch(current !== "all" ? "" : "");
  }
  clear?.addEventListener("click", () => { input.value = ""; clear.style.display = "none"; doSearch(""); input.focus(); });
  renderRecent();
}

async function aiSearch(q) {
  const status = $("#search-status");
  const grid = $("#search-results");
  const recentBox = $("#search-recent");
  if (!status || !grid) return;
  if (recentBox) recentBox.hidden = true;
  if (!q) {
    status.textContent = "";
    grid.innerHTML = `<div class="no-results ai-empty"><h3>Ask AI <span class="ai-badge">Experimental</span></h3><p>Describe what you're in the mood for. A vibe, a plot, an era, an actor, or something like Interstellar. AI will curate a shortlist.</p></div>`;
    return;
  }
  RecentSearches.add(q);
  status.innerHTML = `<span class="search-pending"><span class="spin-dot"></span> Asking AI…</span>`;
  grid.innerHTML = ""; skeletons(8).forEach(s => grid.appendChild(s));
  try {
    const res = await fetch("/api/ai-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    if (!res.ok) {
      let msg = "AI Search is unavailable right now.";
      try { const e = await res.json(); if (e && e.error) msg = e.error; } catch (_) {}
      grid.innerHTML = `<div class="no-results"><h3>Couldn’t reach AI</h3><p>${esc(msg)}</p></div>`;
      status.textContent = "";
      return;
    }
    const data = await res.json();
    const recs = Array.isArray(data.results) ? data.results : [];
    if (!recs.length) {
      grid.innerHTML = `<div class="no-results"><h3>No picks</h3><p>Try rephrasing your request.</p></div>`;
      status.textContent = "";
      return;
    }
    const resolved = await Promise.all(recs.map(async rec => {
      try {
        const path = rec.type === "tv" ? "/search/tv" : "/search/movie";
        const r = await tmdb(`${path}?query=${encodeURIComponent(rec.title)}`);
        const hits = (r.results || []).filter(i => i.poster_path);
        if (rec.year) {
          const y = String(rec.year);
          const exact = hits.find(i => (i.release_date || i.first_air_date || "").startsWith(y));
          if (exact) return { item: exact, type: rec.type };
        }
        return hits[0] ? { item: hits[0], type: rec.type } : null;
      } catch (_) { return null; }
    }));
    const seen = new Set();
    const cards = resolved.filter(c => {
      if (!c) return false;
      const k = `${c.type}_${c.item.id}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    grid.innerHTML = "";
    if (data.intro) {
      const banner = document.createElement("div");
      banner.className = "ai-intro";
      banner.innerHTML = `<span class="ai-intro-spark">${ICONS.spark || "✦"}</span><p>${esc(data.intro)}</p>`;
      grid.appendChild(banner);
    }
    if (!cards.length) {
      const none = document.createElement("div");
      none.className = "no-results";
      none.innerHTML = `<p>AI suggested titles, but none were found in the catalog.</p>`;
      grid.appendChild(none);
    } else {
      cards.forEach(c => grid.appendChild(buildCard(c.item, c.type)));
    }
    status.textContent = `${cards.length} AI picks`;
  } catch (_) {
    grid.innerHTML = `<div class="no-results"><p>AI Search failed. Check your connection.</p></div>`;
    status.textContent = "";
  }
}

function initSettingsPage() {
  initSidebar("settings");
  document.title = "Settings — Osiris Watch";

  const providerBox = $("#settings-providers");
  if (providerBox) {
    providerBox.innerHTML = "";
    PROVIDERS.forEach((p, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `settings-provider${getProvider() === p.id ? " active" : ""}`;
      btn.innerHTML = i === 0
        ? `${p.name}<span class="provider-rec" aria-label="Recommended">★</span>`
        : p.name;
      btn.addEventListener("click", () => {
        setProvider(p.id);
        $$(".settings-provider").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        toast(`Stream provider set to ${p.name}`);
      });
      providerBox.appendChild(btn);
    });
  }

  const accentBox = $("#settings-accents");
  if (accentBox) {
    accentBox.innerHTML = "";
    const cur = SETTINGS.get(SETTINGS.accentKey, ACCENT);
    ACCENT_COLORS.forEach(c => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `accent-swatch${cur === c.id ? " active" : ""}`;
      btn.style.setProperty("--swatch", `#${c.id}`);
      btn.title = c.label;
      btn.innerHTML = cur === c.id ? ICONS.check : "";
      btn.addEventListener("click", () => {
        SETTINGS.set(SETTINGS.accentKey, c.id);
        applyGlobalSettings();
        $$(".accent-swatch").forEach(b => { b.classList.remove("active"); b.innerHTML = ""; });
        btn.classList.add("active");
        btn.innerHTML = ICONS.check;
        toast(`Accent set to ${c.label}`);
      });
      accentBox.appendChild(btn);
    });
  }

  const themeBox = $("#settings-theme");
  if (themeBox) {
    const curTheme = SETTINGS.get(SETTINGS.themeKey, "dark") === "light" ? "light" : "dark";
    themeBox.querySelectorAll(".theme-opt").forEach(b => {
      b.classList.toggle("active", b.dataset.themeVal === curTheme);
      b.addEventListener("click", () => {
        SETTINGS.set(SETTINGS.themeKey, b.dataset.themeVal);
        applyGlobalSettings();
        themeBox.querySelectorAll(".theme-opt").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        toast(`Theme set to ${b.textContent.trim()}`);
      });
    });
  }

  const bindToggle = (id, key, label, defaultOn = "0") => {
    const el = $(id);
    if (!el) return;
    const sync = () => {
      const on = SETTINGS.get(key, defaultOn) === "1";
      el.classList.toggle("on", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
    };
    sync();
    el.addEventListener("click", () => {
      const on = SETTINGS.toggle(key);
      sync();
      applyGlobalSettings();
      if (key === SETTINGS.reduceMotionKey) {
        if (on) clearInterval(heroTimer);
        else startHeroTimer();
      }
      toast(`${label} ${on ? "enabled" : "disabled"}`);
    });
  };

  bindToggle("#toggle-reduce-motion", SETTINGS.reduceMotionKey, "Reduce motion");
  bindToggle("#toggle-hide-watched", SETTINGS.hideWatchedKey, "Hide watched");
  bindToggle("#toggle-autoplay-trailers", SETTINGS.autoplayTrailersKey, "Auto-play trailers");
  bindToggle("#toggle-grid-backdrop", SETTINGS.layoutKey, "Landscape Card View");

  const langSel = $("#settings-pref-lang");
  if (langSel) {
    langSel.value = SETTINGS.get(SETTINGS.prefLangKey, "en");
    langSel.addEventListener("change", e => {
      SETTINGS.set(SETTINGS.prefLangKey, e.target.value);
      toast(`Preferred language updated`);
    });
  }

  $("#clear-progress")?.addEventListener("click", () => {
    localStorage.removeItem(Progress.key);
    toast("Continue watching cleared");
  });
  $("#clear-list")?.addEventListener("click", () => {
    localStorage.removeItem(MyList.key);
    toast("My List cleared");
  });
  $("#reset-splash")?.addEventListener("click", () => {
    sessionStorage.removeItem("orc_splash");
    toast("Intro will show on next home visit");
  });
}

async function initListPage() {
  initSidebar("list");
  document.title = "My List — Osiris Watch";
  const grid = $("#list-grid");
  const status = $("#list-status");
  if (!grid) return;

  const emptyState = () => {
    grid.innerHTML = `<div class="no-results list-empty"><div class="list-empty-ico">${ICONS.list}</div><h3>Your list is empty</h3><p>Add movies and series using the + icon on their cards.</p></div>`;
    if (status) status.textContent = "";
  };

  const rawList = MyList.get();
  if (!rawList.length) { emptyState(); return; }

  grid.innerHTML = ""; skeletons(Math.min(rawList.length, 12)).forEach(s => grid.appendChild(s));

  const settled = await Promise.allSettled(rawList.map(i =>
    tmdb(i.type === "tv" ? `/tv/${i.id}` : `/movie/${i.id}`).then(d => ({ ...d, _type: i.type }))
  ));
  let loadedItems = dedupeItems(settled.filter(r => r.status === "fulfilled").map(r => r.value));
  if (!loadedItems.length) { emptyState(); return; }

  let currentType = "all";
  let currentSort = "recent";

  const renderListGrid = () => {
    let items = [...loadedItems];
    if (currentType === "movie" || currentType === "tv") {
      items = items.filter(it => (it._type || (it.title ? "movie" : "tv")) === currentType);
    } else if (currentType === "favorite") {
      items = items.filter(it => (it.vote_average || 0) >= 7.5);
    } else if (currentType === "planning") {
      items = items.filter(it => {
        const prog = Progress.getItem(it.id, it._type || "movie");
        return !prog || prog.progress < 15;
      });
    } else if (currentType === "completed") {
      items = items.filter(it => {
        const prog = Progress.getItem(it.id, it._type || "movie");
        return prog && prog.progress >= 85;
      });
    }

    if (currentSort === "rating") {
      items.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (currentSort === "title") {
      items.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
    } else if (currentSort === "release") {
      items.sort((a, b) => ((b.release_date || b.first_air_date || "")).localeCompare(a.release_date || a.first_air_date || ""));
    }

    if (status) status.textContent = `${items.length} ${items.length === 1 ? "title" : "titles"}`;
    grid.innerHTML = "";
    if (!items.length) {
      grid.innerHTML = `<div class="no-results"><h3>No titles match filter</h3><p>Try switching filters.</p></div>`;
      return;
    }
    items.forEach(it => grid.appendChild(buildCard(it, it._type === "tv" ? "tv" : "movie")));
  };

  const filterRow = $("#list-filter-chips");
  if (filterRow) {
    filterRow.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        filterRow.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("on"));
        chip.classList.add("on");
        currentType = chip.dataset.type || "all";
        renderListGrid();
      });
    });
  }

  const sortSel = $("#list-sort-select");
  if (sortSel) {
    sortSel.addEventListener("change", e => {
      currentSort = e.target.value;
      renderListGrid();
    });
  }

  renderListGrid();
}

function initDmcaPage() {
  initSidebar("home");
  document.title = "DMCA — Osiris Watch";
}

function playLoader(bg, title, opts = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  const instant = !!opts.instant;
  const hold = opts.hold ?? 480;
  return new Promise(resolve => {
    let el = document.getElementById("play-loader-live");
    if (!el) {
      el = document.createElement("div");
      el.id = "play-loader-live";
      el.className = "play-loader";
      el.innerHTML = `<div class="play-loader-bg"></div><div class="play-loader-veil"></div><div class="play-loader-mark">OSIRIS WATCH</div>`;
      document.body.appendChild(el);
    }
    const bgEl = el.querySelector(".play-loader-bg");
    if (bgEl && bg) bgEl.style.backgroundImage = `url(${esc(bg)})`;
    if (instant) {
      el.classList.add("on", "instant");
    } else {
      el.classList.remove("instant", "is-leaving");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add("on"));
      });
    }
    setTimeout(() => {
      el.classList.add("is-leaving");
      el.classList.remove("on");
      setTimeout(() => {
        el.remove();
        resolve();
      }, 320);
    }, hold);
  });
}

function navigateWithLoader(href, bg, title) {
  if (prefersReducedMotion()) {
    location.href = href;
    return;
  }
  NProgress.start();
  sessionStorage.setItem("orc_loader", JSON.stringify({ bg: bg || "", title: title || "" }));
  let el = document.getElementById("play-loader-live");
  if (!el) {
    el = document.createElement("div");
    el.id = "play-loader-live";
    el.className = "play-loader";
    el.innerHTML = `<div class="play-loader-bg"></div><div class="play-loader-veil"></div><div class="play-loader-mark">OSIRIS WATCH</div>`;
    document.body.appendChild(el);
  }
  const bgEl = el.querySelector(".play-loader-bg");
  if (bgEl && bg) bgEl.style.backgroundImage = `url(${esc(bg)})`;
  el.classList.remove("is-leaving");
  requestAnimationFrame(() => {
    el.classList.add("on");
    setTimeout(() => { location.href = href; }, 220);
  });
}

function navigateWithLoader(href, bg, title) {
  if (prefersReducedMotion()) {
    location.href = href;
    return;
  }
  NProgress.start();
  sessionStorage.setItem("orc_loader", JSON.stringify({ bg, title }));
  playLoader(bg, title).then(() => { location.href = href; });
}

const NProgress = {
  el: null,
  init() {
    if (this.el) return;
    this.el = document.createElement("div");
    this.el.id = "nprogress";
    this.el.innerHTML = '<div class="bar"></div>';
    document.body.appendChild(this.el);
  },
  start() {
    this.init();
    const bar = this.el.querySelector(".bar");
    this.el.classList.add("busy");
    bar.style.width = "0%";
    requestAnimationFrame(() => { bar.style.width = "65%"; });
  },
  done() {
    if (!this.el) return;
    const bar = this.el.querySelector(".bar");
    bar.style.width = "100%";
    setTimeout(() => {
      this.el.classList.remove("busy");
      bar.style.width = "0%";
    }, 280);
  },
};

document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
  try {
    const dest = new URL(a.href, location.origin);
    if (dest.origin !== location.origin) return;
    if (dest.href === location.href) return;
    if (dest.pathname === location.pathname && dest.search === location.search) return;
    NProgress.start();
  } catch (_) {}
});
window.addEventListener("pageshow", () => NProgress.done());

function initPullRefresh() {
  if (!isTouch()) return;
  let startY = 0;
  let pulling = false;
  const indicator = document.createElement("div");
  indicator.className = "ptr-indicator";
  indicator.textContent = "Release to refresh";
  indicator.hidden = true;
  document.body.appendChild(indicator);

  document.addEventListener("touchstart", e => {
    if (window.scrollY > 8) return;
    startY = e.touches[0].clientY;
    pulling = true;
  }, { passive: true });
  document.addEventListener("touchmove", e => {
    if (!pulling) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 40 && window.scrollY <= 0) {
      indicator.hidden = false;
      indicator.style.opacity = String(Math.min(1, dy / 120));
    } else indicator.hidden = true;
  }, { passive: true });
  document.addEventListener("touchend", e => {
    if (!pulling) return;
    pulling = false;
    const dy = e.changedTouches[0].clientY - startY;
    indicator.hidden = true;
    if (window.scrollY <= 8 && dy > 100) location.reload();
  }, { passive: true });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

function checkPlayLoader() {
  const d = sessionStorage.getItem("orc_loader");
  if (!d) return Promise.resolve();
  sessionStorage.removeItem("orc_loader");
  try { const { bg, title } = JSON.parse(d); return playLoader(bg, title); } catch { return Promise.resolve(); }
}

document.addEventListener("DOMContentLoaded", () => {
  PAGE = detectPage();
  try {
    LiquidGlass.init();
    applyGlobalSettings();
    injectGlassFilters();
    initGlassFilter();
    NProgress.done();
    initAnchorScroll();
    initGlobalShortcuts();
    initBackToTop();
    initPullRefresh();
    registerServiceWorker();
    switch (PAGE) {
      case "home": initHomePage().catch(e => console.error(e)); break;
      case "movie": initMoviePage().catch(e => console.error(e)); break;
      case "tv": initTvPage().catch(e => console.error(e)); break;
      case "search": initSearchPage(); break;
      case "list": initListPage(); break;
      case "settings": initSettingsPage(); break;
      case "dmca": initDmcaPage(); break;
    }
  } catch (e) {
    console.error("Osiris Watch init failed:", e);
    const header = $("#detail-header");
    if (header) header.innerHTML = `<p style="color:var(--text-muted)">Something went wrong loading this page. Try refreshing.</p>`;
  }
});