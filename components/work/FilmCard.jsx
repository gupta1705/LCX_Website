"use client";

import { useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Cell, IndexNumeral, RowWash, RuleDraw } from "./IndexRow";
import { CTA } from "@/lib/site";

/**
 * One directed piece (The Studio), set as a filmography index row: oversized
 * serif numeral, typographic entry, and the framed 16:9 artifact. Give it a
 * `youtubeId` and the poster becomes a click-to-load YouTube embed; otherwise
 * it shows a gold placeholder frame that links to `href` (e.g. Instagram) or
 * the contact section. `flip` mirrors the row (media left, text right).
 */

/** Plain play control — a circular button with the play glyph, nothing else. */
function Aperture({ reduce }) {
  return (
    <span className="relative grid h-16 w-16 place-items-center rounded-full border border-gold-soft bg-ink-900 text-gold-200 transition-colors duration-300 group-hover/poster:border-gold-500 group-hover/poster:bg-gold-500 group-hover/poster:text-ink-900">
      <Play className="ml-0.5 h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}

function Poster({ youtubeId, thumbnail, thumbnailBg, href, onPlay, title, reduce }) {
  const src = thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null);
  // A supplied `thumbnail` (brand logo, arbitrary still) can be any aspect
  // ratio and must never crop; only a YouTube frame grab is reliably 16:9.
  // object-contain never crops, but can letterbox — thumbnailBg (sampled
  // from the asset's own background) fills that margin so it reads as a
  // full-bleed frame instead of a visible seam.
  const fit = thumbnail ? "object-contain" : "object-cover";
  const media = src ? (
    <img
      src={src}
      alt=""
      style={thumbnailBg ? { backgroundColor: thumbnailBg } : undefined}
      className={`absolute inset-0 h-full w-full ${fit} opacity-80 transition-opacity duration-500 group-hover/poster:opacity-100`}
    />
  ) : (
    <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_0%,rgba(201,146,61,0.15),transparent_60%)]" />
  );

  const inner = (
    <>
      {media}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
      <Aperture reduce={reduce} />
    </>
  );

  const cls =
    "absolute inset-0 grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400";

  return onPlay ? (
    <button type="button" onClick={onPlay} aria-label={`Play ${title}`} className={cls}>
      {inner}
    </button>
  ) : (
    <a href={href} aria-label={`Watch ${title}`} className={cls}>
      {inner}
    </a>
  );
}

export default function FilmCard({ film, index, flip = false, last = false }) {
  const { title, tag, blurb, idea, metric, youtubeId, thumbnail, thumbnailBg, href, linkLabel } = film;
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const watchHref = href || CTA.href;
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`group relative grid grid-cols-1 gap-y-6 py-10 lg:grid-cols-12 lg:gap-x-6 lg:py-14 ${
        last ? "border-b border-white/[0.08]" : ""
      }`}
    >
      <RuleDraw />
      <RowWash />

      {/* index numeral — desktop spine */}
      <Cell className="hidden lg:block lg:col-span-2" delay={0.1}>
        <IndexNumeral n={num} />
      </Cell>

      {/* the entry */}
      <Cell className={`flex flex-col lg:col-span-4 ${flip ? "lg:order-3" : ""}`} delay={0.18}>
        <h4 className="font-sans text-[clamp(1.6rem,3vw,2.625rem)] font-medium leading-[1.05] tracking-tighter text-bone">
          <span className="mr-3 font-serif text-[0.8em] italic text-gold-gradient lg:hidden">{num}.</span>
          {title}
        </h4>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em]">
          <span className="text-gold-300">{tag}</span>
          {metric && <span className="text-bone-faint"> · {metric}</span>}
        </p>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-bone-dim">{blurb}</p>
        {idea && <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-bone-faint">{idea}</p>}
        {linkLabel && (
          <a
            href={watchHref}
            className="link-underline mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-medium text-gold-300 transition-colors hover:text-gold-100"
          >
            {linkLabel}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        )}
      </Cell>

      {/* the framed artifact */}
      <Cell
        className={`relative lg:col-span-6 ${flip ? "order-first lg:order-2" : "order-first lg:order-none"}`}
        delay={0.26}
      >
        <div className="group/poster relative aspect-video w-full overflow-hidden rounded-sm bg-ink-900">
          {youtubeId && playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Poster
              youtubeId={youtubeId}
              thumbnail={thumbnail}
              thumbnailBg={thumbnailBg}
              href={watchHref}
              onPlay={youtubeId ? () => setPlaying(true) : null}
              title={title}
              reduce={reduce}
            />
          )}

          {/* inset hairline — the mounted-print mat */}
          {!playing && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[2px] ring-1 ring-white/10" />
          )}

        </div>
      </Cell>
    </article>
  );
}
