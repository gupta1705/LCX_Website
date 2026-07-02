"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 22,
  once = true,
}) {
  // framer-motion isn't covered by the global CSS reduced-motion block, so gate
  // the entrance here — reduced-motion users mount directly in the resting state.
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
