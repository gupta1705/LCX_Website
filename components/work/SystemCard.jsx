"use client";

import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import { Cell, IndexNumeral, RowWash, RuleDraw } from "./IndexRow";
import { CTA } from "@/lib/site";

/**
 * One system we built (The Engine), on the same index-row spine as the films.
 * The media rail is replaced by the one boxed object in the section: a
 * gold-bordered machine readout. It used to carry an abstract pipeline
 * schematic — circle/diamond/square nodes joined by arrows — the generic
 * "workflow automation" icon set every AI-tool landing page reaches for, over
 * bracket-placeholder copy ("[X posts · Y followers]") that read as an
 * unfilled template. Both are gone: the readout is now a spec plate, real
 * key/value rows in the mono instrument-plate voice the rest of the site
 * already speaks. Gold border means "machine". A scanline runs only when `live`.
 */

const TICKS = ["left-0 top-0", "right-0 top-0 rotate-90", "right-0 bottom-0 rotate-180", "left-0 bottom-0 -rotate-90"];

export default function SystemCard({ system, index, last = false }) {
  const { name, live, blurb, specs, href, linkLabel } = system;
  const num = String(index + 1).padStart(2, "0");
  const serial = String(index - 3).padStart(2, "0");

  return (
    <article
      className={`group relative grid grid-cols-1 gap-y-6 py-10 lg:grid-cols-12 lg:gap-x-6 lg:py-14 ${
        last ? "border-b border-white/[0.08]" : ""
      }`}
    >
      <RuleDraw />
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

      {/* the machine readout */}
      <Cell className="flex flex-col lg:col-span-5" delay={0.26}>
        <div className="group/readout relative w-full max-w-[380px] overflow-hidden rounded-sm border border-gold-soft bg-ink-800 px-5 py-4">
          {/* engraved blueprint grid — a technical plate, opaque, nothing
              bleeds through it (the opposite of frosted glass) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(232,185,106,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(232,185,106,0.07) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* raking top light — a faint machined sheen on the plate */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[0.05] to-transparent"
          />

          {/* schematic corner ticks */}
          {TICKS.map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`pointer-events-none absolute z-10 h-2.5 w-2.5 border-l border-t border-gold-500/40 ${pos}`}
            />
          ))}

          {/* live scanline — only a running machine gets one */}
          {live && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 z-10 h-px w-2/5 bg-gradient-to-r from-transparent via-gold-300 to-transparent motion-safe:animate-scanline"
            />
          )}

          {/* content sits above the etched grid — a spec plate, real values */}
          <dl className="relative divide-y divide-white/[0.07]">
            {specs.map(({ k, v }) => (
              <div key={k} className="flex items-baseline justify-between gap-6 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">{k}</dt>
                <dd className="text-right font-mono text-[12px] leading-snug text-gold-100">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {linkLabel && (
          <Magnetic className="mt-5 w-fit">
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
