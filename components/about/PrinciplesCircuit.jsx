"use client";

import { useState } from "react";
import { Feather, Zap, Cpu, Radar } from "lucide-react";

/**
 * THE CLOSED CIRCUIT, simplified — four opaque station-plates at asymmetric
 * positions, joined into one directed loop (Story→Speed→Machines→Edge→Story)
 * by four SINGLE straight lines, each ending in an arrowhead at its target.
 *
 * The first cut of this board carried full schematic dressing — net labels
 * with routed lengths, a title block, a DATUM crosshair, diamond vias on
 * multi-segment traces. It read as too complicated; all of it is gone. What
 * survives is the part that works:
 *   1. Opaque plates occlude the attractor — separation by z-order.
 *   2. Every line still rides a slim near-black channel, so the conductor
 *      sits on calmed ground without washing the field around it.
 *   3. Everything is dead straight (lines, triangle arrowheads, square pads
 *      on the mobile spine) — the one linear material the curved background
 *      cannot produce.
 *
 * Hover/focus/tap a plate lights exactly its two lines. An idle CSS pulse
 * walks the loop every 14s, fades while anything is lit, and is off under
 * prefers-reduced-motion. One useState; colour-only transitions.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='pf'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pf)'/%3E%3C/svg%3E\")";

const PRINCIPLES = [
  {
    id: 1,
    serial: "04.1",
    category: "Craft",
    icon: Feather,
    pre: "",
    accent: "Story",
    post: " over spectacle.",
    blurb: "The idea and the emotion do the work.",
    related: ["Speed", "Edge"],
    ghost: "1",
    statement: "text-[clamp(22px,2.2vw,30px)]",
    body: "text-[clamp(11px,1.03vw,14px)]",
  },
  {
    id: 2,
    serial: "04.2",
    category: "Tempo",
    icon: Zap,
    pre: "Speed is a ",
    accent: "feature",
    post: ".",
    blurb: "We move at the speed of the platform.",
    related: ["Story", "Machines"],
    ghost: null,
    statement: "text-[clamp(18px,1.76vw,24px)]",
    body: "text-[clamp(10px,0.96vw,13px)]",
  },
  {
    id: 3,
    serial: "04.3",
    category: "Systems",
    icon: Cpu,
    pre: "Build ",
    accent: "machines",
    post: ", not deliverables.",
    blurb: "The engine outlasts the campaign.",
    related: ["Speed", "Edge"],
    ghost: "3",
    statement: "text-[clamp(19px,1.9vw,26px)]",
    body: "text-[clamp(11px,1.03vw,14px)]",
  },
  {
    id: 4,
    serial: "04.4",
    category: "Frontier",
    icon: Radar,
    pre: "Stay on the ",
    accent: "edge",
    post: ".",
    blurb: "The edge moves every week, so do we.",
    related: ["Machines", "Story"],
    ghost: null,
    statement: "text-[clamp(16px,1.62vw,22px)]",
    body: "text-[clamp(10px,0.96vw,13px)]",
  },
];

// ————— board geometry: one straight segment per connection, arrow at target —————

const LG = {
  vb: [1280, 640],
  nodes: {
    1: [64, 72, 400, 148],
    2: [856, 40, 320, 136],
    3: [792, 400, 368, 168],
    4: [336, 444, 288, 132],
  },
  nets: {
    A: { pair: [1, 2], pts: [[464, 132], [856, 116]] },
    B: { pair: [2, 3], pts: [[1040, 176], [976, 400]] },
    C: { pair: [3, 4], pts: [[792, 488], [624, 500]] },
    D: { pair: [4, 1], pts: [[400, 444], [196, 220]] },
  },
};

const PULSE_CLASS = { A: "lcx-pulse", B: "lcx-pulse lcx-pulse-b", C: "lcx-pulse lcx-pulse-c", D: "lcx-pulse lcx-pulse-d" };

const pathD = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

/** Straight-edged arrowhead at the target end of a line, oriented along it. */
function Arrow({ from, to, lit }) {
  const angle = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
  return (
    <polygon
      points="0,0 -12,5 -12,-5"
      transform={`translate(${to[0]} ${to[1]}) rotate(${angle})`}
      fill={lit ? "#E8B96A" : "#8C857A"}
      fillOpacity={lit ? 1 : 0.7}
      className="transition-[fill,fill-opacity] duration-[450ms] ease-out-expo"
    />
  );
}

function Board({ cfg, activeId }) {
  const [W, H] = cfg.vb;
  const lit = (key) => activeId != null && cfg.nets[key].pair.includes(activeId);
  const anyActive = activeId != null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    >
      {/* slim channels — each line's own calmed ground over the moving field */}
      {Object.keys(cfg.nets).map((k) => (
        <path
          key={`ch-${k}`}
          d={pathD(cfg.nets[k].pts)}
          fill="none"
          stroke="#0A0908"
          strokeOpacity="0.9"
          strokeWidth="10"
          strokeLinecap="butt"
        />
      ))}

      {/* the lines */}
      {Object.keys(cfg.nets).map((k) => (
        <path
          key={`co-${k}`}
          d={pathD(cfg.nets[k].pts)}
          fill="none"
          stroke={lit(k) ? "#E8B96A" : "#8C857A"}
          strokeOpacity={lit(k) ? 1 : 0.55}
          strokeWidth={lit(k) ? 2 : 1.5}
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
          className="transition-[stroke,stroke-width,stroke-opacity] duration-[450ms] ease-out-expo"
        />
      ))}

      {/* idle signal — fades while anything is lit */}
      <g className={`transition-opacity duration-[450ms] ease-out-expo ${anyActive ? "opacity-0" : "opacity-100"}`}>
        {Object.keys(cfg.nets).map((k) => (
          <path
            key={`pu-${k}`}
            d={pathD(cfg.nets[k].pts)}
            fill="none"
            stroke="#E8B96A"
            strokeWidth="2"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
            pathLength="100"
            strokeDasharray="12 100"
            className={PULSE_CLASS[k]}
          />
        ))}
      </g>

      {/* direction of flow */}
      {Object.keys(cfg.nets).map((k) => {
        const pts = cfg.nets[k].pts;
        return <Arrow key={`ar-${k}`} from={pts[0]} to={pts[1]} lit={lit(k)} />;
      })}
    </svg>
  );
}

export default function PrinciplesCircuit() {
  const [activeId, setActiveId] = useState(null);

  const relatedToActive =
    activeId == null
      ? []
      : Object.values(LG.nets)
          .filter((n) => n.pair.includes(activeId))
          .flatMap((n) => n.pair)
          .filter((x) => x !== activeId);

  const plate = (p, cfg) => {
    const [W, H] = cfg.vb;
    const [x, y, w, h] = cfg.nodes[p.id];
    const Icon = p.icon;
    const isActive = activeId === p.id;
    const isRelated = !isActive && relatedToActive.includes(p.id);
    const isUnrelated = activeId != null && !isActive && !isRelated;
    return (
      <li
        key={p.id}
        tabIndex={0}
        onMouseEnter={() => setActiveId(p.id)}
        onMouseLeave={() => setActiveId(null)}
        onFocus={() => setActiveId(p.id)}
        onBlur={() => setActiveId(null)}
        onClick={() => setActiveId((c) => (c === p.id ? null : p.id))}
        onKeyDown={(e) => e.key === "Escape" && setActiveId(null)}
        className={`absolute flex flex-col overflow-hidden bg-ink-700 shadow-[0_0_0_1px_rgba(10,9,8,0.92),inset_0_1px_0_0_rgba(247,227,181,0.09)] outline-none transition-colors duration-[450ms] ease-out-expo focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gold-400 ${
          isActive ? "bg-white/[0.022]" : ""
        }`}
        style={{
          left: `${(x / W) * 100}%`,
          top: `${(y / H) * 100}%`,
          width: `${(w / W) * 100}%`,
          height: `${(h / H) * 100}%`,
          padding: "clamp(14px, 1.6vw, 22px)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
        />
        {p.ghost && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[0.18em] right-2 select-none font-serif text-[clamp(96px,9.5vw,130px)] italic leading-none text-bone/[0.04]"
          >
            {p.ghost}
          </span>
        )}

        <div className={`relative flex h-full flex-col transition-opacity duration-[450ms] ease-out-expo ${isUnrelated ? "opacity-70" : "opacity-100"}`}>
          <div
            className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-[450ms] ease-out-expo ${
              isActive ? "text-gold-300" : isRelated ? "text-gold-200" : "text-bone-faint"
            }`}
          >
            <span>{p.serial}</span>
            <Icon size={12} strokeWidth={1.5} aria-hidden="true" className={isActive ? "text-gold-400" : ""} />
            <span>{p.category}</span>
          </div>

          <p className={`mt-3 font-serif font-medium leading-[1.12] tracking-tight text-bone ${p.statement}`}>
            {p.pre}
            <span className={isActive ? "gold-flow italic" : "italic text-gold-gradient"}>{p.accent}</span>
            {p.post}
          </p>

          <p
            className={`mt-2 leading-relaxed transition-colors duration-[450ms] ease-out-expo ${p.body} ${
              isActive ? "text-bone/[0.78]" : "text-bone-dim"
            }`}
          >
            {p.blurb}
          </p>

          <span className="sr-only">Related principles: {p.related.join(" and ")}.</span>
        </div>
      </li>
    );
  };

  // ————— mobile / tablet transit spine (<lg): full plates on a lit vertical rail —————
  const spineConductor = (segment, plateId) => {
    const litAbove = activeId === plateId || activeId === plateId - 1;
    const litBelow = activeId === plateId || activeId === plateId + 1;
    const isWrapTerminal = (plateId === 1 && segment === "above") || (plateId === 4 && segment === "below");
    const wrapLit = activeId === 1 || activeId === 4;
    const on = isWrapTerminal ? wrapLit : segment === "above" ? litAbove : litBelow;
    return on ? "bg-gold-300" : "bg-bone-faint/40";
  };

  return (
    <div className="relative isolate mt-12 w-full max-w-[1280px] lg:mt-16">
      {/* ————— lg board ————— */}
      <div className="relative hidden aspect-[2/1] lg:block">
        <Board cfg={LG} activeId={activeId} />
        <ul className="absolute inset-0 z-20">{PRINCIPLES.map((p) => plate(p, LG))}</ul>
      </div>

      {/* ————— transit spine (<lg) ————— */}
      <div className="relative pl-11 lg:hidden">
        <ul className="space-y-14">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            const isActive = activeId === p.id;
            return (
              <li key={p.id} className="relative">
                <span aria-hidden="true" className={`absolute -left-[30px] w-[9px] bg-ink-900/90 ${p.id === 1 ? "-top-11" : "-top-7"}`} style={{ height: p.id === 1 ? "calc(2.75rem + 34px)" : "calc(1.75rem + 34px)" }}>
                  <span className={`absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 transition-colors duration-[450ms] ease-out-expo ${spineConductor("above", p.id)}`} />
                  {p.id === 1 && (
                    <span className={`absolute -top-px left-1/2 h-[1.5px] w-[8px] -translate-x-1/2 transition-colors duration-[450ms] ease-out-expo ${spineConductor("above", 1)}`} />
                  )}
                </span>
                <span aria-hidden="true" className={`absolute -left-[30px] top-[34px] w-[9px] bg-ink-900/90 ${p.id === 4 ? "-bottom-11" : "-bottom-7"}`}>
                  <span className={`absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 transition-colors duration-[450ms] ease-out-expo ${spineConductor("below", p.id)}`} />
                  {p.id === 4 && (
                    <span className={`absolute -bottom-px left-1/2 h-[1.5px] w-[8px] -translate-x-1/2 transition-colors duration-[450ms] ease-out-expo ${spineConductor("below", 4)}`} />
                  )}
                </span>
                <span aria-hidden="true" className="absolute -left-[26px] top-[30px] h-[9px] w-[26px] bg-ink-900/90">
                  <span className={`absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 transition-colors duration-[450ms] ease-out-expo ${isActive ? "bg-gold-300" : "bg-bone-faint/40"}`} />
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute -left-[5px] top-[29px] h-[10px] w-[10px] border transition-colors duration-[450ms] ease-out-expo ${
                    isActive ? "border-gold-200 bg-gold-400" : "border-bone-faint/40 bg-ink-900"
                  }`}
                />

                <div
                  tabIndex={0}
                  onFocus={() => setActiveId(p.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => setActiveId((c) => (c === p.id ? null : p.id))}
                  className={`relative flex flex-col overflow-hidden bg-ink-700 p-5 shadow-[0_0_0_1px_rgba(10,9,8,0.92),inset_0_1px_0_0_rgba(247,227,181,0.09)] outline-none transition-colors duration-[450ms] ease-out-expo focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gold-400 ${
                    isActive ? "bg-white/[0.022]" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.045]"
                    style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
                  />
                  <div className="relative">
                    <div className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-[450ms] ease-out-expo ${isActive ? "text-gold-300" : "text-bone-faint"}`}>
                      <span>{p.serial}</span>
                      <Icon size={12} strokeWidth={1.5} aria-hidden="true" className={isActive ? "text-gold-400" : ""} />
                      <span>{p.category}</span>
                    </div>
                    <p className={`mt-3 font-serif font-medium leading-[1.14] tracking-tight text-bone ${p.id === 1 || p.id === 3 ? "text-[22px]" : "text-[20px]"}`}>
                      {p.pre}
                      <span className={isActive ? "gold-flow italic" : "italic text-gold-gradient"}>{p.accent}</span>
                      {p.post}
                    </p>
                    <p className={`mt-2 text-[13px] leading-relaxed transition-colors duration-[450ms] ease-out-expo ${isActive ? "text-bone/[0.78]" : "text-bone-dim"}`}>
                      {p.blurb}
                    </p>
                    <span className="sr-only">Related principles: {p.related.join(" and ")}.</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
