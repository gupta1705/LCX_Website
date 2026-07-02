"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { CTA } from "@/lib/site";

/**
 * The AI-Video flagship 16:9 framed placeholder. A CSS gold-radial fallback
 * means it never ships empty. The Play affordance links to the #start contact
 * section (via CTA.href) — honest aria-label, there is no real reel yet. The
 * idle halo is suppressed under prefers-reduced-motion.
 */
export default function VideoFrame({
  caption = "Showreel, coming soon",
  href = CTA.href,
  ariaLabel = "Play the AI Video showreel, start a project",
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="group relative mt-10 aspect-video w-full overflow-hidden rounded-3xl border border-gold-soft bg-ink-900/60 backdrop-blur-sm">
      {/* never-empty fallback */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_0%,rgba(201,146,61,0.16),transparent_60%)]" />
      {/* inner hairline ring */}
      <div className="pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-white/10" />
      {/* gold wash on hover */}
      <span className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/0 blur-3xl transition-all duration-700 group-hover:bg-gold-500/15" />

      <Link
        href={href}
        aria-label={ariaLabel}
        className="absolute inset-0 grid place-items-center focus-visible:outline-none"
      >
        <span className="relative grid h-20 w-20 place-items-center rounded-full border border-gold-soft bg-ink-800/70 text-gold-200 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-ink-900 group-focus-visible:ring-2 group-focus-visible:ring-gold-400">
          {!reduced && (
            <span className="absolute inset-0 animate-ping rounded-full bg-gold-500/25" />
          )}
          <Play className="relative ml-0.5 h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
        </span>
      </Link>

      <span className="pointer-events-none absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.28em] text-bone-dim">
        {caption}
      </span>
    </div>
  );
}
