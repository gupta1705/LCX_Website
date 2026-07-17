"use client";

import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * The site's button — one mechanic everywhere: a bead sits in the pill at rest,
 * and on hover it floods the whole button while the label swaps for
 * label + arrow.
 *
 * Rebuilt natively rather than dropped in: this project is JSX with its own
 * tokens, so there's no `cn`, no `bg-background`/`bg-primary` CSS vars, and no
 * fixed `w-32` (our labels are longer than the word "Button"). Two differences
 * from the reference worth keeping:
 *
 *  - The flood is a scale() on a circle sized in % of the button, anchored on
 *    the bead. It clears any label length, at any width, and animates transform
 *    and opacity only — the original grew left/top/width/height, which are
 *    layout properties and jank.
 *  - Two tones, one mechanic. `primary` is the gold CTA and inverts to ink;
 *    `secondary` is the quiet one and floods gold. The page keeps a single
 *    button language without flattening the CTA hierarchy into one look.
 */

const TONES = {
  primary: {
    shell: "border border-gold-400/50 bg-gold-500 text-ink-900",
    bead: "bg-ink-900/80",
    flood: "bg-ink-900",
    swap: "text-gold-200",
    icon: "text-ink-900",
  },
  secondary: {
    shell: "border border-gold-soft bg-ink-800 text-bone",
    bead: "bg-gold-400",
    flood: "bg-gold-500",
    swap: "text-ink-900",
    icon: "text-gold-300",
  },
};

// Sizes are a prop, not a className override: without tailwind-merge a passed
// `px-*` would collide with the base one and CSS order — not class order —
// would pick the winner.
const SIZES = {
  md: "px-8 py-3.5 text-sm",
  lg: "px-9 py-4 text-sm",
};

const ActionButton = forwardRef(function ActionButton(
  { as: As = "button", tone = "primary", size = "md", icon: Icon, children, className = "", ...props },
  ref,
) {
  const t = TONES[tone] ?? TONES.primary;

  return (
    <As
      ref={ref}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-colors duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 active:scale-[0.97] ${t.shell} ${SIZES[size] ?? SIZES.md} ${className}`}
      {...props}
    >
      {/* the bead at rest */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${t.bead} transition-opacity duration-200 ease-out group-hover:opacity-0`}
      />

      {/* the flood — anchored on the bead, 260% of the button wide, so its
          radius always clears the far edge whatever the label says */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-4 top-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full ${t.flood} transition-transform duration-500 ease-out-expo group-hover:scale-100`}
      />

      {/* the label at rest — nudges right and clears out */}
      <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 ease-out-expo group-hover:translate-x-3 group-hover:opacity-0">
        {Icon && <Icon className={`h-4 w-4 shrink-0 ${t.icon}`} aria-hidden="true" />}
        {children}
      </span>

      {/* the label on hover — slides in behind it, same direction, with the
          arrow. aria-hidden: the resting label above is the accessible name */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 z-10 inline-flex -translate-x-3 items-center justify-center gap-2 opacity-0 transition-all duration-300 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100 ${t.swap}`}
      >
        {children}
        <ArrowUpRight className="h-4 w-4 shrink-0" />
      </span>
    </As>
  );
});

export default ActionButton;
