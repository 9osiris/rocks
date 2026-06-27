"use strict";

const TMDB_KEY  = "5622cafbfe8f8cfe358a29c53e19bba0";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_W500  = "https://image.tmdb.org/t/p/w500";
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
  shuffle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg>`,
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

async function tmdb(path) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${TMDB_BASE}${path}${sep}api_key=${TMDB_KEY}`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

function posterUrl(p) { return p ? `${IMG_W500}${p}` : null; }
function year(d) { return d ? d.slice(0, 4) : ""; }
function formatRuntime(m) {
  if (!m) return "";
  const h = Math.floor(m / 60), r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
}
function esc(s = "") {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
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
  return location.pathname.toLowerCase().includes("osiriscinema") ? "OsirisCinema.html" : "index.html";
}

function getProvider() { return localStorage.getItem("orc_provider") || PROVIDERS[0].id; }
function setProvider(id) { localStorage.setItem("orc_provider", id); }
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
  getAll() { return Object.values(this.get()); },
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
    if (msg.type === "PLAYER_EVENT" && msg.data?.id && msg.data.progress > 1 && msg.data.progress < 98) {
      Progress.save(msg.data.id, msg.data.mediaType || "movie", msg.data);
    }
  } catch (_) {}
});

const PAGE = (() => {
  const p = location.pathname.toLowerCase();
  if (p.includes("movie")) return "movie";
  if (p.includes("tv")) return "tv";
  if (p.includes("search")) return "search";
  return "home";
})();

const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
const isMobile = () => matchMedia("(max-width: 768px)").matches;

function initMobileUI(page) {
  document.documentElement.classList.toggle("is-touch", isTouch());
  if (!isMobile()) return;

  const shell = $(".app-shell");
  if (!shell || $("#mobile-topbar")) return;

  const isDetail = page === "movie" || page === "tv";
  const bar = document.createElement("header");
  bar.id = "mobile-topbar";
  bar.className = "mobile-topbar";

  if (isDetail) {
    bar.innerHTML = `
      <a href="${homeUrl()}" class="mobile-back-btn" aria-label="Back">${ICONS.back}</a>
      <span class="mobile-topbar-brand" style="flex:1;justify-content:center;margin-right:40px">
        <img src="images/favicon.svg" alt=""> OSIRIS
      </span>`;
  } else if (page === "search") {
    bar.innerHTML = `
      <a href="${homeUrl()}" class="mobile-topbar-brand">
        <img src="images/favicon.svg" alt=""> OSIRIS
      </a>
      <div class="mobile-topbar-actions"></div>`;
  } else {
    bar.innerHTML = `
      <a href="${homeUrl()}" class="mobile-topbar-brand">
        <img src="images/favicon.svg" alt=""> OSIRIS
      </a>
      <div class="mobile-topbar-actions">
        <a href="search.html" class="mobile-icon-btn" aria-label="Search">${ICONS.search}</a>
      </div>`;
  }

  shell.prepend(bar);
}

function initSidebar(active) {
  const el = $("#sidebar");
  if (!el) return;

  const link = (href, icon, label, act, extra = "") =>
    `<a href="${href}" class="sidebar-link${act ? " active" : ""}" ${extra}>${icon}<span class="mob-label">${label}</span><span class="tip">${label}</span></a>`;

  el.innerHTML = `
    <a href="${homeUrl()}" class="sidebar-logo"><img src="images/favicon.svg" alt="Osiris"></a>
    <nav class="sidebar-nav">
      ${link("search.html", ICONS.search, "Search", active === "search")}
      ${link(homeUrl(), ICONS.home, "Home", active === "home")}
      ${link("search.html?type=movie", ICONS.film, "Movies", active === "movies")}
      ${link("search.html?type=tv", ICONS.tv, "TV", active === "tv")}
      <div class="sidebar-divider"></div>
      ${link(`${homeUrl()}#trending`, ICONS.trend, "Trending", false)}
      ${link(`${homeUrl()}#my-list`, ICONS.list, "My List", false)}
      ${link("#", ICONS.shuffle, "Random", false, 'id="shuffle-btn"')}
    </nav>`;

  $("#shuffle-btn")?.addEventListener("click", async e => {
    e.preventDefault();
    toast("Finding something…");
    try {
      const pick = Math.random() > 0.5 ? "movie" : "tv";
      const page = Math.floor(Math.random() * 15) + 1;
      const data = await tmdb(`/discover/${pick}?sort_by=popularity.desc&page=${page}`);
      const items = (data.results || []).filter(r => r.poster_path);
      if (!items.length) return;
      const item = items[Math.floor(Math.random() * items.length)];
      location.href = pick === "tv" ? `tv.html?id=${item.id}` : `movie.html?id=${item.id}`;
    } catch { toast("Couldn't pick — try again"); }
  });

  initMobileUI(PAGE);
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
  const href = kind === "tv" ? `tv.html?id=${id}` : `movie.html?id=${id}`;
  const saved = MyList.has(id, kind);
  const prog = opts.progressValue ?? Progress.getItem(id, kind)?.progress;

  const card = document.createElement("div");
  card.className = "media-card";
  card.innerHTML = `
    ${opts.rank ? `<span class="rank">${opts.rank}</span>` : ""}
    ${img ? `<img src="${esc(img)}" alt="${esc(title)}" loading="lazy" />` : `<div class="no-img">—</div>`}
    ${prog ? `<div class="progress-bar"><span style="width:${Math.min(prog, 100)}%"></span></div>` : ""}
    <div class="card-quick">
      <button class="card-icon-btn save-btn${saved ? " saved" : ""}" aria-label="Save">${saved ? "✓" : "+"}</button>
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
    btn.textContent = added ? "✓" : "+";
    toast(added ? "Added to My List" : "Removed from list");
  });

  let timer;
  if (!isTouch()) {
    card.addEventListener("mouseenter", () => { timer = setTimeout(() => showPopup(card, item, kind), 450); });
    card.addEventListener("mouseleave", () => clearTimeout(timer));
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
  activePopup.classList.add("closing");
  const el = activePopup;
  setTimeout(() => el.remove(), 150);
  activePopup = null;
  if (popupScrollHandler) {
    document.removeEventListener("scroll", popupScrollHandler, true);
    popupScrollHandler = null;
  }
}

function showPopup(card, item, type) {
  if (isTouch() || isMobile()) return;
  closePopup();
  const id = item.id;
  const kind = mediaType(item, type);
  const title = item.title || item.name || "Untitled";
  const thumb = item.backdrop_path ? `${IMG_W500}${item.backdrop_path}` : posterUrl(item.poster_path);
  const href = kind === "tv" ? `tv.html?id=${id}` : `movie.html?id=${id}`;
  const saved = MyList.has(id, kind);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "";

  const pop = document.createElement("div");
  pop.className = "card-popup";
  pop.innerHTML = `
    <div class="card-popup-thumb" style="background-image:url(${esc(thumb || "")})"></div>
    <div class="card-popup-body">
      <div class="card-popup-title">${esc(title)}</div>
      <div class="card-popup-meta">${year(item.release_date || item.first_air_date)}${rating ? ` · ★ ${rating}` : ""} · ${kind === "tv" ? "Series" : "Film"}</div>
      <div class="card-popup-actions">
        <button class="pp-play">Play</button>
        <button class="pp-save${saved ? " saved" : ""}">${saved ? "Saved" : "Save"}</button>
      </div>
    </div>`;

  const rect = card.getBoundingClientRect();
  const pw = 240;
  let left = rect.left + rect.width / 2 - pw / 2;
  let top = rect.top - 8;
  if (left < 8) left = 8;
  if (left + pw > innerWidth - 8) left = innerWidth - pw - 8;
  if (top < 12) top = rect.bottom + 6;
  if (top + 160 > innerHeight) top = innerHeight - 170;

  pop.style.left = left + "px";
  pop.style.top = top + "px";
  document.body.appendChild(pop);
  activePopup = pop;

  pop.querySelector(".pp-play").addEventListener("click", () => { closePopup(); location.href = href; });
  pop.querySelector(".pp-save").addEventListener("click", () => {
    const added = MyList.toggle({ id, type: kind, title, poster: item.poster_path });
    const btn = pop.querySelector(".pp-save");
    btn.classList.toggle("saved", added);
    btn.textContent = added ? "Saved" : "Save";
  });
  pop.addEventListener("mouseleave", () => setTimeout(closePopup, 200));
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
  return wrap;
}

function initSplash() {
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
  setTimeout(() => {
    s.classList.add("fade-out");
    if (main) main.style.opacity = "1";
    setTimeout(() => { s.remove(); sessionStorage.setItem("orc_splash", "1"); }, 600);
  }, 2200);
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
  const bd = $("#hero-backdrop");
  const bdImg = $("#hero-backdrop-img");
  if (bdImg && backdrop) {
    bdImg.classList.remove("is-visible");
    bdImg.onload = () => bdImg.classList.add("is-visible");
    bdImg.src = backdrop;
    if (bdImg.complete) bdImg.classList.add("is-visible");
  } else if (bd && backdrop) {
    bd.style.backgroundImage = `url(${backdrop})`;
  }
  if ($("#hero-type")) $("#hero-type").textContent = realType === "tv" ? "Series" : "Film";
  if ($("#hero-title")) $("#hero-title").textContent = title;
  if ($("#hero-desc")) $("#hero-desc").textContent = item.overview || "";

  try {
    const d = await tmdb(`/${realType}/${id}?append_to_response=videos`);
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

  const href = realType === "tv" ? `tv.html?id=${id}` : `movie.html?id=${id}`;
  bindHeroActions(href, backdrop, title);
}

function bindHeroActions(href, backdrop, title) {
  if (heroBound) return;
  heroBound = true;
  $("#hero-play-btn")?.addEventListener("click", () => navigateWithLoader(href, backdrop, title));
  $("#hero-info-btn")?.addEventListener("click", () => { location.href = href; });
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
      row.querySelector(".row-title").textContent = g.name;
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
  const cats = [
    { title: "New This Week", path: "/movie/now_playing", type: "movie" },
    { title: "Trending Now", path: "/trending/all/week", type: "movie", id: "trending", ranks: true },
    { title: "Top Rated", path: "/movie/top_rated", type: "movie", seeAll: "search.html?type=movie" },
    { title: "Coming Soon", path: "/movie/upcoming", type: "movie" },
    { title: "Popular TV", path: "/tv/popular", type: "tv", seeAll: "search.html?type=tv" },
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

  let heroDone = false;
  results.forEach((res, i) => {
    if (res.status !== "fulfilled") return;
    const items = res.value.results || [];
    const c = cats[i];
    if (!heroDone && items.length) {
      const picks = items.filter(i => i.poster_path && (!i.media_type || i.media_type === "movie" || i.media_type === "tv"));
      if (picks.length) {
        heroDone = true;
        loadHero(picks[Math.floor(Math.random() * Math.min(6, picks.length))]);
      }
    }
    const row = buildRow(c.title, items, c.type, { id: c.id, ranks: c.ranks, seeAll: c.seeAll });
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
    setTimeout(() => {
      const target = document.getElementById(hash);
      if (!target) return;
      const offset = isMobile() ? 64 : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 600);
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
  initSidebar("movies");
  await checkPlayLoader();
  const id = new URLSearchParams(location.search).get("id");
  if (!id) { location.href = homeUrl(); return; }

  try {
    const m = await tmdb(`/movie/${id}?append_to_response=credits,similar,videos`);
    document.title = `${m.title} — ${BRAND}`;
    const backdrop = m.backdrop_path ? `${IMG_ORIG}${m.backdrop_path}` : "";
    if ($("#detail-backdrop")) $("#detail-backdrop").style.backgroundImage = `url(${backdrop})`;

    const saved = MyList.has(m.id, "movie");
    $("#detail-header").innerHTML = `
      <h1 class="detail-title">${esc(m.title)}</h1>
      <div class="detail-meta">
        ${m.vote_average ? `<span class="score">★ ${m.vote_average.toFixed(1)}</span>` : ""}
        <span>${year(m.release_date)}</span>
        ${m.runtime ? `<span>${formatRuntime(m.runtime)}</span>` : ""}
        ${(m.genres || []).map(g => `<span class="tag">${esc(g.name)}</span>`).join("")}
      </div>
      <p class="detail-overview">${esc(m.overview || "")}</p>
      <div class="detail-actions">
        <button class="btn-play" id="detail-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play</button>
        <button class="btn-ghost" id="detail-save">${saved ? "✓ Saved" : "+ My List"}</button>
      </div>`;

    $("#detail-play").addEventListener("click", () => $("#player-frame")?.scrollIntoView({ behavior: "smooth" }));
    $("#detail-save").addEventListener("click", () => {
      const a = MyList.toggle({ id: m.id, type: "movie", title: m.title, poster: m.poster_path });
      $("#detail-save").textContent = a ? "✓ Saved" : "+ My List";
      toast(a ? "Added to My List" : "Removed");
    });

    const frame = $("#player-frame");
    const load = url => { if (frame) frame.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay; fullscreen"></iframe>`; };
    renderProviders($("#provider-bar"), "movie", id, 1, 1, load);
    load(providerUrl("movie", id, 1, 1));

    const info = $("#detail-info");
    if (info) info.innerHTML = `
      <div class="info-grid">
        ${m.status ? `<div class="info-cell"><label>Status</label><span>${esc(m.status)}</span></div>` : ""}
        ${m.original_language ? `<div class="info-cell"><label>Language</label><span>${esc(m.original_language.toUpperCase())}</span></div>` : ""}
        ${m.production_companies?.[0] ? `<div class="info-cell"><label>Studio</label><span>${esc(m.production_companies[0].name)}</span></div>` : ""}
      </div>`;

    const cast = m.credits?.cast?.slice(0, 16) || [];
    if (cast.length) {
      $("#cast-section").style.display = "";
      cast.forEach(a => {
        const d = document.createElement("div");
        d.className = "cast-item";
        d.innerHTML = `${a.profile_path ? `<img src="${IMG_W500}${a.profile_path}" alt="" loading="lazy"/>` : `<img alt=""/>`}<div class="name">${esc(a.name)}</div><div class="role">${esc(a.character || "")}</div>`;
        $("#cast-row").appendChild(d);
      });
    }

    const sim = m.similar?.results?.slice(0, 14) || [];
    if (sim.length) {
      $("#similar-section").style.display = "";
      sim.forEach(it => $("#similar-row").appendChild(buildCard(it, "movie")));
    }
  } catch (e) {
    console.error(e);
    $("#detail-header").innerHTML = `<p style="color:var(--text-muted)">Couldn't load this title.</p>`;
  }
}

async function initTvPage() {
  initSidebar("tv");
  await checkPlayLoader();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  let season = parseInt(params.get("season") || "1", 10);
  let episode = parseInt(params.get("episode") || "1", 10);
  if (!id) { location.href = homeUrl(); return; }

  try {
    const show = await tmdb(`/tv/${id}?append_to_response=credits,similar`);
    document.title = `${show.name} — ${BRAND}`;
    if ($("#detail-backdrop") && show.backdrop_path) $("#detail-backdrop").style.backgroundImage = `url(${IMG_ORIG}${show.backdrop_path})`;

    const saved = MyList.has(show.id, "tv");
    $("#detail-header").innerHTML = `
      <h1 class="detail-title">${esc(show.name)}</h1>
      <div class="detail-meta">
        ${show.vote_average ? `<span class="score">★ ${show.vote_average.toFixed(1)}</span>` : ""}
        <span>${year(show.first_air_date)}</span>
        ${show.number_of_seasons ? `<span>${show.number_of_seasons} Seasons</span>` : ""}
        ${(show.genres || []).map(g => `<span class="tag">${esc(g.name)}</span>`).join("")}
      </div>
      <p class="detail-overview">${esc(show.overview || "")}</p>
      <div class="detail-actions">
        <button class="btn-play" id="detail-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play</button>
        <button class="btn-ghost" id="detail-save">${saved ? "✓ Saved" : "+ My List"}</button>
      </div>`;

    $("#detail-play").addEventListener("click", () => $("#player-frame")?.scrollIntoView({ behavior: "smooth" }));
    $("#detail-save").addEventListener("click", () => {
      const a = MyList.toggle({ id: show.id, type: "tv", title: show.name, poster: show.poster_path });
      $("#detail-save").textContent = a ? "✓ Saved" : "+ My List";
      toast(a ? "Added to My List" : "Removed");
    });

    const frame = $("#player-frame");
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
          const el = document.createElement("div");
          el.className = `ep-item${ep.episode_number === episode && sn === season ? " on" : ""}`;
          el.innerHTML = `
            ${ep.still_path ? `<img src="${IMG_W500}${ep.still_path}" alt="" loading="lazy"/>` : `<img alt=""/>`}
            <div><div class="ep-num">E${ep.episode_number}</div><div class="ep-name">${esc(ep.name || "")}</div><div class="ep-desc">${esc(ep.overview || "")}</div></div>`;
          el.addEventListener("click", () => {
            season = sn; episode = ep.episode_number;
            $$(".ep-item").forEach(x => x.classList.remove("on"));
            el.classList.add("on");
            update();
            frame?.scrollIntoView({ behavior: "smooth" });
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

    const cast = show.credits?.cast?.slice(0, 16) || [];
    if (cast.length) {
      $("#cast-section").style.display = "";
      cast.forEach(a => {
        const d = document.createElement("div");
        d.className = "cast-item";
        d.innerHTML = `${a.profile_path ? `<img src="${IMG_W500}${a.profile_path}" alt="" loading="lazy"/>` : `<img alt=""/>`}<div class="name">${esc(a.name)}</div><div class="role">${esc(a.character || "")}</div>`;
        $("#cast-row").appendChild(d);
      });
    }

    const sim = show.similar?.results?.slice(0, 14) || [];
    if (sim.length) {
      $("#similar-section").style.display = "";
      sim.forEach(it => $("#similar-row").appendChild(buildCard(it, "tv")));
    }
  } catch (e) {
    console.error(e);
    $("#detail-header").innerHTML = `<p style="color:var(--text-muted)">Couldn't load this show.</p>`;
  }
}

function initSearchPage() {
  const filter = new URLSearchParams(location.search).get("type") || "all";
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
    if (!q && current === "all") {
      status.textContent = "";
      grid.innerHTML = `<div class="no-results"><h3>What are you looking for?</h3><p>Search by title or browse categories from the sidebar.</p></div>`;
      return;
    }
    status.textContent = "Loading…";
    grid.innerHTML = ""; skeletons(12).forEach(s => grid.appendChild(s));

    try {
      let items = [];
      if (q) {
        let path = "/search/multi";
        if (current === "movie") path = "/search/movie";
        if (current === "tv") path = "/search/tv";
        const data = await tmdb(`${path}?query=${encodeURIComponent(q)}`);
        items = (data.results || []).filter(i => i.poster_path || i.backdrop_path);
        if (current !== "all") items = items.filter(i => (i.media_type || current) === current);
      } else {
        const data = await tmdb(current === "tv" ? "/tv/popular" : "/movie/popular");
        items = data.results || [];
      }

      grid.innerHTML = "";
      if (!items.length) {
        grid.innerHTML = `<div class="no-results"><h3>Nothing matched</h3><p>Try different keywords.</p></div>`;
        status.textContent = "";
        return;
      }
      status.textContent = q ? `${items.length} results` : `Popular ${current === "tv" ? "series" : "films"}`;
      items.forEach(item => grid.appendChild(buildCard(item, mediaType(item, current === "tv" ? "tv" : "movie"))));
    } catch {
      grid.innerHTML = `<div class="no-results"><p>Search failed — check your connection.</p></div>`;
      status.textContent = "";
    }
  }

  const q = new URLSearchParams(location.search).get("q") || "";
  if (input) {
    input.value = q;
    input.addEventListener("input", () => {
      if (clear) clear.style.display = input.value ? "flex" : "none";
      clearTimeout(timer);
      timer = setTimeout(() => doSearch(input.value.trim()), 400);
    });
    if (q) { clear.style.display = "flex"; doSearch(q); }
    else doSearch(current !== "all" ? "" : "");
  }
  clear?.addEventListener("click", () => { input.value = ""; clear.style.display = "none"; doSearch(""); input.focus(); });
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
  sessionStorage.setItem("orc_loader", JSON.stringify({ bg, title }));
  playLoader(bg, title).then(() => { location.href = href; });
}

function checkPlayLoader() {
  const d = sessionStorage.getItem("orc_loader");
  if (!d) return Promise.resolve();
  sessionStorage.removeItem("orc_loader");
  try { const { bg, title } = JSON.parse(d); return playLoader(bg, title); } catch { return Promise.resolve(); }
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeTrailer();
    closePopup();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  switch (PAGE) {
    case "home": initHomePage(); break;
    case "movie": initMoviePage(); break;
    case "tv": initTvPage(); break;
    case "search": initSearchPage(); break;
  }
});
