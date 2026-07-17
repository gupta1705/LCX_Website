import Reveal from "@/components/ui/Reveal";

/**
 * Mid-page section header (single-page site). Renders an <h2> at section scale
 * — there is only one <h1> on the page (the hero). Opens each tab-section:
 * Capabilities, Work, About, Contact.
 *
 * The section names itself from the GUTTER — a folio, the way a ledger heads
 * its column — instead of as a small tracked kicker stacked on top of the
 * headline. That stack (tiny caps → giant line → muted deck, repeated
 * identically down the page) is the house style of every templated landing
 * page, and the whole point here is not to look like one. It also matches the
 * grammar the About section already uses internally (mark in the margin, prose
 * in the main column), so every section now hangs off one gridline: the folio
 * in columns 1–3, everything you read in 4–12.
 *
 * The numeral is set in the same oversized serif italic as the work index, so
 * the page numbers itself in one voice throughout.
 */
export default function SectionHeader({ index, eyebrow, title, accent, blurb }) {
  return (
    <div className="container-px pt-12 lg:pt-16">
      <div className="grid grid-cols-12 gap-y-6 lg:gap-x-16">
        <Reveal className="col-span-12 lg:col-span-3">
          <div className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-3">
            <span className="select-none font-serif text-[clamp(2.25rem,3vw,3.5rem)] italic leading-[0.75] tracking-[-0.04em] text-gold-gradient">
              {index}
            </span>
            <span aria-hidden="true" className="hidden h-px w-10 bg-gold-500/30 lg:block" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">
              {eyebrow}
            </span>
          </div>
        </Reveal>

        <div className="col-span-12 lg:col-span-9">
          <Reveal>
            <h2 className="max-w-4xl text-balance font-sans text-[clamp(2.2rem,5.75vw,6.75rem)] font-medium leading-[1.02] tracking-tightest text-bone">
              {title}
              {accent && (
                <>
                  {" "}
                  <span className="font-serif italic text-gold-gradient">{accent}</span>
                </>
              )}
            </h2>
          </Reveal>
          {blurb && (
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-bone-dim xl:max-w-3xl xl:text-xl">
                {blurb}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
