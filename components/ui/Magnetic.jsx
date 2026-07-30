"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Wraps an interactive element so it drifts a few pixels toward the cursor
 * while hovered and springs back on leave — the quiet "magnetic" pull that
 * makes a button feel considered rather than stock. Pull is clamped so it
 * never detaches from its label, and it no-ops under reduced motion.
 *
 * The wrapper never declares framer variants, so it stays inert inside a
 * parent's stagger (the enclosed Link/button still fades in with the group).
 */
export default function Magnetic({ children, className = "", strength = 0.35, max = 16 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.5 });

  if (reduced) return <span className={`inline-flex ${className}`}>{children}</span>;

  const clamp = (v) => (v > max ? max : v < -max ? -max : v);
  const move = (e) => {
    // mouse only: touch presses emit pointermove too, and a slightly-moving
    // finger would spring the button out from under its own tap
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.span>
  );
}
