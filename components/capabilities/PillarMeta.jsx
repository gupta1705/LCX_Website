import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CTA } from "@/lib/site";

/**
 * Shared "What you get" deliverables list + per-pillar CTA, so every pillar
 * shares identical structure, spacing and a11y.
 * - ctaVariant="link"    → mono uppercase text-link (Marketing / Images / Automation)
 * - ctaVariant="primary" → filled gold pill (AI Video flagship only)
 */
export default function PillarMeta({
  items,
  ctaLabel,
  ctaHref = CTA.href,
  ctaVariant = "link",
  label = "What you get",
}) {
  return (
    <div className="mt-8">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-300">
        {label}
      </p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-3 text-sm text-bone-dim">
            <span className="h-1 w-1 shrink-0 rounded-full bg-gold-400" />
            {it}
          </li>
        ))}
      </ul>

      <div className="mt-7">
        {ctaVariant === "primary" ? (
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-medium text-ink-900 transition-all duration-300 hover:bg-gold-300 hover:shadow-[0_0_42px_-8px_rgba(233,185,106,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ) : (
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-1.5 rounded-sm font-mono text-xs uppercase tracking-[0.2em] text-gold-200 transition-colors duration-200 hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
