"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import ActionButton from "@/components/ui/ActionButton";
import HeroShowreel from "@/components/home/HeroShowreel";
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
  const heroRef = useRef(null);
  const inView = useInView(heroRef);

  useEffect(() => {
    if (!inView || reduced) return;
    let id;
    const sync = () => {
      clearInterval(id);
      if (!document.hidden) id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), WORD_INTERVAL);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [inView, reduced]);

  return (
    <section
      ref={heroRef}
      style={{ "--hero-animation-state": inView ? "running" : "paused" }}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden border-b border-gold-500/20 bg-ink-900"
    >
      <HeroShowreel />
      <div className="container-px grid w-full grid-cols-12 pb-24 pt-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative col-span-12 lg:col-span-7 xl:col-span-6"
        >
          <motion.h1
            variants={item}
            className="font-sans text-[clamp(2.6rem,7vw,8rem)] font-medium leading-[0.98] tracking-tightest text-bone"
          >
            {/* one clean sentence for screen readers; the visual cycle is hidden from AT */}
            <span className="sr-only">
              We make films, campaigns, visuals, and systems that resonate.
            </span>
            <span aria-hidden="true">
              We make
              <br />
              {/* Outer span sets the visible line gap (tight); the inner span
                  is taller and does the actual clipping, so Besley's deep
                  descenders (campaigns, systems) have room without stretching
                  the layout gap between "We make" and "that resonate." */}
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
              that resonate.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-balance font-sans text-lg font-normal leading-[1.75] text-bone md:text-xl xl:max-w-2xl xl:text-2xl"
          >
            From a single brief to a finished campaign, we use AI to{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0s" }}>design</span>,{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0.4s" }}>produce</span>, and{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0.8s" }}>automate</span> the
            content that gets brands noticed.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ActionButton as={Link} href="#work" tone="secondary" icon={Play} size="lg">
                See our work
              </ActionButton>
            </Magnetic>
            <Magnetic>
              <ActionButton as={Link} id="hero-start-cta" href={CTA.href} tone="primary" size="lg">
                {CTA.label}
              </ActionButton>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
