"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { Cell, IndexNumeral, RowWash } from "./IndexRow";
import { CTA } from "@/lib/site";

/**
 * One system we built (The Engine), on the same index-row spine as the films.
 * The media rail holds proofs pulled off the plate — the machine's OUTPUT as
 * physical prints, not a panel about its specs. ReelForge fans three vertical
 * cuts off one master frame (the machine mid-cut); ParsecDaily shows a single
 * print of the real feed. The specs survive beneath as a figure caption
 * conjugated into prose, and "live" is a serif sentence with the site's own
 * gold sheen, not a status dot.
 *
 * What this replaced: a mono key/value plate on a blueprint grid with corner
 * ticks and a scanline — the terminal-HUD look every AI landing page ships
 * with, and it read as exactly that.
 *
 * Every print is an opaque ink plate (they occlude the live attractor by
 * z-order — this site's proven separation strategy) and doubles as a frame:
 * a real still drops in later with zero layout change, the same promise
 * FilmCard's placeholder poster makes.
 */

const EASE = [0.16, 1, 0.3, 1];

// The deal-out order (master then cuts; pile then today) carries the meaning,
// so the stagger stays — but each print fades in PLACE, opacity only, like
// title cards. No y-drift: scroll ease-ups were stripped sitewide as reading
// generic (see IndexRow.jsx).
const canvasVariants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

/**
 * One print. `breathe` is the print's hover drift, driven from the canvas's
 * whileHover via variant propagation — a Tailwind group-hover translate would
 * be silently overridden by framer's inline transform, so it must live here.
 * `src`, once supplied, fills the promised image contract. Real thumbnails
 * render near-full color (FilmCard's precedent for real content —
 * a sepia wash here would erase exactly what makes them recognizable). No
 * ring anywhere on the print, inset or outer: two earlier passes both left a
 * thin white line on top of real photos (first a radial gold wash, then an
 * inset "photo mat" ring) and both read as an unwanted border rather than a
 * frame. The image is the whole plate now — clipping + a black drop shadow
 * for depth is the only separation from the page behind it.
 *
 * `fit` follows FilmCard's Poster convention: "cover" (default) for stills
 * that already match the print's own aspect ratio; "contain" for a supplied
 * asset of ARBITRARY aspect that must show in full, uncropped — cover would
 * silently discard whichever edges don't fit, which is how a full account
 * screenshot turned into an unrecognizable single tile the first time this
 * shipped. contain letterboxes instead, onto the plate's own near-black
 * surface, so nothing the source image contains is ever cut away.
 *
 * `tilt` (degrees) is set on every variant, not as a separate Tailwind
 * class — same reasoning as `breathe` above: framer overwrites the whole
 * inline `transform` on hover, so a static `rotate-*` class would vanish
 * the moment `breathe` fires. Baking it into each variant keeps the tilt
 * present through fade-in and hover alike, with breathe's x/y layering on
 * top of it in the same transform.
 */
function Print({ position, surface, breathe, tilt, src, fit = "cover", children }) {
  const variants = {
    hidden: { opacity: 0, rotate: tilt || 0 },
    shown: { opacity: 1, rotate: tilt || 0, transition: { duration: 0.6, ease: EASE } },
  };
  if (breathe) variants.breathe = { ...breathe, rotate: tilt || 0, transition: { duration: 0.5, ease: EASE } };

  return (
    <motion.div
      variants={variants}
      className={`absolute overflow-hidden rounded-sm shadow-[0_8px_24px_rgba(0,0,0,0.45)] ${position} ${surface}`}
    >
      {src && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} opacity-[0.88] saturate-[0.9]`}
        />
      )}
      {children}
    </motion.div>
  );
}

function ProofCanvas({ variant, live, masterImage, cutImages = [], stackImage }) {
  const reduce = useReducedMotion();
  const [cutA, cutB, cutC] = cutImages;

  return (
    <motion.div
      variants={canvasVariants}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      whileHover={reduce ? undefined : "breathe"}
      className="relative aspect-[7/6] w-full max-w-[440px]"
    >
      {variant === "fan" ? (
        <>
          {/* the master frame — one long-form video on the plate */}
          <Print
            position="left-0 top-0 z-0 w-[74%] aspect-video"
            surface="bg-ink-800"
            src={masterImage}
          />
          {/* the cuts peeling off its corner, dealt in machine order */}
          <Print
            position="left-[38%] top-[30%] z-10 w-[23%] aspect-[9/16]"
            surface="bg-ink-700"
            breathe={{ x: 2, y: 2 }}
            src={cutA}
          />
          <Print
            position="left-[57%] top-[40%] z-20 w-[23%] aspect-[9/16]"
            surface="bg-ink-700"
            breathe={{ x: 4, y: 4 }}
            src={cutB}
          />
          <Print
            position="left-[76%] top-[50%] z-30 w-[23%] aspect-[9/16]"
            surface="bg-ink-700"
            breathe={{ x: 6, y: 6 }}
            src={cutC}
          />
        </>
      ) : (
        <>
          {/* one print, centered — was a three-layer stack; simplified to a
              single card of the real feed. 6:13 — close to a real phone
              screen, not the 4:5 photo-print ratio the fan's cuts use — so
              the profile screenshot sits inside with barely any pillarbox.
              A slight tilt reads as a print set down, not a UI panel. */}
          <Print
            position="left-[35%] top-[12%] z-0 w-[30%] aspect-[6/13]"
            surface="bg-ink-800"
            tilt={-4}
            breathe={{ y: -3 }}
            src={stackImage}
            fit="contain"
          >
            {live && stackImage && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent"
              />
            )}
            {live && (
              <span className="gold-flow absolute bottom-3.5 left-4 z-10 font-serif text-[13px] italic">
                Live daily.
              </span>
            )}
          </Print>
        </>
      )}
    </motion.div>
  );
}

export default function SystemCard({ system, index }) {
  const { name, live, blurb, variant, caption, href, linkLabel, masterImage, cutImages, stackImage } = system;
  const num = String(index + 1).padStart(2, "0");
  const serial = String(index - 3).padStart(2, "0");

  return (
    <article className="group relative grid grid-cols-1 gap-y-6 py-10 lg:grid-cols-12 lg:gap-x-6 lg:py-14">
      <RowWash />

      {/* index numeral — continuous with the films */}
      <Cell className="hidden lg:block lg:col-span-2" delay={0.1}>
        <IndexNumeral n={num} />
      </Cell>

      {/* the entry */}
      <Cell className="flex flex-col lg:col-span-5" delay={0.18}>
        <h4 className="font-sans text-[clamp(1.9rem,3.25vw,3.5rem)] font-medium leading-[1.05] tracking-tighter text-bone">
          <span className="mr-3 font-serif text-[0.8em] italic text-gold-gradient lg:hidden">{num}.</span>
          {name}
        </h4>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">
          LCX / ENGINE / {serial}
        </p>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-bone-dim xl:text-[17px]">{blurb}</p>
      </Cell>

      {/* the proofs — the machine's output as prints, specs as the caption */}
      <Cell className="flex flex-col lg:col-span-5" delay={0.26}>
        <ProofCanvas
          variant={variant}
          live={live}
          masterImage={masterImage}
          cutImages={cutImages}
          stackImage={stackImage}
        />
        {/* bone-dim, not the specced bone-faint — the ReelForge caption sits
            over the attractor's brightest ring field and faint drowned there */}
        <p className="mt-5 max-w-[40ch] font-sans text-[13px] leading-relaxed text-bone-dim xl:text-[14px]">
          {caption.map((seg, i) =>
            seg.g ? (
              <span key={i} className="font-serif italic text-gold-300">
                {seg.g}
              </span>
            ) : (
              <span key={i}>{seg.t}</span>
            ),
          )}
        </p>

        {linkLabel && (
          <Magnetic className="mt-4 w-fit">
            <a
              href={href || CTA.href}
              className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-100"
            >
              {linkLabel}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </Magnetic>
        )}
      </Cell>
    </article>
  );
}
