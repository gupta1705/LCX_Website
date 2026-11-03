"use client";

import { useEffect } from "react";

// CSS glints remain purely decorative. Only visible words need repainting;
// pause their timelines offscreen so they resume without restarting a flash.
export default function VisibleDecorations() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = document.querySelectorAll(".gold-flow, .text-gold-shimmer");
    const visible = new Set();
    const update = (element) => {
      const collapsed = element.closest('[aria-expanded="false"]');
      const running = visible.has(element) && !collapsed && !document.hidden && !motion.matches;
      element.style.setProperty("--decoration-animation-state", running ? "running" : "paused");
    };
    const sync = () => elements.forEach(update);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0) visible.add(entry.target);
        else visible.delete(entry.target);
        update(entry.target);
      }
    }, { threshold: [0, 0.01] });
    // The principles cards hide their inactive text with opacity, which does
    // not affect intersection. Their disclosure state supplies that signal.
    const disclosures = new MutationObserver(sync);

    elements.forEach((element) => observer.observe(element));
    disclosures.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["aria-expanded"] });
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      disclosures.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      elements.forEach((element) => element.style.removeProperty("--decoration-animation-state"));
    };
  }, []);

  return null;
}
