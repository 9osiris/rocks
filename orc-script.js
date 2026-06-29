*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:           #0e0e10;
  --bg-elevated:  #161618;
  --bg-hover:     #222226;
  --accent:       #7c5cff;
  --accent-dim:   #6344e0;
  --accent-soft:  rgba(124, 92, 255, 0.14);
  --text:         #ececee;
  --text-muted:   #8b8b95;
  --text-dim:     #5c5c66;
  --sidebar-w:    52px;
  --sidebar-fade: 22px;
  --sidebar-total: calc(var(--sidebar-w) + var(--sidebar-fade));
  --sidebar-push: 52px;
  --mobile-nav-h: 62px;
  --mobile-nav-w: 340px;
  --radius:       6px;
  --radius-lg:    10px;
  --pill:         20px;
  --ease:         cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --safe-top:     env(safe-area-inset-top, 0px);
  --safe-bottom:  env(safe-area-inset-bottom, 0px);
  --safe-left:    env(safe-area-inset-left, 0px);
  --safe-right:   env(safe-area-inset-right, 0px);
}

html {
  scroll-behavior: auto;
  scroll-padding-top: 20px;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
  min-height: 100vh;
  min-height: 100dvh;
  -webkit-tap-highlight-color: transparent;
  -webkit-overflow-scrolling: touch;
}

.glass-filters-root,
.splash-filters {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

.liquidGlass-wrapper {
  position: relative;
  display: flex;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}

.liquidGlass-effect {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  backdrop-filter: blur(14px) saturate(1.6);
  -webkit-backdrop-filter: blur(14px) saturate(1.6);
  filter: url(#glass-distortion);
}

.liquidGlass-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  background: rgba(255,255,255,0.08);
}

.liquidGlass-tint--dark {
  background: rgba(14,14,16,0.35);
}

.liquidGlass-shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    inset 2px 2px 1px 0 rgba(255,255,255,0.14),
    inset -1px -1px 1px 0 rgba(255,255,255,0.06);
}

.liquidGlass-text {
  position: relative;
  z-index: 3;
}

.glass-chip {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
}

.glass-chip::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  backdrop-filter: blur(12px) saturate(1.6);
  -webkit-backdrop-filter: blur(12px) saturate(1.6);
  filter: url(#glass-distortion);
}

.glass-chip::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  background: rgba(255,255,255,0.06);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
  pointer-events: none;
}

.glass-chip svg,
.glass-chip > * {
  position: relative;
  z-index: 2;
}

.glass-surface {
  overflow: hidden;
  background: rgba(14,14,16,0.45) !important;
  backdrop-filter: blur(16px) saturate(1.7);
  -webkit-backdrop-filter: blur(16px) saturate(1.7);
  filter: url(#glass-distortion);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.1);
}

button, a { touch-action: manipulation; }

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
button { cursor: pointer; border: none; background: none; font-family: inherit; color: inherit; }
ul { list-style: none; }

/* Visible keyboard focus for accessibility (PC keyboard / a11y users) */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
.media-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

::-webkit-scrollbar { width: 0; height: 0; }
.row-track { scrollbar-width: none; }
.row-track::-webkit-scrollbar { display: none; }

.app-shell {
  margin-left: 0;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  will-change: margin-left, width;
  transition:
    margin-left 0.55s var(--ease-out),
    width 0.55s var(--ease-out);
}

#sidebar-edge {
  display: none;
}

.sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--sidebar-total);
  z-index: 200;
  background: linear-gradient(
    90deg,
    rgba(14,14,16,0.93) 0%,
    rgba(14,14,16,0.68) 38%,
    rgba(14,14,16,0.26) 68%,
    rgba(14,14,16,0) 100%
  );
  border-right: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: visible;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(90deg, black 56%, transparent 100%);
  mask-image: linear-gradient(90deg, black 56%, transparent 100%);
  transform: translateX(calc(-1 * var(--sidebar-total)));
  opacity: 0;
  visibility: hidden;
  will-change: transform, opacity;
  transition:
    transform 0.55s var(--ease-out),
    opacity 0.45s var(--ease-out),
    visibility 0s linear 0.55s;
}

body.sidebar-open .sidebar {
  transform: translateX(0);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition:
    transform 0.55s var(--ease-out),
    opacity 0.45s var(--ease-out),
    visibility 0s linear 0s;
}

@media (min-width: 769px) {
  #sidebar-edge {
    display: block;
    position: fixed;
    left: 0; top: 0; bottom: 0;
    width: 32px;
    z-index: 199;
    cursor: ew-resize;
  }
  #sidebar-edge:focus-visible {
    outline: 2px solid rgba(124,92,255,0.55);
    outline-offset: -2px;
  }

  body.sidebar-dock.sidebar-open .app-shell {
    margin-left: var(--sidebar-push);
    width: calc(100% - var(--sidebar-push));
  }

  body.sidebar-pinned .sidebar {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0 12px;
  gap: 2px;
  flex: 1;
  width: var(--sidebar-w);
  position: relative;
  z-index: 3;
  pointer-events: auto;
}

.sidebar-logo {
  width: 32px; height: 32px;
  margin-bottom: 14px;
  flex-shrink: 0;
  transition: transform 0.4s var(--ease-out);
}
.sidebar-logo:hover { transform: scale(1.08); }
.sidebar-logo img { width: 100%; height: 100%; }

.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  width: 100%;
}

.sidebar-link {
  position: relative;
  width: 40px; height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  transition: color 0.28s, background 0.38s var(--ease-out), transform 0.42s var(--ease-out);
}
.sidebar-link svg {
  width: 20px; height: 20px;
  stroke-width: 1.75;
  transition: transform 0.38s var(--ease-out);
}
.sidebar-link:hover {
  color: var(--text);
  background: rgba(255,255,255,0.09);
  transform: scale(1.08);
}
.sidebar-link:hover svg { transform: scale(1.05); }
.sidebar-link.active {
  color: var(--text);
  background: var(--accent-soft);
}
.sidebar-link.active::before {
  content: "";
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px; height: 18px;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
}

.sidebar-link .tip {
  position: absolute;
  left: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%) translateX(-10px);
  background: rgba(22,22,26,0.96);
  color: var(--text);
  font-size: 0.76rem;
  font-weight: 600;
  padding: 7px 13px;
  border-radius: var(--radius);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.32s var(--ease-out), transform 0.38s var(--ease-out), visibility 0.32s;
  box-shadow: 0 8px 28px rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.08);
  z-index: 300;
}
body.sidebar-open .sidebar-link:hover .tip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.sidebar-divider {
  width: 28px; height: 1px;
  background: var(--bg-hover);
  margin: 8px 0;
}


.mobile-topbar {
  display: none !important;
}

.mobile-float-back {
  display: none;
  position: fixed;
  top: calc(10px + var(--safe-top));
  left: 12px;
  z-index: 180;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(14,14,16,0.55);
  backdrop-filter: blur(16px) saturate(1.6);
  -webkit-backdrop-filter: blur(16px) saturate(1.6);
  border: 1px solid rgba(255,255,255,0.1);
  filter: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  color: var(--text);
  transition: transform 0.2s var(--ease-out);
}
.mobile-float-back svg { width: 20px; height: 20px; }
.mobile-float-back:active { transform: scale(0.94); }

.sidebar-link .mob-label {
  display: none;
}

/* ===== Cinematic Splash Screen ===== */

#splash-screen {
  position: fixed; inset: 0; z-index: 9999;
  background: #000;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

.splash-curtain {
  position: absolute;
  top: 0; bottom: 0;
  width: 50%;
  z-index: 1;
}
.splash-curtain-left {
  left: 0;
  background: linear-gradient(90deg, #000 0%, rgba(14,14,16,0.95) 60%, rgba(99,68,224,0.10) 100%);
}
.splash-curtain-right {
  right: 0;
  background: linear-gradient(90deg, rgba(99,68,224,0.10) 0%, rgba(14,14,16,0.95) 40%, #000 100%);
}

#splash-screen.splash-exit .splash-curtain-left {
  animation: none;
  transform: translateX(-100%);
  transition: transform 0.7s var(--ease-out);
}
#splash-screen.splash-exit .splash-curtain-right {
  animation: none;
  transform: translateX(100%);
  transition: transform 0.7s var(--ease-out);
}

#splash-screen.splash-exit .splash-stage {
  opacity: 0;
  transform: scale(1.06);
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
}

#splash-screen.splash-exit .splash-glass-main {
  animation: none;
}

#splash-screen.splash-exit {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease-out) 0.4s;
}

.splash-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  opacity: 0;
  animation: splashFadeIn 1s var(--ease-out) 0.15s forwards;
  padding: 0 16px;
  width: 100%;
  z-index: 2;
}

.splash-tagline-top {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  opacity: 0;
  animation: splashFadeIn 0.8s var(--ease-out) 0.5s forwards;
}

.splash-tagline-bottom {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: rgba(255,255,255,0.3);
  opacity: 0;
  animation: splashFadeIn 0.8s var(--ease-out) 1.1s forwards;
}

.splash-glass {
  flex-direction: column;
  align-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.2);
  max-width: min(92vw, 420px);
  opacity: 0;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.1) inset,
    0 12px 48px rgba(0,0,0,0.55),
    0 0 72px rgba(124,92,255,0.16);
  animation: splashFadeIn 1s var(--ease-out) 0.7s forwards, splashGlassPulse 3.2s ease-in-out 1.8s infinite alternate;
}

.splash-glass > .liquidGlass-effect {
  backdrop-filter: blur(24px) saturate(1.9);
  -webkit-backdrop-filter: blur(24px) saturate(1.9);
}

.splash-glass > .liquidGlass-tint--dark {
  background: linear-gradient(145deg, rgba(124,92,255,0.14) 0%, rgba(18,16,28,0.55) 45%, rgba(14,14,16,0.5) 100%);
}

.splash-glass > .liquidGlass-shine {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.22),
    inset 0 -1px 0 rgba(255,255,255,0.06),
    inset 2px 2px 1px 0 rgba(255,255,255,0.12);
}

#splash-screen.splash-exit .splash-glass {
  animation: none;
}

.splash-glass,
.splash-glass > .liquidGlass-effect,
.splash-glass > .liquidGlass-tint,
.splash-glass > .liquidGlass-shine {
  border-radius: 999px;
}

.splash-glass-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: clamp(16px, 5vw, 22px) clamp(28px, 8vw, 48px);
}

.splash-glass-sub {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}

.splash-glass-main {
  font-size: clamp(1.6rem, 5vw, 2.1rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  text-shadow: 0 0 24px rgba(124,92,255,0.5);
}

#splash-screen:not(.splash-exit) .splash-glass-main {
  animation: splashGlow 2.5s ease-in-out 1s infinite alternate;
}

@keyframes splashGlow {
  from { text-shadow: 0 0 24px rgba(124,92,255,0.5); }
  to   { text-shadow: 0 0 36px rgba(124,92,255,0.75), 0 0 8px rgba(255,255,255,0.2); }
}

@keyframes splashGlassPulse {
  from { box-shadow: 0 0 0 1px rgba(255,255,255,0.1) inset, 0 12px 48px rgba(0,0,0,0.55), 0 0 60px rgba(124,92,255,0.14); }
  to   { box-shadow: 0 0 0 1px rgba(255,255,255,0.18) inset, 0 14px 52px rgba(0,0,0,0.62), 0 0 96px rgba(124,92,255,0.24); }
}

@keyframes splashFadeIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero {
  position: relative;
  height: 82vh;
  min-height: 480px;
  max-height: 860px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--bg-elevated);
}

.hero-backdrop img,
.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  display: block;
  opacity: 0;
  transition: opacity 0.85s ease;
  will-change: opacity;
}

.hero-slide.is-active {
  opacity: 1;
}

.hero.hero-fading .hero-content,
.hero.hero-fading .hero-backdrop .hero-slide.is-active {
  opacity: 0;
  transition: opacity 0.42s ease;
}

.hero-content {
  position: relative; z-index: 2;
  padding: 0 48px 72px;
  max-width: 580px;
  animation: heroFade 0.9s var(--ease-out) 0.15s both;
  transition: opacity 0.45s ease, transform 0.45s var(--ease-out);
}
.hero-overlay {
  position: absolute; inset: 0;
  z-index: 1;
  background:
    linear-gradient(0deg, var(--bg) 0%, rgba(14,14,16,0.55) 42%, rgba(14,14,16,0.12) 100%),
    linear-gradient(90deg, rgba(14,14,16,0.95) 0%, rgba(14,14,16,0.45) 45%, transparent 100%);
}

@keyframes heroFade {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-type {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}

.hero-title {
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
}

.hero-dots {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-dot {
  position: relative;
  height: 8px;
  width: 8px;
  border-radius: 99px;
  background: rgba(255,255,255,0.12);
  overflow: hidden;
  transition: width 0.35s var(--ease-out), background 0.25s;
}
.hero-dot.active {
  width: 28px;
  background: rgba(255,255,255,0.18);
}
.hero-dot-fill {
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform-origin: left center;
  transform: scaleX(0);
  border-radius: inherit;
}
.hero-dot.active .hero-dot-fill {
  animation: heroDotFill 7s linear forwards;
}
@keyframes heroDotFill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.hero-desc {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 22px;
}
.hero-meta .score {
  color: #f5c518;
  font-weight: 700;
  display: flex; align-items: center; gap: 4px;
}
.hero-meta .dot::before { content: "·"; margin-right: 14px; color: var(--text-dim); }

.hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.btn-play {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 28px;
  background: #fff;
  color: #0e0e10;
  font-size: 0.92rem;
  font-weight: 700;
  border-radius: var(--pill);
  transition: transform 0.3s var(--ease-out), background 0.25s, box-shadow 0.3s;
}
.btn-play:hover {
  transform: scale(1.05) translateY(-1px);
  background: #e8e8ea;
  box-shadow: 0 8px 24px rgba(255,255,255,0.12);
}
.btn-play svg { width: 18px; height: 18px; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px;
  background: rgba(255,255,255,0.1);
  color: var(--text);
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: var(--pill);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.08);
  transition: background 0.2s, transform 0.2s var(--ease-out);
}
.btn-ghost:hover { background: rgba(255,255,255,0.2); transform: scale(1.03); }
.btn-ghost svg { width: 16px; height: 16px; }

.genre-strip {
  padding: 12px 48px 10px;
  margin-top: 0;
  position: relative;
  z-index: 4;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  background: linear-gradient(to bottom, transparent, var(--bg) 28%);
}
.genre-strip::-webkit-scrollbar { display: none; }

.genre-pill {
  flex-shrink: 0;
  padding: 8px 18px;
  background: rgba(255,255,255,0.07);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--pill);
  border: 1px solid rgba(255,255,255,0.1);
  transition: background 0.3s var(--ease-out), color 0.3s, transform 0.35s var(--ease-out), border-color 0.3s;
}
.genre-pill:hover {
  background: rgba(255,255,255,0.12);
  color: var(--text);
  transform: translateY(-2px);
}
.genre-pill.active {
  background: rgba(124,92,255,0.22);
  border-color: rgba(124,92,255,0.45);
  color: var(--text);
}

.categories {
  padding: 8px 0 48px;
  margin-top: 0;
  position: relative;
  z-index: 2;
}

#genre-row .row-header {
  display: none;
}

.row-wrapper {
  margin-bottom: 28px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.65s var(--ease-out), transform 0.65s var(--ease-out);
}
.row-wrapper.visible { opacity: 1; transform: translateY(0); }

.row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  margin-bottom: 12px;
}

.row-title {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.row-period-wrap { position: relative; display: inline-flex; }
.row-period-btn {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.25s, background 0.25s;
}
.row-period-btn:hover { background: var(--accent-soft); }
.row-period-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 140px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 36px rgba(0,0,0,0.55);
  padding: 6px;
  z-index: 20;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: opacity 0.25s, transform 0.3s var(--ease-out), visibility 0.25s;
}
.row-period-menu.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.row-period-menu button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: background 0.2s, color 0.2s;
}
.row-period-menu button:hover,
.row-period-menu button.active {
  background: var(--accent-soft);
  color: var(--text);
}

.row-see-all {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.2s;
}
.row-see-all:hover { color: var(--accent); }

.row-track {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-behavior: smooth;
  /* Extra vertical padding so cards scaled up on hover are not clipped
     (overflow-x:auto forces overflow-y to auto, which would crop them). */
  padding: 26px 48px 30px;
  margin-top: -16px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}

.row-track-container {
  position: relative;
  isolation: isolate;
}

.row-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(14,14,16,0.85);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s, background 0.2s, transform 0.2s var(--ease-out);
  backdrop-filter: blur(6px);
}
.row-arrow svg { width: 18px; height: 18px; }
.row-arrow.left  { left: 8px; }
.row-arrow.right { right: 8px; }
.row-track-container:hover .row-arrow { opacity: 1; }
.row-arrow:hover { background: var(--bg-hover); transform: translateY(-50%) scale(1.08); }

.media-card {
  flex: 0 0 auto;
  width: 148px;
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.55s var(--ease-out), box-shadow 0.55s var(--ease-out), opacity 0.35s;
  contain: layout style;
  will-change: transform;
}
.media-card.is-watched { opacity: 0.42; filter: saturate(0.65); }
.media-card:hover,
.media-card.is-hovered {
  transform: scale(1.1) translateY(-10px);
  box-shadow: 0 20px 44px rgba(0,0,0,0.55);
  z-index: 8;
}

@media (hover: none) {
  .media-card:hover,
  .media-card.is-hovered { transform: none; box-shadow: none; }
  .media-card .card-quick { opacity: 1; transform: none; }
  .media-card:active { transform: scale(0.97); }
}

.media-card img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  display: block;
  background: var(--bg-elevated);
}

.media-card .no-img {
  aspect-ratio: 2/3;
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  font-size: 0.7rem;
}

.media-card .rank {
  position: absolute;
  top: 6px; left: 6px;
  z-index: 2;
  background: var(--accent);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  width: 22px; height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-card .card-rating {
  position: absolute;
  top: 6px; right: 6px;
  z-index: 2;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 4px;
  background: rgba(0,0,0,0.72);
  color: #f5c518;
  backdrop-filter: blur(6px);
}

.media-card .progress-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: rgba(255,255,255,0.15);
}
.media-card .progress-bar span {
  display: block;
  height: 100%;
  background: var(--accent);
}

.media-card .card-quick {
  position: absolute;
  top: 8px; right: 8px;
  bottom: auto;
  z-index: 4;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: translateY(-6px) scale(0.88);
  transition: opacity 0.4s var(--ease-out), transform 0.5s var(--ease-out);
}
.media-card:hover .card-quick,
.media-card.is-hovered .card-quick {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.card-foot {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  z-index: 3;
  padding: 32px 10px 10px;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.92) 100%);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s var(--ease-out), transform 0.5s var(--ease-out);
  pointer-events: none;
}
.media-card:hover .card-foot,
.media-card.is-hovered .card-foot {
  opacity: 1;
  transform: translateY(0);
}
.card-foot-title {
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-foot-meta {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.65);
  margin-top: 3px;
}

.card-icon-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(8,8,10,0.88);
  border: 1.5px solid rgba(255,255,255,0.28);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: background 0.25s, transform 0.3s var(--ease-out), border-color 0.25s;
}
.card-icon-btn svg { width: 14px; height: 14px; display: block; }
.card-icon-btn:hover { background: var(--accent); border-color: var(--accent); transform: scale(1.12); }
.card-icon-btn.saved { background: var(--accent); border-color: var(--accent); }

.skeleton-card {
  flex: 0 0 auto;
  width: 148px;
  aspect-ratio: 2/3;
  border-radius: var(--radius);
  background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.card-popup {
  position: fixed;
  z-index: 300;
  width: 248px;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0,0,0,0.65);
  border: 1px solid rgba(255,255,255,0.08);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(10px) scale(0.96);
  transition: opacity 0.38s var(--ease-out), transform 0.42s var(--ease-out);
}
.card-popup.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.card-popup.closing {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.card-popup-thumb {
  height: 72px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.card-popup-thumb::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(0deg, var(--bg-elevated), transparent 60%);
}

.card-popup-body { padding: 8px 10px 10px; margin-top: -16px; position: relative; }

.card-popup-title {
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-popup-meta {
  font-size: 0.64rem;
  color: var(--text-muted);
  margin-bottom: 5px;
}

.card-popup-overview {
  font-size: 0.68rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.card-popup-overview.truncated {
  display: block;
  overflow: hidden;
}
.card-popup-overview.expanded {
  max-height: 140px;
  overflow-y: auto;
}
.pp-more {
  display: inline;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  color: var(--accent);
  font-size: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.pp-more:hover { color: var(--text); }

.card-popup-actions {
  display: flex;
  gap: 6px;
}
.card-popup-actions button {
  flex: 1;
  padding: 7px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 4px;
  transition: transform 0.15s;
}
.card-popup-actions button:hover { transform: scale(1.03); }
.card-popup-actions .pp-play { background: #fff; color: #0e0e10; }
.card-popup-actions .pp-save { background: var(--bg-hover); color: var(--text-muted); }
.card-popup-actions .pp-save.saved { background: var(--accent-soft); color: var(--accent); }

.detail-page .app-shell { padding-bottom: 40px; }

.detail-hero {
  position: relative;
  height: 48vh;
  min-height: 280px;
  max-height: 480px;
  overflow: hidden;
}
.detail-hero-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center 15%;
}
.detail-hero-fade {
  position: absolute; inset: 0;
  background: linear-gradient(0deg, var(--bg) 0%, rgba(14,14,16,0.4) 50%, rgba(14,14,16,0.6) 100%);
}

.detail-body {
  padding: 0 48px;
  margin-top: -80px;
  position: relative;
  z-index: 2;
}

.detail-title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.detail-tagline {
  font-size: 0.92rem;
  font-style: italic;
  color: var(--text-muted);
  margin: -4px 0 12px;
  max-width: 640px;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 14px;
  align-items: center;
}
.detail-meta .score { color: #f5c518; font-weight: 700; }
.detail-meta .tag {
  padding: 3px 10px;
  background: var(--bg-elevated);
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
}
.detail-meta .tag-link {
  transition: background 0.25s, color 0.25s;
}
.detail-meta .tag-link:hover {
  background: var(--accent-soft);
  color: var(--text);
}

.detail-overview {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 640px;
  margin-bottom: 20px;
}

.detail-resume {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
  margin: -8px 0 14px;
}

.btn-ghost.btn-icon-text {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.btn-ghost.btn-icon-text svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.detail-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.player-wrap { margin-bottom: 36px; max-width: 960px; position: relative; }

.provider-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.provider-tab {
  padding: 8px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-elevated);
  border-radius: var(--pill);
  border: 1px solid rgba(255,255,255,0.06);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.provider-tab:hover { color: var(--text); background: var(--bg-hover); }
.provider-tab.active { background: var(--accent-soft); color: var(--text); border-color: rgba(124,92,255,0.35); }
.provider-rec {
  display: inline-flex;
  align-items: center;
  margin-left: 5px;
  padding: 1px 5px;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #f0c040;
  background: rgba(240,192,64,0.12);
  border-radius: 4px;
  vertical-align: middle;
}

.player-frame {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #000;
}
.player-frame iframe {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  border: none;
}

.back-top {
  position: fixed;
  right: 20px;
  bottom: calc(20px + var(--safe-bottom));
  z-index: 480;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(14,14,16,0.88);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text);
  box-shadow: 0 6px 24px rgba(0,0,0,0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: opacity 0.35s var(--ease-out), transform 0.35s var(--ease-out), visibility 0.35s;
}
.back-top svg { width: 18px; height: 18px; }
.back-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.back-top:active { transform: scale(0.94); }

.row-track.is-dragging {
  cursor: grabbing;
  user-select: none;
}
.row-track.is-dragging .media-card {
  pointer-events: none;
}

.spinner {
  width: 36px; height: 36px;
  border: 2px solid var(--bg-hover);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 36px;
  max-width: 640px;
}
.info-cell label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  margin-bottom: 3px;
}
.info-cell span { font-size: 0.85rem; font-weight: 600; }

.watch-providers {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
  max-width: 640px;
}
.watch-providers .wp-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}
.watch-providers .wp-logos {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.watch-providers img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  background: var(--bg-elevated);
}

.collection-banner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 20px;
  border-radius: var(--radius-lg);
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: border-color 0.25s, color 0.25s;
}
.collection-banner:hover {
  border-color: var(--accent-soft);
  color: var(--text);
}

.keywords-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 640px;
}

.detail-extra-block {
  margin-bottom: 28px;
  max-width: 960px;
}
.detail-extra-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  margin-bottom: 10px;
}

.keyword-pill {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--pill);
  background: rgba(255,255,255,0.05);
  color: var(--text-dim);
  transition: background 0.25s, color 0.25s;
}
.keyword-pill:hover {
  background: var(--accent-soft);
  color: var(--text);
}

.section-head {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 14px;
  padding: 0 48px;
}

.cast-scroll {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 0 48px 16px;
  scroll-behavior: smooth;
}
.cast-item { flex: 0 0 auto; width: 96px; text-align: center; transition: transform 0.35s var(--ease-out); }
.cast-item:hover { transform: translateY(-4px); }
button.cast-item {
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font: inherit;
}
.cast-item img,
.cast-placeholder {
  width: 76px; height: 76px;
  border-radius: 12px;
  object-fit: cover;
  background: var(--bg-elevated);
  margin: 0 auto 8px;
}
.cast-placeholder { display: block; }
.cast-item .name { font-size: 0.74rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cast-item .role { font-size: 0.66rem; color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.similar-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 48px 24px;
  scroll-behavior: smooth;
}

.ep-block {
  margin-bottom: 36px;
  max-width: 960px;
}
.ep-block select {
  background: var(--bg-elevated);
  color: var(--text);
  padding: 8px 14px;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 0.85rem;
  margin-bottom: 14px;
  outline: none;
  border: 1px solid rgba(255,255,255,0.08);
}
.ep-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.ep-head h2 {
  font-size: 1.1rem;
  font-weight: 800;
}
.ep-grid,
#ep-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}
.ep-row {
  display: grid;
  grid-template-columns: 36px 120px 1fr auto;
  gap: 14px;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  color: inherit;
  cursor: pointer;
  transition: background 0.3s var(--ease-out), transform 0.35s var(--ease-out);
}
.ep-row:last-child { border-bottom: none; }
.ep-row:hover { background: rgba(255,255,255,0.04); transform: translateX(4px); }
.ep-row.on { background: var(--accent-soft); }
.ep-row-num {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-dim);
  line-height: 1;
}
.ep-row.on .ep-row-num { color: var(--accent); }
.ep-row-thumb {
  width: 120px;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-elevated);
  flex-shrink: 0;
}
.ep-row-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ep-row-title { font-size: 0.92rem; font-weight: 700; margin-bottom: 4px; }
.ep-row-date { font-size: 0.72rem; color: var(--text-dim); margin-bottom: 6px; }
.ep-row-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ep-row-dur {
  font-size: 0.72rem;
  color: var(--text-dim);
  white-space: nowrap;
  align-self: start;
  padding-top: 4px;
}

.search-page .search-body { padding: 32px 48px 48px; }

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-elevated);
  padding: 4px 16px;
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
  max-width: 560px;
  transition: background 0.2s;
}
.search-input-wrap:focus-within { background: var(--bg-hover); }
.search-input-wrap svg { width: 20px; height: 20px; color: var(--text-dim); flex-shrink: 0; }
.search-input-wrap input {
  flex: 1;
  background: none; border: none; outline: none;
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
  padding: 12px 0;
}

.filter-row { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-chip {
  padding: 7px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-elevated);
  border-radius: var(--radius);
  border: 1px solid transparent;
  transition: background 0.3s var(--ease-out), color 0.3s, transform 0.35s var(--ease-out), border-color 0.3s;
}
.filter-chip:hover { color: var(--text); transform: translateY(-1px); }
.filter-chip.on {
  background: var(--accent-soft);
  color: var(--text);
  border-color: rgba(124,92,255,0.35);
  transform: translateY(-1px);
}

.search-status { font-size: 0.85rem; color: var(--text-dim); margin-bottom: 16px; min-height: 20px; }
.search-status.is-busy { color: var(--text-muted); }
.search-pending { display: inline-flex; align-items: center; gap: 8px; }
.spin-dot {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.search-recent { margin-bottom: 18px; }
.search-recent-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 0 0 10px;
}
.search-recent-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.search-recent-pill {
  padding: 7px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--pill);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.search-recent-pill:hover { color: var(--text); background: var(--bg-hover); border-color: rgba(124,92,255,0.25); }

.row-track:focus-visible {
  outline: 2px solid rgba(124,92,255,0.45);
  outline-offset: 3px;
  border-radius: var(--radius);
}

.ptr-indicator {
  position: fixed;
  top: calc(12px + var(--safe-top));
  left: 50%;
  transform: translateX(-50%);
  z-index: 8000;
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  background: rgba(14,14,16,0.9);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--pill);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 12px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 20px;
  color: var(--text-muted);
}
.no-results h3 { font-size: 1.1rem; color: var(--text); margin-bottom: 6px; }

.modal-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  backdrop-filter: blur(8px);
}
.modal-overlay.open { opacity: 1; pointer-events: auto; }

.modal-box {
  width: min(900px, 100%);
  aspect-ratio: 16/9;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transform: scale(0.94);
  transition: transform 0.35s var(--ease-out);
}
.modal-overlay.open .modal-box { transform: scale(1); }
.modal-box iframe { width: 100%; height: 100%; border: none; }

.person-modal .modal-box {
  aspect-ratio: auto;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px;
  background: var(--bg-elevated);
}
.person-head {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.person-head img,
.person-head .person-ph {
  width: 88px;
  height: 88px;
  border-radius: 14px;
  object-fit: cover;
  background: var(--bg-hover);
  flex-shrink: 0;
}
.person-head h2 {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 4px;
}
.person-head p {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
}
.person-credits h3 {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-dim);
  margin-bottom: 10px;
}
.person-credit-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.person-credit-list a {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.04);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
  transition: background 0.2s;
}
.person-credit-list a:hover { background: var(--accent-soft); }
.person-credit-list span:last-child {
  color: var(--text-dim);
  font-weight: 500;
  flex-shrink: 0;
}

.modal-close {
  position: absolute;
  top: 20px; right: 24px;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--bg-elevated);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
}
.modal-close:hover { background: var(--bg-hover); transform: scale(1.08); }

.play-loader {
  position: fixed; inset: 0; z-index: 9998;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.45s;
}
.play-loader.on { opacity: 1; pointer-events: auto; }
.play-loader-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.2);
  transform: scale(1.1);
}
.play-loader-veil { position: absolute; inset: 0; background: rgba(14,14,16,0.7); }
.play-loader-mark {
  position: relative;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.25em;
  animation: loaderPulse 1s ease-in-out infinite alternate;
}
@keyframes loaderPulse {
  from { opacity: 0.5; }
  to   { opacity: 1; }
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(80px);
  background: rgba(14,14,16,0.92);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: var(--pill);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 600;
  opacity: 0;
  transition: transform 0.4s var(--ease-out), opacity 0.4s;
  pointer-events: none;
  white-space: nowrap;
  filter: none;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

[id="trending"], [id="my-list"], [id="genre-row"] {
  scroll-margin-top: 16px;
  scroll-margin-bottom: calc(var(--mobile-nav-h) + var(--safe-bottom) + 16px);
}

@media (min-width: 769px) {
  [id="trending"], [id="my-list"], [id="genre-row"] {
    scroll-margin-top: 32px;
    scroll-margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  :root { --sidebar-w: 0px; }

  .mobile-float-back { display: flex; }

  .sidebar {
    top: auto;
    bottom: calc(12px + var(--safe-bottom));
    left: 50%;
    right: auto;
    width: var(--mobile-nav-w);
    max-width: calc(100vw - 24px);
    height: var(--mobile-nav-h);
    flex-direction: row;
    align-items: stretch;
    background: rgba(14,14,16,0.9);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--pill);
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    pointer-events: auto !important;
    transform: translateX(-50%) !important;
    opacity: 1 !important;
    visibility: visible !important;
    -webkit-mask-image: none !important;
    mask-image: none !important;
    z-index: 500;
  }

  #sidebar-edge { display: none !important; }

  .sidebar-inner {
    flex-direction: row;
    flex: 1;
    align-items: stretch;
    width: 100%;
    padding: 0;
  }

  .sidebar-logo, .sidebar-divider, .sidebar-link .tip, .sidebar-link.active::before { display: none; }

  .sidebar-nav {
    flex-direction: row;
    flex: 1;
    justify-content: space-evenly;
    align-items: stretch;
    overflow: hidden;
    padding: 0 6px;
  }

  .sidebar-link {
    flex: 0 0 42px;
    min-width: 42px;
    max-width: 42px;
    width: 42px;
    height: auto;
    flex-direction: column;
    gap: 3px;
    padding: 8px 0 6px;
    border-radius: 0;
    justify-content: center;
    transform: none !important;
  }
  .sidebar-link svg { width: 21px; height: 21px; }
  .sidebar-link .tip { display: none !important; }
  .sidebar-link.active { background: transparent; }
  .sidebar-link.active svg { color: var(--accent); }
  .sidebar-link .mob-label {
    display: block;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-dim);
    line-height: 1;
  }
  .sidebar-link.active .mob-label { color: var(--accent); }

  .app-shell {
    margin-left: 0;
    padding-bottom: calc(var(--mobile-nav-h) + var(--safe-bottom) + 20px);
  }

  .hero-dots { bottom: calc(var(--mobile-nav-h) + var(--safe-bottom) + 20px); }

  .hero {
    height: 100svh;
    min-height: 100svh;
    max-height: none;
  }

  .hero-overlay {
    background:
      linear-gradient(0deg, var(--bg) 0%, rgba(14,14,16,0.88) 38%, rgba(14,14,16,0.2) 100%),
      linear-gradient(90deg, rgba(14,14,16,0.8) 0%, transparent 100%);
  }

  .hero-content {
    /* Clear the floating bottom nav + hero dots so Play/Details aren't covered */
    padding: calc(8px + var(--safe-top)) 20px calc(var(--mobile-nav-h) + var(--safe-bottom) + 52px);
    max-width: 100%;
  }

  .hero-title { font-size: clamp(1.65rem, 7vw, 2.4rem); }
  .hero-desc { -webkit-line-clamp: 2; font-size: 0.85rem; }
  .hero-meta { font-size: 0.75rem; margin-bottom: 16px; }

  .hero-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .hero-actions .btn-play { grid-column: 1 / -1; justify-content: center; min-height: 44px; }
  .hero-actions .btn-ghost { justify-content: center; min-height: 42px; font-size: 0.82rem; padding: 10px 12px; }

  .categories { margin-top: 0; }
  .genre-strip { padding: 10px 20px 8px; margin-top: 0; }
  .genre-pill { padding: 10px 16px; font-size: 0.78rem; }

  .row-header { padding: 0 20px; }
  .row-title { font-size: 0.98rem; }
  .row-track {
    padding: 4px 20px 14px;
    margin-top: 0;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .media-card { scroll-snap-align: start; width: 128px; }
  .skeleton-card { width: 128px; }
  .row-arrow { display: none; }

  .detail-hero { height: 34vh; min-height: 200px; max-height: 280px; }
  .detail-body { padding: 0 20px; margin-top: -48px; }
  .detail-title { font-size: 1.45rem; }
  .detail-overview { font-size: 0.85rem; }
  .detail-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .detail-actions .btn-play { grid-column: 1 / -1; justify-content: center; min-height: 44px; }
  .detail-actions .btn-ghost { justify-content: center; min-height: 42px; }

  .player-wrap { margin-bottom: 28px; }
  .player-frame { border-radius: var(--radius); }
  .provider-tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
  .provider-tabs::-webkit-scrollbar { display: none; }
  .provider-tab { flex-shrink: 0; min-height: 36px; }

  .section-head { padding: 0 20px; }
  .cast-scroll, .similar-row { padding-left: 20px; padding-right: 20px; }

  .ep-row {
    grid-template-columns: 28px 88px 1fr;
    gap: 10px;
    padding: 12px;
  }
  .ep-row-dur { display: none; }
  .ep-row-thumb { width: 88px; }

  .search-page .search-body { padding: 16px 20px 32px; }
  .search-grid { grid-template-columns: repeat(auto-fill, minmax(108px, 1fr)); gap: 10px; }

  .page-foot { padding: 24px 20px calc(12px + var(--safe-bottom)); font-size: 0.78rem; line-height: 1.55; }

  .toast {
    bottom: calc(var(--mobile-nav-h) + var(--safe-bottom) + 12px);
    max-width: calc(100% - 40px);
    text-align: center;
  }

  .back-top {
    bottom: calc(var(--mobile-nav-h) + var(--safe-bottom) + 14px);
    right: 16px;
  }

  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal-box {
    width: 100%;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    aspect-ratio: auto;
    height: min(56vw, 340px);
  }
  .modal-close { top: calc(12px + var(--safe-top)); right: 12px; }

  .card-popup { display: none !important; }

  .page-foot { animation: none; opacity: 1; }

  .splash-glass { max-width: min(94vw, 380px); }
  .splash-tagline-top { font-size: 0.68rem; letter-spacing: 0.24em; }
  .splash-tagline-bottom { font-size: 0.65rem; letter-spacing: 0.12em; text-align: center; }
  .splash-glass-main { font-size: clamp(1.45rem, 8vw, 2rem); }
  .splash-glass-sub { font-size: 0.62rem; letter-spacing: 0.22em; }
}

@media (max-width: 380px) {
  .media-card, .skeleton-card { width: 112px; }
  .hero-actions { grid-template-columns: 1fr; }
  .sidebar-link .mob-label { font-size: 0.58rem; }
}

@media (min-width: 769px) {
  .btn-ghost.glass-chip:hover::after {
    background: rgba(255,255,255,0.12);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-content { padding: 0 32px 48px; }
  .row-header, .row-track { padding-left: 32px; padding-right: 32px; }
  .genre-strip { padding-left: 32px; padding-right: 32px; }
  .detail-body { padding: 0 32px; }
  .media-card { width: 136px; }
  .skeleton-card { width: 136px; }
}

@media (max-width: 768px) and (orientation: landscape) {
  .hero { height: 100svh; min-height: 0; max-height: none; }
  .hero-content { padding-bottom: calc(var(--mobile-nav-h) + var(--safe-bottom) + 16px); }
  .hero-desc { display: none; }
  .detail-hero { height: 50vh; min-height: 180px; }
}

.page-foot {
  padding: 32px 48px;
  font-size: 0.72rem;
  color: var(--text-dim);
  line-height: 1.6;
  opacity: 0;
  animation: footFade 0.45s var(--ease-out) 0.5s forwards;
}
.page-foot p { margin: 0 0 0.4em; }
.page-foot p:last-child { margin-bottom: 0; }
@keyframes footFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

#nprogress {
  pointer-events: none;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1600;
  height: 2px;
  opacity: 0;
  transition: opacity 0.25s;
}
#nprogress.busy { opacity: 1; }
#nprogress .bar {
  height: 100%;
  width: 0;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent), 0 0 4px var(--accent);
  transition: width 0.35s var(--ease-out);
}
.page-foot a { color: var(--text-muted); transition: color 0.25s; }
.page-foot a:hover { color: var(--accent); }

.settings-body,
.legal-body {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 48px 24px;
  animation: pageFadeIn 0.55s var(--ease-out) forwards;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.settings-title,
.legal-body h1 {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 28px;
}

.settings-section {
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.settings-section:last-of-type { border-bottom: none; }

.settings-section h2,
.legal-body h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.settings-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 14px;
}

.settings-note {
  font-size: 0.78rem;
  color: var(--text-dim);
  line-height: 1.5;
  margin: -4px 0 14px;
  padding-left: 2px;
}

.settings-providers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.settings-provider {
  padding: 10px 18px;
  border-radius: var(--pill);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: background 0.3s, color 0.3s, transform 0.3s var(--ease-out), border-color 0.3s;
}
.settings-provider:hover { color: var(--text); transform: translateY(-1px); }
.settings-provider.active {
  background: var(--accent-soft);
  border-color: rgba(124,92,255,0.4);
  color: var(--text);
}

.settings-accents {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.accent-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--swatch);
  border: 2px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: transform 0.3s var(--ease-out), border-color 0.25s;
}
.accent-swatch:hover { transform: scale(1.1); }
.accent-swatch.active { border-color: #fff; box-shadow: 0 0 0 2px var(--swatch); }
.accent-swatch svg { width: 14px; height: 14px; }

.settings-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.settings-toggle-row:last-child { border-bottom: none; }
.settings-toggle-row strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 3px;
}
.settings-toggle-row span {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.45;
  max-width: 480px;
}

.settings-toggle {
  width: 46px;
  height: 26px;
  border-radius: 999px;
  background: var(--bg-hover);
  border: 1px solid rgba(255,255,255,0.08);
  position: relative;
  flex-shrink: 0;
  transition: background 0.3s var(--ease-out);
}
.settings-toggle::after {
  content: "";
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.35s var(--ease-out);
}
.settings-toggle.on {
  background: var(--accent);
  border-color: var(--accent);
}
.settings-toggle.on::after { transform: translateX(20px); }

.settings-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.settings-btn {
  padding: 10px 18px;
  border-radius: var(--pill);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text);
  transition: background 0.25s, transform 0.3s var(--ease-out);
}
.settings-btn:hover { background: rgba(255,255,255,0.14); transform: translateY(-1px); }
.settings-btn.subtle { color: var(--text-muted); }

.legal-body p,
.legal-body li {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.legal-body ul {
  padding-left: 20px;
  margin-bottom: 16px;
}

.legal-body li { margin-bottom: 8px; }

.legal-contact {
  margin-top: 24px;
  font-size: 0.9rem;
  color: var(--text);
}

@media (max-width: 768px) {
  .settings-body,
  .legal-body { padding: 24px 20px 16px; }
  .settings-title,
  .legal-body h1 { font-size: 1.45rem; }
}

@media (prefers-reduced-motion: reduce), html.reduce-motion {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
  .page-foot { opacity: 1; animation: none; }
  .hero-dot.active .hero-dot-fill { animation: none; transform: scaleX(1); }
  .media-card:hover,
  .media-card.is-hovered { transform: none; box-shadow: none; }
  .sidebar,
  body.sidebar-dock .app-shell {
    transition-duration: 0.2s !important;
  }
}
