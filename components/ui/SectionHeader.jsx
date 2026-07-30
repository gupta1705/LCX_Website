import Reveal from "@/components/ui/Reveal";

/**
 * Mid-page section header (single-page site). Renders an <h2> at section scale
 * — there is only one <h1> on the page (the hero). Opens each tab-section:
 * Capabilities, Work, About, Contact.
 *
 * Composition, not labels. The tiny tracked-caps eyebrow is gone for good (it
 * out-titled the title), so is the hairline rule that once sat above the
 * title (the page had accumulated a rule at every segment change and read as
 * ruled paper), and so is the oversized ghost-numeral section index that used
 * to sit on the title's baseline — three sections all carried one and it read
 * as a running page-number gimmick rather than texture. Whitespace and scale
 * mark the chapter now; no rule, no numeral, no label.
 *
 * `eyebrow` is still accepted and deliberately ignored.
 *
 * `center`, opt-in per call site: centers the title and blurb (mx-auto on
 * each's own max-w box, text-center for the type itself) instead of the
 * default left column. Off by default so this stays a per-section choice,
 * not a sitewide one.
 */
export default function SectionHeader({ title, accent, blurb, center = false }) {
  return (
    <div className="container-px pt-12 lg:pt-16">
      <Reveal>
        <div className={`pt-8 lg:pt-10 ${center ? "text-center" : ""}`}>
          <h2
            className={`max-w-4xl text-balance font-sans text-[clamp(2.2rem,5.75vw,6.75rem)] font-medium leading-[1.02] tracking-tightest text-bone ${center ? "mx-auto" : ""}`}
          >
            {title}
            {accent && (
              <>
                {" "}
                <span className="font-serif italic text-gold-gradient">{accent}</span>
              </>
            )}
          </h2>
          {blurb && (
            <p
              className={`mt-8 max-w-2xl text-balance text-lg leading-relaxed text-bone-dim lg:mt-12 xl:max-w-3xl xl:text-xl ${center ? "mx-auto" : ""}`}
            >
              {blurb}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
