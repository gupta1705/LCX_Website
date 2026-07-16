"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ArrowRight, Link2, Feather, Zap, Cpu, Radar } from "lucide-react";
import { useReducedMotion } from "framer-motion";

/**
 * The four principles in a 3D orbit, inked for the LIGHT (bone) plate the
 * section sits on. The nodes ride a TILTED orbital plane: their 3D position is
 * projected to 2D in JS (x, squashed y, depth), and depth drives scale,
 * opacity, blur and z-order — so nodes genuinely pass in front of and behind
 * the gold core while every label stays crisp (nothing is CSS-3D-skewed). The
 * chart under them is a static engraved SVG — an orrery drawing in the antique
 * astronomy-plate tradition: double-ruled orbit rail (far half behind the
 * core, near half in front), a graduated tick limb, construction cross,
 * dotted inner orbit, radius callout and plate labels — gold ink on paper.
 * Click a node: the orbit glides it to the front docking seat and its readout
 * opens as a dark plate over a paper fog.
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
      opacity: 0.45 + near * 0.55,
      blur: depth < 0 ? -depth * 1.4 : 0, // up to 1.4px on the far side
      z: depth >= 0 ? Math.round(56 + depth * 40) : Math.round(46 + depth * 40),
    };
  };

  const ellipseW = radius * 2;
  const ellipseH = radius * 2 * COS_T;
  const openItem = openId ? PRINCIPLES.find((p) => p.id === openId) : null;

  // Engraved chart geometry — static per radius, so memoised. All points sit
  // on the tilted plane via P(r, θ) = (r·cosθ, r·sinθ·cos60°), the same
  // projection the nodes use; the tick lengths foreshorten automatically,
  // which is what makes the flat drawing read as one inclined plate.
  const chart = useMemo(() => {
    const R = radius;
    const P = (r, deg) => {
      const a = (deg * Math.PI) / 180;
      return [r * Math.cos(a), 0.5 * r * Math.sin(a)];
    };
    const seg = ([x1, y1], [x2, y2]) =>
      `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} `;
    const compact = R < 180;
    let minors = "";
    for (let t = 0, step = compact ? 10 : 5; t < 360; t += step) {
      if (t % 30 === 0) continue;
      minors += seg(P(1.06 * R, t), P(1.095 * R, t));
    }
    let majors = "";
    for (let t = 0; t < 360; t += 30) majors += seg(P(1.06 * R, t), P(1.15 * R, t));
    const r0 = Math.max(56, 0.18 * R);
    let cross = "";
    for (const t of [0, 90, 180, 270]) cross += seg(P(r0, t), P(1.06 * R, t));
    return {
      compact,
      minors,
      majors,
      cross,
      calloutA: P(0.22 * R, 210),
      calloutB: P(R, 210),
      showDetail: R >= 200,
    };
  }, [radius]);

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.target === containerRef.current) closeAll();
      }}
      className="relative mx-auto flex h-[440px] w-full max-w-5xl items-center justify-center overflow-visible sm:h-[520px] lg:h-[560px]"
    >
      {/* gentle paper shading — a whisper of depth on the light plate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(closest-side,rgba(10,9,8,0.05),transparent_75%)]"
      />

      <div className="relative" style={{ width: ellipseW, height: ellipseH }}>
        {/* THE CHART — one static engraved SVG under everything: core seat
            shadow, guide ring, construction cross, radius callout, dotted
            inner orbit, the FAR half of the double-ruled rail, graduated
            limb + tick band, station dots, plate labels. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 overflow-visible"
          width={2.8 * radius}
          height={1.44 * radius}
          viewBox={`${-1.4 * radius} ${-0.72 * radius} ${2.8 * radius} ${1.44 * radius}`}
        >
          <defs>
            <radialGradient id="tvl-core-seat">
              <stop offset="0%" stopColor="rgba(10,9,8,0.18)" />
              <stop offset="60%" stopColor="rgba(10,9,8,0.06)" />
              <stop offset="100%" stopColor="rgba(10,9,8,0)" />
            </radialGradient>
          </defs>
          {/* core ground shadow — the bead floats just above its seat */}
          <ellipse
            cx="0"
            cy="5"
            rx={Math.max(26, 0.14 * radius)}
            ry={Math.max(13, 0.07 * radius)}
            fill="url(#tvl-core-seat)"
          />
          {/* guide ring */}
          {!chart.compact && (
            <ellipse rx={0.33 * radius} ry={0.165 * radius} fill="none" stroke="rgba(10,9,8,0.10)" strokeWidth="0.75" />
          )}
          {/* construction cross — axes stop at the limb, clear the core */}
          <path d={chart.cross} stroke="rgba(10,9,8,0.18)" strokeWidth="0.75" fill="none" />
          {/* radius callout */}
          {chart.showDetail && (
            <>
              <path
                d={`M ${chart.calloutA[0].toFixed(2)} ${chart.calloutA[1].toFixed(2)} L ${chart.calloutB[0].toFixed(2)} ${chart.calloutB[1].toFixed(2)}`}
                stroke="rgba(10,9,8,0.22)"
                strokeWidth="0.75"
                strokeDasharray="1 3.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx={chart.calloutB[0]} cy={chart.calloutB[1]} r="1.75" fill="rgba(130,89,34,0.9)" />
              <text
                x={-0.52 * radius}
                y={-0.15 * radius - 10}
                textAnchor="middle"
                fill="rgba(130,89,34,0.8)"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 12 }}
              >
                r
              </text>
            </>
          )}
          {/* dotted inner orbit */}
          <ellipse
            rx={0.62 * radius}
            ry={0.31 * radius}
            fill="none"
            stroke="rgba(130,89,34,0.35)"
            strokeWidth="1.2"
            strokeDasharray="0.1 7"
            strokeLinecap="round"
          />
          {/* far half of the main rail — double-ruled */}
          <path
            d={`M ${-radius} 0 A ${radius} ${0.5 * radius} 0 0 1 ${radius} 0`}
            fill="none"
            stroke="rgba(130,89,34,0.4)"
            strokeWidth="1.5"
          />
          <path
            d={`M ${-(radius - 4)} 0 A ${radius - 4} ${0.5 * (radius - 4)} 0 0 1 ${radius - 4} 0`}
            fill="none"
            stroke="rgba(92,62,24,0.22)"
            strokeWidth="0.75"
          />
          {/* graduated limb bounds */}
          <ellipse rx={1.06 * radius} ry={0.53 * radius} fill="none" stroke="rgba(130,89,34,0.22)" strokeWidth="0.75" />
          <ellipse rx={1.12 * radius} ry={0.56 * radius} fill="none" stroke="rgba(130,89,34,0.22)" strokeWidth="0.75" />
          {/* tick band — foreshortened by the same projection as the nodes */}
          <path d={chart.minors} stroke="rgba(130,89,34,0.4)" strokeWidth="0.75" fill="none" />
          <path d={chart.majors} stroke="rgba(92,62,24,0.6)" strokeWidth="1.25" fill="none" />
          {/* station dots — pin the rail to the crosshair, cover the seams */}
          <circle cx={radius} cy="0" r="2.25" fill="rgba(130,89,34,0.85)" />
          <circle cx={-radius} cy="0" r="2.25" fill="rgba(130,89,34,0.85)" />
          <circle cx="0" cy={-0.5 * radius} r="2" fill="rgba(130,89,34,0.45)" />
          {/* plate labels */}
          {chart.showDetail && (
            <>
              <text
                x={-1.15 * radius - 10}
                y="0"
                textAnchor="end"
                dominantBaseline="central"
                fill="rgba(10,9,8,0.4)"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em" }}
              >
                FIG. 01
              </text>
              <text
                x={1.15 * radius + 10}
                y="0"
                textAnchor="start"
                dominantBaseline="central"
                fill="rgba(10,9,8,0.4)"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em" }}
              >
                INCL. 60°
              </text>
            </>
          )}
        </svg>

        {/* central core — a small lit gold bead with one soft breathing glow */}
        <div className="absolute left-1/2 top-1/2 z-[50] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center">
          {!reduce && (
            <div className="absolute h-14 w-14 animate-pulse-soft rounded-full bg-[radial-gradient(circle,rgba(201,146,61,0.30),transparent_66%)]" />
          )}
          <div className="absolute h-9 w-9 rounded-full bg-[radial-gradient(circle_at_38%_30%,#f7e3b5_0%,#dda64f_48%,#6e4513_100%)] shadow-[inset_0_-3px_7px_-2px_rgba(0,0,0,0.55),0_0_0_1px_rgba(10,9,8,0.5),0_0_16px_-4px_rgba(233,185,106,0.6)]" />
          <div className="relative h-2.5 w-2.5 rounded-full bg-bone/90" />
        </div>

        {/* NEAR half of the rail — in front of the core, behind near nodes —
            plus the docking seat the clicked node glides onto */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[52] -translate-x-1/2 -translate-y-1/2 overflow-visible"
          width={2.8 * radius}
          height={1.44 * radius}
          viewBox={`${-1.4 * radius} ${-0.72 * radius} ${2.8 * radius} ${1.44 * radius}`}
        >
          <defs>
            <linearGradient id="tvl-rail-grad" gradientUnits="userSpaceOnUse" x1={-radius} y1="0" x2={radius} y2="0">
              <stop offset="0%" stopColor="#825922" />
              <stop offset="50%" stopColor="#C9923D" />
              <stop offset="100%" stopColor="#825922" />
            </linearGradient>
          </defs>
          <path
            d={`M ${-radius} 0 A ${radius} ${0.5 * radius} 0 0 0 ${radius} 0`}
            fill="none"
            stroke="url(#tvl-rail-grad)"
            strokeOpacity="0.95"
            strokeWidth="2"
          />
          <path
            d={`M ${-(radius - 4)} 0 A ${radius - 4} ${0.5 * (radius - 4)} 0 0 0 ${radius - 4} 0`}
            fill="none"
            stroke="rgba(92,62,24,0.5)"
            strokeWidth="0.75"
          />
          <circle cx="0" cy={0.5 * radius} r="4.5" fill="#F4F1EA" stroke="rgba(169,118,46,0.9)" strokeWidth="1" />
          <circle cx="0" cy={0.5 * radius} r="1.5" fill="#A9762E" />
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
              {/* seat shadow — the coin presses onto the paper (same family
                  as the core's ground shadow; inherits the wrapper's scale) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[46px] h-2.5 w-10 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(50%_50%_at_center,rgba(10,9,8,0.25),transparent_70%)]"
              />

              {/* minted-plate node — an ink coin on the paper plate */}
              <div
                className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 transition-all duration-300 ease-out ${
                  isOpen
                    ? "scale-125 border-gold-100 bg-[radial-gradient(circle_at_50%_28%,#F7E3B5_0%,#DDA64F_100%)] text-ink-900 shadow-[0_0_0_1.5px_rgba(10,9,8,0.9),0_4px_20px_-2px_rgba(0,0,0,0.7),0_0_34px_-3px_rgba(233,185,106,0.9)]"
                    : isRelated
                      ? "animate-pulse border-gold-200 bg-[radial-gradient(circle_at_50%_30%,rgba(201,146,61,0.32)_0%,#110F0B_75%)] text-gold-100 ring-1 ring-inset ring-gold-400/40 shadow-[0_0_0_1.5px_rgba(10,9,8,0.95),0_3px_12px_-2px_rgba(0,0,0,0.85),0_0_26px_-3px_rgba(241,208,138,0.6)]"
                      : "border-gold-300 bg-[radial-gradient(circle_at_50%_30%,#231F17_0%,#0C0B09_78%)] text-gold-100 shadow-[0_0_0_1.5px_rgba(10,9,8,0.95),0_3px_12px_-2px_rgba(0,0,0,0.85),0_0_10px_-7px_rgba(232,185,106,0.35)]"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </div>

              {/* label */}
              <div
                className={`absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 ${
                  isOpen ? "text-gold-700" : "text-ink-900/70"
                }`}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* paper fog + centered readout — the orbit softens behind the open card
          (a light veil: darkening the light plate on click read as murky) */}
      {openItem && (
        <>
          <div
            className="absolute inset-0 z-[140] bg-bone/70 transition-opacity duration-300"
            onClick={closeAll}
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-1/2 z-[150] w-[19rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-gold-soft bg-ink-900/95 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.9)] sm:w-80"
            role="dialog"
            aria-label={`Principle ${String(openItem.id).padStart(2, "0")}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/[0.07] px-5 py-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
                <span className="text-gold-300">Principle {String(openItem.id).padStart(2, "0")}</span>
                <span className="text-bone-faint">{openItem.category}</span>
              </div>
              <h4 className="mt-2 font-sans text-lg font-medium leading-tight tracking-tight text-bone">
                {openItem.pre}
                <span className="font-serif italic text-gold-gradient">{openItem.accent}</span>
                {openItem.post}
              </h4>
            </div>
            <div className="px-5 py-4">
              <p className="text-[13px] leading-relaxed text-bone-dim">{openItem.blurb}</p>
              <div className="mt-4 border-t border-white/[0.07] pt-3">
                <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-faint">
                  <Link2 size={10} className="text-gold-400" aria-hidden="true" />
                  Connected
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {openItem.relatedIds.map((rid) => {
                    const rel = PRINCIPLES.find((p) => p.id === rid);
                    return (
                      <button
                        key={rid}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(rid);
                        }}
                        className="inline-flex items-center gap-1 rounded-sm border border-gold-soft bg-transparent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-200 transition-colors hover:bg-gold-500/10 hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      >
                        {rel?.label}
                        <ArrowRight size={9} className="text-gold-400" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
