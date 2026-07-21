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
 * rather than the reference's unitless flex ratios; its lime / pink /
 * baby-blue palette becomes the ink scale, with the open plate lifting to
 * ink-700 (lighter — the scene's warm radial raises the ambient, so a darker
 * plate would read as a hole punched in a lit field); and the photographs are
 * desaturated and gold-tinted down to texture so they read as brand material
 * rather than stock. Plates stay opaque, so they occlude the live attractor
 * outright — separation is z-order fact, not contrast tuning.
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

// Percentage widths — the four always total 100%.
const OPEN_W = 50;
const CLOSED_W = (100 - OPEN_W) / 3;

// The staircase: closed plates rise left to right; the open one is tallest.
const CLOSED_H = [320, 366, 412, 458];
const OPEN_H = 500;

/** Desaturated, gold-tinted photograph — texture in the brand palette. */
function Plate_Image({ src, className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-ink-900 ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.45] sepia saturate-[0.6] contrast-[1.15]"
      />
      {/* gold cast + a foot-of-frame fade so the photo sits into the plate */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gold-700/25" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-700 via-ink-700/20 to-transparent"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-bone/10" />
    </div>
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
              className={`relative cursor-pointer overflow-hidden outline-none shadow-[0_0_0_1px_rgba(10,9,8,0.92),inset_0_1px_0_0_rgba(247,227,181,0.09)] transition-colors duration-[450ms] ease-out-expo focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gold-400 ${
                isOpen ? "bg-ink-700" : "bg-ink-800"
              }`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
              />

              {/* OPEN — statement and blurb up top, share + photograph below */}
              <motion.div
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.3, delay: isOpen && !reduce ? 0.12 : 0 }}
                className={`absolute inset-0 flex flex-col p-7 lg:p-9 ${isOpen ? "" : "pointer-events-none"}`}
              >
                <p className="max-w-[20ch] font-serif text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.1] tracking-tight text-bone">
                  {p.pre}
                  <span className="gold-flow italic">{p.accent}</span>
                  {p.post}
                </p>

                <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-bone-dim lg:text-[15px]">
                  {p.blurb}
                </p>

                <div className="mt-auto grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] items-end gap-5">
                  <div>
                    <p className="font-serif text-[clamp(48px,5.4vw,76px)] font-medium leading-[0.85] tracking-tight text-gold-gradient">
                      {p.share}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">
                      of every build
                    </p>
                  </div>
                  <Plate_Image src={p.image} className="h-[150px] lg:h-[180px]" />
                </div>
              </motion.div>

              {/* CLOSED — share over name, anchored to the foot of the spine */}
              <motion.div
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className={`absolute inset-0 flex flex-col justify-end p-5 lg:p-6 ${isOpen ? "pointer-events-none" : ""}`}
              >
                <p className="font-serif text-[clamp(30px,3vw,42px)] font-medium leading-none tracking-tight text-bone/[0.30]">
                  {p.share}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-dim">{p.label}</p>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>

      {/* ————— mobile: everything open, stacked. Nothing worth reading should
              sit behind a tap on a phone. ————— */}
      <ul className="space-y-3 md:hidden">
        {PRINCIPLES.map((p) => (
          <li
            key={p.id}
            className="relative overflow-hidden bg-ink-700 shadow-[0_0_0_1px_rgba(10,9,8,0.92),inset_0_1px_0_0_rgba(247,227,181,0.09)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 opacity-[0.045]"
              style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
            />
            <Plate_Image src={p.image} className="h-[132px] w-full" />
            <div className="relative p-6">
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
