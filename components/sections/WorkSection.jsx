import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import VideoFrame from "@/components/capabilities/VideoFrame";
import WorkGallery from "@/components/work/WorkGallery";

// Labs Experiments — generic sectors only, no real/invented brand names.
const EXPERIMENTS = [
  {
    projectName: "Launch film + platform cutdowns",
    client: "DTC skincare brand",
    category: "Video",
    problem: "A single product launch needed a month of always-on video, not one hero spot.",
    did: [
      "Built one cinematic hero film from a single brief",
      "Auto-recut it into three platform-native cutdowns",
      "Scheduled a month of organic from that one shoot",
    ],
    result: "~12M views",
    resultType: "number",
    icon: "Clapperboard",
    featured: true,
  },
  {
    projectName: "Always-on performance engine",
    client: "Fintech app",
    category: "Marketing",
    problem: "Paid social burned through ad creative faster than a team could make it.",
    did: [
      "Generated hundreds of on-brand variants from one brief",
      "Refreshed the live set weekly against fatigue",
      "Kept every variant inside brand guardrails",
    ],
    result: "~3x ROAS",
    resultType: "number",
    icon: "Megaphone",
    featured: false,
  },
  {
    projectName: "Infinite campaign key visuals",
    client: "Premium coffee label",
    category: "Images",
    problem: "Every campaign needed a full studio shoot the brand couldn't keep funding.",
    did: [
      "Generated packshots and key visuals on demand",
      "Held one consistent look across the whole set",
      "Delivered any aspect ratio without a reshoot",
    ],
    result: "A full key-visual set, any ratio, on demand",
    resultType: "visual",
    icon: "Aperture",
    featured: false,
  },
  {
    projectName: "Source-to-publish content pipeline",
    client: "B2B SaaS team",
    category: "Automation",
    problem: "Shipping channel-native content still needed a producer in the loop every time.",
    did: [
      "Wired a source-to-publish content system",
      "Templated brand voice and format per channel",
      "Added a human-approval gate before anything ships",
    ],
    result: "A source-to-publish system, content shipped end to end",
    resultType: "visual",
    icon: "Workflow",
    featured: false,
  },
  {
    projectName: "Performance UGC at scale",
    client: "Mobile game studio",
    category: "Video",
    problem: "Paid-social testing starved without a steady feed of fresh UGC-style ads.",
    did: [
      "Spun up UGC-style ad variants every week",
      "Matched each variant to a paid-social test cell",
      "Turned new concepts around inside two days",
    ],
    result: "A weekly variant wall, proof is the volume on screen",
    resultType: "visual",
    icon: "Clapperboard",
    featured: false,
  },
  {
    projectName: "Recurring brand character set",
    client: "Apparel brand",
    category: "Images",
    problem: "A brand mascot had to stay perfectly consistent across every channel and pose.",
    did: [
      "Locked one character design as the source reference",
      "Rendered it across many poses and scenes",
      "Output any ratio on demand, always on brand",
    ],
    result: "A consistent character sheet, proof lives in the visual",
    resultType: "visual",
    icon: "Aperture",
    featured: false,
  },
];

export default function WorkSection() {
  return (
    <div id="work" className="scroll-mt-24">
      <SectionHeader
        index="03"
        eyebrow="Selected work"
        title="Proof beats"
        accent="promises."
        blurb="These are Labs Experiments: self-initiated spec films and systems that show how the studio works across video, marketing, images and automation. Sectors are generic placeholders and any figures are illustrative until we swap in named client work."
      />

      {/* Showreel */}
      <section className="relative py-16 lg:py-24">
        <div className="container-px">
          <Reveal>
            <SectionLabel index="01">Showreel</SectionLabel>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-dim">
              One reel, cut from the experiments below. The fastest way to see how the pipeline
              moves from brief to finished frame. The reel is in production; for now the experiments
              stand in for it.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <VideoFrame
              caption="Studio showreel, coming soon"
              ariaLabel="Play the studio showreel, start a project (showreel coming soon)"
            />
          </Reveal>
        </div>
      </section>

      {/* Labs Experiments — filterable grid */}
      <section className="relative py-16 lg:py-24">
        <div className="container-px">
          <Reveal>
            <SectionLabel index="02">Labs Experiments</SectionLabel>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-dim">
              Self-initiated spec work across the four capabilities. Each experiment states the
              problem, what we did, and the result: a figure where we have one, a finished frame
              where the proof is visual.
            </p>
          </Reveal>
          <WorkGallery cases={EXPERIMENTS} />
        </div>
      </section>
    </div>
  );
}
