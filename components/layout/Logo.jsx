import Link from "next/link";

/**
 * The Viral Labs wordmark — lowercase "the viral labs" with a gold thermometer
 * standing in for the "i" in "viral". The thermometer is an inline SVG using the
 * default baseline alignment (its bulb sits at the bottom of the viewBox, so it
 * lands on the text baseline like the letter it replaces). Mercury brightens on
 * hover — a quiet nod to going viral / heating up.
 */
export default function Logo({ className = "", size = "base" }) {
  const textSize =
    size === "lg"
      ? "text-xl leading-none sm:text-2xl"
      : "text-[17px] leading-none sm:text-lg";
  return (
    <Link
      href="/"
      aria-label="The Viral Labs, home"
      className={`group inline-flex items-center rounded-md ${className}`}
    >
      <span className={`font-semibold lowercase tracking-tight text-bone transition-[font-size] duration-300 ${textSize}`}>
        the&nbsp;v
        <svg
          viewBox="0 0 11 33"
          className="mx-[0.5px] inline h-[0.8em] w-auto text-gold-400 transition-colors duration-300 group-hover:text-gold-300"
          fill="none"
          aria-hidden="true"
        >
          <rect x="2.6" y="1.4" width="5.8" height="21.4" rx="2.9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M5.5 8v11"
            className="text-gold-200"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="5.5" cy="27.9" r="4.9" className="fill-gold-200" />
        </svg>
        ral&nbsp;labs
      </span>
    </Link>
  );
}
