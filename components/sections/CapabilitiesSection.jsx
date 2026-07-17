import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import BrandStack from "@/components/capabilities/BrandStack";
import CapabilitiesScroll from "@/components/capabilities/CapabilitiesScroll";

export default function CapabilitiesSection() {
  return (
    <div id="capabilities" className="scroll-mt-24">
      <SectionHeader
        index="02"
        eyebrow="What we make"
        title="We run two things"
        accent="at once."
        blurb="A studio that directs, and an engine that scales. Most shops can only do one."
      />

      {/* The Studio ↔ The Engine — pinned scroll morph */}
      <CapabilitiesScroll />

      <section className="container-px py-10 lg:py-14">
        {/* Brands we have worked with — across both the studio and the engine */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500/40" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-300">
                  Brands we have worked with
                </span>
              </div>
              <h3 className="mt-6 max-w-lg text-balance text-[clamp(1.75rem,3.25vw,3.25rem)] font-medium leading-[1.15] tracking-tighter text-bone">
                Films directed by the <span className="text-gold-gradient">Studio</span>, content scaled
                by the <span className="text-gold-gradient">Engine</span>, for brands across sectors.
              </h3>
            </div>
            <div className="lg:col-span-7">
              <BrandStack />
            </div>
          </div>
        </Reveal>

        {/* Closing — big centered impact line */}
        <Reveal className="mt-20 lg:mt-36">
          <p className="mx-auto max-w-5xl text-balance text-center font-serif text-[clamp(1.5rem,3.5vw,3.75rem)] leading-[1.12] tracking-tight text-bone">
            Whatever you&apos;re launching, we can{" "}
            <span className="gold-flow italic" style={{ animationDelay: "0s" }}>
              direct it or scale it
            </span>
            , usually both.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
