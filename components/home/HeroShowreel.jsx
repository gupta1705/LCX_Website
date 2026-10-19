"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function HeroShowreel() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const updatePlayback = () => {
      if (motion.matches) video.play().catch(() => {});
      else video.pause();
    };
    updatePlayback();
    motion.addEventListener("change", updatePlayback);
    return () => motion.removeEventListener("change", updatePlayback);
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <>
      {/* Opaque, hero-sized footage. Nothing fades or bleeds into the next section. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-ink-900">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(1.35)" }}
          src="/home/showreel.mp4"
        />
        {/* Contrast overlays stay inside the video section. */}
        <div className="absolute inset-0 bg-ink-900/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/75 via-ink-900/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-900/85 to-transparent" />
      </div>
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute bottom-6 right-5 z-20 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/25 bg-ink-900/75 text-bone transition-colors hover:bg-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300 sm:right-8 lg:right-10"
      >
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </>
  );
}
