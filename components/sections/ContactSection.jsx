import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import StartProjectForm from "@/components/start/StartProjectForm";
import { SITE } from "@/lib/site";

const SOCIALS = ["Instagram", "LinkedIn", "YouTube", "X / Twitter"];

export default function ContactSection() {
  return (
    <div id="start" className="scroll-mt-24">
      <SectionHeader
        index="05"
        eyebrow="Start a project"
        title="Tell us what you're"
        accent="building."
        blurb="Whether it's one film or a content engine, we'll tell you how we'd do it. No decks, no runaround."
      />

      {/* Form + info */}
      <section className="container-px pb-24 pt-10 lg:pb-32">
        <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <StartProjectForm />
            </Reveal>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-gold-soft bg-ink-800 p-8 lg:p-10">
                {/* raking top light — same engraved-plate treatment as the Engine
                    readouts, replacing the old frosted-glass panel */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.05] to-transparent"
                />
                <div className="relative">
                <h4 className="text-balance font-serif text-[clamp(1.25rem,1.75vw,1.75rem)] font-medium leading-[1.2] tracking-tight text-bone">
                  We reply within 24 hours with a{" "}
                  <span className="italic text-gold-gradient">point of view</span>, not a sales
                  pitch.
                </h4>
                <p className="mt-4 text-base leading-relaxed text-bone-dim">
                  Every brief gets an answer from a human: how we&apos;d approach it, what it would
                  take, and whether we&apos;re the studio for it.
                </p>

                <div className="mt-8 border-t border-white/[0.07] pt-6">
                  <p className="text-sm text-bone-dim">Prefer email?</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-1 inline-block rounded-sm font-mono text-sm text-gold-300 transition-colors hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    {SITE.email}
                  </a>
                </div>

                <div className="mt-6 border-t border-white/[0.07] pt-6">
                  <p className="eyebrow mb-3">Find us</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {SOCIALS.map((s) => (
                      <span key={s} className="text-sm text-bone-dim">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </div>
  );
}
