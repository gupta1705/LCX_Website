"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AttractorScene = dynamic(() => import("./AttractorScene"), {
  ssr: false,
  loading: () => null,
});

export default function SceneBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false); // canvas has drawn → cue the fade-in
  const wrapRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Cinematic entrance + calm the scene down as the visitor scrolls past the hero.
  useEffect(() => {
    if (reduced || !mounted) return;
    let raf = 0;
    const update = () => {
      const el = wrapRef.current;
      if (el) {
        const fade = Math.min(window.scrollY / (window.innerHeight * 1.1), 1);
        // base entrance opacity (0 until ready) × scroll calm-down. Gentle, so the
        // shape keeps morphing visibly as the visitor scrolls (never below ~0.7).
        el.style.opacity = String((ready ? 1 : 0) * (1 - fade * 0.3));
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    // let the first frames render before fading in
    const t = setTimeout(() => setReady(true), 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, mounted, ready]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* Always-present CSS fallback (also shown for reduced-motion / no-WebGL) */}
      <div className="absolute inset-0 bg-ink-900" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 72% 38%, rgba(201,146,61,0.20), transparent 60%), radial-gradient(40% 40% at 20% 80%, rgba(122,79,23,0.12), transparent 60%)",
        }}
      />

      {/* The live golden attractor — fades in over ~1.2s after first paint */}
      {mounted && !reduced && (
        <div
          ref={wrapRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
        >
          <AttractorScene />
        </div>
      )}

      {/* Readability overlays — keep text crisp over the motion */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/40 to-transparent" />
      {/* light right-side scrim so the travelling form stays legible behind right-column content */}
      <div className="absolute inset-0 bg-gradient-to-l from-ink-900/35 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-900/90 to-transparent sm:h-28" />

      {/* Film grain — subtle cinematic texture. Plain alpha (no blend mode) so
          it doesn't force a full-screen recomposite over the animating canvas. */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
