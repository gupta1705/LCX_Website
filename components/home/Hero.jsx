"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { CTA } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1];
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="container-px grid w-full grid-cols-12 pb-16 pt-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="col-span-12 lg:col-span-7 xl:col-span-6"
        >
          <motion.h1
            variants={item}
            className="text-balance font-sans text-[clamp(2.6rem,7vw,5.4rem)] font-medium leading-[0.98] tracking-tightest text-bone"
          >
            Story-first.
            <br />
            AI-powered.
            <br />
            <span className="font-serif italic text-gold-gradient">
              Built to go viral.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-bone-dim"
          >
            From a single brief to a finished campaign, we use AI to{" "}
            <span className="font-normal text-gold-gradient">design</span>,{" "}
            <span className="font-normal text-gold-gradient">produce</span>, and{" "}
            <span className="font-normal text-gold-gradient">automate</span> the
            content that gets brands noticed.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-bone backdrop-blur-sm transition-all duration-300 hover:border-gold-soft hover:bg-white/[0.06]"
            >
              <Play className="h-4 w-4 text-gold-300" />
              See our work
            </Link>
            <Link
              href={CTA.href}
              className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-medium text-ink-900 transition-all duration-300 hover:bg-gold-300 hover:shadow-[0_0_42px_-8px_rgba(233,185,106,0.7)]"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute inset-x-0 bottom-7 flex justify-center"
      >
        <div className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone-faint">
          Scroll
          <span className="h-10 w-px overflow-hidden bg-white/10">
            <span className="block h-1/2 w-full animate-pulse-soft bg-gold-400" />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
