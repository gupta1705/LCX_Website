"use client";

import { useState, useEffect, useRef } from "react";
import { Feather, Zap, Cpu, Radar } from "lucide-react";
import { useReducedMotion } from "framer-motion";

/**
 * The four principles in a 3D orbit, in gold over the page's own attractor.
 *
 * The nodes ride a TILTED orbital plane: their 3D position is projected to 2D
 * in JS (x, squashed y, depth), and depth drives scale, opacity, blur and
 * z-order — so nodes genuinely pass in front of and behind the gold core while
 * every label stays crisp (nothing is CSS-3D-skewed). The ring is drawn as two
 * halves, dim behind the core and lit in front of it; that crossing is what
 * sells the depth, and it is the whole drawing. An earlier version added an
 * engraved orrery around it (tick limb, plate labels, callouts) — at this size
 * the instrumentation read as clutter, so the ring carries it alone.
 *
 * Click a node: the orbit glides it to the front and its readout opens as an
 * opaque ink plate — nothing dims behind it.
 */
const PRINCIPLES = [
  {
    id: 1,
    label: "Story",
    category: "Craft",
    icon: Feather,
    pre: "",
    accent: "Story",
    post: " over spectacle.",
    blurb:
      "The idea and the emotion do the work. A flawless render that says nothing never leaves the building.",
    relatedIds: [2, 4],
  },
  {
    id: 2,
    label: "Speed",
    category: "Tempo",
    icon: Zap,
    pre: "Speed is a ",
    accent: "feature",
    post: ".",
    blurb:
      "Momentum is part of the value, not a compromise on it. We move at the speed of the platform, not the agency.",
    relatedIds: [1, 3],
  },
  {
    id: 3,
    label: "Machines",
    category: "Systems",
    icon: Cpu,
    pre: "Build ",
    accent: "machines",
    post: ", not deliverables.",
    blurb:
      "We ship the system that makes the content, not a folder of one-off assets. The engine outlasts the campaign.",
    relatedIds: [2, 4],
  },
  {
    id: 4,
    label: "Edge",
    category: "Frontier",
    icon: Radar,
    pre: "Stay on the ",
    accent: "edge",
    post: ".",
    blurb:
      "We live on the frontier of what these models can do. The edge moves every week, so do we.",
    relatedIds: [3, 1],
  },
];

const getRelated = (id) => PRINCIPLES.find((p) => p.id === id)?.relatedIds ?? [];

// Orbital plane inclination. 60° from the screen: the ellipse's vertical
// radius is cos(60°)=0.5 of the horizontal, and depth swing is sin(60°).
const TILT = (60 * Math.PI) / 180;
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);

export default function PrinciplesOrbit() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulse, setPulse] = useState({});
  const [radius, setRadius] = useState(280);
  const containerRef = useRef(null);

  // Orbit radius tracks the container so it fits phones and wide screens alike.
  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = Math.min(el.clientWidth / 2 - 72, 320);
      setRadius(Math.max(120, r));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Slow ambient rotation — paused while a readout is open or motion is reduced.
  useEffect(() => {
    if (reduce || !autoRotate) return;
    const t = setInterval(() => {
      setRotation((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(t);
  }, [autoRotate, reduce]);

  const centerOnNode = (id) => {
    const i = PRINCIPLES.findIndex((p) => p.id === id);
    if (i < 0) return;
    setRotation(90 - (i / PRINCIPLES.length) * 360); // bring the node to the FRONT
  };

  const toggle = (id) => {
    if (openId === id) {
      setOpenId(null);
      setPulse({});
      setAutoRotate(true);
      return;
    }
    setOpenId(id);
    setAutoRotate(false);
    const p = {};
    getRelated(id).forEach((r) => (p[r] = true));
    setPulse(p);
    centerOnNode(id);
  };

  const closeAll = () => {
    setOpenId(null);
    setPulse({});
    setAutoRotate(true);
  };

  // Project a node on the tilted orbital plane to screen space.
  // depth ∈ [-1, 1]: -1 = far side (top of the ellipse), +1 = nearest.
  const nodePosition = (index) => {
    const angle = ((index / PRINCIPLES.length) * 360 + rotation) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad) * COS_T;
    const depth = Math.sin(rad); // sin(rad)·SIN_T normalised by SIN_T
    const near = (depth + 1) / 2; // 0 far → 1 near
    return {
      x,
      y,
      scale: 0.72 + near * 0.46, // 0.72 far → 1.18 near
      opacity: 0.55 + near * 0.45,
      blur: depth < 0 ? -depth * 1.4 : 0, // up to 1.4px on the far side
      z: depth >= 0 ? Math.round(56 + depth * 40) : Math.round(46 + depth * 40),
    };
  };

  const ellipseW = radius * 2;
  const ellipseH = radius * 2 * COS_T;
  const openItem = openId ? PRINCIPLES.find((p) => p.id === openId) : null;

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.target === containerRef.current) closeAll();
      }}
      className="relative mx-auto flex h-[440px] w-full max-w-5xl items-center justify-center overflow-visible sm:h-[520px] lg:h-[560px]"
    >
      {/* local scrim — a clean pocket in the line field, no visible blob edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(72%_60%_at_50%_50%,rgba(10,9,8,0.5),rgba(10,9,8,0.18)_55%,transparent_88%)]"
      />

      <div className="relative" style={{ width: ellipseW, height: ellipseH }}>
        {/* FAR half of the orbit — behind the core, dim because it's the far
            side of a tilted ring. One stroke; the depth does the talking. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 overflow-visible"
          width={2.4 * radius}
          height={1.24 * radius}
          viewBox={`${-1.2 * radius} ${-0.62 * radius} ${2.4 * radius} ${1.24 * radius}`}
        >
          <defs>
            <radialGradient id="tvl-core-seat">
              <stop offset="0%" stopColor="rgba(10,9,8,0.9)" />
              <stop offset="60%" stopColor="rgba(10,9,8,0.4)" />
              <stop offset="100%" stopColor="rgba(10,9,8,0)" />
            </radialGradient>
          </defs>
          <ellipse
            cx="0"
            cy="5"
            rx={Math.max(26, 0.14 * radius)}
            ry={Math.max(13, 0.07 * radius)}
            fill="url(#tvl-core-seat)"
          />
          <path
            d={`M ${-radius} 0 A ${radius} ${0.5 * radius} 0 0 1 ${radius} 0`}
            fill="none"
            stroke="rgba(232,185,106,0.3)"
            strokeWidth="1.25"
          />
        </svg>

        {/* central core — a small lit gold bead with one soft breathing glow */}
        <div className="absolute left-1/2 top-1/2 z-[50] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center">
          {!reduce && (
            <div className="absolute h-14 w-14 animate-pulse-soft rounded-full bg-[radial-gradient(circle,rgba(201,146,61,0.30),transparent_66%)]" />
          )}
          <div className="absolute h-9 w-9 rounded-full bg-[radial-gradient(circle_at_38%_30%,#f7e3b5_0%,#dda64f_48%,#6e4513_100%)] shadow-[inset_0_-3px_7px_-2px_rgba(0,0,0,0.55),0_0_0_1px_rgba(10,9,8,0.5),0_0_16px_-4px_rgba(232,185,106,0.6)]" />
          <div className="relative h-2.5 w-2.5 rounded-full bg-bone/90" />
        </div>

        {/* NEAR half of the orbit — in front of the core, behind near nodes.
            Lit, so the ring reads as passing over the bead. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[52] -translate-x-1/2 -translate-y-1/2 overflow-visible"
          width={2.4 * radius}
          height={1.24 * radius}
          viewBox={`${-1.2 * radius} ${-0.62 * radius} ${2.4 * radius} ${1.24 * radius}`}
        >
          <defs>
            <linearGradient id="tvl-rail-grad" gradientUnits="userSpaceOnUse" x1={-radius} y1="0" x2={radius} y2="0">
              <stop offset="0%" stopColor="#A9762E" />
              <stop offset="50%" stopColor="#F1D08A" />
              <stop offset="100%" stopColor="#A9762E" />
            </linearGradient>
          </defs>
          <path
            d={`M ${-radius} 0 A ${radius} ${0.5 * radius} 0 0 0 ${radius} 0`}
            fill="none"
            stroke="url(#tvl-rail-grad)"
            strokeOpacity="1"
            strokeWidth="1.75"
          />
        </svg>

        {PRINCIPLES.map((item, index) => {
          const pos = nodePosition(index);
          const isOpen = openId === item.id;
          const isRelated = openId ? getRelated(openId).includes(item.id) : false;
          const isPulsing = !!pulse[item.id];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={`Principle: ${item.label}`}
              onClick={(e) => {
                e.stopPropagation();
                toggle(item.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(item.id);
                }
              }}
              className="absolute left-1/2 top-1/2 cursor-pointer transition-all duration-700 ease-out-expo focus-visible:outline-none"
              style={{
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${isOpen ? 1.06 : pos.scale})`,
                zIndex: isOpen ? 120 : pos.z,
                opacity: isOpen ? 1 : pos.opacity,
                filter: pos.blur && !isOpen ? `blur(${pos.blur}px)` : undefined,
              }}
            >
              {/* dark halo — clears the line field right behind the coin */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,9,8,0.9)_0%,rgba(10,9,8,0.55)_48%,rgba(10,9,8,0)_75%)]"
              />

              {/* minted-plate node */}
              <div
                className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 transition-all duration-300 ease-out ${
                  isOpen
                    ? "scale-125 border-gold-100 bg-[radial-gradient(circle_at_50%_28%,#F7E3B5_0%,#DDA64F_100%)] text-ink-900 shadow-[0_0_0_1.5px_rgba(10,9,8,0.9),0_4px_20px_-2px_rgba(0,0,0,0.7),0_0_34px_-3px_rgba(232,185,106,0.9)]"
                    : isRelated
                      ? "animate-pulse border-gold-200 bg-[radial-gradient(circle_at_50%_30%,rgba(201,146,61,0.32)_0%,#110F0B_75%)] text-gold-100 ring-1 ring-inset ring-gold-400/40 shadow-[0_0_0_1.5px_rgba(10,9,8,0.95),0_3px_12px_-2px_rgba(0,0,0,0.85),0_0_26px_-3px_rgba(241,208,138,0.6)]"
                      : "border-gold-300 bg-[radial-gradient(circle_at_50%_30%,#231F17_0%,#0C0B09_78%)] text-gold-100 shadow-[0_0_0_1.5px_rgba(10,9,8,0.95),0_3px_12px_-2px_rgba(0,0,0,0.85),0_0_18px_-6px_rgba(232,185,106,0.5)]"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </div>

              {/* label */}
              <div
                className={`absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 [text-shadow:0_1px_2px_rgba(10,9,8,0.95),0_0_8px_rgba(10,9,8,0.85)] ${
                  isOpen ? "text-gold-200" : "text-bone/90"
                }`}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* click-away catcher + centered readout. The catcher is invisible on
          purpose: washing the whole band on open was the "darkens on click"
          murk — the card is opaque, so it needs no help. */}
      {openItem && (
        <>
          <div className="absolute inset-0 z-[140]" onClick={closeAll} aria-hidden="true" />
          <div
            className="absolute left-1/2 top-1/2 z-[150] w-[19rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-gold-soft bg-ink-900 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.95),0_0_0_1px_rgba(10,9,8,0.6)] sm:w-80"
            role="dialog"
            aria-label={`Principle ${String(openItem.id).padStart(2, "0")}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* An entry, not a dashboard card: a ledger numeral leads the line
                (the same serif-italic voice as the work index), the category
                sits beside it as a quiet word, and the headline is a
                STATEMENT — so it takes the site's serif voice, not the sans
                one. No opposite-corner metadata row, no icon+label chip. */}
            <div className="border-b border-white/[0.07] px-5 pb-4 pt-5">
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif text-2xl italic text-gold-gradient">
                  {String(openItem.id).padStart(2, "0")}.
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">
                  {openItem.category}
                </span>
              </div>
              <h4 className="mt-3 font-serif text-lg font-medium leading-snug text-bone">
                {openItem.pre}
                <span className="italic text-gold-gradient">{openItem.accent}</span>
                {openItem.post}
              </h4>
            </div>
            <div className="px-5 py-4">
              <p className="text-[13px] leading-relaxed text-bone-dim">{openItem.blurb}</p>
              {/* cross-reference as a sentence, the way an index refers to its
                  own entries — not tag chips borrowed from a component kit */}
              <p className="mt-4 border-t border-white/[0.07] pt-3 text-[13px] leading-relaxed text-bone-faint">
                See also{" "}
                {openItem.relatedIds.map((rid, i) => {
                  const rel = PRINCIPLES.find((p) => p.id === rid);
                  const isLast = i === openItem.relatedIds.length - 1;
                  return (
                    <span key={rid}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(rid);
                        }}
                        className="rounded-sm text-gold-200 underline decoration-gold-500/40 underline-offset-2 transition-colors hover:text-gold-100 hover:decoration-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      >
                        {rel?.label}
                      </button>
                      {isLast ? "." : " and "}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
