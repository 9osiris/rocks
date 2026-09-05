# osiris.rocks

my portfolio. live at [osiris.rocks](https://osiris.rocks)

---

## what this is

my dumbass portfolio website that isnt completed, used my own ai to vibecode, and lowkey gave up on but were chill. an older version of this site was unoptimized as hell and fibre optimized it for me. thanks fibre.

## what it does

- **quantized canvas engine** - 35 fps animated background grid with a per-frame quantized color palette (48 alpha tiers, no per-cell string churn), precomputed cell distances, dpr-scaled rendering. it reacts to the audio: bass hits send soft expanding glows and a center flash that actually land on the beat
- **audio visualizer** - real fft analysis through the web audio api. sub-bass (20-60hz) and kick (60-150hz) bands are detected by flux onset detection, so the shockwaves actually land on the beat instead of just flickering randomly
- **fluid magnetic cursor** - continuous spring-damped pointer tracking that smoothly interpolates and morphs into interactive interface boundaries
- **floating audio widget** - embedded bottom-corner audio player with scrub controls, track progress tracking, a 7-band spectrum visualizer, and user-gesture autoplay handling so it actually works on mobile
- **responsive marquee ticker** - continuous animated skill ticker displaying development tooling and language proficiencies
- **seo & pwa configured** - validated web app manifest, opengraph tags, sitemap, and google search console verification

theres also a little easter egg. type `fibre` anywhere on the page (works on both pages).

## tech stack

- html5 + css3 (custom properties, no frameworks)
- vanilla javascript (es6+)
- deployed on vercel

## project structure

```text
.
├── index.html                  # the landing page, markup + player scripts
├── about.html                  # about me page, interests + stack
├── bg.js                       # shared canvas engine, cursor, easter egg
├── orc-styles.css              # layout & styling
├── osirisweb.svg               # vector brand logo & favicon
├── osirisweb.png               # raster brand icon
├── guilt_trip.mp3              # the track
├── cover.jfif                  # audio player artwork
├── googleb3700fd05b93ee70.html # google search console verification
├── manifest.json               # web app manifest
├── robots.txt                  # search crawler directives
├── sitemap.xml                 # xml sitemap
├── vercel.json                 # vercel deployment & routing config
└── README.md                   # this
```

## license

&copy; 2026 LYRD INNO. all rights reserved. fibre automated systems.
