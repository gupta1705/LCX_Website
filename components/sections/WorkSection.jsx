import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import FilmCard from "@/components/work/FilmCard";
import SystemCard from "@/components/work/SystemCard";

/*
  SWAP-IN CHECKLIST (placeholders in [brackets] are meant to be replaced):
   • Films: add `youtubeId: "abc123"` to embed a YouTube video, or `href` for an
     external watch link (Instagram, Vimeo). Instagram reels can't be embedded
     inline without pulling in Meta's embed script, so those get a `thumbnail`
     image instead, and the whole poster links out on click.
   • Coffee Monster: drop a real cover frame at /public/work/coffee-monster.jpg
     (any still from the reel works) so `thumbnail` below has something to load.
   • Chaayos: drop the brand logo at /public/work/chaayos-logo.png so its
     `thumbnail` below has something to load; the click-to-play embed still works.
   • Order The Studio to LEAD with the most finished, best-lit spec ad.
   • Stats live on the Engine side only. No view/follower counts on films.
     Fill the [1 video -> N clips] and [X posts] figures once known, and set
     the ParsecDaily `href` to the live channel.
*/

const FILMS = [
  {
    title: "Chaayos",
    tag: "Concept film",
    blurb:
      "A cinematic spot for a brand we love. Concept film, self-initiated, not affiliated with Chaayos.",
    youtubeId: "JCCdgJLM_Ag",
    thumbnail: "/work/chaayos-logo.png", // drop the brand logo here, see checklist above
    thumbnailBg: "#018c36", // sampled from the logo's own background, blends the contain-fit margin
  },
  {
    title: "Laxmipati Sarees",
    tag: "Concept film",
    blurb:
      "Premium, traditional, and shot without a set. Concept film, self-initiated, not affiliated with Laxmipati.",
    youtubeId: "q7iT_ydwMNw",
    thumbnail: "/work/laxmipati-logo.png",
    thumbnailBg: "#fefefe", // sampled from the logo's own background
  },
  {
    title: "Coffee Monster",
    tag: "Original series",
    status: "Live on Instagram",
    blurb: "An animated micro-drama we write, produce, and publish ourselves.",
    linkLabel: "Watch on Instagram",
    href: "https://www.instagram.com/reel/DY9v1M6tWn-/",
    thumbnail: "/work/coffee-logo.png",
    thumbnailBg: "#000000", // sampled from the logo's own background
  },
  {
    title: "The PukiPoo Song",
    tag: "Original animation",
    blurb: "Kids' animation, start to finish.",
    linkLabel: "Watch on YouTube",
    youtubeId: "etNaSpG-Ob8",
  },
];

const SYSTEMS = [
  {
    name: "ReelForge",
    blurb:
      "Feed it one long-form video; it cuts the sharpest short-form moments and mass-publishes across accounts, automatically. The content pipeline we sell, running in our own house first.",
    specs: [
      { k: "Input", v: "One long-form video" },
      { k: "Output", v: "Cut for every channel it runs on" },
      { k: "Runs", v: "On every new upload" },
    ],
  },
  {
    name: "ParsecDaily",
    live: true,
    blurb:
      "A daily Instagram channel that runs with zero human input, sourced, produced, and posted by the machine.",
    specs: [
      { k: "Sourcing", v: "Automatic" },
      { k: "Publishing", v: "Daily" },
      { k: "Manual uploads", v: "Zero" },
    ],
    linkLabel: "See it live",
    // href: "https://instagram.com/...",
  },
];

/**
 * Chapter divider — a rule, the chapter's name at heading scale, and what's in
 * it as a deck beneath. The sub used to run above the title as an 11px tracked
 * mark, which put the chapter's smallest type in charge of its biggest.
 */
function GroupDivider({ title, sub }) {
  return (
    <Reveal>
      <div className="border-t border-white/[0.12] pt-6">
        <h3 className="font-sans text-[clamp(2rem,4.75vw,5.5rem)] font-medium tracking-tight text-bone">
          {title}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-bone-dim">{sub}.</p>
      </div>
    </Reveal>
  );
}

export default function WorkSection() {
  return (
    <div id="work" className="scroll-mt-24">
      <SectionHeader
        index="03"
        eyebrow="Proof of work"
        title="The"
        accent="Work."
        blurb="Some of this we built to prove a point. The rest is running on its own as you read this."
      />

      {/* The Studio — index entries 01-04 */}
      <section className="container-px py-14 lg:py-20">
        <GroupDivider title="The Studio" sub="Things we directed" />
        <div className="mt-10">
          {FILMS.map((film, i) => (
            <FilmCard key={film.title} film={film} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* The Engine — index entries 05-06 */}
      <section className="container-px py-14 lg:py-20">
        <GroupDivider title="The Engine" sub="Systems we built" />
        <div className="mt-10">
          {SYSTEMS.map((system, i) => (
            <SystemCard
              key={system.name}
              system={system}
              index={i + FILMS.length}
              last={i === SYSTEMS.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="container-px pb-16 lg:pb-24">
        <Reveal>
          <p className="mx-auto max-w-5xl text-balance text-center font-serif text-[clamp(1.5rem,3.5vw,3.75rem)] leading-[1.12] tracking-tight text-bone">
            Whatever you&apos;re launching, we&apos;ve either{" "}
            <span className="gold-flow italic">directed something like it</span> or{" "}
            <span className="gold-flow italic" style={{ animationDelay: "0.5s" }}>
              built the system that ships it
            </span>
            .
          </p>
        </Reveal>
      </section>
    </div>
  );
}
