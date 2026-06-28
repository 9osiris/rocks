const TMDB_KEY  = "5622cafbfe8f8cfe358a29c53e19bba0";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_W500  = "https://image.tmdb.org/t/p/w500";
const IMG_W45   = "https://image.tmdb.org/t/p/w45";
const IMG_ORIG  = "https://image.tmdb.org/t/p/original";
const BRAND     = "OsirisCinema";
const ACCENT    = "7c5cff";

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
];

const PLAYER_HOSTS = [
  "vidking.net", "www.vidking.net",
  "vidsrc-embed.ru", "vidsrc-embed.su", "vidsrcme.su", "vsrc.su",
  "v2.vidsrc.me", "vidsrc.me",
  "111movies.com", "www.111movies.com",
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
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L19 7"/></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`,
  fullscreenExit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 9H5V5M15 5h4v4M5 15v4h4M19 15v4h-4"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

async function tmdb(path) {
  const sep = path.includes("?") ? "&" : "?";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(`${TMDB_BASE}${path}${sep}api_key=${TMDB_KEY}`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
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
    `<img src="${IMG_W45}${p.logo_path}" alt="${esc(p.provider_name)}" title="${esc(p.provider_name)}" loading="lazy"/>`
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
    d.innerHTML = `${a.profile_path ? `<img src="${IMG_W500}${a.profile_path}" alt="" loading="lazy" draggable="false"/>` : `<div class="cast-placeholder"></div>`}<div class="name" title="${esc(a.name)}">${esc(a.name)}</div><div class="role" title="${esc(a.character || "")}">${esc(a.character || "")}</div>`;
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
  try {
    const p = await tmdb(`/person/${id}?append_to_response=combined_credits`);
    const credits = (p.combined_credits?.cast || []).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 12);
    box.innerHTML = `
      <div class="person-head">
        ${p.profile_path ? `<img src="${IMG_W500}${p.profile_path}" alt=""/>` : `<div class="person-ph"></div>`}
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
function setProvider(id) { localStorage.setItem("orc_provider", id); }

const SETTINGS = {
  accentKey: "orc_accent",
  reduceMotionKey: "orc_reduce_motion",
  hideWatchedKey: "orc_hide_watched",
  autoplayTrailersKey: "orc_autoplay_trailers",
  get(k, def = "") { return localStorage.getItem(k) ?? def; },
  set(k, v) { localStorage.setItem(k, v); },
  toggle(k) {
    const on = localStorage.getItem(k) === "1";
    localStorage.setItem(k, on ? "0" : "1");
    return !on;
  },
};

const ACCENT_COLORS = [
  { id: "7c5cff", label: "Violet" },
  { id: "3b82f6", label: "Blue" },
  { id: "ef4444", label: "Red" },
  { id: "22c55e", label: "Green" },
  { id: "f97316", label: "Orange" },
  { id: "ec4899", label: "Pink" },
  { id: "06b6d4", label: "Cyan" },
];

function applyGlobalSettings() {
  let hex = SETTINGS.get(SETTINGS.accentKey, ACCENT) || ACCENT;
  hex = String(hex).replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) hex = ACCENT;
  document.documentElement.style.setProperty("--accent", `#${hex}`);
  document.documentElement.style.setProperty("--accent-dim", `#${hex}`);
  document.documentElement.style.setProperty("--accent-soft", `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, 0.14)`);
  document.documentElement.classList.toggle("reduce-motion", SETTINGS.get(SETTINGS.reduceMotionKey) === "1");
}
function providerUrl(type, id, s, e) {
  const p = PROVIDERS.find(x => x.id === getProvider()) || PROVIDERS[0];
  return type === "tv" ? p.tv(id, s, e) : p.movie(id);
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
  iframe.setAttribute("allowfullscreen", "");
  iframe.setAttribute("webkitallowfullscreen", "");
  iframe.setAttribute("mozallowfullscreen", "");
  iframe.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture");
  return iframe;
}

function isPlayerFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function togglePlayerFullscreen(frameEl) {
  if (!frameEl) return;
  if (isPlayerFullscreen()) {
    (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    return;
  }
  const req = frameEl.requestFullscreen || frameEl.webkitRequestFullscreen;
  if (req) req.call(frameEl).catch(() => {});
}

function syncPlayerFsBtn(frameEl) {
  const btn = frameEl?.querySelector(".player-fs-btn");
  if (btn) btn.innerHTML = isPlayerFullscreen() ? ICONS.fullscreenExit : ICONS.fullscreen;
}

function ensurePlayerFsBtn(frameEl) {
  if (!frameEl || frameEl.querySelector(".player-fs-btn")) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "player-fs-btn";
  btn.setAttribute("aria-label", "Fullscreen");
  btn.innerHTML = ICONS.fullscreen;
  btn.addEventListener("click", e => {
    e.stopPropagation();
    togglePlayerFullscreen(frameEl);
  });
  frameEl.appendChild(btn);
}

function loadPlayerFrame(frameEl, url) {
  if (!frameEl) return;
  frameEl.innerHTML = "";
  const iframe = createPlayerIframe(url);
  if (!iframe) {
    frameEl.innerHTML = `<p style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.85rem;padding:20px;text-align:center">Could not load this stream source.</p>`;
    return;
  }
  frameEl.appendChild(iframe);
  ensurePlayerFsBtn(frameEl);
}

let playerGuardReady = false;

function initPlayerGuard() {
  if (playerGuardReady) return;
  playerGuardReady = true;

  document.addEventListener("fullscreenchange", () => {
    syncPlayerFsBtn($("#player-frame"));
  });
  document.addEventListener("webkitfullscreenchange", () => {
    syncPlayerFsBtn($("#player-frame"));
  });

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
    if (i >= 0) { list.splice(i, 1); localStorage.setItem(this.key, JSON.stringify(list)); return false; }
    list.unshift(item); localStorage.setItem(this.key, JSON.stringify(list)); return true;
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
    localStorage.setItem(this.key, JSON.stringify(all));
  },
};

/* ===== Recent Searches ===== */

const RecentSearches = {
  key: "orc_recent_searches",
  get() { try { return JSON.parse(localStorage.getItem(this.key) || "[]"); } catch { return []; } },
  add(term) {
    const q = term.trim();
    if (!q) return;
    let list = this.get().filter(s => s.toLowerCase() !== q.toLowerCase());
    list.unshift(q);
    list = list.slice(0, 5);
    localStorage.setItem(this.key, JSON.stringify(list));
  },
  clear() { localStorage.removeItem(this.key); },
};

window.addEventListener("message", e => {
  try {
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
  if ($("#main-search-input") || document.body.classList.contains("search-page")) return "search";
  if ($(".settings-body") || document.body.classList.contains("settings-page")) return "settings";
  if ($(".legal-body") || document.body.classList.contains("legal-page")) return "dmca";
  if ($("#categories") || $("#hero-title") || $("#splash-screen")) return "home";

  const seg = (location.pathname.split("/").pop() || "").replace(/\.html$/i, "").toLowerCase();
  const bySeg = { movie: "movie", tv: "tv", search: "search", settings: "settings", dmca: "dmca", index: "home", osiriscinema: "home" };
  if (bySeg[seg]) return bySeg[seg];

  const p = location.pathname.replace(/\/$/, "") || "/";
  if (p === "/movie" || p.endsWith("/movie")) return "movie";
  if (p === "/tv" || p.endsWith("/tv")) return "tv";
  if (p === "/search" || p.endsWith("/search")) return "search";
  if (p === "/settings" || p.endsWith("/settings")) return "settings";
  if (p === "/dmca" || p.endsWith("/dmca")) return "dmca";
  return "home";
}

const normPath = p => (p.replace(/\/$/, "") || "/");

const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
const isMobile = () => matchMedia("(max-width: 768px)").matches;

function initMobileUI(page) {
  document.documentElement.classList.toggle("is-touch", isTouch());
  if (!isMobile() || page === "home") return;
  if ($("#mobile-float-back")) return;
  const btn = document.createElement("a");
  btn.id = "mobile-float-back";
  btn.className = "mobile-float-back";
  btn.href = homeUrl();
  btn.setAttribute("aria-label", "Back");
  btn.innerHTML = ICONS.back;
  document.body.appendChild(btn);
}

// ── FIX 1: mismatched backtick/quote on the two anchor hrefs ──────────────────
function initSidebar(active) {
  const el = $("#sidebar");
  if (!el) return;

  const link = (href, icon, label, act) =>
    `<a href="${href}" class="sidebar-link${act ? " active" : ""}">${icon}<span class="mob-label">${label}</span><span class="tip">${label}</span></a>`;

  el.className = "sidebar";
  el.innerHTML = `
    <div class="sidebar-inner">
      <a href="${homeUrl()}" class="sidebar-logo"><img src="images/favicon.svg" alt=""></a>
      <nav class="sidebar-nav">
        ${link("/search", ICONS.search, "Search", active === "search")}
        ${link(homeUrl(), ICONS.home, "Home", active === "home")}
        ${link("/search?type=movie", ICONS.film, "Movies", active === "movies")}
        ${link("/search?type=tv", ICONS.tv, "TV", active === "tv")}
        <div class="sidebar-divider"></div>
        ${link(`${homeUrl()}#trending`, ICONS.trend, "Trending", false)}
        ${link(`${homeUrl()}#my-list`, ICONS.list, "My List", false)}
        ${link("/settings", ICONS.settings, "Settings", active === "settings")}
      </nav>
    </div>`;

  initSidebarDock();
  if (!isMobile() && PINNED_SIDEBAR_PAGES.has(PAGE)) {
    document.body.classList.add("sidebar-open", "sidebar-pinned");
  }
  initMobileUI(PAGE);
}

function initSidebarDock() {
  if (isMobile()) return;
  document.body.classList.add("sidebar-dock");
  if ($("#sidebar-edge")) return;

  const edge = document.createElement("div");
  edge.id = "sidebar-edge";
  edge.setAttribute("aria-hidden", "true");
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
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2400);
}

function observeRows() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".row-wrapper").forEach(r => obs.observe(r));
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
  card.innerHTML = `
    ${opts.rank ? `<span class="rank">${opts.rank}</span>` : ""}
    ${!opts.rank && item.vote_average >= 6 ? `<span class="card-rating">★ ${item.vote_average.toFixed(1)}</span>` : ""}
    ${img ? `<img src="${esc(img)}" alt="" loading="lazy" draggable="false" decoding="async" />` : `<div class="no-img">—</div>`}
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
    location.href = href;
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

  titleEl.innerHTML = `Trending Movies <span class="row-period-wrap">
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
  const offset = isMobile() ? 12 : 28;
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
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) scrollToEl(target);
  });
}

function injectGlassFilters() {
  if ($("#glass-distortion")) return;
  const distortion = `
    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="1" seed="5" result="turbulence"/>
      <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap"/>
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale="55" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
  const existing = $(".splash-filters");
  if (existing) {
    existing.insertAdjacentHTML("beforeend", distortion);
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
    </svg>`;
  document.body.prepend(wrap);
}

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

/* ===== Hero skeleton ===== */

const PLAY_ICON_SVG = `<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

// ── FIX 2: closed the innerHTML template literal properly ─────────────────────
function showHeroSkeleton() {
  const backdrop = $("#hero-backdrop");
  if (backdrop) backdrop.classList.add("has-skeleton");

  const hero = $(".hero");
  if (!hero) return;
  const old = $(".hero-skeleton-content");
  if (old) return;

  const skel = document.createElement("div");
  skel.className = "hero-skeleton-content";
  skel.innerHTML = `
    <div class="hero-skeleton-type"></div>
    <div class="hero-skeleton-title"></div>
    <div class="hero-skeleton-desc"><span></span><span></span><span></span></div>
    <div class="hero-skeleton-meta"></div>
    <div class="hero-skeleton-actions"></div>`;

  hero.appendChild(skel);
}

function hideHeroSkeleton() {
  $(".hero-skeleton-content")?.remove();
  $("#hero-backdrop")?.classList.remove("has-skeleton");
}
