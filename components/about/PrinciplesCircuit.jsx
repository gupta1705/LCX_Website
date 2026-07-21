"use client";

import { useState } from "react";
import { Feather, Zap, Cpu, Radar } from "lucide-react";

/**
 * THE CLOSED CIRCUIT — the four principles wired in series on one engraved
 * board: four opaque station-plates at asymmetric positions, joined by four
 * straight-segment traces (H / V / exact-45° only, like PCB routing) into a
 * single closed loop. Remove any principle and the signal dies — which is the
 * argument the copy itself makes.
 *
 * Separation from the live attractor (thin gold CURVES, always moving):
 *   1. The plates are opaque ink-700 — occlusion is z-order fact.
 *   2. Every trace rides its own 16-unit near-black CHANNEL, so the gold
 *      conductor always sits on locally calmed ground — without washing the
 *      field. The attractor stays at full energy everywhere else.
 *   3. Every mark is dead straight (miter joins, butt caps, diamond vias —
 *      zero curves anywhere): the one linear material the attractor cannot
 *      produce. Straight reads as engineered; curved reads as background.
 *
 * The drawing tells the truth like an instrument sheet: net labels carry the
 * true routed length of their trace, the title block certifies the loop
 * (ΣL 1093 · CONTINUITY OK), and a DATUM mark sits at the board's exact
 * center — where, pointedly, nothing is mounted.
 *
 * Interaction: hovering/focusing a plate lights exactly its two nets
 * (colour-only, 450ms). An idle signal pulse circulates the loop 1→2→3→4→1
 * every 14s — pure CSS on stroke-dashoffset (straight rails, our object's own
 * motion, categorically different from the background drift), disabled under
 * prefers-reduced-motion and faded out while any plate is active.
 */

// Re-supplied grain: the plates occlude the sitewide film grain, so they
// respray their own (128px tile vs the sitewide 160px so they never beat).
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
    blurb:
      "The idea and the emotion do the work. A flawless render that says nothing never leaves the building.",
    related: ["Speed", "Edge"],
    rel: "REL → 04.2 · 04.4",
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
    blurb:
      "Momentum is part of the value, not a compromise on it. We move at the speed of the platform, not the agency.",
    related: ["Story", "Machines"],
    rel: "REL → 04.1 · 04.3",
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
    blurb:
      "We ship the system that makes the content, not a folder of one-off assets. The engine outlasts the campaign.",
    related: ["Speed", "Edge"],
    rel: "REL → 04.2 · 04.4",
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
    blurb:
      "We live on the frontier of what these models can do. The edge moves every week, so do we.",
    related: ["Machines", "Story"],
    rel: "REL → 04.3 · 04.1",
    ghost: null,
    statement: "text-[clamp(16px,1.62vw,22px)]",
    body: "text-[clamp(10px,0.96vw,13px)]",
  },
];

// ————— board geometry (single source of truth; all segments H, V or 45°) —————

const LG = {
  vb: [1280, 640],
  nodes: {
    1: [64, 56, 400, 232],
    2: [856, 24, 320, 184],
    3: [792, 368, 368, 216],
    4: [336, 412, 288, 172],
  },
  titleBlock: [64, 528, 224, 88],
  nets: {
    A: {
      pair: [1, 2],
      pts: [[464, 120], [600, 120], [656, 64], [800, 64], [824, 88], [856, 88]],
      label: { x: 728, y: 46, anchor: "middle", text: "NET A · 04.1 → 04.2 · L425" },
    },
    B: {
      pair: [2, 3],
      pts: [[1048, 208], [1048, 264], [1000, 312], [1000, 368]],
      label: { x: 1032, y: 240, anchor: "end", text: "NET B · 04.2 → 04.3 · L180" },
    },
    C: {
      pair: [3, 4],
      pts: [[792, 488], [728, 488], [704, 512], [624, 512]],
      label: { x: 708, y: 540, anchor: "middle", text: "NET C · 04.3 → 04.4 · L178" },
    },
    D: {
      pair: [4, 1],
      pts: [[400, 412], [400, 368], [336, 304], [176, 304], [176, 288]],
      label: { x: 256, y: 326, anchor: "middle", text: "NET D · 04.4 → 04.1 · L311" },
    },
  },
  datum: [640, 320],
};

const MD = {
  vb: [768, 920],
  nodes: {
    1: [32, 32, 440, 200],
    2: [296, 272, 440, 176],
    3: [32, 488, 440, 192],
    4: [296, 720, 440, 168],
  },
  nets: {
    A: { pair: [1, 2], pts: [[352, 232], [352, 240], [384, 272]], label: { x: 368, y: 256, anchor: "start", text: "NET A" } },
    B: { pair: [2, 3], pts: [[440, 448], [440, 460], [412, 488]], label: { x: 456, y: 472, anchor: "start", text: "NET B" } },
    C: { pair: [3, 4], pts: [[352, 680], [352, 692], [380, 720]], label: { x: 368, y: 704, anchor: "start", text: "NET C" } },
    D: { pair: [4, 1], pts: [[296, 804], [16, 804], [16, 132], [32, 132]], label: { x: 28, y: 460, anchor: "start", text: "NET D" } },
  },
};

const PULSE_CLASS = { A: "lcx-pulse", B: "lcx-pulse lcx-pulse-b", C: "lcx-pulse lcx-pulse-c", D: "lcx-pulse lcx-pulse-d" };

const pathD = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

/** Diamond via — a 45°-rotated square. Straight edges only; no circles on this sheet. */
function Via({ x, y, lit }) {
  return (
    <g>
      <rect
        x={x - 3.5}
        y={y - 3.5}
        width="7"
        height="7"
        transform={`rotate(45 ${x} ${y})`}
        fill={lit ? "#DDA64F" : "#0A0908"}
        stroke={lit ? "#F7E3B5" : "rgba(140,133,122,0.6)"}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        className="transition-[fill,stroke] duration-[450ms] ease-out-expo"
      />
      {/* annular halo, lit only */}
      <rect
        x={x - 6}
        y={y - 6}
        width="12"
        height="12"
        transform={`rotate(45 ${x} ${y})`}
        fill="none"
        stroke="rgba(201,146,61,0.5)"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
        className={`transition-opacity duration-[450ms] ease-out-expo ${lit ? "opacity-100" : "opacity-0"}`}
      />
    </g>
  );
}

function Board({ cfg, activeId, full }) {
  const [W, H] = cfg.vb;
  const lit = (key) => activeId != null && cfg.nets[key].pair.includes(activeId);
  const anyActive = activeId != null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    >
      {/* channels — each trace's own calmed ground; miter corners, butt caps */}
      {Object.keys(cfg.nets).map((k) => (
        <path
          key={`ch-${k}`}
          d={pathD(cfg.nets[k].pts)}
          fill="none"
          stroke="#0A0908"
          strokeOpacity="0.92"
          strokeWidth="16"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        />
      ))}

      {/* conductors */}
      {Object.keys(cfg.nets).map((k) => (
        <path
          key={`co-${k}`}
          d={pathD(cfg.nets[k].pts)}
          fill="none"
          stroke={lit(k) ? "#E8B96A" : "#8C857A"}
          strokeOpacity={lit(k) ? 1 : 0.55}
          strokeWidth={lit(k) ? 2 : 1.5}
          strokeLinejoin="miter"
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
          className="transition-[stroke,stroke-width,stroke-opacity] duration-[450ms] ease-out-expo"
        />
      ))}

      {/* idle signal — walks the loop net by net; fades while anything is lit */}
      <g className={`transition-opacity duration-[450ms] ease-out-expo ${anyActive ? "opacity-0" : "opacity-100"}`}>
        {Object.keys(cfg.nets).map((k) => (
          <path
            key={`pu-${k}`}
            d={pathD(cfg.nets[k].pts)}
            fill="none"
            stroke="#E8B96A"
            strokeWidth="2"
            strokeLinejoin="miter"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
            pathLength="100"
            strokeDasharray="12 100"
            className={PULSE_CLASS[k]}
          />
        ))}
      </g>

      {/* vias at every bend */}
      {Object.keys(cfg.nets).map((k) =>
        cfg.nets[k].pts.slice(1, -1).map(([x, y], i) => <Via key={`v-${k}-${i}`} x={x} y={y} lit={lit(k)} />),
      )}

      {/* net labels on ink chips — always horizontal */}
      {Object.keys(cfg.nets).map((k) => {
        const { x, y, anchor, text } = cfg.nets[k].label;
        const w = text.length * 6 + 12;
        const rx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w + 4 : x - 4;
        return (
          <g key={`lb-${k}`}>
            <rect x={rx} y={y - 11} width={w} height="15" fill="#0A0908" fillOpacity="0.9" />
            <text
              x={x}
              y={y}
              textAnchor={anchor}
              fill={lit(k) ? "#F1D08A" : "#8C857A"}
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}
              className="transition-[fill] duration-[450ms] ease-out-expo"
            >
              {text}
            </text>
          </g>
        );
      })}

      {/* DATUM — the board's exact center, where nothing is mounted */}
      {full && (
        <g>
          <rect x={cfg.datum[0] - 11} y={cfg.datum[1] - 11} width="22" height="22" fill="#0A0908" fillOpacity="0.85" />
          <line x1={cfg.datum[0] - 12} y1={cfg.datum[1]} x2={cfg.datum[0] + 12} y2={cfg.datum[1]} stroke="rgba(255,255,255,0.1)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1={cfg.datum[0]} y1={cfg.datum[1] - 12} x2={cfg.datum[0]} y2={cfg.datum[1] + 12} stroke="rgba(255,255,255,0.1)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <text
            x={cfg.datum[0]}
            y={cfg.datum[1] + 22}
            textAnchor="middle"
            fill="rgba(140,133,122,0.5)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.2em" }}
          >
            DATUM
          </text>
        </g>
      )}
    </svg>
  );
}

export default function PrinciplesCircuit() {
  const [activeId, setActiveId] = useState(null);

  const relatedIdsOf = (id) => (id == null ? [] : LG.nets ? Object.values(LG.nets).filter((n) => n.pair.includes(id)).flatMap((n) => n.pair).filter((x) => x !== id) : []);
  const relatedToActive = relatedIdsOf(activeId);

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

          <p className="mt-auto pt-2 font-mono text-[9px] tracking-[0.18em] text-bone-faint">{p.rel}</p>
          <span className="sr-only">Related principles: {p.related.join(" and ")}.</span>
        </div>
      </li>
    );
  };

  // Pads: 10px squares straddling the plate edges, centred exactly on each
  // net endpoint (translate centring so they can't drift as the board scales).
  const pads = (cfg) => {
    const [W, H] = cfg.vb;
    return Object.keys(cfg.nets).flatMap((k) => {
      const { pts, pair } = cfg.nets[k];
      const isLit = activeId != null && pair.includes(activeId);
      return [pts[0], pts[pts.length - 1]].map(([x, y], i) => (
        <span
          key={`pad-${k}-${i}`}
          aria-hidden="true"
          className={`pointer-events-none absolute z-30 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 border transition-colors duration-[450ms] ease-out-expo ${
            isLit ? "border-gold-200 bg-gold-400" : "border-bone-faint/40 bg-ink-900"
          }`}
          style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
        />
      ));
    });
  };

  // ————— mobile transit spine (<md): full plates on a lit vertical rail —————
  const spineConductor = (segment, plateId) => {
    // segment: "above" | "below" of this plate's pad
    const litAbove = activeId === plateId || activeId === plateId - 1;
    const litBelow = activeId === plateId || activeId === plateId + 1;
    // NET D wrap: the rail's two open ends light together on 1 and 4
    const isWrapTerminal = (plateId === 1 && segment === "above") || (plateId === 4 && segment === "below");
    const wrapLit = activeId === 1 || activeId === 4;
    const on = isWrapTerminal ? wrapLit : segment === "above" ? litAbove : litBelow;
    return on ? "bg-gold-300" : "bg-bone-faint/40";
  };

  return (
    <div className="relative isolate mt-12 w-full max-w-[1280px] lg:mt-16">
      {/* ————— lg board ————— */}
      <div className="relative hidden aspect-[2/1] lg:block">
        <Board cfg={LG} activeId={activeId} full />
        <ul className="absolute inset-0 z-20">{PRINCIPLES.map((p) => plate(p, LG))}</ul>

        {/* title block — the sheet certifies its own loop */}
        <div
          className="absolute z-20 flex flex-col justify-center gap-1 bg-ink-700 px-4 shadow-[0_0_0_1px_rgba(10,9,8,0.92),inset_0_1px_0_0_rgba(247,227,181,0.09)]"
          style={{ left: "5%", top: "82.5%", width: "17.5%", height: "13.75%" }}
        >
          <p className="font-mono text-[clamp(7px,0.7vw,9px)] uppercase tracking-[0.18em] text-bone-dim">LCX / Operating circuit</p>
          <p className="font-mono text-[clamp(7px,0.7vw,9px)] uppercase tracking-[0.18em] text-bone-faint">Sheet 04 — Principles · Rev C</p>
          <p className="font-mono text-[clamp(7px,0.7vw,9px)] uppercase tracking-[0.18em] text-bone-faint">Nets 4 · ΣL 1093 · Continuity OK</p>
        </div>

        {pads(LG)}
      </div>

      {/* ————— md board ————— */}
      <div className="relative hidden aspect-[768/920] md:block lg:hidden">
        <Board cfg={MD} activeId={activeId} full={false} />
        <ul className="absolute inset-0 z-20">{PRINCIPLES.map((p) => plate(p, MD))}</ul>
        {pads(MD)}
      </div>

      {/* ————— mobile transit spine ————— */}
      <div className="relative pl-11 md:hidden">
        <ul className="space-y-14">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            const isActive = activeId === p.id;
            return (
              <li key={p.id} className="relative">
                {/* rail above / below this station, riding its own channel */}
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
                {/* stub + pad into the plate */}
                <span aria-hidden="true" className="absolute -left-[26px] top-[30px] h-[9px] w-[26px] bg-ink-900/90">
                  <span className={`absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 transition-colors duration-[450ms] ease-out-expo ${isActive ? "bg-gold-300" : "bg-bone-faint/40"}`} />
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute -left-[5px] top-[29px] h-[10px] w-[10px] border transition-colors duration-[450ms] ease-out-expo ${
                    isActive ? "border-gold-200 bg-gold-400" : "border-bone-faint/40 bg-ink-900"
                  }`}
                />
                {p.id === 4 && (
                  <span aria-hidden="true" className="absolute -bottom-[54px] -left-[30px] whitespace-nowrap font-mono text-[8px] tracking-[0.18em] text-bone-faint">
                    ↺ NET D → 04.1
                  </span>
                )}

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
                    <p className="mt-3 font-mono text-[9px] tracking-[0.18em] text-bone-faint">{p.rel}</p>
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
