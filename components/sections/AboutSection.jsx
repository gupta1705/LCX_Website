import Reveal from "@/components/ui/Reveal";
import PrinciplesPanels from "@/components/about/PrinciplesPanels";

export default function AboutSection() {
  return (
    <div id="about" className="scroll-mt-24">
      {/* The origin — centered, the sole statement in this slot now that
          "The approach" is gone. Matches the centered-coda convention already
          used in Work/Capabilities rather than staying left-column alone. */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="container-px">
          <Reveal>
            <div className="relative isolate mx-auto max-w-3xl text-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[45%] bg-ink-900/70 blur-2xl"
              />
              <h3 className="text-balance font-serif text-[clamp(1.75rem,4.5vw,4.75rem)] font-medium leading-[1.08] tracking-tight text-bone">
                Lights Camera Experiments started with{" "}
                <span className="gold-flow italic">a frustration.</span>
              </h3>
              <p className="mx-auto mt-6 max-w-[38rem] text-lg leading-relaxed text-bone-dim xl:text-xl">
                The world&apos;s best AI tools were in the hands of people who didn&apos;t
                understand why some things catch on and most don&apos;t. So we put them in the hands
                of{" "}
                <span className="gold-flow font-serif italic">people who do</span> — then
                built the machines to run it at scale.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How we think. Four opaque plates at staggered heights, one open at a
          time — hovering widens it and narrows the rest to spines. The plates
          occlude the attractor outright, so separation is z-order fact rather
          than contrast tuning. */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="container-px relative">
          <Reveal>
            <h3 className="max-w-4xl text-balance font-serif text-[clamp(2rem,4.5vw,4.75rem)] font-medium leading-[1.08] tracking-tight text-bone">
              Four principles,{" "}
              <span className="italic text-gold-gradient">one at a time.</span>
            </h3>
          </Reveal>

          <Reveal>
            <PrinciplesPanels />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
