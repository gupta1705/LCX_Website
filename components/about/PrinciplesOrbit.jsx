"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link2, Feather, Zap, Cpu, Radar } from "lucide-react";
import { useReducedMotion } from "framer-motion";

/**
 * The four principles set as an auto-rotating orbit — a radial-orbital timeline
 * recast into the site's black-and-gold language (no shadcn: the card, badge
 * and connection chips are inlined). Click a node to glide it to the top and
 * open its readout; connected principles pulse. Auto-rotation pauses while a
 * node is open and under prefers-reduced-motion.
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

export default function PrinciplesOrbit() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulse, setPulse] = useState({});
  const [radius, setRadius] = useState(300);
  const containerRef = useRef(null);
  const orbitRef = useRef(null);

  // Orbit radius tracks the container so it fits phones and wide screens alike.
  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = Math.min(el.clientWidth, el.clientHeight) / 2 - 68;
      setRadius(Math.max(120, Math.min(350, r)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Slow ambient rotation — paused while a node is open or motion is reduced.
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
    setRotation(270 - (i / PRINCIPLES.length) * 360); // bring node to the top
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

  const onBackdrop = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) closeAll();
  };

  const nodePosition = (index) => {
    const angle = ((index / PRINCIPLES.length) * 360 + rotation) % 360;
    const rad = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      zIndex: Math.round(100 + 50 * Math.cos(rad)),
      opacity: Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(rad)) / 2))),
    };
  };

  return (
    <div
      ref={containerRef}
      onClick={onBackdrop}
      className="relative mx-auto flex h-[560px] w-full max-w-5xl items-center justify-center overflow-visible sm:h-[720px] lg:h-[820px]"
    >
      {/* readability scrim — the orbit reads cleanly over the live attractor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(closest-side,rgba(10,9,8,0.8),transparent_78%)]"
      />

      <div
        ref={orbitRef}
        className="relative"
        style={{ width: radius * 2, height: radius * 2, perspective: "1000px" }}
      >
        {/* central core — a small lit gold bead with one soft breathing glow */}
        <div className="absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center">
          {!reduce && (
            <div className="absolute h-16 w-16 animate-pulse-soft rounded-full bg-[radial-gradient(circle,rgba(201,146,61,0.45),transparent_66%)]" />
          )}
          <div className="absolute h-9 w-9 rounded-full bg-[radial-gradient(circle_at_38%_30%,#f7e3b5_0%,#dda64f_48%,#6e4513_100%)] shadow-[inset_0_-3px_7px_-2px_rgba(0,0,0,0.55),0_0_0_1px_rgba(10,9,8,0.5),0_0_16px_-4px_rgba(233,185,106,0.6)]" />
          <div className="relative h-2.5 w-2.5 rounded-full bg-bone/90" />
        </div>

        {/* orbit ring — a lit gold track that catches light around its
            circumference (conic gradient masked to a thin ring), so it reads
            as an orbit rather than a flat faint circle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: radius * 2,
            height: radius * 2,
            background:
              "conic-gradient(from 210deg, rgba(241,208,138,0.6) 0deg, rgba(201,146,61,0.10) 95deg, rgba(201,146,61,0.04) 200deg, rgba(233,185,106,0.4) 315deg, rgba(241,208,138,0.6) 360deg)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))",
          }}
        />
        {/* soft glow under the track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[6px]"
          style={{
            width: radius * 2,
            height: radius * 2,
            background:
              "conic-gradient(from 210deg, rgba(233,185,106,0.35) 0deg, transparent 110deg, transparent 300deg, rgba(233,185,106,0.25) 360deg)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
          }}
        />

        {PRINCIPLES.map((item, index) => {
          const pos = nodePosition(index);
          const isOpen = openId === item.id;
          const isRelated = openId ? getRelated(openId).includes(item.id) : false;
          const isPulsing = !!pulse[item.id];
          const Icon = item.icon;
          const num = String(item.id).padStart(2, "0");

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                toggle(item.id);
              }}
              className="absolute left-1/2 top-1/2 cursor-pointer transition-all duration-700 ease-out-expo"
              style={{
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
                zIndex: isOpen ? 200 : pos.zIndex,
                opacity: isOpen ? 1 : pos.opacity,
              }}
            >
              {/* dark halo — erases the attractor lines right behind the node
                  so it reads as a solid object cut out of the gold field */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#0A0908_0%,#0A0908_45%,rgba(10,9,8,0.72)_62%,rgba(10,9,8,0)_100%)] blur-[3px]"
              />

              {/* node */}
              <div
                className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 transition-all duration-300 ease-out ${
                  isOpen
                    ? "scale-150 border-gold-100 bg-[radial-gradient(circle_at_50%_28%,#F7E3B5_0%,#DDA64F_100%)] text-ink-900 shadow-[0_0_0_1.5px_rgba(10,9,8,0.9),0_4px_20px_-2px_rgba(0,0,0,0.7),0_0_34px_-3px_rgba(233,185,106,0.9)]"
                    : isRelated
                      ? "animate-pulse border-gold-200 bg-[radial-gradient(circle_at_50%_30%,rgba(201,146,61,0.32)_0%,#110F0B_75%)] text-gold-100 ring-1 ring-inset ring-gold-400/40 shadow-[0_0_0_1.5px_rgba(10,9,8,0.95),0_3px_12px_-2px_rgba(0,0,0,0.85),0_0_26px_-3px_rgba(241,208,138,0.6)]"
                      : "border-gold-300 bg-[radial-gradient(circle_at_50%_30%,#231F17_0%,#0C0B09_78%)] text-gold-100 shadow-[0_0_0_1.5px_rgba(10,9,8,0.95),0_3px_12px_-2px_rgba(0,0,0,0.85),0_0_18px_-6px_rgba(232,185,106,0.5)]"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </div>

              {/* label */}
              <div
                className={`absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 ${
                  isOpen ? "scale-110 text-gold-200" : "text-bone/80"
                }`}
              >
                {item.label}
              </div>

              {/* readout — always opens from the top, so it never runs off-frame */}
              {isOpen && (
                <div
                  className="absolute left-1/2 top-24 w-72 -translate-x-1/2 overflow-hidden rounded-sm border border-gold-soft bg-ink-900/95 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.9)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div aria-hidden="true" className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-gold-500/50" />
                  <div className="border-b border-white/[0.07] px-5 py-3">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
                      <span className="text-gold-300">Principle {num}</span>
                      <span className="text-bone-faint">{item.category}</span>
                    </div>
                    <h4 className="mt-2 font-sans text-lg font-medium leading-tight tracking-tight text-bone">
                      {item.pre}
                      <span className="font-serif italic text-gold-gradient">{item.accent}</span>
                      {item.post}
                    </h4>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[13px] leading-relaxed text-bone-dim">{item.blurb}</p>
                    <div className="mt-4 border-t border-white/[0.07] pt-3">
                      <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-faint">
                        <Link2 size={10} className="text-gold-400" aria-hidden="true" />
                        Connected
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.relatedIds.map((rid) => {
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
