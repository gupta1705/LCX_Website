import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * Mid-page section header (single-page site). Renders an <h2> at section scale
 * — there is only one <h1> on the page (the hero). Used to open each
 * tab-section: Capabilities, Work, About, Contact.
 */
export default function SectionHeader({ index, eyebrow, title, accent, blurb }) {
  return (
    <div className="container-px pt-12 lg:pt-16">
      <Reveal>
        <div className="mb-6">
          <SectionLabel index={index} tone="gold">{eyebrow}</SectionLabel>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-4xl text-balance font-sans text-[clamp(2.2rem,6vw,6.5rem)] font-medium leading-[1.02] tracking-tightest text-bone">
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
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-bone-dim">
            {blurb}
          </p>
        </Reveal>
      )}
    </div>
  );
}
