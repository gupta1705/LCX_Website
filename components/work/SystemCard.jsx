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
 * cuts off one master frame (the machine mid-cut); ParsecDaily piles up its
 * published days, today landing on top. The specs survive beneath as a figure
 * caption conjugated into prose, and "live" is a serif sentence with the
 * site's own gold sheen, not a status dot.
 *
 * What this replaced: a mono key/value plate on a blueprint grid with corner
 * ticks and a scanline — the terminal-HUD look every AI landing page ships
 * with, and it read as exactly that.
 *
 * Every print is an opaque ink plate (they occlude the live attractor by
 * z-order — this site's proven separation strategy) and doubles as a frame:
 * a real still drops in under the mat later with zero layout change, the
 * same promise FilmCard's placeholder poster makes.
 */

// FilmCard's radial gold wash, reused verbatim so the prints read as the same
// photographic material as the film posters above them.
const MASTER_WASH =
  "radial-gradient(120% 90% at 30% 0%, rgba(201,146,61,0.15), transparent 60%)";

// One raking light losing strength across the fan of cuts.
const cutWash = (a) =>
  `radial-gradient(140% 60% at 50% 0%, rgba(201,146,61,${a}), transparent 65%)`;

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
 */
function Print({ position, surface, wash, mat, breathe, children }) {
  const variants = {
    hidden: { opacity: 0 },
    shown: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
  };
  if (breathe) variants.breathe = { ...breathe, transition: { duration: 0.5, ease: EASE } };

  return (
    <motion.div
      variants={variants}
      className={`absolute overflow-hidden rounded-sm ring-1 ring-white/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.45)] ${position} ${surface}`}
    >
      {/* future contract: an <img className="absolute inset-0 h-full w-full
          object-cover" /> drops in here, under the mat, zero layout change */}
      {wash && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: wash }}
        />
      )}
      {mat && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute ${mat} rounded-[2px] ring-1 ring-white/10`}
        />
      )}
      {children}
    </motion.div>
  );
}

function ProofCanvas({ variant, live }) {
  const reduce = useReducedMotion();

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
            wash={MASTER_WASH}
            mat="inset-2"
          />
          {/* the cuts peeling off its corner, dealt in machine order */}
          <Print
            position="left-[38%] top-[30%] z-10 w-[23%] aspect-[9/16]"
            surface="bg-ink-700"
            wash={cutWash(0.16)}
            mat="inset-1.5"
            breathe={{ x: 2, y: 2 }}
          />
          <Print
            position="left-[57%] top-[40%] z-20 w-[23%] aspect-[9/16]"
            surface="bg-ink-700"
            wash={cutWash(0.12)}
            mat="inset-1.5"
            breathe={{ x: 4, y: 4 }}
          />
          <Print
            position="left-[76%] top-[50%] z-30 w-[23%] aspect-[9/16]"
            surface="bg-ink-700"
            wash={cutWash(0.09)}
            mat="inset-1.5"
            breathe={{ x: 6, y: 6 }}
          />
        </>
      ) : (
        <>
          {/* the published days piling up, today landing on top */}
          <Print
            position="left-[18%] top-[8%] z-0 w-[52%] aspect-[4/5]"
            surface="bg-ink-600"
            breathe={{ x: 2, y: -2 }}
          />
          <Print
            position="left-[14%] top-[13%] z-10 w-[52%] aspect-[4/5]"
            surface="bg-ink-700"
            breathe={{ x: 2, y: -2 }}
          />
          <Print
            position="left-[10%] top-[18%] z-20 w-[52%] aspect-[4/5]"
            surface="bg-ink-800"
            wash={MASTER_WASH}
            mat="inset-2"
            breathe={{ y: -3 }}
          >
            {live && (
              <span className="gold-flow absolute bottom-3.5 left-4 font-serif text-[13px] italic">
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
  const { name, live, blurb, variant, caption, href, linkLabel } = system;
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
        <ProofCanvas variant={variant} live={live} />
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
