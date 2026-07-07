"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
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

// The rotating headline word — the four capabilities, cycling in place.
const WORDS = ["films", "campaigns", "visuals", "systems"];
const WORD_INTERVAL = 2200;

export default function Hero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), WORD_INTERVAL);
    return () => clearInterval(id);
  }, []);

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
            className="font-sans text-[clamp(2.6rem,7vw,6.25rem)] font-medium leading-[0.98] tracking-tightest text-bone"
          >
            {/* one clean sentence for screen readers; the visual cycle is hidden from AT */}
            <span className="sr-only">
              We make films, campaigns, visuals, and systems that go viral.
            </span>
            <span aria-hidden="true">
              We make
              <br />
              {/* Outer span sets the visible line gap (tight); the inner span
                  is taller and does the actual clipping, so Besley's deep
                  descenders (campaigns, systems) have room without stretching
                  the layout gap between "We make" and "that go viral." */}
              <span className="relative block h-[1.08em]">
                <span className="absolute inset-x-0 -top-[0.36em] -bottom-[0.36em] overflow-hidden">
                  {WORDS.map((word, i) => (
                    <motion.span
                      key={word}
                      className="absolute inset-x-0 top-0 flex h-full items-center font-serif italic text-gold-gradient"
                      initial={false}
                      animate={
                        reduced
                          ? { y: 0, opacity: index === i ? 1 : 0 }
                          : index === i
                            ? { y: "0%", opacity: 1 }
                            : { y: index > i ? "-110%" : "110%", opacity: 0 }
                      }
                      transition={
                        reduced
                          ? { duration: 0.4, ease: "easeInOut" }
                          : { type: "spring", stiffness: 55, damping: 13 }
                      }
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </span>
              that go viral.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-balance font-sans text-lg font-normal leading-[1.75] text-bone-dim md:text-xl"
          >
            From a single brief to a finished campaign, we use AI to{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0s" }}>design</span>,{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0.4s" }}>produce</span>, and{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0.8s" }}>automate</span> the
            content that gets brands noticed.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-bone backdrop-blur-sm transition-all duration-300 ease-out-expo hover:border-gold-soft hover:bg-white/[0.06] active:scale-[0.97]"
              >
                <Play className="h-4 w-4 text-gold-300 transition-transform duration-300 group-hover:scale-110" />
                See our work
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                id="hero-start-cta"
                href={CTA.href}
                className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-medium text-ink-900 transition-all duration-300 ease-out-expo hover:bg-gold-300 hover:shadow-[0_0_42px_-8px_rgba(233,185,106,0.7)] active:scale-[0.97]"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
