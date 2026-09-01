import { useEffect, useMemo, useRef, useState } from 'react'

/* Inlined so this file is self-contained for registries (21st.dev Studio,
   shadcn-style installs) that only bundle the exact file(s) you publish and
   won't resolve a sibling .css import. Rendered as a single <style> tag. */
const BBD2_CSS = `/* broken by design. ---------------------------------------------------- */

.bbd2 {
  position: relative;
  width: 100%;
  overflow: hidden;
  isolation: isolate;
  background: #030407;
  perspective: 1250px;

  /* Type in cqw: the title and every per-shard slice measure against
     the hero itself — pixel-identical alignment at any width. */
  container-type: inline-size;

  font-family:
    'Space Grotesk',
    'Archivo Black',
    system-ui,
    sans-serif;

  user-select: none;
}

.bbd2-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 62% 50% at 50% 42%,
      rgba(125, 150, 200, 0.08), transparent 62%),
    radial-gradient(ellipse 100% 80% at 50% 118%,
      rgba(45, 55, 90, 0.18), transparent 60%),
    #030407;
}

/* The composition sits inset: smaller pane, bigger word across it.
   Everything inside (under word, cracks, pieces, slices) shares this
   box, so the slice alignment math stays exact. */
.bbd2-stage {
  position: absolute;
  inset: 6% 4.5%;
}

/* ------- title ------------------------------------------------------ */

.bbd2-title,
.bbd2-slice {
  position: absolute;
  display: grid;
  place-items: center;
  pointer-events: none;
  white-space: nowrap;
  font-weight: 700;
  font-size: clamp(26px, 10cqw, 190px);
  letter-spacing: -0.035em;
  line-height: 1;
}

.bbd2-title {
  inset: 0;
  z-index: 1;
  opacity: 0;
  animation: bbd2-cracks-in 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* The exposed word: flat and cold. No halo — air doesn't glow. */
.bbd2-title--under span,
.bbd2-title--under .bbd2-stack {
  color: rgba(188, 198, 220, 0.24);
}

/* Portrait: the words stack and lean on a diagonal. Same node in the
   under layer and in every slice, so the geometry stays identical. */
.bbd2--portrait .bbd2-title,
.bbd2--portrait .bbd2-slice {
  font-size: clamp(44px, 20cqw, 190px);
}

.bbd2-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.08em;
  transform: rotate(-8deg);
  line-height: 0.92;
}

.bbd2-stack em {
  font-style: normal;
  display: block;
}

/* the middle word (by) sits smaller, off-axis — a beat, not a shout */
.bbd2-stack em:nth-child(2) {
  font-size: 0.44em;
  align-self: flex-end;
  margin-right: 8%;
  opacity: 0.85;
}

/* ------- logo variant ----------------------------------------------- */

/* When a logo replaces the wordmark: same node in the under layer and
   in every slice, so the shard alignment math still holds. */
.bbd2-logo {
  height: 62%;
  width: auto;
  max-width: 80%;
  object-fit: contain;
}

.bbd2-title--under .bbd2-logo {
  opacity: 0.22;
  filter: grayscale(1) brightness(1.1);
}

.bbd2-slice > .bbd2-logo {
  opacity: 0.55;
  mix-blend-mode: screen;
  filter: grayscale(1) blur(0.3px);
  transform: var(--jt);
}

/* ------- cracks through the void ------------------------------------ */

.bbd2-cracks {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  animation: bbd2-cracks-in 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes bbd2-cracks-in {
  to { opacity: 1; }
}

.bbd2-cracks path {
  fill: none;
  vector-effect: non-scaling-stroke;
}

.bbd2-cracks-line path {
  stroke: rgba(198, 214, 244, 0.34);
  stroke-width: 1;
}

.bbd2-cracks-glow path {
  stroke: rgba(170, 195, 240, 0.10);
  stroke-width: 2.6;
}

.bbd2-cracks-fine path {
  stroke: rgba(198, 214, 244, 0.17);
  stroke-width: 0.75;
}

/* ------- glass ------------------------------------------------------ */

.bbd2-pane {
  position: absolute;
  inset: 0;
  z-index: 5;
  transform-style: preserve-3d;
  pointer-events: none;
}

.bbd2-shard {
  position: absolute;
  transform-origin: 50% 50%;
  pointer-events: auto;
  will-change: transform;
  transition: filter 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.bbd2-shard--hot {
  z-index: 40 !important;
  filter:
    brightness(1.22)
    drop-shadow(0 42px 54px rgba(0, 0, 0, 0.72))
    drop-shadow(0 0 30px rgba(150, 185, 255, 0.18));
}

/* Everything inside exists only where the shard's alpha exists. */
.bbd2-inlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  pointer-events: none;
}

.bbd2-glassimg {
  position: absolute;
  inset: 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

/* Ambient sheen: the pane catches the light of the room. Without it,
   big flat pieces read as opaque panels instead of glass. */
.bbd2-glassimg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      132deg,
      rgba(165, 185, 232, 0.13) 0%,
      rgba(165, 185, 232, 0.03) 30%,
      transparent 46%,
      transparent 60%,
      rgba(112, 96, 178, 0.08) 100%
    );
  mix-blend-mode: screen;
}

/* This shard's slice of the word, sized back up to the full hero.
   Inside the glass the letters ARE allowed to catch light — but
   quietly: a close, cold sheen instead of a neon halo. */
.bbd2-slice > span,
.bbd2-slice > .bbd2-stack {
  color: rgba(222, 232, 252, 0.52);
  mix-blend-mode: screen;
  filter: blur(0.3px);
  transform: var(--jt);
  text-shadow: 0 0 12px rgba(165, 195, 250, 0.22);
}

/* stacked variant already carries rotate(-8deg); compose the jitter */
.bbd2-slice > .bbd2-stack {
  transform: var(--jt) rotate(-8deg);
}

.bbd2-specular {
  position: absolute;
  inset: 0;
  opacity: 0;
  background:
    radial-gradient(
      42% 42% at var(--mx, 50%) var(--my, 50%),
      rgba(205, 225, 255, 0.34),
      rgba(140, 170, 230, 0.08) 46%,
      transparent 72%
    );
  mix-blend-mode: screen;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.bbd2-shard--hot .bbd2-specular {
  opacity: 1;
}

/* ------- chrome: sound toggle + credit ------------------------------ */

/* The toggle IS a glass shard: no chrome, the PNG is the button. */
.bbd2-sound {
  position: absolute;
  right: 16px;
  bottom: 12px;
  z-index: 50;

  appearance: none;
  border: none;
  background: none;
  padding: 6px;

  cursor: pointer;
  transition: filter 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.bbd2-sound img {
  display: block;
  width: 74px;
  height: auto;
  pointer-events: none;
  animation: bbd2-fade-in 0.5s ease forwards;
}

@keyframes bbd2-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.bbd2-sound:hover,
.bbd2-sound:focus-visible {
  filter: brightness(1.35) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55));
  transform: translateY(-2px);
  outline: none;
}

.bbd2-sound:active {
  transform: translateY(0) scale(0.96);
}

.bbd2-sound[aria-pressed='false'] {
  filter: brightness(0.8);
}

.bbd2-sound[aria-pressed='false']:hover,
.bbd2-sound[aria-pressed='false']:focus-visible {
  filter: brightness(1.1) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55));
}

.bbd2-credit {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 50;

  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.08em;

  color: rgba(214, 224, 244, 0.85);
  text-decoration: none;

  opacity: 0.16;
  transition: opacity 0.35s;
}

.bbd2-credit:hover,
.bbd2-credit:focus-visible {
  opacity: 0.8;
  outline: none;
}

/* ------- a11y -------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .bbd2-shard,
  .bbd2-specular,
  .bbd2-sound,
  .bbd2-credit {
    transition: none;
  }
  .bbd2-cracks,
  .bbd2-title {
    animation: none;
    opacity: 1;
  }
}

/* ------- shatter exit ------------------------------------------------ */

/* On exit the pane stops being a backdrop and becomes just the glass:
   the room behind it (the app) shows through while the pieces fall. */
.bbd2--shatter {
  background: transparent;
  overflow: visible;
}

.bbd2--shatter .bbd2-bg,
.bbd2--shatter .bbd2-sound,
.bbd2--shatter .bbd2-credit {
  opacity: 0;
  transition: opacity 0.14s linear;
  pointer-events: none;
}

/* The fracture network holds until the fist actually hits it. */
.bbd2--shatter .bbd2-cracks {
  opacity: 0;
  transition: opacity 0.22s linear 0.24s;
  pointer-events: none;
}

/* Every screen-blend in here was compositing against the black pane.
   Once the app is the backdrop, each blended layer forces the browser to
   re-read a full-screen surface per frame — that is the jank. Drop them
   for the fall: what's left is the glass and its edges, which is all you
   see anyway once the pieces are tumbling. */
.bbd2--shatter .bbd2-specular,
.bbd2--shatter .bbd2-glassimg::after {
  display: none;
}

/* The logo stops being a thing trapped inside the glass and becomes one
   object in front of it — so the per-shard slices go, and the under layer
   comes forward, lit. */
.bbd2--shatter .bbd2-slice {
  opacity: 0;
  transition: opacity 0.16s linear;
}

.bbd2--shatter .bbd2-title--under {
  z-index: 60;
  opacity: 1;
  animation: none;
}

.bbd2--shatter .bbd2-title--under .bbd2-logo {
  opacity: 0.95;
  filter:
    grayscale(1) brightness(1.5)
    drop-shadow(0 0 28px rgba(150, 185, 255, 0.4));
  transition: opacity 0.18s linear, filter 0.18s linear;
}

.bbd2--shatter .bbd2-shard {
  pointer-events: none;
  transition: none;
  filter: none;
  will-change: transform;
  backface-visibility: hidden;
}
`

/* ------------------------------------------------------------------ */
/*  broken by design. — big-shard glass hero                          */
/*                                                                    */
/*  Two real piece sets (desktop / mobile render), each shard an      */
/*  independent 3D layer cut with alpha from the source render.       */
/*  The title lives inside the glass: every shard carries its own     */
/*  masked slice of the text and tilts it along. Crack lines run      */
/*  through the gaps — traced from the medial axis of the real        */
/*  channels between the pieces, so the void reads as fracture.       */
/*                                                                    */
/*  No animation deps. One rAF spring loop drives everything.         */
/* ------------------------------------------------------------------ */

export interface BrokenByDesignProps {
  /** Base URL where the shard PNGs are hosted (no trailing slash). */
  assetsBase?: string
  title?: string
  /** Logo image that replaces the text behind the glass. */
  logoSrc?: string
  height?: string
  /** Crack tick on hover. Starts ON; the UI toggle lets users mute. */
  sound?: boolean
  interactive?: boolean
  className?: string
  /** Drop the pane: every shard falls off-screen, revealing what's behind. */
  shatter?: boolean
  /** Fires once the last shard has left the screen. */
  onShatterEnd?: () => void
}

type Piece = {
  id: string; x: number; y: number; w: number; h: number
  cx: number; cy: number; ring: number
}

const DESKTOP: Piece[] = [
  { id: 'desktop-01a', x: 80.214, y: 5.299, w: 15.445, h: 72.943, cx: 87.96, cy: 41.83, ring: 2 },
  { id: 'desktop-01b', x: 92.39, y: 31.004, w: 6.144, h: 52.762, cx: 95.32, cy: 58.4, ring: 2 },
  { id: 'desktop-02a', x: 31.285, y: 7.44, w: 15.614, h: 40.023, cx: 38.98, cy: 27.34, ring: 1 },
  { id: 'desktop-02b', x: 5.073, y: 6.313, w: 31.567, h: 39.572, cx: 20.94, cy: 26.04, ring: 1 },
  { id: 'desktop-02c', x: 4.791, y: 9.808, w: 19.786, h: 25.93, cx: 14.63, cy: 22.6, ring: 1 },
  { id: 'desktop-03a', x: 18.771, y: 38.444, w: 28.636, h: 52.649, cx: 32.92, cy: 64.66, ring: 1 },
  { id: 'desktop-03b', x: 4.735, y: 35.964, w: 15.558, h: 11.612, cx: 12.63, cy: 41.88, ring: 1 },
  { id: 'desktop-03c', x: 3.044, y: 46.111, w: 26.719, h: 45.547, cx: 16.52, cy: 68.43, ring: 1 },
  { id: 'desktop-04a', x: 42.785, y: 7.892, w: 25.536, h: 36.077, cx: 55.55, cy: 25.82, ring: 0 },
  { id: 'desktop-04b', x: 50.057, y: 7.554, w: 34.16, h: 29.876, cx: 67.08, cy: 22.55, ring: 0 },
  { id: 'desktop-05a', x: 37.655, y: 46.786, w: 14.149, h: 18.489, cx: 44.79, cy: 55.86, ring: 0 },
  { id: 'desktop-05b', x: 46.11, y: 37.88, w: 34.611, h: 26.945, cx: 63.28, cy: 51.24, ring: 0 },
  { id: 'desktop-06a', x: 44.645, y: 68.659, w: 32.694, h: 24.464, cx: 60.94, cy: 80.5, ring: 0 },
  { id: 'desktop-06b', x: 47.238, y: 66.404, w: 26.945, h: 12.852, cx: 60.85, cy: 72.55, ring: 0 },
  { id: 'desktop-07a', x: 74.972, y: 57.61, w: 12.12, h: 34.498, cx: 81.14, cy: 74.69, ring: 2 },
  { id: 'desktop-07b', x: 84.273, y: 66.855, w: 10.654, h: 25.028, cx: 89.54, cy: 79.65, ring: 2 },
]

const MOBILE: Piece[] = [
  { id: 'mobile-01a', x: 51.817, y: 3.633, w: 39.625, h: 22.343, cx: 71.45, cy: 14.78, ring: 2 },
  { id: 'mobile-01b', x: 7.972, y: 4.338, w: 60.258, h: 19.469, cx: 38.39, cy: 14.13, ring: 2 },
  { id: 'mobile-01c', x: 59.789, y: 3.958, w: 13.013, h: 5.369, cx: 66.3, cy: 6.81, ring: 2 },
  { id: 'mobile-02a', x: 7.034, y: 19.36, w: 36.811, h: 34.111, cx: 25.44, cy: 36.36, ring: 0 },
  { id: 'mobile-02b', x: 10.082, y: 18.872, w: 48.886, h: 24.024, cx: 34.23, cy: 30.99, ring: 0 },
  { id: 'mobile-03a', x: 10.316, y: 69.685, w: 35.287, h: 13.178, cx: 27.84, cy: 76.36, ring: 1 },
  { id: 'mobile-03b', x: 9.144, y: 73.59, w: 60.844, h: 22.397, cx: 39.62, cy: 84.6, ring: 1 },
  { id: 'mobile-04a', x: 8.91, y: 55.965, w: 67.057, h: 22.56, cx: 42.38, cy: 67.14, ring: 0 },
  { id: 'mobile-04b', x: 13.834, y: 52.603, w: 56.389, h: 11.714, cx: 41.79, cy: 58.6, ring: 0 },
  { id: 'mobile-04c', x: 42.556, y: 56.508, w: 47.831, h: 13.503, cx: 66.0, cy: 63.31, ring: 0 },
  { id: 'mobile-05a', x: 63.54, y: 11.985, w: 29.426, h: 14.479, cx: 78.43, cy: 19.28, ring: 1 },
  { id: 'mobile-05b', x: 57.796, y: 16.595, w: 34.584, h: 28.145, cx: 75.03, cy: 30.56, ring: 1 },
  { id: 'mobile-06a', x: 61.313, y: 71.529, w: 26.495, h: 24.403, cx: 74.68, cy: 83.73, ring: 2 },
  { id: 'mobile-06b', x: 76.905, y: 67.462, w: 14.42, h: 18.113, cx: 83.76, cy: 76.57, ring: 2 },
  { id: 'mobile-07a', x: 32.474, y: 46.312, w: 54.396, h: 10.521, cx: 58.97, cy: 51.44, ring: 0 },
  { id: 'mobile-07b', x: 43.494, y: 37.961, w: 48.3, h: 18.872, cx: 67.53, cy: 47.37, ring: 0 },
]

/* Crack polylines traced from the medial axis of the gaps between the
   real pieces — main channels plus fine secondary branches. */
/* One sprite per breakpoint instead of 16 separate PNGs — cuts the
   pane from ~16 HTTP requests to 1, which is what actually made the
   glass feel slow to arrive. Rects are [x, y, w, h] in atlas px. */
const ATLAS = {
  desktop: { url: 'atlas-desktop.png', w: 900, h: 2807 },
  mobile: { url: 'atlas-mobile.png', w: 900, h: 3287 },
}

const ATLAS_RECTS: Record<string, Record<string, [number, number, number, number]>> = {
  desktop: {
  'desktop-01a': [2, 2, 274, 647],
  'desktop-01b': [278, 2, 109, 468],
  'desktop-02a': [478, 651, 277, 355],
  'desktop-02b': [2, 1057, 560, 351],
  'desktop-02c': [2, 2240, 351, 230],
  'desktop-03a': [389, 2, 508, 467],
  'desktop-03b': [482, 2691, 276, 103],
  'desktop-03c': [2, 651, 474, 404],
  'desktop-04a': [2, 1410, 453, 320],
  'desktop-04b': [2, 1732, 606, 265],
  'desktop-05a': [584, 2472, 251, 164],
  'desktop-05b': [2, 1999, 614, 239],
  'desktop-06a': [2, 2472, 580, 217],
  'desktop-06b': [2, 2691, 478, 114],
  'desktop-07a': [457, 1410, 215, 306],
  'desktop-07b': [355, 2240, 189, 222],
  },
  mobile: {
  'mobile-01a': [523, 1496, 338, 412],
  'mobile-01b': [2, 1911, 514, 359],
  'mobile-01c': [468, 3091, 111, 99],
  'mobile-02a': [2, 2, 314, 629],
  'mobile-02b': [2, 633, 417, 443],
  'mobile-03a': [412, 2622, 301, 243],
  'mobile-03b': [2, 1496, 519, 413],
  'mobile-04a': [2, 1078, 572, 416],
  'mobile-04b': [2, 2873, 481, 216],
  'mobile-04c': [2, 2622, 408, 249],
  'mobile-05a': [541, 2272, 251, 267],
  'mobile-05b': [318, 2, 295, 519],
  'mobile-06a': [615, 2, 226, 450],
  'mobile-06b': [416, 2272, 123, 334],
  'mobile-07a': [2, 3091, 464, 194],
  'mobile-07b': [2, 2272, 412, 348],
  },
}

/* Classic responsive-sprite math: background-size/position expressed
   as % of the ELEMENT, so the crop stays exact at any render size
   without knowing actual pixel dimensions up front. */
function spriteStyle(setKey: 'desktop' | 'mobile', id: string) {
  const sheet = ATLAS[setKey]
  const rect = ATLAS_RECTS[setKey][id]
  const sx = rect[0], sy = rect[1], fw = rect[2], fh = rect[3]
  const sizeX = (sheet.w / fw) * 100
  const sizeY = (sheet.h / fh) * 100
  const posX = sheet.w > fw ? (sx / (sheet.w - fw)) * 100 : 0
  const posY = sheet.h > fh ? (sy / (sheet.h - fh)) * 100 : 0
  return {
    backgroundSize: sizeX.toFixed(3) + '% ' + sizeY.toFixed(3) + '%',
    backgroundPosition: posX.toFixed(3) + '% ' + posY.toFixed(3) + '%',
  }
}

const CRACKS: Record<string, { w: number; h: number; main: string[]; fine: string[] }> = {
  desktop: { w: 1774, h: 887, main: ["M1616 807L1432 812L1402 805L1397 797L1385 790", "M769 404L812 402L1359 327L1381 321", "M1381 321L1390 300L1443 241L1467 231", "M1381 321L1386 326L1410 329L1435 338", "M695 402L701 391L724 374L747 365", "M656 484L629 473L611 455L604 434", "M1436 339L1436 379L1428 438L1404 489", "M1122 817L1135 817", "M832 590L835 587L854 586L895 587", "M657 484L660 481L664 443L670 430", "M696 403L706 403L708 408", "M75 501L89 329L102 318L124 310L136 298", "M1318 543L1321 583", "M110 765L78 711", "M918 817L1014 817", "M62 661L66 629", "M852 646L846 640L832 591", "M129 61L814 67L842 90", "M173 805L720 807L735 803L756 778L777 770", "M819 816L809 814L789 801L783 775L778 770", "M1174 818L1331 818", "M853 646L870 639L888 615L895 588", "M834 816L877 816", "M1667 796L1681 773L1688 750", "M748 365L762 385L768 403", "M1436 338L1442 331L1467 265L1470 237", "M94 267L87 239L92 100", "M1320 584L1283 582L1274 573", "M1403 490L1358 504L1331 525L1318 542", "M1689 749L1716 741L1729 732", "M1273 572L910 581L896 587", "M1274 571L1293 550L1317 543", "M696 420L763 409L768 404", "M1673 115L1674 131", "M1621 806L1640 806", "M75 503L66 597L66 628", "M1508 127L1500 119L1497 105L1487 86L1480 79L1465 75L1286 69L884 64L867 68L853 84L842 90", "M1508 127L1527 115L1541 80L1556 63L1579 56L1633 54", "M1508 127L1502 152L1468 230", "M778 769L781 757L843 671L852 647", "M1675 133L1736 671", "M1404 490L1434 526L1688 749", "M1384 789L1380 759L1321 585", "M604 433L608 429L664 429", "M1383 790L1370 806L1341 818", "M842 90L835 131L753 337L748 364", "M95 268L112 280L125 284L136 298", "M831 590L819 587L685 518L664 502L657 485", "M688 418L694 403", "M136 298L494 342L510 351L603 433", "M687 419L670 430"], fine: ["M82 502L76 502", "M1468 231L1469 236", "M1653 60L1665 71", "M94 268L88 272", "M1671 98L1671 103", "M63 685L66 691", "M1039 817L1029 817", "M664 430L652 442", "M1457 249L1468 237", "M696 418L705 409", "M665 430L670 430", "M93 97L93 93", "M1737 680L1737 675", "M1672 111L1672 106", "M61 666L61 674", "M688 419L695 419", "M1670 89L1670 93", "M117 777L111 767", "M1738 689L1738 684", "M93 85L93 89", "M1739 697L1739 692"] },
  mobile: { w: 853, h: 1844, main: ["M579 81L594 81", "M609 1745L596 1754L570 1762", "M610 1744L605 1710L518 1517L505 1465", "M489 691L508 709L684 822L725 835", "M576 82L561 82", "M265 925L272 965", "M751 1230L763 1210L767 1195L769 1121L766 1102L748 1079L742 1059", "M162 106L147 106", "M491 626L501 636L509 634", "M750 1231L725 1236L691 1257L527 1455L505 1465", "M527 84L541 84", "M75 165L72 285L78 313L87 322L93 336", "M528 638L570 492L591 482L605 448L717 314L734 303L748 299", "M164 105L508 86", "M524 85L510 85", "M769 1256L764 1242L751 1231", "M596 80L609 80", "M742 1058L767 1043L778 1008", "M787 251L770 615L755 787L748 812L726 835", "M611 80L625 79", "M748 1547L742 1623", "M513 521L508 562L494 588", "M769 1258L772 1272", "M423 694L428 663L448 610L468 595L493 589", "M773 120L775 177L767 212", "M709 782L714 773L754 306L750 299", "M424 695L488 691", "M218 956L228 937L240 930L264 925", "M544 83L559 83", "M423 696L415 709L363 849L349 862L279 903L270 912L265 924", "M488 490L470 486L459 479L362 389L124 339L94 337", "M130 1273L172 1276L370 1316L471 1446L482 1456L505 1465", "M217 957L184 967L143 994L127 998", "M489 491L499 512L513 520", "M514 520L525 509L527 480", "M490 626L484 648L488 690", "M379 1762L188 1762", "M127 998L121 992L104 990L84 975L80 961L66 401", "M127 998L119 1018L84 1043L78 1082L89 1233L106 1256L122 1263L129 1272", "M527 659L528 639", "M494 589L490 625", "M741 1058L273 966", "M778 988L776 897L768 872", "M708 782L687 777L532 677L527 660", "M527 480L549 450L740 227L749 219L767 212", "M527 480L498 484L490 490", "M767 871L734 851L726 836", "M218 957L228 964L259 968L271 966", "M70 412L70 402L66 401", "M527 638L510 634", "M611 1745L627 1753L654 1760L694 1761", "M84 1703L92 1326L96 1310L106 1297L122 1285L129 1273", "M93 338L76 353L65 386", "M749 298L761 263L759 252L763 242", "M767 212L780 225L787 245"], fine: ["M761 1403L761 1411", "M703 74L711 74", "M741 1635L741 1625", "M772 1287L772 1283", "M65 390L66 401", "M695 75L683 75", "M759 1426L759 1434", "M753 1492L753 1501", "M737 1679L737 1673", "M758 1445L758 1437", "M765 1359L765 1367", "M738 1668L738 1661", "M763 1389L763 1381", "M768 1333L768 1329", "M749 1536L749 1545", "M735 1702L735 1696", "M723 1746L719 1750", "M630 78L640 78", "M754 1489L754 1481", "M659 77L648 77", "M769 1322L769 1317", "M760 1422L760 1415", "M752 1503L752 1512", "M766 1355L766 1350", "M389 1762L384 1762", "M733 1715L733 1724", "M755 1471L755 1478", "M771 1299L771 1294", "M665 76L672 76", "M132 107L137 107", "M514 657L526 660", "M751 1515L751 1523", "M509 633L512 622", "M760 96L753 92", "M756 1459L756 1467", "M764 1378L764 1370", "M767 1340L767 1344", "M750 1534L750 1526", "M710 787L709 783", "M736 1690L736 1682", "M762 1400L762 1393", "M91 1738L100 1747", "M734 1704L734 1713", "M770 1306L770 1310", "M740 1637L740 1646", "M739 1648L739 1657", "M757 1456L757 1449"] },
}

/* A couple of pieces rest slightly lifted: the pane reads as 3D even
   in a static frame (what a 21st.dev card thumbnail shows). */
const BASE_POSE: Record<string, Partial<SpringState>> = {
  'desktop-05a': { rx: 3.2, ry: -4.6, tz: 22 },
  'desktop-07b': { rx: -2.4, ry: 3.8, tz: 14 },
  'mobile-07a': { rx: 2.8, ry: -3.6, tz: 18 },
  'mobile-01b': { rx: -2, ry: 2.6, tz: 10 },
}

/* Deterministic per-shard jitter: the word reads as one line but sits
   visibly fractured across the pane. */
function jitter(seed: number) {
  const r = (n: number) => {
    const s = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
    return s - Math.floor(s)
  }
  return {
    tx: (r(1) - 0.5) * 14,
    ty: (r(2) - 0.5) * 10,
    rot: (r(3) - 0.5) * 2.4,
  }
}

function playCrack(ctx: AudioContext) {
  const now = ctx.currentTime
  const size = Math.floor(ctx.sampleRate * 0.09)
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++)
    data[i] = (Math.random() * 2 - 1) * (1 - i / size) ** 2
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 3000
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.22, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
  noise.connect(hp); hp.connect(g); g.connect(ctx.destination)
  noise.start(now)
}

/* Sampled glass crackle (~6 KB mp3, embedded so the file stays
   self-contained). Half the hover ticks play this recording instead of
   the synth burst, so repeated hovers don't sound machine-made. */
const CRACKLE_MP3 =
  'data:audio/mpeg;base64,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xhoFoegB//twxEUAUCWdO4eMz8ntsmeymFABhAAKPhJAW+QUIfZDhsmk5GAQWHVFxYADJMgeOhXIJOUgwLYwdFxl1HC5ma+dDEVZTEqV0cxSMahXkjU2cxkcRQl1LZ9ZFH7sjFV1M5WaLnFUO92LKVzK1j0Hj0q1V7vSzPbroZ9zJYguKnO9cR+fAG03tdRaPhsLRYLRIJBGIxGFplvJTZ/3BZN9X/N5QRF2XJ/6TRDz4QHUO41d/gQgljk43bX+NaBqCIgjRKh3/nlDIelEHTulv/6Z+TqqZIR9sbv/9j0x9abHTp7c7/lv//5qWlbz586khBJi5hzvj////MLLCwpoyMDA4XnkqN87KKShRUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cMRYgBAhW1W5hYAYAAA0g4AABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='

let crackleBuf: AudioBuffer | null = null
let crackleLoading = false

function loadCrackle(ctx: AudioContext) {
  if (crackleBuf || crackleLoading) return
  crackleLoading = true
  fetch(CRACKLE_MP3)
    .then((r) => r.arrayBuffer())
    .then((b) => ctx.decodeAudioData(b))
    .then((buf) => { crackleBuf = buf })
    .catch(() => { crackleLoading = false })
}

function playCrackle(ctx: AudioContext) {
  if (!crackleBuf) return false
  const src = ctx.createBufferSource()
  src.buffer = crackleBuf
  const g = ctx.createGain()
  g.gain.value = 0.45
  src.connect(g); g.connect(ctx.destination)
  src.start()
  return true
}

type SpringState = { rx: number; ry: number; tz: number; px: number; py: number; sc: number }

/* Every fragment rests at its own slight depth and tilt — the pane
   reads as truly come apart, not laid flat. Two hero pieces per set
   get stronger poses on top (BASE_POSE). */
function baseOf(id: string, seed: number): SpringState {
  const r = (n: number) => {
    const s = Math.sin(seed * 91.7 + n * 269.5) * 43758.5453
    return s - Math.floor(s)
  }
  return {
    rx: (r(1) - 0.5) * 3.4,
    ry: (r(2) - 0.5) * 4.2,
    tz: r(3) * 16,
    px: 0,
    py: 0,
    sc: 1,
    ...BASE_POSE[id],
  }
}

function toTransform(s: SpringState) {
  return (
    `translate3d(${s.px.toFixed(2)}px, ${s.py.toFixed(2)}px, ${s.tz.toFixed(2)}px)` +
    ` rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg)` +
    ` scale(${s.sc.toFixed(4)})`
  )
}

/* Same function list as toTransform plus rotateZ — the exit keyframes must
   match the resting transform function-for-function, or Chrome decomposes
   both to matrices and interpolates the rotations into a wobble. */
function toFallTransform(
  x: number, y: number, z: number,
  rx: number, ry: number, rz: number, sc: number,
) {
  return (
    `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)` +
    ` rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)` +
    ` scale(${sc.toFixed(4)})`
  )
}

export default function BrokenByDesign({
  assetsBase = 'https://cdn.jsdelivr.net/gh/gughigug/broken-by-design-assets@main',
  title = 'broken by design.',
  logoSrc,
  height = '100dvh',
  sound = true,
  interactive = true,
  className = '',
  shatter = false,
  onShatterEnd,
}: BrokenByDesignProps) {
  const rootRef = useRef<HTMLElement>(null)
  const audioRef = useRef<AudioContext | null>(null)

  /* last pose the spring loop wrote, handed to the exit animation */
  const poseRef = useRef<SpringState[] | null>(null)

  const [portrait, setPortrait] = useState(false)
  const [soundOn, setSoundOn] = useState(sound)
  const soundRef = useRef(soundOn)
  soundRef.current = soundOn

  /* Gate the entrance on the sprite actually being decoded — a single
     request lands close to atomically, so instead of pieces trickling
     in one texture at a time, the whole pane appears glass-ready and
     THEN assembles. Times out after 2.5s so a slow network still
     shows something rather than hanging on a blank hero. */
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-aspect-ratio: 1/1)')
    const apply = () => setPortrait(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const pieces = portrait ? MOBILE : DESKTOP
  const setKey = portrait ? 'mobile' : 'desktop'
  const cracks = CRACKS[setKey]
  const jitters = useMemo(() => pieces.map((_, i) => jitter(i + 1)), [pieces])

  useEffect(() => {
    let cancelled = false
    setReady(false)
    const urls = [
      `${assetsBase}/${ATLAS[setKey].url}`,
      `${assetsBase}/sound-on.png`,
      `${assetsBase}/sound-off.png`,
    ]
    if (logoSrc) urls.push(logoSrc)
    const timeout = setTimeout(() => { if (!cancelled) setReady(true) }, 2500)
    Promise.all(
      urls.map(
        (u) =>
          new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = () => resolve()
            img.src = u
          }),
      ),
    ).then(() => {
      if (!cancelled) { clearTimeout(timeout); setReady(true) }
    })
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [assetsBase, setKey, logoSrc])

  /* Portrait: the words stack and lean on a diagonal. A logo replaces
     the text outright — same node in both layers either way. */
  const titleNode = logoSrc ? (
    <img className="bbd2-logo" src={logoSrc} alt="" draggable={false} />
  ) : portrait ? (
    <span className="bbd2-stack">
      {title.split(' ').map((w, i) => (
        <em key={i}>{w}</em>
      ))}
    </span>
  ) : (
    <span>{title}</span>
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root || !ready || shatter) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const shards = Array.from(root.querySelectorAll<HTMLElement>('[data-shard]'))
    const P = setKey === 'mobile' ? MOBILE : DESKTOP

    /* resting pose is the floor state — set it as inline style so the
       entrance animation (fill: backwards) lands exactly on it */
    shards.forEach((el, i) => {
      el.style.transform = toTransform(baseOf(P[i].id, i + 1))
    })

    /* ---------- entrance: the pane reassembles from the center ---------- */
    if (!reduced) {
      shards.forEach((el, i) => {
        const p = P[i]
        const rest = toTransform(baseOf(p.id, i + 1))
        const dx = p.cx - 50
        const dy = p.cy - 50
        const dist = Math.hypot(dx, dy)
        const ux = dx / (dist || 1)
        const uy = dy / (dist || 1)
        el.animate(
          [
            {
              opacity: 0,
              transform:
                `translate3d(${ux * 110}px, ${uy * 110}px, 280px)` +
                ` rotateX(${uy * -12}deg) rotateY(${ux * 12}deg)`,
              filter: 'brightness(2) blur(2px)',
            },
            {
              opacity: 1,
              transform: rest,
              filter: 'brightness(1) blur(0px)',
              offset: 0.72,
            },
            { opacity: 1, transform: rest, filter: 'none' },
          ],
          {
            duration: 1400,
            delay: 180, // all pieces land together — the word assembles in one beat
            easing: 'cubic-bezier(.16,1,.3,1)',
            fill: 'backwards',
          },
        )
      })
    }

    if (!interactive || reduced) return

    /* ---------- one spring loop for every shard ---------- */
    const cur: SpringState[] = shards.map((_, i) => baseOf(P[i].id, i + 1))
    const tgt: SpringState[] = shards.map((_, i) => baseOf(P[i].id, i + 1))
    const hovered = new Set<number>()
    poseRef.current = cur

    let raf = 0
    let running = false
    let globalX = 0
    let globalY = 0

    const wake = () => {
      if (!running) { running = true; raf = requestAnimationFrame(tick) }
    }

    const tick = () => {
      let alive = false
      const k = 0.12
      for (let i = 0; i < shards.length; i++) {
        const c = cur[i]
        const t = tgt[i]
        c.rx += (t.rx - c.rx) * k
        c.ry += (t.ry - c.ry) * k
        c.tz += (t.tz - c.tz) * k
        c.px += (t.px - c.px) * k
        c.py += (t.py - c.py) * k
        c.sc += (t.sc - c.sc) * k
        const d =
          Math.abs(t.rx - c.rx) + Math.abs(t.ry - c.ry) +
          Math.abs(t.tz - c.tz) + Math.abs(t.px - c.px) +
          Math.abs(t.py - c.py)
        if (d > 0.01) alive = true
        shards[i].style.transform = toTransform(c)
      }
      if (alive) raf = requestAnimationFrame(tick)
      else running = false
    }

    const setParallax = () => {
      for (let i = 0; i < shards.length; i++) {
        if (hovered.has(i)) continue
        const b = baseOf(P[i].id, i + 1)
        const depth = 1 - P[i].ring * 0.32
        tgt[i].px = b.px - globalX * 24 * depth
        tgt[i].py = b.py - globalY * 18 * depth
        tgt[i].rx = b.rx + globalY * 3.2 * depth
        tgt[i].ry = b.ry - globalX * 4 * depth
        tgt[i].tz = b.tz
        tgt[i].sc = b.sc
      }
    }

    const onRootMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      globalX = (e.clientX - r.left) / r.width - 0.5
      globalY = (e.clientY - r.top) / r.height - 0.5
      setParallax()
      wake()
    }

    const onRootLeave = () => {
      globalX = 0; globalY = 0
      tgt.forEach((t, i) => { if (!hovered.has(i)) Object.assign(t, baseOf(P[i].id, i + 1)) })
      wake()
    }

    const cleanups: (() => void)[] = [
      () => root.removeEventListener('pointermove', onRootMove),
      () => root.removeEventListener('pointerleave', onRootLeave),
    ]
    root.addEventListener('pointermove', onRootMove)
    root.addEventListener('pointerleave', onRootLeave)

    shards.forEach((el, i) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const lx = (e.clientX - r.left) / r.width - 0.5
        const ly = (e.clientY - r.top) / r.height - 0.5
        const b = baseOf(P[i].id, i + 1)
        tgt[i].rx = b.rx - ly * 14
        tgt[i].ry = b.ry + lx * 17
        tgt[i].tz = b.tz + 92
        tgt[i].sc = 1.035
        el.style.setProperty('--mx', `${((lx + 0.5) * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${((ly + 0.5) * 100).toFixed(1)}%`)
        wake()
      }
      const onEnter = () => {
        hovered.add(i)
        el.classList.add('bbd2-shard--hot')
        if (soundRef.current) {
          try {
            audioRef.current ??= new AudioContext()
            const ctx = audioRef.current
            if (ctx.state === 'suspended') ctx.resume().catch(() => {})
            loadCrackle(ctx)
            if (!(Math.random() < 0.5 && playCrackle(ctx))) playCrack(ctx)
          } catch { /* decorative */ }
        }
      }
      const onLeave = () => {
        hovered.delete(i)
        el.classList.remove('bbd2-shard--hot')
        Object.assign(tgt[i], baseOf(P[i].id, i + 1))
        setParallax()
        wake()
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerenter', onEnter)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerenter', onEnter)
        el.removeEventListener('pointerleave', onLeave)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
    }
  }, [interactive, setKey, ready, shatter])

  /* ---------- exit: the fist comes through the pane ---------- */
  useEffect(() => {
    const root = rootRef.current
    if (!root || !shatter) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const shards = Array.from(root.querySelectorAll<HTMLElement>('[data-shard]'))
    const P = setKey === 'mobile' ? MOBILE : DESKTOP

    if (reduced || shards.length === 0) {
      const t = setTimeout(() => onShatterEnd?.(), 260)
      return () => clearTimeout(t)
    }

    /* the beat: fist travels forward, connects, glass goes. Nothing in the
       pane moves before IMPACT — that wait is what sells the hit. */
    const IMPACT = 300
    const FALL = 900
    const fallY = window.innerHeight * 1.35
    const pose = poseRef.current
    let last = 0
    const cleanupSound: ReturnType<typeof setTimeout>[] = []

    /* ---- the fist: forward into the pane, then past the camera ---- */
    const mark = root.querySelector<HTMLElement>('.bbd2-title--under')
    if (mark) {
      mark.animate(
        [
          { transform: 'scale(1)', opacity: 1, offset: 0 },
          { transform: 'scale(1.3)', opacity: 1, offset: 0.24, easing: 'cubic-bezier(.5,0,.85,.4)' },
          { transform: 'scale(2.4)', opacity: 1, offset: 0.42, easing: 'cubic-bezier(.3,0,.7,1)' },
          { transform: 'scale(13)', opacity: 0, offset: 1 },
        ],
        { duration: 1200, easing: 'cubic-bezier(.4,0,.7,1)', fill: 'forwards' },
      )
      last = 1200
    }

    /* the hit itself */
    if (soundRef.current) {
      const t = setTimeout(() => {
        try {
          audioRef.current ??= new AudioContext()
          const ctx = audioRef.current
          if (ctx.state === 'suspended') ctx.resume().catch(() => {})
          if (!playCrackle(ctx)) playCrack(ctx)
        } catch { /* decorative */ }
      }, IMPACT)
      cleanupSound.push(t)
    }

    /* ---- the glass: blown outward off the fist, then gravity ---- */
    shards.forEach((el, i) => {
      const p = P[i]
      const seed = i + 1
      const r = (n: number) => {
        const s = Math.sin(seed * 57.3 + n * 191.9) * 43758.5453
        return s - Math.floor(s)
      }

      /* exact pose the spring loop left this piece in */
      const b = (pose && pose[i]) || baseOf(p.id, seed)

      /* pieces are thrown away from where the fist came through */
      const ux = (p.cx - 50) / 50
      const uy = (p.cy - 50) / 50
      const burstX = ux * 110 + (r(1) - 0.5) * 40
      const burstY = uy * 80 + (r(2) - 0.5) * 30

      const delay = IMPACT + Math.round(r(4) * 60)
      const dur = FALL + Math.round(r(5) * 160)
      const drift = burstX * 1.5
      const spin = (r(2) - 0.5) * 90
      const tilt = (r(3) - 0.5) * 50

      el.animate(
        [
          {
            transform: toFallTransform(b.px, b.py, b.tz, b.rx, b.ry, 0, b.sc),
          },
          {
            transform: toFallTransform(
              b.px + burstX, b.py + burstY, b.tz + 230,
              b.rx + tilt * 0.3, b.ry, spin * 0.25, b.sc * 1.06,
            ),
            offset: 0.2,
            easing: 'cubic-bezier(.16,.9,.4,1)',
          },
          {
            transform: toFallTransform(
              b.px + drift, b.py + fallY, b.tz,
              b.rx + tilt, b.ry, spin, b.sc,
            ),
            easing: 'cubic-bezier(.42,0,.86,.36)',
          },
        ],
        { duration: dur, delay, fill: 'forwards' },
      )

      last = Math.max(last, dur + delay)
    })

    const t = setTimeout(() => onShatterEnd?.(), last + 40)
    return () => {
      clearTimeout(t)
      cleanupSound.forEach(clearTimeout)
    }
  }, [shatter, setKey, onShatterEnd])

  return (
    <>
    <style>{BBD2_CSS}</style>
    <section
      ref={rootRef}
      className={`bbd2 ${portrait ? 'bbd2--portrait' : ''} ${ready ? 'bbd2--ready' : ''} ${shatter ? 'bbd2--shatter' : ''} ${className}`}
      style={{ height }}
      aria-label={title}
    >
      <div className="bbd2-bg" aria-hidden="true" />

      <div className="bbd2-stage">

      {/* Nothing below renders until the sprite is actually decoded —
          one request lands close to atomically, so the pane appears
          glass-ready in one beat instead of trickling in texture by
          texture. Assets are preloaded via Image(), so by the time
          this mounts they're already in the browser cache. */}
      {ready && (
      <>
      {/* Exposed word in the gaps: flat, cold, no halo — the glow
          belongs to the glass, not to the air. */}
      <div className="bbd2-title bbd2-title--under" aria-hidden="true">
        {titleNode}
      </div>

      {/* The fracture network continues through the void. */}
      <svg
        className="bbd2-cracks"
        viewBox={`0 0 ${cracks.w} ${cracks.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="bbd2-cracks-glow">
          {cracks.main.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g className="bbd2-cracks-line">
          {cracks.main.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g className="bbd2-cracks-fine">
          {cracks.fine.map((d, i) => <path key={i} d={d} />)}
        </g>
      </svg>

      <div className="bbd2-pane" aria-hidden="true">
        {pieces.map((p, i) => {
          const j = jitters[i]
          const atlasUrl = `${assetsBase}/${ATLAS[setKey].url}`
          const sprite = spriteStyle(setKey, p.id)
          return (
            <div
              key={p.id}
              data-shard
              className="bbd2-shard"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.w}%`,
                height: `${p.h}%`,
                zIndex: 10 + (2 - p.ring),
              }}
            >
              <div
                className="bbd2-inlay"
                style={{
                  WebkitMaskImage: `url(${atlasUrl})`,
                  maskImage: `url(${atlasUrl})`,
                  WebkitMaskSize: sprite.backgroundSize,
                  maskSize: sprite.backgroundSize,
                  WebkitMaskPosition: sprite.backgroundPosition,
                  maskPosition: sprite.backgroundPosition,
                }}
              >
                <div
                  className="bbd2-glassimg"
                  style={{
                    backgroundImage: `url(${atlasUrl})`,
                    backgroundSize: sprite.backgroundSize,
                    backgroundPosition: sprite.backgroundPosition,
                  }}
                />
                <div
                  className="bbd2-slice"
                  style={{
                    width: `${10000 / p.w}%`,
                    height: `${10000 / p.h}%`,
                    left: `${-(p.x / p.w) * 100}%`,
                    top: `${-(p.y / p.h) * 100}%`,
                    ['--jt' as string]:
                      `translate(${j.tx.toFixed(1)}px, ${j.ty.toFixed(1)}px)` +
                      ` rotate(${j.rot.toFixed(2)}deg)`,
                  }}
                >
                  {titleNode}
                </div>
                <div className="bbd2-specular" />
              </div>
            </div>
          )
        })}
      </div>
      </>
      )}

      </div>

      {/* the toggle is a glass shard too — same material, same light */}
      <button
        type="button"
        className="bbd2-sound"
        aria-pressed={soundOn}
        aria-label={soundOn ? 'disattiva audio' : 'attiva audio'}
        onClick={() => {
          setSoundOn((v) => !v)
          try {
            audioRef.current ??= new AudioContext()
            loadCrackle(audioRef.current)
          } catch { /* - */ }
        }}
      >
        {ready && (
          <img
            src={`${assetsBase}/${soundOn ? 'sound-on' : 'sound-off'}.png`}
            alt=""
            draggable={false}
          />
        )}
      </button>

      <a
        className="bbd2-credit"
        href="https://www.guglielmogiannattasio.it"
        target="_blank"
        rel="noreferrer"
      >
        by guglielmogiannattasio.exe
      </a>
    </section>
    </>
  )
}
