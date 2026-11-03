"use client";

import { Component, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { scenePolicy } from "@/lib/device-performance.mjs";

const AttractorScene = dynamic(() => import("./AttractorScene"), {
  ssr: false,
  loading: () => null,
});

// Decorative WebGL/chunk failures must never take the content or form down.
class SceneFallback extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFallback?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function SceneBackground() {
  const [seen, setSeen] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [ready, setReady] = useState(false);
  const [struggling, setStruggling] = useState(false);
  const sceneRef = useRef(null);
  const [active, setActive] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onStruggle = useCallback(() => setStruggling(true), []);
  const mode = struggling ? "still" : policy?.mode;
  const loadScene = seen && policy && mode !== "still";

  useEffect(() => {
    let inView = false;
    const sync = () => {
      const visible = inView && !document.hidden;
      setActive(visible);
      if (visible) setSeen(true);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio > 0;
      sync();
    }, { threshold: [0, 0.001] });
    observer.observe(sceneRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const update = () => setPolicy(scenePolicy({
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      connection,
      reducedMotion: mq.matches,
    }));
    update();
    mq.addEventListener("change", update);
    connection?.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => { if (!loadScene) setReady(false); }, [loadScene]);

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
      data-scene-active={active}
      data-scene-mode={mode || "pending"}
      data-scene-loaded={Boolean(loadScene)}
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

      {/* A small vector of the same curve keeps the gold design while loading,
          in data-saving mode, or on a device that cannot sustain WebGL. */}
      {seen && (!ready || !loadScene) && (
        <img src="/home/attractor-still-v1.svg" alt="" width={1600} height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-70" />
      )}

      {/* Rendering this component triggers its code download, only after the
          backdrop first enters view. The hero never competes with Three.js. */}
      {loadScene && (
        <div
          style={{ opacity: ready ? 0.7 : 0 }}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
        >
          <SceneFallback onFallback={onStruggle}>
            <AttractorScene active={active} fps={policy.fps} onReady={onReady} onStruggle={onStruggle} />
          </SceneFallback>
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
