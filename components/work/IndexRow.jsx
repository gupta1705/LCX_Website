"use client";

import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

/** Animated top hairline — each index row "typesets" its own rule on scroll. */
export function RuleDraw() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px origin-left bg-white/[0.08]"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
    />
  );
}

/** Gold breath across the row on hover — opacity only, no layout shift. */
export function RowWash() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold-500/[0.05] via-gold-500/[0.015] to-transparent opacity-0 transition-opacity duration-500 ease-out-expo group-hover:opacity-100"
    />
  );
}

/** One grid cell of an index row, printed in after the rule draws. */
export function Cell({ className = "", delay = 0, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Oversized serif index numeral — a ghost at rest that ignites into the gold
 * gradient on row hover. Two stacked layers because gradient text can't
 * transition its color.
 */
export function IndexNumeral({ n }) {
  return (
    <div className="grid select-none" aria-hidden="true">
      <span className="[grid-area:1/1] font-serif italic text-[clamp(3.5rem,7.5vw,7rem)] leading-[0.8] tracking-[-0.04em] text-bone/[0.14] transition-opacity duration-[600ms] ease-out-expo group-hover:opacity-40">
        {n}
      </span>
      <span className="[grid-area:1/1] font-serif italic text-[clamp(3.5rem,7.5vw,7rem)] leading-[0.8] tracking-[-0.04em] text-gold-gradient opacity-0 transition-all duration-[600ms] ease-out-expo group-hover:-translate-y-[3px] group-hover:opacity-100 motion-reduce:group-hover:translate-y-0">
        {n}
      </span>
    </div>
  );
}
