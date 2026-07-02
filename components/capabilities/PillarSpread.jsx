import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import PillarMeta from "./PillarMeta";
import { CTA } from "@/lib/site";

/**
 * One standard pillar "spread" in the ledger. DOM order is text-first for
 * screen readers; the left/right alternation is achieved ONLY with lg:order
 * utilities (never by reordering the DOM).
 *  - side="right" → visual sits on the RIGHT (default reading order)
 *  - side="left"  → visual sits on the LEFT at lg (text moves last)
 */
export default function PillarSpread({
  index,
  label,
  heading,
  desc,
  punchline,
  deliverables,
  ctaLabel,
  ctaHref = CTA.href,
  side = "right",
  frame,
}) {
  return (
    <section className="container-px py-24 lg:py-32">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Text — DOM first */}
        <Reveal
          className={`lg:col-span-5 ${side === "left" ? "lg:order-last" : ""}`}
        >
          <SectionLabel index={index}>{label}</SectionLabel>
          <span
            aria-hidden="true"
            className="mt-5 block font-sans text-[clamp(4rem,11vw,9rem)] font-medium leading-[0.85] tracking-tightest text-gold-gradient"
          >
            {index}
          </span>
          <h3 className="mt-2 font-sans text-3xl tracking-tighter text-bone sm:text-4xl lg:text-5xl">
            {heading}
          </h3>
          <p className="mt-5 max-w-md leading-relaxed text-bone-dim">{desc}</p>
          <p className="mt-6 border-l border-gold-500/40 pl-5 text-lg text-bone">
            {punchline}
          </p>
          <PillarMeta items={deliverables} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        </Reveal>

        {/* Visual */}
        <Reveal delay={0.07} className="lg:col-span-7">
          {frame}
        </Reveal>
      </div>
    </section>
  );
}
