"use client";

import { useEffect, useRef } from "react";

export default function HeroShowreel() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const autoplay = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
    );
    const updatePlayback = () => {
      if (autoplay.matches) {
        // The native controls remain available if autoplay is blocked.
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    updatePlayback();
    autoplay.addEventListener("change", updatePlayback);
    return () => autoplay.removeEventListener("change", updatePlayback);
  }, []);

  return (
    <figure className="w-full overflow-hidden rounded-lg border border-gold-500/35 bg-ink-900 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <figcaption
        id="hero-showreel-caption"
        className="flex items-center justify-between gap-4 border-b border-gold-500/20 bg-ink-800 px-4 py-4 sm:px-5"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-200 sm:text-[11px]">
          Lights Camera Experiments
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-dim sm:text-[11px]">
          Showreel
        </span>
      </figcaption>
      <video
        ref={videoRef}
        aria-label="Lights Camera Experiments showreel"
        aria-describedby="hero-showreel-caption"
        controls
        muted
        loop
        playsInline
        preload="metadata"
        className="block aspect-video w-full bg-black object-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-300"
        src="/home/showreel.mp4"
      />
    </figure>
  );
}
