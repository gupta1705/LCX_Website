import { Plus } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import { SERVICE_GROUPS } from "@/lib/services";
import ServiceContact from "./ServiceContact";

export default function ServicesSection() {
  return (
    <section id="services" aria-label="Our services" className="relative scroll-mt-24 pb-24 lg:pb-40">
      <SectionHeader
        title="More ways to"
        accent="make it happen."
        blurb="Repurpose what you have. Create what comes next. Build the systems that keep it moving. Explore all 18 LCX services."
      />
      <div className="container-px mt-14 lg:mt-20">
        {SERVICE_GROUPS.map((group, index) => (
          <Reveal key={group.id}>
            <details open={index === 0} className="group border-t border-gold-500/25 bg-ink-900/80">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 pr-2 transition-colors hover:text-gold-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300 md:py-10 [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans text-[clamp(1.5rem,3.1vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-bone group-open:text-gold-200">
                  {group.title}
                </h3>
                <span className="flex shrink-0 items-center gap-4 md:gap-8">
                  <span className="hidden font-mono text-xs uppercase tracking-[0.14em] text-bone-dim sm:inline">{group.services.length} services</span>
                  <Plus aria-hidden="true" className="h-6 w-6 text-gold-300 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none" />
                </span>
              </summary>
              <div className="pb-12 lg:pb-16">
                <p className="max-w-2xl text-lg leading-relaxed text-bone-dim">{group.intro}</p>
                <div className="mt-9 grid gap-x-16 sm:grid-cols-2 xl:gap-x-24">
                  {group.services.map((service) => (
                    <article key={service.name} className="border-t border-white/10 py-7 lg:py-9">
                      <h4 className="max-w-lg font-serif text-2xl leading-tight text-bone lg:text-3xl">{service.name}</h4>
                      <p className="mt-3 max-w-lg text-base leading-relaxed text-bone-dim">{service.description}</p>
                    </article>
                  ))}
                </div>
                <ServiceContact group={{ id: group.id, title: group.title }} />
              </div>
            </details>
          </Reveal>
        ))}
        <div className="border-t border-gold-500/25 pt-7 text-sm leading-relaxed text-bone-dim">
          One service or a connected system. We’ll help you find the right starting point.
        </div>
      </div>
    </section>
  );
}
