import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import NebulaField from "@/components/ui/NebulaField";
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
          <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-4">
              <Reveal className="mb-8">
                <SectionLabel index="01">The origin</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="font-serif text-2xl italic leading-snug text-gold-gradient">
                  Why we exist.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-10 hidden lg:block">
                <svg viewBox="0 0 120 120" className="h-28 w-28 text-gold-500/60" fill="none" aria-hidden="true">
                  <path d="M8 86 C 40 86, 60 30, 112 30" stroke="currentColor" strokeWidth="1" />
                  <path d="M8 30 C 40 30, 60 86, 112 86" stroke="currentColor" strokeWidth="1" />
                  <circle cx="60" cy="58" r="3.5" className="fill-gold-200" />
                  <circle cx="60" cy="58" r="11" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
                </svg>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <Reveal>
                <div className="relative isolate">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[45%] bg-ink-900/70 blur-2xl"
                  />
                  <p className="text-balance font-sans text-[clamp(1.7rem,4vw,4.25rem)] font-normal leading-[1.22] tracking-tighter text-bone">
                    The Viral Labs started with a frustration: the world&apos;s best AI tools were in
                    the hands of people who didn&apos;t understand why some things go viral and most
                    don&apos;t. So we put them in the hands of{" "}
                    <span className="font-serif italic text-gold-gradient">people who do</span> — then
                    built the machines to run it at scale.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* The approach (the wedge, expanded) */}
      <section className="relative py-24 lg:py-32">
        <div className="container-px">
          <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-4">
              <Reveal>
                <SectionLabel index="02">The approach</SectionLabel>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <Reveal>
                <div className="relative isolate">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[45%] bg-ink-900/70 blur-2xl"
                  />
                  <p className="text-balance font-sans text-[clamp(1.6rem,3.75vw,4rem)] font-normal leading-[1.25] tracking-tighter text-bone">
                    We{" "}
                    <span className="font-serif italic text-gold-gradient">
                      direct like a studio and ship like a system.
                    </span>{" "}
                    Storytellers set the hook, the craft, the emotion; the engine produces it at a
                    scale and speed that didn&apos;t exist two years ago, and keeps producing long
                    after the launch.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How we think — the nebula band. A full-bleed gold cloud field
          interrupts the attractor that runs behind the rest of the page, so the
          section still reads as its own plate; the orbit is inked for it
          inside PrinciplesOrbit. */}
      <section className="relative isolate overflow-hidden border-y border-gold-500/15 bg-ink-900 py-24 text-bone lg:py-32">
        {/* stand-in for the field if WebGL2 is unavailable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(120%_90%_at_50%_50%,rgba(169,118,46,0.16),#0A0908_70%)]"
        />
        <NebulaField className="absolute inset-0 -z-10 h-full w-full" />
        {/* scrim — the type and the orbit stay legible over the clouds */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(80%_65%_at_50%_55%,rgba(10,9,8,0.7),rgba(10,9,8,0.3)_68%,transparent)]"
        />
        <div className="container-px relative">
          <Reveal>
            <SectionLabel index="03">How we think</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="mt-6 max-w-3xl text-balance font-sans text-[clamp(2rem,4.5vw,4.75rem)] font-medium leading-[1.05] tracking-tightest text-bone">
              Four principles,{" "}
              <span className="font-serif italic text-gold-gradient">always in orbit.</span>
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.28em] text-bone-faint">
              Tap a node to open it.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-4">
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
