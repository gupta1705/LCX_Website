"use client";

import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import PipelineDiagram from "@/components/work/PipelineDiagram";
import { Cell, IndexNumeral, RowWash, RuleDraw } from "./IndexRow";
import { CTA } from "@/lib/site";

/**
 * One system we built (The Engine), on the same index-row spine as the films.
 * The media rail is replaced by the one boxed object in the section: a
 * gold-bordered machine readout with a pipeline schematic that draws itself
 * on scroll. Gold border means "machine". A scanline runs only when `live`.
 */

const TICKS = ["left-0 top-0", "right-0 top-0 rotate-90", "right-0 bottom-0 rotate-180", "left-0 bottom-0 -rotate-90"];

export default function SystemCard({ system, index, last = false }) {
  const { name, status, live, blurb, pipeline, href, linkLabel } = system;
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
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            {live && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/60" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-300">{status}</span>
        </div>
        <h4 className="mt-4 font-sans text-[clamp(1.9rem,3.25vw,2.875rem)] font-medium leading-[1.05] tracking-tighter text-bone">
          <span className="mr-3 font-serif text-[0.8em] italic text-gold-gradient lg:hidden">{num}.</span>
          {name}
        </h4>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-faint">
          TVL / ENGINE / {serial}
        </p>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-bone-dim">{blurb}</p>
      </Cell>

      {/* the machine readout */}
      <Cell className="flex flex-col lg:col-span-5" delay={0.26}>
        <div className="group/readout relative overflow-hidden rounded-sm border border-gold-soft bg-ink-900/60 px-5 py-4">
          {/* schematic corner ticks */}
          {TICKS.map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`pointer-events-none absolute h-2.5 w-2.5 border-l border-t border-gold-500/40 ${pos}`}
            />
          ))}

          {/* live scanline — only a running machine gets one */}
          {live && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-px w-2/5 bg-gradient-to-r from-transparent via-gold-300 to-transparent motion-safe:animate-scanline"
            />
          )}

          <PipelineDiagram variant={live ? "loop" : "fanout"} gid={`pipe-${index}`} />

          <p className="mt-3 font-mono text-[clamp(0.68rem,1.1vw,0.8rem)] uppercase tracking-[0.14em] text-gold-200">
            {pipeline}
          </p>
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
