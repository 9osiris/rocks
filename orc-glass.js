/*
 * orc-glass.js — Real WebGL "liquid glass" upgrade for the splash logo panel.
 *
 * Uses @ybouane/liquidglass (https://liquid-glass.ybouane.com/), loaded from a
 * CDN at runtime. This is intentionally defensive: if the module fails to load,
 * WebGL is unavailable, the user prefers reduced motion, or we're on a phone,
 * it does nothing and the existing CSS glass remains untouched.
 *
 * To disable entirely: remove the <script src="orc-glass.js" type="module"> line
 * from index.html.
 */

const GLASS_CDN = "https://cdn.jsdelivr.net/npm/@ybouane/liquidglass@1.0.3/dist/index.js";

function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch (e) {
    return false;
  }
}

async function initSplashGlass() {
  // Only the splash showcase, desktop only, motion allowed, WebGL present.
  if (matchMedia("(max-width: 768px)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!webglSupported()) return;

  const stage = document.querySelector(".splash-stage");
  const panel = document.querySelector(".splash-glass");
  const screen = document.getElementById("splash-screen");
  // If the splash was already dismissed this session there's nothing to enhance.
  if (!stage || !panel || !screen || screen.classList.contains("splash-exit")) return;

  let LiquidGlass;
  try {
    ({ LiquidGlass } = await import(GLASS_CDN));
  } catch (e) {
    console.warn("[orc-glass] CDN load failed, keeping CSS glass.", e);
    return;
  }
  if (!LiquidGlass || typeof LiquidGlass.init !== "function") return;

  let instance;
  try {
    instance = await LiquidGlass.init({
      root: stage,
      glassElements: [panel],
      defaults: {
        blurAmount: 0.18,
        refraction: 0.72,
        chromAberration: 0.06,
        edgeHighlight: 0.12,
        specular: 0.35,
        fresnel: 1.0,
        cornerRadius: 60,
        zRadius: 34,
        tintStrength: 0.10,
        saturation: 0.25,
        shadowOpacity: 0.45,
        shadowSpread: 26,
        shadowOffsetY: 8,
      },
    });
  } catch (e) {
    console.warn("[orc-glass] init failed, keeping CSS glass.", e);
    return;
  }

  // WebGL is live — hand the look over to the shader and hide the CSS fakery.
  panel.classList.add("glass-webgl-on");

  // Tear down cleanly the moment the splash starts exiting, so the render loop
  // doesn't keep running for a panel that's animating away / removed.
  const stop = () => {
    try { instance && instance.destroy(); } catch (e) {}
  };
  const obs = new MutationObserver(() => {
    if (screen.classList.contains("splash-exit")) {
      stop();
      obs.disconnect();
    }
  });
  obs.observe(screen, { attributes: true, attributeFilter: ["class"] });
  // Hard stop fallback in case the splash is removed without the exit class.
  setTimeout(stop, 8000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSplashGlass, { once: true });
} else {
  initSplashGlass();
}
