"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  // Fed to HeroShowreel so its gradients start exactly at the button row's
  // own rendered position instead of a percentage guessed from a handful of
  // test window sizes — that guess held for the sizes it was checked at and
  // missed the user's actual window, leaving the fade starting well below
  // where the buttons actually end. null until measured; HeroShowreel keeps
  // its own fallback for that first tick.
  const [btnBottomPct, setBtnBottomPct] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), WORD_INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      const cta = ctaRef.current;
      if (!section || !cta) return;
      const sectionRect = section.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      setBtnBottomPct(((ctaRect.bottom - sectionRect.top) / sectionRect.height) * 100);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* isolate keeps the showreel's -z-10 inside THIS stacking context —
          above the fixed z-0 attractor, below the hero copy */}
      <HeroShowreel btnBottomPct={btnBottomPct} />
      <div className="container-px grid w-full grid-cols-12 pb-16 pt-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative isolate col-span-12 lg:col-span-7 xl:col-span-6"
        >
          {/* soft scrim — lifts headline/body contrast where they overlap the
              bright attractor (most visible on mobile, where the rings run
              under the body copy). lg:hidden: at lg+ HeroShowreel is behind
              this instead of the plain attractor, and its own broad gradient
              already carries this job — stacking this on top of it read as
              a visible dark box/rectangle sitting over the (detailed,
              photographic) footage, in a way it never did over the
              attractor's own soft abstract lines. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 bg-[radial-gradient(70%_60%_at_35%_45%,rgba(10,9,8,0.7),transparent_72%)] lg:hidden"
          />
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
            className="mt-8 max-w-xl text-balance font-sans text-lg font-normal leading-[1.75] text-bone-dim md:text-xl xl:max-w-2xl xl:text-2xl"
          >
            From a single brief to a finished campaign, we use AI to{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0s" }}>design</span>,{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0.4s" }}>produce</span>, and{" "}
            <span className="gold-flow font-serif text-[1.05em] italic" style={{ animationDelay: "0.8s" }}>automate</span> the
            content that gets brands noticed.
          </motion.p>

          <motion.div ref={ctaRef} variants={item} className="mt-10 flex flex-wrap items-center gap-3">
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
