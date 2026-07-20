import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import PrinciplesOrbit from "@/components/about/PrinciplesOrbit";

export default function AboutSection() {
  return (
    <div id="about" className="scroll-mt-24">
      <SectionHeader
        index="04"
        eyebrow="About"
        title="Inside the"
        accent="Lab."
        blurb="One team, two disciplines: a studio that directs and an engine that scales. Here's why we exist and how we think."
      />

      {/* The origin */}
      <section className="relative py-24 lg:py-32">
        <div className="container-px">
          <Reveal>
            <div className="relative isolate">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[45%] bg-ink-900/70 blur-2xl"
              />
              <h3 className="max-w-4xl text-balance font-serif text-[clamp(1.75rem,4.5vw,4.75rem)] font-medium leading-[1.08] tracking-tight text-bone">
                Lights Camera Experiments started with{" "}
                <span className="italic text-gold-gradient">a frustration.</span>
              </h3>
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-bone-dim xl:max-w-2xl xl:text-xl">
                The world&apos;s best AI tools were in the hands of people who didn&apos;t
                understand why some things catch on and most don&apos;t. So we put them in the hands
                of{" "}
                <span className="font-serif italic text-gold-gradient">people who do</span> — then
                built the machines to run it at scale.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The approach (the wedge, expanded) */}
      <section className="relative py-24 lg:py-32">
        <div className="container-px">
          <Reveal>
            <div className="relative isolate">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[45%] bg-ink-900/70 blur-2xl"
              />
              <h3 className="max-w-4xl text-balance font-serif text-[clamp(1.75rem,4.5vw,4.75rem)] font-medium leading-[1.08] tracking-tight text-bone">
                We{" "}
                <span className="italic text-gold-gradient">
                  direct like a studio and ship like a system.
                </span>
              </h3>
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-bone-dim xl:max-w-2xl xl:text-xl">
                Storytellers set the hook, the craft, the emotion; the engine produces it at a scale
                and speed that didn&apos;t exist two years ago, and keeps producing long after the
                launch.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How we think. No background of its own: the page's attractor IS the
          theme, and a second full-bleed field only ever fought it. The orbit
          is the section's visual — it doesn't need a stage built under it. */}
      <section className="relative py-24 lg:py-32">
        <div className="container-px relative">
          <Reveal>
            <h3 className="max-w-4xl text-balance font-serif text-[clamp(2rem,4.5vw,4.75rem)] font-medium leading-[1.08] tracking-tight text-bone">
              Four principles,{" "}
              <span className="italic text-gold-gradient">always in orbit.</span>
            </h3>
          </Reveal>
          <Reveal>
            {/* the affordance cue, in sentence case at body scale — a hint, not
                a tracked-caps mark impersonating a title */}
            <p className="mt-5 text-base text-bone-faint">Tap a node to open it.</p>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <PrinciplesOrbit />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing one-liner */}
      <section className="container-px pb-8 pt-4 lg:pb-12">
        <Reveal>
          <div className="relative isolate max-w-3xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[45%] bg-ink-900/70 blur-2xl"
            />
            <p className="text-balance font-sans text-[clamp(1.5rem,3.5vw,3.75rem)] font-normal leading-[1.25] tracking-tighter text-bone">
              The tools get better every week. Knowing{" "}
              <span className="font-serif italic text-gold-gradient">why it works</span> doesn&apos;t
              come in an update.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
