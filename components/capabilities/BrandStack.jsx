"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * A shuffling stack of brand cards — the front card slides away and the next
 * rises into place, cycling through the list (auto while in view, or on click).
 *
 * PLACEHOLDERS: swap `name` for the real brands and add `logo: "/logos/x.svg"`
 * to show a logo image instead of the wordmark. Keeps its motion under
 * prefers-reduced-motion (swaps instantly, no auto-advance).
 */
// A mix of both pillars: directed films (the Studio) and scaled
// content systems (the Engine). Swap these for the real brands + work.
const BRANDS = [
  { name: "NOVA", note: "Skincare · launch film" }, // Studio
  { name: "HELIO", note: "Fintech · content engine" }, // Engine
  { name: "QUANTA", note: "SaaS · product film" }, // Studio
  { name: "LUMEN", note: "DTC · always-on social" }, // Engine
  { name: "VERTEX", note: "Retail · 500 ad variants" }, // Engine
];

const CYCLE_MS = 2200;

// Front card sits lowest; the two behind step up and back (bottom-anchored).
const POS = [
  { scale: 1, y: 14 },
  { scale: 0.95, y: -24 },
  { scale: 0.9, y: -60 },
];
const EXIT = { y: 460, scale: 1, zIndex: 20 };
const ENTER = { y: -24, scale: 0.9 };

function BrandFace({ brand }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="grid flex-1 place-items-center overflow-hidden rounded-xl border border-gold-soft bg-[radial-gradient(120%_90%_at_30%_0%,rgba(201,146,61,0.16),transparent_60%)]">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-h-[52%] w-auto select-none object-contain opacity-90"
          />
        ) : (
          <span className="select-none font-sans text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-tight text-gold-gradient">
            {brand.name}
          </span>
        )}
      </div>
      <div className="px-5 pb-5 pt-4">
        <p className="truncate text-base font-medium text-bone">{brand.name}</p>
        <p className="truncate font-mono text-[11px] uppercase tracking-[0.2em] text-bone-faint">
          {brand.note}
        </p>
      </div>
    </div>
  );
}

export default function BrandStack() {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const cursor = useRef(3 % BRANDS.length); // next brand to append
  const idRef = useRef(3); // monotonic keys so AnimatePresence never collides
  const hover = useRef(false);
  const inView = useRef(false);
  const [cards, setCards] = useState(() =>
    BRANDS.slice(0, 3).map((b, i) => ({ id: i, brand: b })),
  );

  const advance = () => {
    const brand = BRANDS[cursor.current];
    cursor.current = (cursor.current + 1) % BRANDS.length;
    setCards((prev) => [...prev.slice(1), { id: idRef.current++, brand }]);
  };

  // auto-advance only while visible + not hovered + motion allowed
  useEffect(() => {
    if (reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
      },
      { threshold: 0.3 },
    );
    const el = rootRef.current;
    if (el) io.observe(el);
    const iv = setInterval(() => {
      if (inView.current && !hover.current) advance();
    }, CYCLE_MS);
    return () => {
      io.disconnect();
      clearInterval(iv);
    };
  }, [reduced]);

  const visible = cards.slice(0, 3);

  return (
    <div
      ref={rootRef}
      className="flex w-full flex-col items-center"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      <div className="relative h-[460px] w-full max-w-[620px] overflow-hidden">
        <AnimatePresence initial={false}>
          {visible.map((card, index) => {
            const { scale, y } = POS[index] ?? POS[2];
            const zIndex = index === 0 ? 10 : 3 - index;
            return (
              <motion.div
                key={card.id}
                initial={reduced ? false : index === 2 ? ENTER : false}
                animate={{ y, scale }}
                exit={reduced ? undefined : index === 0 ? EXIT : undefined}
                transition={reduced ? { duration: 0 } : { type: "spring", duration: 0.65, bounce: 0 }}
                style={{ zIndex, left: "50%", x: "-50%", bottom: 0 }}
                className="absolute flex h-[360px] w-[300px] items-center justify-center overflow-hidden rounded-t-2xl border-x border-t border-gold-soft bg-ink-800/90 p-1 shadow-[0_-12px_50px_-24px_rgba(0,0,0,0.95)] backdrop-blur-sm will-change-transform sm:w-[560px]"
              >
                <BrandFace brand={card.brand} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={advance}
        aria-label="Show the next brand"
        className="relative z-10 -mt-px flex w-full max-w-[620px] items-center justify-center gap-2 border-t border-white/[0.08] py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-bone-dim transition-colors duration-300 hover:text-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        Next brand
      </button>
    </div>
  );
}
