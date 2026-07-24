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

// `variant` picks the proof composition on the media rail ("fan" = one master
// frame cut into verticals, "solo" = a single print of the real feed).
// `caption` is the specs conjugated to prose — keep in sync with `specs` by
// hand (specs stays the source of truth even though the caption is what
// renders).
const SYSTEMS = [
  {
    name: "ReelForge",
    variant: "fan",
    blurb:
      "Feed it one long-form video; it cuts the sharpest short-form moments and mass-publishes across accounts, automatically. The content pipeline we sell, running in our own house first.",
    specs: [
      { k: "Input", v: "One long-form video" },
      { k: "Output", v: "Cut for every channel it runs on" },
      { k: "Runs", v: "On every new upload" },
    ],
    caption: [
      { g: "Input" },
      { t: " — one long-form video. " },
      { g: "Output" },
      { t: " — cut for every channel it runs on. " },
      { g: "Runs" },
      { t: " on every new upload." },
    ],
    // master: Panchayat (user-supplied), pre-cropped to the frame's exact
    // 16:9 so the title and faces are chosen deliberately, not auto-cropped.
    // Source: Inspiration Websites/images/long_video_thumbnail.jpg.
    masterImage: "/work/reelforge-master.jpg",
    // the three cuts: real clip channels the engine publishes to
    // (thefictionpeople, kahaanicircuit, thetvfadda) — user-supplied
    // screenshots, top-anchored 9:16 crops so each channel header survives.
    cutImages: [
      "/work/reelforge-short1.jpg",
      "/work/reelforge-short2.jpg",
      "/work/reelforge-short3.jpg",
    ],
  },
  {
    name: "ParsecDaily",
    variant: "solo",
    live: true,
    blurb:
      "An Instagram channel that runs itself — sourced, produced, and posted by the machine.",
    specs: [
      { k: "Sourcing", v: "Automatic" },
      { k: "Publishing", v: "Daily" },
      { k: "Manual uploads", v: "Zero" },
    ],
    caption: [
      { g: "Sourcing" },
      { t: " — automatic. " },
      { g: "Publishing" },
      { t: " — daily. " },
      { g: "Zero" },
      { t: " manual uploads." },
    ],
    // the real @parsecdaily profile screenshot, verbatim — thumbnail-parsec.jpg
    // at the repo root, copied in unmodified. Two cropped attempts before this
    // both failed: the full 2-row post grid read as noise under object-cover
    // (6 tiles squeezed and partial at once), and cropping down to one clean
    // tile lost every trace of "parsecdaily" — from the outside indistinguishable
    // from a random stock photo. This Print renders with fit="contain", so the
    // whole screenshot shows uncropped, pillarboxed onto the plate's own
    // near-black surface rather than a crop discarding part of it.
    stackImage: "/work/parsecdaily-feed.jpg",
    linkLabel: "See it live",
    // href: "https://instagram.com/...",
  },
];

/**
 * Chapter divider — the chapter's name at heading scale with what's in it as a
 * deck beneath. The sub used to run above the title as an 11px tracked mark,
 * which put the chapter's smallest type in charge of its biggest; the hairline
 * rule that used to sit above it is gone too, with every other segment rule on
 * the page.
 *
 * Carries the same ghost-numeral counterweight as SectionHeader, one level
 * down ("03.1" under section "03") — without it the row is just text hugging
 * the left edge with nothing balancing the rest of the line.
 */
function GroupDivider({ index, title, sub }) {
  return (
    <Reveal>
      <div className="pt-6">
        <div className="flex items-end justify-between gap-10">
          <h3 className="font-sans text-[clamp(2rem,4.75vw,5.5rem)] font-medium tracking-tight text-bone">
            {title}
          </h3>
          {index && (
            <span
              aria-hidden="true"
              className="hidden shrink-0 select-none font-serif text-[clamp(5rem,9vw,9rem)] italic leading-[0.72] tracking-[-0.04em] text-bone/[0.08] md:block"
            >
              {index}
            </span>
          )}
        </div>
        <p className="mt-3 text-lg leading-relaxed text-bone-dim">{sub}.</p>
      </div>
    </Reveal>
  );
}

export default function WorkSection() {
  return (
    <div id="work" className="scroll-mt-24">
      {/* The Studio — index entries 01-04 */}
      <section className="container-px py-14 lg:py-20">
        <GroupDivider index="03.1" title="The Studio" sub="Things we directed" />
        <div className="mt-10">
          {FILMS.map((film, i) => (
            <FilmCard key={film.title} film={film} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* The Engine — index entries 05-06 */}
      <section className="container-px py-14 lg:py-20">
        <GroupDivider index="03.2" title="The Engine" sub="Systems we built" />
        <div className="mt-10">
          {SYSTEMS.map((system, i) => (
            <SystemCard key={system.name} system={system} index={i + FILMS.length} />
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="container-px pb-16 pt-16 lg:pb-24 lg:pt-24">
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
