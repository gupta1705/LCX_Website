"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import WorkCard from "./WorkCard";
import { CTA } from "@/lib/site";

const CATEGORIES = ["All", "Marketing", "Video", "Images", "Automation"];
const EASE = [0.16, 1, 0.3, 1];

export default function WorkGallery({ cases }) {
  const [active, setActive] = useState("All");
  const [reduced, setReduced] = useState(false);
  const chipRefs = useRef([]);

  // Roving arrow-key navigation for the radiogroup filter.
  const onChipKeyDown = (e, i) => {
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % CATEGORIES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + CATEGORIES.length) % CATEGORIES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = CATEGORIES.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(CATEGORIES[next]);
    chipRefs.current[next]?.focus();
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const countFor = (cat) =>
    cat === "All" ? cases.length : cases.filter((c) => c.category === cat).length;

  const visible = cases.filter((c) => active === "All" || c.category === active);

  return (
    <>
      {/* filter chips */}
      <div
        role="radiogroup"
        aria-label="Filter work by capability"
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        {CATEGORIES.map((cat, i) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(el) => (chipRefs.current[i] = el)}
              onClick={() => setActive(cat)}
              onKeyDown={(e) => onChipKeyDown(e, i)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 ${
                isActive
                  ? "border border-gold-soft bg-gold-500/[0.12] text-gold-200"
                  : "border border-white/[0.07] bg-white/[0.02] text-bone-dim hover:border-gold-soft hover:text-gold-200"
              }`}
            >
              {cat}{" "}
              <span className={isActive ? "text-gold-300/70" : "text-bone-faint"}>
                ({countFor(cat)})
              </span>
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-bone-faint"
      >
        Showing {visible.length} of {cases.length}
      </p>

      {/* grid */}
      <ul role="list" className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((c) => (
            <motion.li
              key={c.projectName}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={c.featured && active === "All" ? "lg:col-span-2" : ""}
            >
              <WorkCard caseItem={c} wide={c.featured && active === "All"} />
            </motion.li>
          ))}
        </AnimatePresence>

        {visible.length === 0 && (
          <li className="panel p-8 lg:col-span-2">
            <p className="text-sm text-bone-dim">
              No work in this category yet,{" "}
              <Link
                href={CTA.href}
                className="rounded-sm text-gold-300 underline-offset-4 transition-colors hover:text-gold-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                start a project
              </Link>
              .
            </p>
          </li>
        )}
      </ul>
    </>
  );
}
