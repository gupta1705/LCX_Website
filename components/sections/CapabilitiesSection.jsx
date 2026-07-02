import Link from "next/link";
import { Megaphone, Aperture, Workflow, Play } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CountUp from "@/components/ui/CountUp";
import PillarSpread from "@/components/capabilities/PillarSpread";
import PillarFrame from "@/components/capabilities/PillarFrame";
import PillarMeta from "@/components/capabilities/PillarMeta";
import VideoFrame from "@/components/capabilities/VideoFrame";
import { CTA } from "@/lib/site";

const VIDEO_DELIVERABLES = [
  "Brand films & hero spots",
  "Product videos & explainers",
  "UGC-style performance ads",
  "AI presenters & brand avatars",
  "Dubbing & localization, any language",
  "Platform-native cutdowns at scale",
];

const VIDEO_SAMPLES = ["Brand film", "UGC ad", "Explainer", "AI presenter"];

const TOOLS = [
  { pillar: "AI Marketing", tools: ["Meta Advantage+", "Google PMax", "GA4", "Claude", "ChatGPT"] },
  {
    pillar: "AI Video",
    tools: ["Runway Gen-4", "Google Veo 3", "OpenAI Sora", "Kling 2.0", "Luma", "HeyGen", "ElevenLabs", "Topaz"],
  },
  { pillar: "AI Images", tools: ["Midjourney v7", "FLUX.1", "Adobe Firefly", "Magnific", "Ideogram"] },
  { pillar: "AI Automation", tools: ["n8n", "Make", "LangGraph", "Zapier", "Custom agents"] },
];

export default function CapabilitiesSection() {
  return (
    <div id="capabilities" className="scroll-mt-24">
      <SectionHeader
        index="02"
        eyebrow="Capabilities"
        title="Four things we do"
        accent="better, faster, cheaper."
        blurb="Performance, video, visuals, and the systems behind them, engineered better, faster, and cheaper than anyone still running yesterday's playbook. Pick a lane, or run all four."
      />

      {/* 01 — AI Marketing (visual right) */}
      <PillarSpread
        index="01"
        label="AI Marketing"
        side="right"
        heading={
          <>
            Hundreds of on-brand{" "}
            <span className="font-serif italic text-gold-gradient">variants</span>, from one brief
          </>
        }
        desc="Performance creative, ad campaigns, social-first content, endless on-brand variations, and localized versions for every market."
        punchline="Hundreds of on-brand ad variants in the time it takes to brief one."
        deliverables={[
          "Always-on performance ad creative",
          "Endless variants from a single brief",
          "Social-first, channel-native content",
          "Localized versions for every market",
        ]}
        ctaLabel="Brief a campaign"
        frame={<PillarFrame variant="single" Icon={Megaphone} caption="Ad variants / localized" />}
      />

      {/* 02 — AI Video — THE FLAGSHIP */}
      <section className="relative py-28 lg:py-40">
        <div className="container-px">
          <Reveal className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 right-0 select-none font-sans text-[clamp(8rem,22vw,18rem)] font-medium leading-none tracking-tightest text-gold-gradient opacity-10"
            >
              02
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <SectionLabel index="02">AI Video</SectionLabel>
              <span className="rounded-full border border-gold-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-300">
                Flagship
              </span>
            </div>
            <h3 className="mt-6 max-w-3xl font-sans text-4xl tracking-tightest text-bone sm:text-5xl lg:text-6xl">
              <span className="font-serif italic text-gold-gradient">Cinematic</span> video, without the
              cinematic timeline
            </h3>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone-dim">
              Brand films, product videos, explainers, UGC-style ads, AI presenters and avatars, plus
              dubbing and localization for every market.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <VideoFrame />
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <p className="border-l border-gold-500/40 pl-6 text-xl leading-relaxed text-bone">
                Cinematic video, without the cinematic timeline, or the budget.
              </p>
              <div className="mt-10">
                <p className="font-sans text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-tightest text-gold-gradient">
                  <CountUp to={48} suffix="h" />
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.28em] text-bone-faint">
                  From script to first cut
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.07} className="lg:col-span-5">
              <PillarMeta items={VIDEO_DELIVERABLES} ctaLabel="Start a video project" ctaVariant="primary" />
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-14">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {VIDEO_SAMPLES.map((s) => (
                <Link
                  key={s}
                  href={CTA.href}
                  aria-label={`AI Video, ${s.toLowerCase()}: start a project`}
                  className="group relative grid aspect-video place-items-center rounded-xl border border-white/[0.07] bg-ink-800/60 transition-all duration-500 ease-out-expo hover:border-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
                >
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <span className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-500/0 blur-3xl transition-all duration-700 group-hover:bg-gold-500/15" />
                  </span>
                  <Play
                    className="absolute h-5 w-5 text-gold-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">
                    {s}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — AI Images (visual left) */}
      <PillarSpread
        index="03"
        label="AI Images"
        side="left"
        heading={
          <>
            Studio-grade visuals,{" "}
            <span className="font-serif italic text-gold-gradient">infinitely</span>, on demand
          </>
        }
        desc="Campaign visuals, product photography, packshots, brand mascots and characters, and social creatives."
        punchline="Studio-grade visuals, infinitely, on demand."
        deliverables={[
          "Campaign key visuals",
          "Product photography & packshots",
          "Brand mascots & recurring characters",
          "On-brand social creatives, any ratio",
        ]}
        ctaLabel="Generate visuals"
        frame={<PillarFrame variant="gallery" Icon={Aperture} caption="Key visual / packshot / mascot / social" />}
      />

      {/* 04 — AI Automation (visual right) */}
      <PillarSpread
        index="04"
        label="AI Automation"
        side="right"
        heading={
          <>
            We don&apos;t just make content. We build the{" "}
            <span className="font-serif italic text-gold-gradient">machine</span>
          </>
        }
        desc="Content pipelines, auto-publishing systems, custom AI agents and workflows, chatbots, and internal tooling."
        punchline="We don't just make content. We build the system that makes it for you, forever."
        deliverables={[
          "Custom content pipelines",
          "Auto-publishing & scheduling systems",
          "Bespoke AI agents & workflows",
          "Chatbots & internal tooling",
        ]}
        ctaLabel="Build your system"
        frame={<PillarFrame variant="diagram" Icon={Workflow} caption="Source → Agent → Publish" />}
      />

      {/* Tools we build on */}
      <section className="relative py-20 lg:py-28">
        <div className="container-px">
          <Reveal>
            <SectionLabel index="05">Tools we build on</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-md font-mono text-[11px] uppercase tracking-[0.28em] text-bone-faint">
              A live 2026 stack, not a reseller&apos;s single app.
            </p>
          </Reveal>

          <div className="mt-12 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {TOOLS.map((row, i) => (
              <Reveal key={row.pillar} delay={i * 0.07}>
                <dl className="grid grid-cols-1 items-baseline gap-x-8 gap-y-3 py-6 md:grid-cols-[170px_1fr]">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-300">
                    {row.pillar}
                  </dt>
                  <dd className="m-0 flex flex-wrap gap-2">
                    {row.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-bone-dim"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </dl>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
