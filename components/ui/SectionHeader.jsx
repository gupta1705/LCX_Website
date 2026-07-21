import Reveal from "@/components/ui/Reveal";

/**
 * Mid-page section header (single-page site). Renders an <h2> at section scale
 * — there is only one <h1> on the page (the hero). Opens each tab-section:
 * Capabilities, Work, About, Contact.
 *
 * Composition, not labels. The tiny tracked-caps eyebrow is gone for good (it
 * out-titled the title), and so is the hairline rule that once sat above the
 * title — the page had accumulated a rule at every segment change and read as
 * ruled paper. Whitespace and scale mark the chapter now.
 *
 * What carries it: the section index as an oversized GHOST NUMERAL in the
 * work-index voice (serif italic, barely-there bone), sat on the title's
 * baseline to the right. It's bigger than the headline, so it can never read
 * as its title — it's texture that numbers the chapter.
 *
 * `eyebrow` is still accepted and deliberately ignored.
 */
export default function SectionHeader({ index, title, accent, blurb }) {
  return (
    <div className="container-px pt-12 lg:pt-16">
      <Reveal>
        <div className="pt-8 lg:pt-10">
          <div className="flex items-end justify-between gap-10">
            <h2 className="max-w-4xl text-balance font-sans text-[clamp(2.2rem,5.75vw,6.75rem)] font-medium leading-[1.02] tracking-tightest text-bone">
              {title}
              {accent && (
                <>
                  {" "}
                  <span className="font-serif italic text-gold-gradient">{accent}</span>
                </>
              )}
            </h2>
            {index && (
              <span
                aria-hidden="true"
                className="hidden shrink-0 select-none font-serif text-[clamp(7rem,12vw,13rem)] italic leading-[0.72] tracking-[-0.04em] text-bone/[0.08] md:block"
              >
                {index}
              </span>
            )}
          </div>
          {blurb && (
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-bone-dim xl:max-w-3xl xl:text-xl">
              {blurb}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
