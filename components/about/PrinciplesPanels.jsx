"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * THE PANELS — the four principles as an expanding accordion: four opaque
 * plates at staggered heights, one open at a time. Hovering (or focusing /
 * tapping) a plate widens it and reveals its full entry; the other three
 * narrow to spines showing only their share and their name.
 *
 * On the percentages: these are a WEIGHTING, not a performance claim. They
 * sum to exactly 100 because they describe how much of a build each principle
 * governs — the studio's own emphasis, which is a thing we can honestly
 * assert. They are deliberately NOT client-outcome statistics ("45% fewer
 * X"), which would be fabricated. The "of every build" unit under each figure
 * and the summing-to-100 are both there to make that reading unmistakable.
 *
 * Adapted from a supplied "impact section" reference, rebuilt in this site's
 * material: widths are explicit percentages (open 50%, closed 16.66% each)
 * rather than the reference's unitless flex ratios, and its candy-colored
 * card fields became full-bleed photographic posters — each card IS its
 * gold-tinted photograph under state-specific ink scrims (left column for
 * the open card's type, foot for the closed spine's), edged in the same
 * soft gold border the Engine plates wear. Cards stay opaque, so they
 * occlude the live attractor outright — separation is z-order fact, not
 * contrast tuning.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='pf'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pf)'/%3E%3C/svg%3E\")";

// share: how much of a build each principle governs. Sums to 100.
const PRINCIPLES = [
  {
    id: 1,
    share: "37%",
    label: "Story",
    pre: "",
    accent: "Story",
    post: " over spectacle.",
    blurb:
      "The idea and the emotion do the work. A flawless render that says nothing never leaves the building — we cut it and start again from the thought.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    share: "23%",
    label: "Speed",
    pre: "Speed is a ",
    accent: "feature",
    post: ".",
    blurb:
      "Momentum is part of the value, not a compromise on it. We move at the speed of the platform, not the agency — because a good idea delivered late is a different, worse idea.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    share: "27%",
    label: "Machines",
    pre: "Build ",
    accent: "machines",
    post: ", not deliverables.",
    blurb:
      "We ship the system that makes the content, not a folder of one-off assets. The engine outlasts the campaign, and it keeps producing long after the launch week is over.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    share: "13%",
    label: "Edge",
    pre: "Stay on the ",
    accent: "edge",
    post: ".",
    blurb:
      "We live on the frontier of what these models can do. The edge moves every week, so do we — what was impossible in the last quarter is often routine in this one.",
    image:
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1200&q=80",
  },
];

// THE POSTER TREATMENT. Three surface attempts failed the same way: two
// four-hue palettes ("earth tones" muddy and rich alike) and a flat ink
// plate with a whisper-faint gold sheen — every one left the card ~90% empty
// dark surface, and no hex value fixes that. The diagnosis was wrong, not
// the values: the card needed IMAGERY, not a better color field. So the
// photograph is now the card surface itself, full-bleed, the way this
// site's film posters already carry their rows — with ink scrims where the
// type sits and the gold doing every accent. No invented hues anywhere:
// ink, bone, gold, photograph. Period.
const INK = "#0F0E0C"; // ink-800 — the plate under everything
// a visible warm ramp (ink-600 → ink-800) so even the darkest photo corner
// never reads as a flat black hole; ~150° puts the light at top-left
const SURFACE = "linear-gradient(150deg, #1E1B15 0%, #14120E 55%, #0F0E0C 100%)";
const GOLD_CAST = "rgba(201,146,61,0.18)"; // one gold tint on every photo — FilmCard's wash hue
// OPEN card: type is all left-aligned, so the scrim is a left-to-right ramp —
// solid ink under the text column, clearing to let the photo read on the right
const SCRIM_OPEN = `linear-gradient(to right, ${INK}f0 0%, ${INK}c9 42%, ${INK}59 68%, ${INK}00 92%)`;
// CLOSED spine: share + name sit at the foot, so the scrim seats there
const SCRIM_CLOSED = `linear-gradient(to top, ${INK}f5 0%, ${INK}cc 30%, ${INK}26 62%, ${INK}00 80%)`;
// MOBILE poster: content stacks at the foot
const SCRIM_MOBILE = `linear-gradient(to top, ${INK}fa 0%, ${INK}e6 38%, ${INK}8c 68%, ${INK}1a 100%)`;

// Percentage widths — the four always total 100%.
const OPEN_W = 50;
const CLOSED_W = (100 - OPEN_W) / 3;

// The staircase: closed plates rise left to right; the open one is tallest.
const CLOSED_H = [320, 366, 412, 458];
const OPEN_H = 500;

/**
 * The card's photographic surface — full-bleed, desaturated toward gold so
 * it reads as brand material, with the warm SURFACE ramp underneath so the
 * darkest frame never collapses into flat black. Shared by both states; the
 * state-specific scrims live inside each state's own layer so they crossfade
 * with the content they protect.
 */
function PosterSurface({ src }) {
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: SURFACE }} />
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.52] sepia saturate-[0.6] contrast-[1.12]"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundColor: GOLD_CAST }} />
    </>
  );
}

export default function PrinciplesPanels() {
  const [openIndex, setOpenIndex] = useState(0);
  const reduce = useReducedMotion();

  const spring = reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 28 };

  // No max-width of its own: an inner 1280px cap left the row stopping 280px
  // short of the content column's right edge while still aligning left, which
  // read as lopsided on wide screens. The page container (max-w-container) is
  // the only thing that should bound this, so the row spans the same width as
  // the heading above it and the gaps either side are equal.
  return (
    <div className="relative isolate mt-20 w-full lg:mt-36">
      {/* ————— desktop: the expanding row ————— */}
      <ul className="hidden items-end gap-2 md:flex" style={{ height: OPEN_H }}>
        {PRINCIPLES.map((p, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.li
              key={p.id}
              tabIndex={0}
              aria-expanded={isOpen}
              onMouseEnter={() => setOpenIndex(i)}
              onFocus={() => setOpenIndex(i)}
              onClick={() => setOpenIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIndex(i);
                }
              }}
              animate={{
                width: `${isOpen ? OPEN_W : CLOSED_W}%`,
                height: isOpen ? OPEN_H : CLOSED_H[i],
              }}
              transition={spring}
              style={{ backgroundColor: INK }}
              className="relative cursor-pointer overflow-hidden border border-gold-soft outline-none shadow-[0_24px_70px_-32px_rgba(0,0,0,0.9)] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gold-400"
            >
              {/* one photographic surface for both states */}
              <PosterSurface src={p.image} />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
              />

              {/* OPEN — its scrim rides with it: ink under the left text
                  column, clearing rightward so the photo reads as a poster */}
              <motion.div
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.3, delay: isOpen && !reduce ? 0.12 : 0 }}
                className={`absolute inset-0 ${isOpen ? "" : "pointer-events-none"}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ backgroundImage: SCRIM_OPEN }}
                />
                <div className="relative flex h-full flex-col p-7 lg:p-9">
                  <p className="max-w-[20ch] font-serif text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.1] tracking-tight text-bone">
                    {p.pre}
                    <span className="gold-flow italic">{p.accent}</span>
                    {p.post}
                  </p>

                  <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-bone-dim lg:text-[15px]">
                    {p.blurb}
                  </p>

                  <div className="mt-auto">
                    <p className="font-serif text-[clamp(48px,5.4vw,76px)] font-medium leading-[0.85] tracking-tight text-gold-gradient">
                      {p.share}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">
                      of every build
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CLOSED — same photograph showing plainly above a foot scrim;
                  the spine is a sliver of the same poster, so opening reads
                  as a reveal, not a swap. Gold numeral anchors each spine. */}
              <motion.div
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className={`absolute inset-0 ${isOpen ? "pointer-events-none" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ backgroundImage: SCRIM_CLOSED }}
                />
                <div className="relative flex h-full flex-col justify-end p-5 lg:p-6">
                  <p className="font-serif text-[clamp(30px,3vw,42px)] font-medium leading-none tracking-tight text-gold-gradient">
                    {p.share}
                  </p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone">{p.label}</p>
                </div>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>

      {/* ————— mobile: everything open, stacked posters. Nothing worth
              reading should sit behind a tap on a phone. ————— */}
      <ul className="space-y-3 md:hidden">
        {PRINCIPLES.map((p) => (
          <li
            key={p.id}
            style={{ backgroundColor: INK }}
            className="relative overflow-hidden border border-gold-soft shadow-[0_24px_70px_-32px_rgba(0,0,0,0.9)]"
          >
            <PosterSurface src={p.image} />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.045]"
              style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: SCRIM_MOBILE }}
            />
            {/* min-height gives the photo a band of its own above the text */}
            <div className="relative flex min-h-[360px] flex-col justify-end p-6">
              <p className="font-serif text-[22px] font-medium leading-[1.14] tracking-tight text-bone">
                {p.pre}
                <span className="gold-flow italic">{p.accent}</span>
                {p.post}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-bone-dim">{p.blurb}</p>
              <div className="mt-5 flex items-baseline gap-3">
                <p className="font-serif text-[40px] font-medium leading-none tracking-tight text-gold-gradient">
                  {p.share}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">of every build</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
