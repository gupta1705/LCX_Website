import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import BrandStack from "@/components/capabilities/BrandStack";
import CapabilitiesScroll from "@/components/capabilities/CapabilitiesScroll";

export default function CapabilitiesSection() {
  return (
    <div id="capabilities" className="scroll-mt-24">
      <SectionHeader
        eyebrow="What we make"
        title="We run two things"
        accent="at once."
        blurb="A studio that directs, and an engine that scales. Most shops can only do one."
      />

      {/* The Studio ↔ The Engine — pinned scroll morph */}
      <CapabilitiesScroll />

      {/* pb-20/36, not the old symmetric py-10/14: the closing line that used
          to live here carried its own mt-20 lg:mt-36 clearance before it, so
          removing the line without compensating would have collapsed the
          BrandStack-to-Work gap from ~313px down to ~56px. Reusing that same
          mt-20/36 value as the section's own bottom padding keeps the
          breathing room the line was providing, without the line. */}
      <section className="container-px pt-10 pb-20 lg:pt-14 lg:pb-36">
        {/* Brands we have worked with — across both the studio and the engine */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-5">
              <h3 className="max-w-lg text-balance font-serif text-[clamp(1.75rem,3.25vw,3.25rem)] font-medium leading-[1.15] tracking-tight text-bone">
                Films directed by the <span className="text-gold-gradient">Studio</span>, content scaled
                by the <span className="text-gold-gradient">Engine</span>, for brands across sectors.
              </h3>
            </div>
            <div className="lg:col-span-7">
              <BrandStack />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
