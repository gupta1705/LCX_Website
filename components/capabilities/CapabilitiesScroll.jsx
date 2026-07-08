"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ---- crafted gold emblems (not stock icons) ---------------------------- */

function GoldGrad({ id }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f7e3b5" />
        <stop offset="45%" stopColor="#e8b96a" />
        <stop offset="78%" stopColor="#c9923d" />
        <stop offset="100%" stopColor="#f1d08a" />
      </linearGradient>
    </defs>
  );
}

// The Studio — a lens / aperture.
function LensMark({ id }) {
  const g = `url(#${id})`;
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className="h-28 w-28 drop-shadow-[0_0_34px_rgba(233,185,106,0.4)] sm:h-32 sm:w-32">
      <GoldGrad id={id} />
      <circle cx="60" cy="60" r="48" stroke={g} strokeWidth="1.3" />
      <circle cx="60" cy="60" r="36" stroke={g} strokeWidth="1" opacity="0.7" />
      <circle cx="60" cy="60" r="23" stroke={g} strokeWidth="1" opacity="0.5" />
      <g stroke={g} strokeWidth="1.4">
        <line x1="60" y1="3" x2="60" y2="14" />
        <line x1="60" y1="106" x2="60" y2="117" />
        <line x1="3" y1="60" x2="14" y2="60" />
        <line x1="106" y1="60" x2="117" y2="60" />
      </g>
      <circle cx="60" cy="60" r="6" fill={g} />
      <circle cx="60" cy="12" r="3" fill={g} />
    </svg>
  );
}

// The Engine — an orbit / system.
function OrbitMark({ id }) {
  const g = `url(#${id})`;
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className="h-28 w-28 drop-shadow-[0_0_34px_rgba(233,185,106,0.4)] sm:h-32 sm:w-32">
      <GoldGrad id={id} />
      <g stroke={g} strokeWidth="1.3">
        <ellipse cx="60" cy="60" rx="50" ry="19" />
        <ellipse cx="60" cy="60" rx="50" ry="19" transform="rotate(60 60 60)" opacity="0.85" />
        <ellipse cx="60" cy="60" rx="50" ry="19" transform="rotate(120 60 60)" opacity="0.7" />
      </g>
      <circle cx="60" cy="60" r="7" fill={g} />
      <circle cx="110" cy="60" r="3.2" fill={g} />
      <circle cx="35" cy="18" r="2.6" fill={g} opacity="0.85" />
    </svg>
  );
}

const ITEMS = [
  {
    num: "01",
    tag: "Work we direct",
    title: "The Studio",
    body: "The films you'd hire a director for, minus the crew, the location, and the month in post. Real performances, real craft, light that behaves like light. We start with the hook and build out, then use AI to actually shoot it. Story leads; the AI is just how we get there.",
    Mark: LensMark,
  },
  {
    num: "02",
    tag: "Work we scale",
    title: "The Engine",
    body: "The volume a campaign actually burns through. Hundreds of variants, product visuals on demand, every format and every language, plus the systems that keep producing after we've handed over. We don't just give you files. We build the machine that makes them.",
    Mark: OrbitMark,
  },
];

/* ---- scramble text (rebuilt HyperText, re-runs when `text` changes) ---- */

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const randInt = (max) => Math.floor(Math.random() * max);

function Scramble({ text, className, duration = 975 }) {
  const [display, setDisplay] = useState(text);
  const iter = useRef(0);
  useEffect(() => {
    iter.current = 0;
    const chars = text.split("");
    const id = setInterval(
      () => {
        if (iter.current >= chars.length) {
          setDisplay(text);
          clearInterval(id);
          return;
        }
        setDisplay(
          chars
            .map((l, i) => (l === " " ? " " : i <= iter.current ? text[i] : ALPHA[randInt(26)]))
            .join(""),
        );
        iter.current += 0.5;
      },
      Math.max(duration / (chars.length * 3), 16),
    );
    return () => clearInterval(id);
  }, [text, duration]);
  return <span className={className}>{display}</span>;
}

/* ---- cards ------------------------------------------------------------- */

function CurvedLabel({ text, id }) {
  return (
    <svg viewBox="0 0 320 110" className="pointer-events-none absolute inset-x-0 top-3 w-full" aria-hidden="true">
      <defs>
        <path id={`${id}-arc`} d="M 46 84 Q 160 26 274 84" fill="none" />
      </defs>
      <text className="fill-bone/85 font-serif italic" fontSize="18" letterSpacing="0.4">
        <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

function Card({ item, id }) {
  const Mark = item.Mark;
  return (
    <div className="relative h-[360px] w-[290px] rounded-[26px] border border-white/[0.12] bg-gradient-to-b from-ink-700 to-ink-900 shadow-[0_44px_100px_-44px_rgba(0,0,0,0.95)] sm:h-[420px] sm:w-[350px]">
      <div className="pointer-events-none absolute inset-3 rounded-[20px] ring-1 ring-white/[0.06]" />
      <CurvedLabel text={item.title} id={id} />
      <div className="grid h-full place-items-center">
        <Mark id={`${id}-grad`} />
      </div>
      <span className="absolute bottom-4 right-7 select-none font-serif text-6xl italic text-bone/85 sm:text-7xl">
        {item.num}
      </span>
    </div>
  );
}

const BAR_FILL = "absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-100";

/* ---- static (mobile + reduced-motion): plain, no pinning, no scramble -- */

function StaticStack() {
  return (
    <div className="container-px grid gap-16 py-16 lg:gap-20 lg:py-24">
      {ITEMS.map((item, i) => (
        <div key={item.num} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className={`lg:col-span-6 ${i % 2 ? "lg:order-last" : ""}`}>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl italic text-gold-gradient">{item.num}.</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-300">{item.tag}</span>
            </div>
            <h3 className="mt-4 font-sans text-[clamp(2.6rem,6.5vw,7.25rem)] font-medium leading-[0.98] tracking-tightest text-bone">
              {item.title}
            </h3>
            <div className="relative mt-6 h-[2px] w-full max-w-[26rem] overflow-hidden rounded-full bg-white/12">
              <div className={BAR_FILL} />
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-bone-dim xl:max-w-lg xl:text-xl">{item.body}</p>
          </div>
          <div className="grid place-items-center lg:col-span-6">
            {/* one card leans left, the other right */}
            <div className={i % 2 ? "rotate-6" : "-rotate-6"}>
              <Card item={item} id={`static-${item.num}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CapabilitiesScroll() {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  // flip the active pillar at the midpoint (hysteresis avoids flip-flop)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIdx((prev) => {
      if (prev === 0 && v > 0.55) return 1;
      if (prev === 1 && v < 0.45) return 0;
      return prev;
    });
  });

  // morph 0 → 1 across most of the pinned scroll (drives the cards).
  // Wide range = brief static holds at each end, so little dead scroll.
  const t = useTransform(scrollYProgress, [0.16, 0.84], [0, 1]);

  // section-specific progress bars: Studio fills the first half, Engine the second
  const fillA = useTransform(scrollYProgress, [0.02, 0.48], [0, 1]);
  const fillB = useTransform(scrollYProgress, [0.52, 0.98], [0, 1]);

  // card A (front, leans LEFT) slides away; card B (behind, leans RIGHT) rises to front
  const c0rot = useTransform(t, [0, 1], [-8, -26]);
  const c0x = useTransform(t, [0, 1], [0, -160]);
  const c0y = useTransform(t, [0, 1], [0, 480]);
  const c0op = useTransform(t, [0.15, 0.68], [1, 0]);
  const c1rot = useTransform(t, [0, 1], [15, 8]);
  const c1scale = useTransform(t, [0, 1], [0.9, 1]);
  const c1x = useTransform(t, [0, 1], [34, 0]);
  const c1y = useTransform(t, [0, 1], [44, 0]);
  const c1op = useTransform(t, [0, 0.5], [0.6, 1]);

  if (reduced) return <StaticStack />;

  const [A, B] = ITEMS;
  const item = ITEMS[activeIdx];

  return (
    <>
      {/* Desktop: pinned scroll — title scrambles, cards shuffle */}
      <section ref={trackRef} className="relative hidden h-[170vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container-px grid w-full grid-cols-12 items-center gap-y-12">
            {/* LEFT — scramble on change */}
            <div className="col-span-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl italic text-gold-gradient">{item.num}.</span>
                <Scramble
                  text={item.tag}
                  duration={720}
                  className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-300"
                />
              </div>
              <h3 className="mt-4 font-sans text-[clamp(2.6rem,6.5vw,7.25rem)] font-medium leading-[0.98] tracking-tightest text-bone">
                <Scramble text={item.title} />
              </h3>
              <div className="relative mt-6 h-[2px] w-full max-w-[26rem] overflow-hidden rounded-full bg-white/12">
                <motion.div style={{ scaleX: activeIdx === 0 ? fillA : fillB }} className={BAR_FILL} />
              </div>
              <motion.p
                key={item.num}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="mt-6 min-h-[8.5rem] max-w-md text-lg leading-relaxed text-bone-dim xl:max-w-lg xl:text-xl"
              >
                {item.body}
              </motion.p>
            </div>

            {/* RIGHT — shuffling card stack (one leans left, one right) */}
            <div className="relative col-span-6 grid h-[500px] place-items-center">
              <motion.div style={{ rotate: c1rot, x: c1x, y: c1y, scale: c1scale, opacity: c1op }} className="[grid-area:1/1] z-[1]">
                <Card item={B} id="pin-b" />
              </motion.div>
              <motion.div style={{ rotate: c0rot, x: c0x, y: c0y, opacity: c0op }} className="[grid-area:1/1] z-[2]">
                <Card item={A} id="pin-a" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: static stacked */}
      <div className="lg:hidden">
        <StaticStack />
      </div>
    </>
  );
}
