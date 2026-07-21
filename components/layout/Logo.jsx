import Link from "next/link";

/**
 * Lights Camera Experiments (LCX) wordmark. A small gold cue triangle — the
 * "action" the name points at — sits ahead of the mark.
 *
 * Two states: collapsed shows the compact "LCX"; `expanded` (the menu-open
 * state) spells the full name out in tracked caps with gold dot separators.
 *
 * The morph between them is a CROSS-FADE, not a font-size tween. An earlier
 * version animated `font-size` while the text content swapped at the same
 * instant, which has no stable end state — the size got stuck and the swap
 * had to be made instant, which read as a jarring snap. Instead both labels
 * are rendered permanently at their OWN fixed sizes and the pill morphs by
 * animating each one's grid column between 0fr and 1fr (the reliable way to
 * transition an auto width) while opacity cross-fades. Nothing animates
 * font-size, so nothing can get stuck, and the nav pill's own width follows
 * the growing label as one continuous movement.
 *
 * The anchor carries an aria-label, so screen readers announce the name once
 * and never see both labels.
 */
export default function Logo({ className = "", size = "base", expanded = false }) {
  const lcxSize = size === "lg" ? "text-xl sm:text-2xl" : "text-[17px] sm:text-lg";

  // 0fr → 1fr is animatable; auto → auto is not. The inner span needs both
  // min-w-0 and overflow-hidden or the column refuses to collapse.
  const slot =
    "grid overflow-hidden transition-[grid-template-columns,opacity] duration-[420ms] ease-out-expo";
  const inner = "min-w-0 overflow-hidden whitespace-nowrap font-semibold uppercase text-bone";

  return (
    <Link
      href="/"
      aria-label="Lights Camera Experiments, home"
      className={`group inline-flex items-center rounded-md ${className}`}
    >
      <svg
        viewBox="0 0 12 12"
        className="mr-2 h-2.5 w-2.5 shrink-0 text-gold-400 transition-colors duration-300 group-hover:text-gold-300"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M1 1 L11 6 L1 11 Z" />
      </svg>

      {/* compact mark */}
      <span
        aria-hidden="true"
        className={`${slot} ${expanded ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"}`}
      >
        <span className={`${inner} tracking-tight ${lcxSize}`}>LCX</span>
      </span>

      {/* spelled out */}
      <span
        aria-hidden="true"
        className={`${slot} ${expanded ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"}`}
      >
        <span className={`${inner} text-[clamp(10px,2.4vw,12px)] leading-none tracking-[0.16em]`}>
          Lights <span className="text-gold-400">·</span> Camera{" "}
          <span className="text-gold-400">·</span> Experiments
        </span>
      </span>
    </Link>
  );
}
