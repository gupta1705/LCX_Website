"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { createHeroVideoController, heroVideoPolicy, HERO_POSTER } from "@/lib/hero-video.mjs";

export default function HeroShowreel() {
  const videoRef = useRef(null);
  const controllerRef = useRef(null);
  const [playback, setPlayback] = useState({ mode: "poster", wantsPlayback: false });

  useEffect(() => {
    const video = videoRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const hero = video.closest("section");
    const bounds = hero.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    const connection = navigator.connection || {};
    const policy = heroVideoPolicy(window.innerWidth, connection, !motion.matches);
    const controller = createHeroVideoController(video, { profile: policy.profile, onState: setPlayback });
    controllerRef.current = controller;
    const updatePlayback = () => controller.setVisible(visible && !document.hidden);
    const onMotionChange = () => {
      controller.setIntent(heroVideoPolicy(window.innerWidth, connection, !motion.matches).autoplay);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      updatePlayback();
    }, { threshold: [0, 0.001] });
    observer.observe(hero);
    updatePlayback();
    controller.setIntent(policy.autoplay);
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", updatePlayback);
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  const showVideo = playback.mode === "playing" || playback.mode === "paused";

  return (
    <>
      {/* Opaque, hero-sized footage. Nothing fades or bleeds into the next section. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-ink-900">
        <img
          src={HERO_POSTER}
          alt=""
          fetchPriority="high"
          width={1280}
          height={720}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(1.35)" }}
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={HERO_POSTER}
          data-playback={playback.mode}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(1.35)", opacity: showVideo ? 1 : 0 }}
        />
        {/* Contrast overlays stay inside the video section. */}
        <div className="absolute inset-0 bg-ink-900/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/75 via-ink-900/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-900/85 to-transparent" />
      </div>
      <button
        type="button"
        onClick={() => controllerRef.current?.toggle()}
        aria-label={playback.wantsPlayback ? "Pause background video" : "Play background video"}
        className="absolute bottom-6 right-5 z-20 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/25 bg-ink-900/75 text-bone transition-colors hover:bg-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300 sm:right-8 lg:right-10"
      >
        {playback.wantsPlayback ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </>
  );
}
