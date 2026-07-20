import Link from "next/link";

/**
 * Lights Camera Experiments (LCX) wordmark. A small gold cue triangle — the
 * "action" the name points at — sits ahead of the compact "LCX" mark; there's
 * no room at nav scale to spell out the full name, so that lives in the
 * aria-label instead.
 *
 * Rebuilt in the site's own type system (Schibsted Grotesk, gold-on-bone)
 * rather than importing the submitted logo's black-and-white geometric
 * treatment — the design system stays, only the name changes. Both icon and
 * text sit inside one sized span so they scale together when the nav grows
 * the mark on open (`size="lg"`).
 */
export default function Logo({ className = "", size = "base" }) {
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
        className={`inline-flex items-center gap-[0.35em] font-semibold uppercase tracking-tight text-bone transition-[font-size] duration-300 ${textSize}`}
      >
        <svg
          viewBox="0 0 12 12"
          className="h-[0.6em] w-[0.6em] shrink-0 text-gold-400 transition-colors duration-300 group-hover:text-gold-300"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M1 1 L11 6 L1 11 Z" />
        </svg>
        LCX
      </span>
    </Link>
  );
}
