import Reveal from "@/components/ui/Reveal";

/**
 * Mid-page section header (single-page site). Renders an <h2> at section scale
 * — there is only one <h1> on the page (the hero). Opens each tab-section:
 * Capabilities, Work, About, Contact.
 *
 * No eyebrow, no folio, no index. A tracked-caps mono mark set at 11px above a
 * 92px headline is not a title, it's decoration pretending to be one — and it
 * put the smallest type on the page in charge of the biggest. The headline
 * names the section. Nothing else needs to.
 *
 * `index` and `eyebrow` are still accepted so call sites don't break, and are
 * deliberately ignored.
 */
export default function SectionHeader({ title, accent, blurb }) {
  return (
    <div className="container-px pt-12 lg:pt-16">
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
  );
}
