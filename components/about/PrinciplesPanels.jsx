"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Feather, Zap, Cpu, Radar } from "lucide-react";

/**
 * THE PANELS — the four principles as an expanding accordion: four opaque
 * plates standing side by side at staggered heights, one open at a time.
 * Hovering (or focusing / tapping) a plate widens it and reveals its
 * statement; the other three narrow to spines showing only their numeral and
 * name.
 *
 * Adapted from a supplied "impact section" reference, rebuilt in this site's
 * material rather than pasted in:
 *   - WIDTHS ARE PERCENTAGES (open 46%, closed 18% each = 100%), not the
 *     reference's unitless flex ratios, so the row's geometry is explicit and
 *     the plates never reflow differently between breakpoints.
 *   - The reference's lime / baby-blue / hot-pink / light-grey palette is
 *     replaced by the ink scale: closed plates ink-800, the open plate lifts
 *     to ink-700 (lighter, because the scene's warm radial raises the ambient
 *     — a darker plate would read as a hole punched in a lit field).
 *   - The reference's Unsplash photo in every card is dropped. These are
 *     principles, not case studies; stock photography of offices is exactly
 *     the generic filler this site has been stripping out. The oversized
 *     serif numeral carries the visual weight instead — the site's own device.
 *   - The staggered closed heights are kept: they make the row a rising
 *     staircase rather than four equal blocks, which is the asymmetry the
 *     composition needed.
 *
 * Plates stay opaque so they occlude the live attractor behind them —
 * separation is z-order fact, not contrast tuning.
 */

// Re-supplied grain: the plates occlude the sitewide film grain layer, so
// without this they read as flat vector against a grained page.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='pf'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pf)'/%3E%3C/svg%3E\")";

const PRINCIPLES = [
  {
    id: 1,
    numeral: "01",
    serial: "04.1",
    label: "Story",
    category: "Craft",
    icon: Feather,
    pre: "",
    accent: "Story",
    post: " over spectacle.",
    blurb: "The idea and the emotion do the work.",
  },
  {
    id: 2,
    numeral: "02",
    serial: "04.2",
    label: "Speed",
    category: "Tempo",
    icon: Zap,
    pre: "Speed is a ",
    accent: "feature",
    post: ".",
    blurb: "We move at the speed of the platform.",
  },
  {
    id: 3,
    numeral: "03",
    serial: "04.3",
    label: "Machines",
    category: "Systems",
    icon: Cpu,
    pre: "Build ",
    accent: "machines",
    post: ", not deliverables.",
    blurb: "The engine outlasts the campaign.",
  },
  {
    id: 4,
    numeral: "04",
    serial: "04.4",
    label: "Edge",
    category: "Frontier",
    icon: Radar,
    pre: "Stay on the ",
    accent: "edge",
    post: ".",
    blurb: "The edge moves every week, so do we.",
  },
];

// Percentage widths — the four always total 100%.
const OPEN_W = 46;
const CLOSED_W = (100 - OPEN_W) / 3; // 18%

// The staircase: closed plates rise left to right; the open one is tallest.
const CLOSED_H = [286, 330, 374, 414];
const OPEN_H = 440;

export default function PrinciplesPanels() {
  const [openIndex, setOpenIndex] = useState(0);
  const reduce = useReducedMotion();

  const spring = reduce
    ? { duration: 0 }
    : { type: "spring", stiffness: 220, damping: 28 };

  return (
    <div className="relative isolate mt-12 w-full max-w-[1280px] lg:mt-16">
      {/* ————— desktop: the expanding row ————— */}
      <ul className="hidden items-end gap-2 md:flex" style={{ height: OPEN_H }}>
        {PRINCIPLES.map((p, i) => {
          const isOpen = openIndex === i;
          const Icon = p.icon;
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

              {/* OPEN — the full entry */}
              <motion.div
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.3, delay: isOpen && !reduce ? 0.12 : 0 }}
                className={`absolute inset-0 flex flex-col p-7 lg:p-9 ${isOpen ? "" : "pointer-events-none"}`}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-300">
                  <span>{p.serial}</span>
                  <Icon size={12} strokeWidth={1.5} aria-hidden="true" className="text-gold-400" />
                  <span>{p.category}</span>
                </div>

                <p className="mt-5 max-w-[22ch] font-serif text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.1] tracking-tight text-bone">
                  {p.pre}
                  <span className="gold-flow italic">{p.accent}</span>
                  {p.post}
                </p>

                <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-bone-dim">{p.blurb}</p>

                {/* The numeral carries the weight the reference gave a photo,
                    so it has to be big enough to actually anchor the foot of
                    the plate — at photo scale, not caption scale. */}
                <p className="pointer-events-none mt-auto -mb-[0.12em] select-none font-serif text-[clamp(104px,13vw,190px)] italic leading-[0.78] text-bone/[0.09]">
                  {p.numeral}
                </p>
              </motion.div>

              {/* CLOSED — numeral over name, anchored to the foot of the spine */}
              <motion.div
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className={`absolute inset-0 flex flex-col justify-end p-5 lg:p-6 ${isOpen ? "pointer-events-none" : ""}`}
              >
                <p className="select-none font-serif text-[clamp(30px,3vw,40px)] italic leading-none text-bone/[0.22]">
                  {p.numeral}
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
        {PRINCIPLES.map((p) => {
          const Icon = p.icon;
          return (
            <li
              key={p.id}
              className="relative overflow-hidden bg-ink-700 p-6 shadow-[0_0_0_1px_rgba(10,9,8,0.92),inset_0_1px_0_0_rgba(247,227,181,0.09)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 right-3 select-none font-serif text-[76px] italic leading-none text-bone/[0.07]"
              >
                {p.numeral}
              </span>
              <div className="relative">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-300">
                  <span>{p.serial}</span>
                  <Icon size={12} strokeWidth={1.5} aria-hidden="true" className="text-gold-400" />
                  <span>{p.category}</span>
                </div>
                <p className="mt-3 font-serif text-[22px] font-medium leading-[1.14] tracking-tight text-bone">
                  {p.pre}
                  <span className="gold-flow italic">{p.accent}</span>
                  {p.post}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-bone-dim">{p.blurb}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
