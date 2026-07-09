import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";

const PRINCIPLES = [
  {
    pre: "",
    accent: "Story",
    post: " over spectacle.",
    blurb:
      "The idea and the emotion do the work. A flawless render that says nothing never leaves the building.",
  },
  {
    pre: "Speed is a ",
    accent: "feature",
    post: ".",
    blurb:
      "Momentum is part of the value, not a compromise on it. We move at the speed of the platform, not the agency.",
  },
  {
    pre: "Build ",
    accent: "machines",
    post: ", not deliverables.",
    blurb:
      "We ship the system that makes the content, not a folder of one-off assets. The engine outlasts the campaign.",
  },
  {
    pre: "Stay on the ",
    accent: "edge",
    post: ".",
    blurb:
      "We live on the frontier of what these models can do. The edge moves every week, so do we.",
  },
];

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

      {/* How we think (numbered manifesto rows) */}
      <section className="relative py-24 lg:py-32">
        <div className="container-px">
          <Reveal>
            <SectionLabel index="03">How we think</SectionLabel>
          </Reveal>

          <ol className="mt-14 divide-y divide-white/[0.06] border-t border-white/[0.06]">
            {PRINCIPLES.map((p, i) => (
              <li key={p.accent}>
                <Reveal delay={i * 0.07}>
                  <article className="group relative grid grid-cols-1 gap-x-10 gap-y-4 py-10 lg:grid-cols-12 lg:py-14">
                    <span
                      aria-hidden="true"
                      className="font-sans text-[clamp(2.5rem,6vw,7rem)] font-medium leading-none tracking-tightest text-gold-gradient opacity-90 lg:col-span-2"
                    >
                      0{i + 1}
                    </span>
                    <h3 className="font-sans text-2xl tracking-tighter text-bone sm:text-3xl lg:col-span-6">
                      {p.pre}
                      <span className="font-serif italic text-gold-gradient">{p.accent}</span>
                      {p.post}
                    </h3>
                    <p className="max-w-sm leading-relaxed text-bone-dim lg:col-span-4">{p.blurb}</p>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold-500 to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                    />
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
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
