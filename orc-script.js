"use strict";

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
    movie: id => `https://vidsrc-embed.ru/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc-embed.ru/embed/tv/${id}/${s}/${e}` },
  { id: "111movies", name: "111Movies",
    movie: id => `https://111movies.com/movie/${id}`,
    tv: (id, s, e) => `https://111movies.com/tv/${id}/${s}/${e}` },
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
function renderKeywords(container, keywords, type) {
  if (!container) return;
  const list = keywords?.keywords || keywords?.results || [];
  if (!list.length) { container.style.display = "none"; return; }
  container.style.display = "";
  container.innerHTML = list.slice(0, 12).map(k =>
    `<a href="/search?type=${type}&q=${encodeURIComponent(k.name)}" class="keyword-pill">${esc(k.name)}</a>`
  ).join("");
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
  if (!isMobile() || page !== "movie" && page !== "tv") return;
  if ($("#mobile-float-back")) return;
  const btn = document.createElement("a");
  btn.id = "mobile-float-back";
  btn.className = "mobile-float-back";
  btn.href = homeUrl();
  btn.setAttribute("aria-label", "Back");
  btn.innerHTML = ICONS.back;
  document.body.appendChild(btn);
}

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
        ${link("/search?type=tv", ICONS.tv, "TV Shows", active === "tv")}
        <div class="sidebar-divider"></div>
        ${link(`${homeUrl()}#trending`, ICONS.trend, "Trending", false)}
        ${link(`${homeUrl()}#my-list`, ICONS.list, "My List", false)}
        ${link("/settings", ICONS.settings, "Settings", active === "settings")}
      </nav>
    </div>`;

  initSidebarDock();
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
      heroTimer = setInterval(() => setHeroSlide((heroIndex + 1) % heroSlides.length, true), HERO_INTERVAL);
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
  await loadHero(heroSlides[i]);
  if (animate) {
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    $(".hero")?.classList.remove("hero-fading");
    heroFading = false;
  }
  restartDotFill(i);
}

function initHeroCarousel(slides) {
  if (!slides.length) return;
  heroSlides = slides;
  buildHeroDots();
  loadHero(slides[0]);
  if (slides.length > 1) {
    heroTimer = setInterval(() => setHeroSlide((heroIndex + 1) % heroSlides.length, true), HERO_INTERVAL);
  }
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
  if ($("#hero-title")) $("#hero-title").textContent = title;
  if ($("#hero-desc")) $("#hero-desc").textContent = item.overview || "";

  const cacheKey = `${realType}_${id}`;
  try {
    let d = heroDetailCache[cacheKey];
    if (!d) {
      d = await tmdb(`/${realType}/${id}?append_to_response=videos`);
      heroDetailCache[cacheKey] = d;
    }
    heroData._detail = d;
    heroData._type = realType;
    const rating = d.vote_average?.toFixed(1);
    const metaParts = [];
    if (rating) metaParts.push(`★ ${rating}`);
    if (year(d.release_date || d.first_air_date)) metaParts.push(year(d.release_date || d.first_air_date));
    if (d.runtime) metaParts.push(formatRuntime(d.runtime));
    else if (d.number_of_seasons) metaParts.push(`${d.number_of_seasons} Season${d.number_of_seasons > 1 ? "s" : ""}`);
    if (d.genres?.length) metaParts.push(d.genres.slice(0, 3).map(g => g.name).join(", "));
    if ($("#hero-meta")) $("#hero-meta").textContent = metaParts.join("  ·  ");

    const videos = d.videos?.results || [];
    const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos.find(v => v.site === "YouTube");
    const trBtn = $("#hero-trailer-btn");
    if (trBtn) {
      trBtn.style.display = trailer ? "" : "none";
      trBtn.dataset.key = trailer?.key || "";
    }
  } catch (_) {}

  bindHeroActions();
}

function bindHeroActions() {
  if (heroBound) return;
  heroBound = true;
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
  $("#hero-trailer-btn")?.addEventListener("click", () => {
    const key = $("#hero-trailer-btn")?.dataset.key;
    if (key) openTrailer(key);
  });
}

function openTrailer(youtubeKey) {
  let modal = $("#trailer-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "trailer-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `<button class="modal-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="modal-box"><iframe allowfullscreen allow="autoplay"></iframe></div>`;
    document.body.appendChild(modal);
    modal.querySelector(".modal-close").addEventListener("click", closeTrailer);
    modal.addEventListener("click", e => { if (e.target === modal) closeTrailer(); });
  }
  modal.querySelector("iframe").src = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0`;
  modal.classList.add("open");
}

function closeTrailer() {
  const modal = $("#trailer-modal");
  if (!modal) return;
  modal.classList.remove("open");
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
      const track = row.querySelector(".row-track");
      track.innerHTML = ""; skeletons(10).forEach(s => track.appendChild(s));
      try {
        const data = await tmdb(`/discover/movie?with_genres=${g.id}&sort_by=popularity.desc`);
        track.innerHTML = "";
        (data.results || []).slice(0, 20).forEach(it => track.appendChild(buildCard(it, "movie")));
      } catch (_) {}
    });
    strip.appendChild(btn);
  });
}

async function initHomePage() {
  initSplash();
  initSidebar("home");
  initGenreStrip();

  const el = $("#categories");
  if (!el) return;
  const cats = [
    { title: "New This Week", path: "/movie/now_playing", type: "movie" },
    { title: "Trending Now", path: "/trending/all/week", type: "movie", id: "trending", ranks: true },
    { title: "Top Rated", path: "/movie/top_rated", type: "movie", seeAll: "/search?type=movie" },
    { title: "Coming Soon", path: "/movie/upcoming", type: "movie" },
    { title: "Popular TV", path: "/tv/popular", type: "tv", seeAll: "/search?type=tv" },
    { title: "On The Air", path: "/tv/on_the_air", type: "tv" },
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
    const items = res.value.results || [];
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
    (gd.results || []).slice(0, 20).forEach(it => gRow.querySelector(".row-track").appendChild(buildCard(it, "movie")));
  } catch (_) {}
  el.prepend(gRow);

  observeRows();
  const main = $("#main-content");
  if (main && !$("#splash-screen")) main.style.opacity = "1";

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
  PROVIDERS.forEach(p => {
    const btn = document.createElement("button");
    btn.className = `provider-tab${getProvider() === p.id ? " active" : ""}`;
    btn.textContent = p.name;
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

  initSidebar();
  checkPlayLoader();

  const showErr = msg => {
    if (header) header.innerHTML = `<p style="color:var(--text-muted)">${esc(msg)}</p>`;
    if (frame) frame.innerHTML = `<p style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.85rem;padding:20px;text-align:center">Could not load player.</p>`;
  };

  let m;
  try {
    m = await tmdb(`/movie/${id}?append_to_response=credits,similar,videos,recommendations`);
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
    header.innerHTML = `
      <h1 class="detail-title">${esc(m.title)}</h1>
      ${m.tagline ? `<p class="detail-tagline">${esc(m.tagline)}</p>` : ""}
      ${m.belongs_to_collection ? `<a class="collection-banner" href="/search?type=movie&q=${encodeURIComponent(m.belongs_to_collection.name)}">Part of ${esc(m.belongs_to_collection.name)}</a>` : ""}
      <div class="detail-meta">
        ${m.vote_average ? `<span class="score">★ ${m.vote_average.toFixed(1)}</span>` : ""}
        ${m.vote_count ? `<span>${fmtVotes(m.vote_count)}</span>` : ""}
        <span>${year(m.release_date)}</span>
        ${m.runtime ? `<span>${formatRuntime(m.runtime)}</span>` : ""}
        ${genreTags(m.genres, "movie")}
      </div>
      <p class="detail-overview">${esc(m.overview || "")}</p>
      <div class="detail-actions">
        <button class="btn-play" id="detail-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play</button>
        ${trailer ? `<button class="btn-ghost" id="detail-trailer">Trailer</button>` : ""}
        <button class="btn-ghost" id="detail-save">${saved ? "✓ Saved" : "+ My List"}</button>
      </div>`;

    $("#detail-play")?.addEventListener("click", () => scrollToSelector("#player-frame"));
    if (trailer) $("#detail-trailer")?.addEventListener("click", () => openTrailer(trailer.key));
    $("#detail-save")?.addEventListener("click", () => {
      const a = MyList.toggle({ id: m.id, type: "movie", title: m.title, poster: m.poster_path });
      const btn = $("#detail-save");
      if (btn) btn.textContent = a ? "✓ Saved" : "+ My List";
      toast(a ? "Added to My List" : "Removed");
    });

    const load = url => { frame.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay; fullscreen"></iframe>`; };
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
    renderWatchProviders(hostAfter(header, "watch-providers-host"), extras["watch/providers"]);
    renderKeywords(hostAfter($("#watch-providers-host") || header, "keywords-host"), extras.keywords, "movie");
  }).catch(() => {});
}

async function initTvPage() {
  initSidebar("tv");
  checkPlayLoader();
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
    const show = await tmdb(`/tv/${id}?append_to_response=credits,similar,recommendations,videos`);
    document.title = `${show.name} — ${BRAND}`;
    const backdropEl = $("#detail-backdrop");
    if (backdropEl && show.backdrop_path) backdropEl.style.backgroundImage = `url(${IMG_ORIG}${show.backdrop_path})`;

    const saved = MyList.has(show.id, "tv");
    const trailer = pickTrailer(show.videos);
    const creators = (show.created_by || []).map(c => c.name).join(", ");
    if (header) header.innerHTML = `
      <h1 class="detail-title">${esc(show.name)}</h1>
      ${show.tagline ? `<p class="detail-tagline">${esc(show.tagline)}</p>` : ""}
      <div class="detail-meta">
        ${show.vote_average ? `<span class="score">★ ${show.vote_average.toFixed(1)}</span>` : ""}
        ${show.vote_count ? `<span>${fmtVotes(show.vote_count)}</span>` : ""}
        <span>${year(show.first_air_date)}</span>
        ${show.number_of_seasons ? `<span>${show.number_of_seasons} Seasons</span>` : ""}
        ${show.number_of_episodes ? `<span>${show.number_of_episodes} Eps</span>` : ""}
        ${genreTags(show.genres, "tv")}
      </div>
      <p class="detail-overview">${esc(show.overview || "")}</p>
      <div class="detail-actions">
        <button class="btn-play" id="detail-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play</button>
        ${trailer ? `<button class="btn-ghost" id="detail-trailer">Trailer</button>` : ""}
        <button class="btn-ghost" id="detail-save">${saved ? "✓ Saved" : "+ My List"}</button>
      </div>`;

    $("#detail-play")?.addEventListener("click", () => scrollToSelector("#player-frame"));
    if (trailer) $("#detail-trailer")?.addEventListener("click", () => openTrailer(trailer.key));
    $("#detail-save")?.addEventListener("click", () => {
      const a = MyList.toggle({ id: show.id, type: "tv", title: show.name, poster: show.poster_path });
      $("#detail-save").textContent = a ? "✓ Saved" : "+ My List";
      toast(a ? "Added to My List" : "Removed");
    });

    const seasons = (show.seasons || []).filter(s => s.season_number > 0);
    const seasonNums = seasons.map(s => s.season_number);
    if (seasonNums.length && !seasonNums.includes(season)) season = seasonNums[0];
    if (!Number.isFinite(episode) || episode < 1) episode = 1;

    const update = () => {
      if (frame) frame.innerHTML = `<iframe src="${providerUrl("tv", id, season, episode)}" allowfullscreen allow="autoplay; fullscreen"></iframe>`;
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
          const air = ep.air_date ? new Date(ep.air_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
          const dur = ep.runtime ? `${ep.runtime}m` : "";
          el.innerHTML = `
            <span class="ep-row-num">${ep.episode_number}</span>
            <div class="ep-row-thumb">${ep.still_path ? `<img src="${IMG_W500}${ep.still_path}" alt="" loading="lazy" draggable="false"/>` : ""}</div>
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
            scrollToSelector("#player-frame");
          });
          $("#ep-grid").appendChild(el);
        });
      } catch {
        $("#ep-grid").innerHTML = `<p style="color:var(--text-muted)">Episodes unavailable.</p>`;
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
      renderWatchProviders(hostAfter(header, "watch-providers-host"), extras["watch/providers"]);
      renderKeywords(hostAfter($("#watch-providers-host") || header, "keywords-host"), extras.keywords, "tv");
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
  const chips = $$(".filter-chip");
  let current = filter === "movie" || filter === "tv" ? filter : "all";
  let timer, lastQ = "";

  chips.forEach(c => c.classList.toggle("on", c.dataset.filter === current));
  chips.forEach(c => c.addEventListener("click", () => {
    current = c.dataset.filter;
    chips.forEach(x => x.classList.toggle("on", x === c));
    doSearch(lastQ || input?.value.trim() || "");
  }));

  async function doSearch(q) {
    if (!status || !grid) return;
    lastQ = q;
    if (!q && current === "all" && !genreId) {
      status.textContent = "";
      grid.innerHTML = `<div class="no-results"><h3>What are you looking for?</h3><p>Search by title or browse categories from the sidebar.</p></div>`;
      return;
    }
    status.textContent = "Loading…";
    grid.innerHTML = ""; skeletons(12).forEach(s => grid.appendChild(s));

    try {
      let items = [];
      if (genreId && !q) {
        const media = current === "tv" ? "tv" : "movie";
        const genreName = GENRES.find(g => String(g.id) === genreId)?.name || "Genre";
        const data = await tmdb(`/discover/${media}?with_genres=${genreId}&sort_by=popularity.desc`);
        items = data.results || [];
        status.textContent = `${genreName} · ${items.length} titles`;
      } else if (q) {
        let path = "/search/multi";
        if (current === "movie") path = "/search/movie";
        if (current === "tv") path = "/search/tv";
        const data = await tmdb(`${path}?query=${encodeURIComponent(q)}`);
        items = (data.results || []).filter(i => i.poster_path || i.backdrop_path);
        if (current !== "all") items = items.filter(i => (i.media_type || current) === current);
        status.textContent = `${items.length} results`;
      } else {
        const data = await tmdb(current === "tv" ? "/tv/popular" : "/movie/popular");
        items = data.results || [];
        status.textContent = `Popular ${current === "tv" ? "series" : "films"}`;
      }

      grid.innerHTML = "";
      if (!items.length) {
        grid.innerHTML = `<div class="no-results"><h3>Nothing matched</h3><p>Try different keywords.</p></div>`;
        if (!genreId) status.textContent = "";
        return;
      }
      items.forEach(item => grid.appendChild(buildCard(item, mediaType(item, current === "tv" ? "tv" : "movie"))));
    } catch {
      grid.innerHTML = `<div class="no-results"><p>Search failed — check your connection.</p></div>`;
      status.textContent = "";
    }
  }

  const q = params.get("q") || "";
  if (input) {
    input.value = q;
    input.addEventListener("input", () => {
      if (clear) clear.style.display = input.value ? "flex" : "none";
      clearTimeout(timer);
      timer = setTimeout(() => doSearch(input.value.trim()), 400);
    });
    if (q) { clear.style.display = "flex"; doSearch(q); }
    else if (genreId) doSearch("");
    else doSearch(current !== "all" ? "" : "");
  }
  clear?.addEventListener("click", () => { input.value = ""; clear.style.display = "none"; doSearch(""); input.focus(); });
}

function initSettingsPage() {
  initSidebar("settings");
  document.title = "Settings — Osiris's Cinema";

  const providerBox = $("#settings-providers");
  if (providerBox) {
    providerBox.innerHTML = "";
    PROVIDERS.forEach(p => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `settings-provider${getProvider() === p.id ? " active" : ""}`;
      btn.textContent = p.name;
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

  const bindToggle = (id, key, label) => {
    const el = $(id);
    if (!el) return;
    const sync = () => el.classList.toggle("on", SETTINGS.get(key) === "1");
    sync();
    el.addEventListener("click", () => {
      const on = SETTINGS.toggle(key);
      sync();
      if (key === SETTINGS.reduceMotionKey) applyGlobalSettings();
      toast(`${label} ${on ? "enabled" : "disabled"}`);
    });
  };

  bindToggle("#toggle-reduce-motion", SETTINGS.reduceMotionKey, "Reduce motion");
  bindToggle("#toggle-hide-watched", SETTINGS.hideWatchedKey, "Hide watched");
  bindToggle("#toggle-autoplay-trailers", SETTINGS.autoplayTrailersKey, "Auto-play trailers");

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

function initDmcaPage() {
  initSidebar("home");
  document.title = "DMCA — Osiris's Cinema";
}

function playLoader(bg, title) {
  return new Promise(resolve => {
    const el = document.createElement("div");
    el.className = "play-loader";
    el.innerHTML = `<div class="play-loader-bg" style="background-image:url(${esc(bg || "")})"></div><div class="play-loader-veil"></div><div class="play-loader-mark">OSIRIS</div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("on"));
    setTimeout(() => { el.classList.remove("on"); setTimeout(() => { el.remove(); resolve(); }, 450); }, 1800);
  });
}

function navigateWithLoader(href, bg, title) {
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
  if (!a || a.target === "_blank") return;
  try {
    const dest = new URL(a.href, location.origin);
    if (dest.origin !== location.origin) return;
    if (dest.pathname !== location.pathname) NProgress.start();
  } catch (_) {}
});
window.addEventListener("pageshow", () => NProgress.done());

function checkPlayLoader() {
  const d = sessionStorage.getItem("orc_loader");
  if (!d) return Promise.resolve();
  sessionStorage.removeItem("orc_loader");
  try { const { bg, title } = JSON.parse(d); return playLoader(bg, title); } catch { return Promise.resolve(); }
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeTrailer();
    closePersonModal();
    closePopup();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  PAGE = detectPage();
  try {
    applyGlobalSettings();
    injectGlassFilters();
    initGlassFilter();
    NProgress.done();
    initAnchorScroll();
    switch (PAGE) {
      case "home": initHomePage().catch(e => console.error(e)); break;
      case "movie": initMoviePage().catch(e => console.error(e)); break;
      case "tv": initTvPage().catch(e => console.error(e)); break;
      case "search": initSearchPage(); break;
      case "settings": initSettingsPage(); break;
      case "dmca": initDmcaPage(); break;
    }
  } catch (e) {
    console.error("Osiris init failed:", e);
    const header = $("#detail-header");
    if (header) header.innerHTML = `<p style="color:var(--text-muted)">Something went wrong loading this page. Try refreshing.</p>`;
  }
});
