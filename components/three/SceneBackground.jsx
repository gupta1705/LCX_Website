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
  const sceneRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    const timer = setTimeout(() => setReady(true), 120);
    return () => {
      mq.removeEventListener("change", onChange);
      clearTimeout(timer);
    };
  }, []);

  // Move the entire canvas below the hero, then pin it when that section
  // reaches the viewport top. Translating the scene keeps its composition
  // intact instead of letting the video cover the upper half of the shape.
  useEffect(() => {
    const hero = document.getElementById("home");
    let heroBottom = window.innerHeight;
    let raf = 0;
    const update = () => {
      if (sceneRef.current) {
        sceneRef.current.style.transform = `translateY(${Math.max(0, heroBottom - window.scrollY)}px)`;
      }
      raf = 0;
    };
    const measure = () => {
      heroBottom = hero ? hero.getBoundingClientRect().bottom + window.scrollY : 0;
      update();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (hero) observer.observe(hero);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      data-scene-background
      className="pointer-events-none fixed inset-0 z-0"
      style={{ transform: "translateY(100svh)" }}
    >
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
          style={{ opacity: ready ? 0.7 : 0 }}
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
