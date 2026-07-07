"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const VIEW = { once: true, margin: "-80px" };
const TIERS = [1, 0.7, 0.5];

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

/**
 * Hand-drawn gold pipeline schematic that assembles itself on scroll.
 *  - variant="fanout" (ReelForge): one source reel splits into clips into channels.
 *  - variant="loop" (ParsecDaily): a closed autonomy loop, nothing enters, nothing leaves.
 * Decorative only (aria-hidden); the mono `pipeline` caption below carries the text.
 */
export default function PipelineDiagram({ variant = "fanout", gid }) {
  const reduce = useReducedMotion();
  const g = `url(#${gid})`;

  // strokes draw themselves in; filled nodes fade in after
  const draw = (i) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: VIEW,
          transition: { duration: 1.4, ease: EASE, delay: i * 0.12 },
        };
  const fade = (i, to = 1) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: to },
          viewport: VIEW,
          transition: { duration: 0.4, delay: 0.9 + i * 0.1 },
        };

  return (
    <svg
      viewBox="0 0 320 96"
      fill="none"
      aria-hidden="true"
      className="h-20 w-full max-w-[320px] drop-shadow-[0_0_24px_rgba(233,185,106,0.25)] transition-[filter] duration-[600ms] ease-out-expo group-hover/readout:drop-shadow-[0_0_30px_rgba(233,185,106,0.45)]"
    >
      <GoldGrad id={gid} />

      {variant === "loop" ? (
        <>
          {/* orbit — the whole machine is one closed circuit */}
          <motion.ellipse cx="160" cy="48" rx="88" ry="30" stroke={g} strokeWidth="1" opacity="0.25" {...draw(0)} />
          {/* source */}
          <motion.circle cx="100" cy="48" r="11" stroke={g} strokeWidth="1.3" {...draw(1)} />
          {/* process hex */}
          <motion.path d="M 160 15 l 10 5.5 v 11 l -10 5.5 l -10 -5.5 v -11 z" stroke={g} strokeWidth="1.2" {...draw(2)} />
          {/* publish */}
          <motion.rect x="206" y="40" width="28" height="16" rx="4" stroke={g} strokeWidth="1.2" {...draw(3)} />
          {/* circuit arcs */}
          <motion.path d="M 111 44 Q 130 26 148 26" stroke={g} strokeWidth="1.2" {...draw(4)} />
          <motion.path d="M 172 26 Q 196 26 206 40" stroke={g} strokeWidth="1.2" opacity="0.7" {...draw(5)} />
          <motion.path d="M 212 58 Q 160 84 108 56" stroke={g} strokeWidth="1.2" opacity="0.5" {...draw(6)} />
          {/* return chevron */}
          <motion.path d="M 164 73 l -6 2 l 5 4" stroke={g} strokeWidth="1.2" opacity="0.7" {...draw(7)} />
          {/* publish node — where the machine emits */}
          <motion.circle cx="220" cy="48" r="3" fill={g} opacity={reduce ? 1 : undefined} {...fade(0)} />
        </>
      ) : (
        <>
          {/* source reel */}
          <motion.circle cx="36" cy="48" r="16" stroke={g} strokeWidth="1.3" {...draw(0)} />
          <motion.circle cx="36" cy="40" r="2.5" stroke={g} strokeWidth="1" opacity="0.7" {...draw(1)} />
          <motion.circle cx="36" cy="56" r="2.5" stroke={g} strokeWidth="1" opacity="0.7" {...draw(1)} />
          <motion.circle cx="28" cy="48" r="2.5" stroke={g} strokeWidth="1" opacity="0.7" {...draw(1)} />
          <motion.circle cx="44" cy="48" r="2.5" stroke={g} strokeWidth="1" opacity="0.7" {...draw(1)} />
          {/* feed + splitter */}
          <motion.path d="M 52 48 H 96" stroke={g} strokeWidth="1.2" {...draw(2)} />
          <motion.path d="M 108 48 l 10 -10 l 10 10 l -10 10 z" stroke={g} strokeWidth="1.2" {...draw(3)} />
          {/* fan, stepped opacity */}
          <motion.path d="M 128 48 C 160 48 168 20 200 20" stroke={g} strokeWidth="1.2" {...draw(4)} />
          <motion.path d="M 128 48 H 200" stroke={g} strokeWidth="1.2" opacity="0.7" {...draw(5)} />
          <motion.path d="M 128 48 C 160 48 168 76 200 76" stroke={g} strokeWidth="1.2" opacity="0.5" {...draw(6)} />
          {/* clip nodes */}
          <motion.rect x="200" y="13" width="22" height="14" rx="3" stroke={g} strokeWidth="1.2" {...draw(7)} />
          <motion.rect x="200" y="41" width="22" height="14" rx="3" stroke={g} strokeWidth="1.2" opacity="0.7" {...draw(8)} />
          <motion.rect x="200" y="69" width="22" height="14" rx="3" stroke={g} strokeWidth="1.2" opacity="0.5" {...draw(9)} />
          {/* publish chevrons + channel dots — chevrons thrust on readout hover */}
          {[20, 48, 76].map((y, i) => (
            <motion.g key={y} opacity={reduce ? TIERS[i] : undefined} {...fade(i, TIERS[i])}>
              <path
                d={`M 232 ${y} h 20 m -5 -4 l 5 4 l -5 4`}
                stroke={g}
                strokeWidth="1.2"
                className="transition-transform duration-500 ease-out-expo group-hover/readout:translate-x-[3px]"
                style={{ transitionDelay: `${i * 80}ms` }}
              />
              <circle cx="266" cy={y} r="2.6" fill={g} />
            </motion.g>
          ))}
        </>
      )}
    </svg>
  );
}
