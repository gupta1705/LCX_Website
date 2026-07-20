import Link from "next/link";

/**
 * Lights Camera Experiments (LCX) wordmark. A small gold cue triangle — the
 * "action" the name points at — sits ahead of the mark.
 *
 * Two text states, not just two sizes: collapsed shows the compact "LCX"
 * mark (there's no room to spell the name out at nav scale); `expanded`
 * (the menu-open state) spells the full name out, tracked caps with gold
 * dot separators, the way the submitted logo pairs its monogram with the
 * spelled-out name underneath — set on one line here since the nav pill is
 * horizontal, not stacked. Sized with `clamp()` rather than the fixed step
 * `size` uses, so it always fits one line down to narrow phones instead of
 * wrapping inside the pill.
 *
 * Built in the site's own type system (Schibsted Grotesk, gold-on-bone)
 * rather than importing the submitted logo's black-and-white geometric
 * treatment — the design system stays, only the name changes.
 */
export default function Logo({ className = "", size = "base", expanded = false }) {
  const textSize =
    size === "lg"
      ? "text-xl leading-none sm:text-2xl"
      : "text-[17px] leading-none sm:text-lg";
  return (
    <Link
      href="/"
      aria-label="Lights Camera Experiments, home"
      className={`group inline-flex items-center rounded-md ${className}`}
    >
      <span
        className={`inline-flex items-center gap-[0.35em] whitespace-nowrap font-semibold uppercase text-bone ${
          expanded
            ? "text-[clamp(10px,2.4vw,12px)] leading-none tracking-[0.16em]"
            : `tracking-tight ${textSize}`
        }`}
      >
        <svg
          viewBox="0 0 12 12"
          className="h-[0.6em] w-[0.6em] shrink-0 text-gold-400 transition-colors duration-300 group-hover:text-gold-300"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M1 1 L11 6 L1 11 Z" />
        </svg>
        {expanded ? (
          <span>
            Lights <span className="text-gold-400">·</span> Camera{" "}
            <span className="text-gold-400">·</span> Experiments
          </span>
        ) : (
          "LCX"
        )}
      </span>
    </Link>
  );
}
