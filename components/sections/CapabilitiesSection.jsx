import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import BrandStack from "@/components/capabilities/BrandStack";
import CapabilitiesScroll from "@/components/capabilities/CapabilitiesScroll";

export default function CapabilitiesSection() {
  return (
    // relative: the hero showreel's fade bleeds down behind this section's
    // heading, and the hero is positioned — so this has to be too, or the
    // static heading would paint underneath the footage instead of over it.
    <div id="capabilities" className="relative scroll-mt-24">
      <SectionHeader
        center
        eyebrow="What we make"
        title="We run two things"
        accent="at once."
        blurb="A studio that directs, and an engine that scales. Most shops can only do one."
      />

      {/* The Studio ↔ The Engine — pinned scroll morph */}
      <CapabilitiesScroll />

      {/* pb-20/72, not the old symmetric py-10/14: the closing line that used
          to live here carried its own mt-20 lg:mt-36 clearance before it, so
          removing the line without compensating would have collapsed the
          BrandStack-to-Work gap from ~313px down to ~56px. Reusing that
          mt-20/36 value as a first pass at bottom padding wasn't enough on
          its own, though: at a real 2000x1125 window, scrolling this row's
          own content (heading through the BrandStack card + its "Next
          brand" button) to dead center of the viewport still left "The
          Studio" 128px into view from the bottom — this section's bottom
          padding plus Work's own top padding (144+80=224px) wasn't covering
          the ~352px the row's height actually demands at that viewport.
          lg:pb-72 (288px, +80 from Work = 368px) clears it with margin. */}
      <section className="container-px pt-10 pb-20 lg:pt-14 lg:pb-72">
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
