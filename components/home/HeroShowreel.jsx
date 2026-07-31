"use client";

import { useEffect, useState } from "react";

/**
 * The TVF AI showreel as the hero's background — self-hosted now, not a
 * YouTube embed. The embed version worked but fought its own player the
 * whole way: chapter/playlist chrome with no URL parameter to suppress it,
 * a multi-second third-party boot before the first frame, and cover-cropping
 * an iframe requires the cqw/cqh container-query hack since iframes don't
 * support object-fit. A real <video> element has none of that — no player
 * UI at all, starts as soon as this origin's own file is decoded, and
 * object-fit is native.
 *
 * public/home/showreel.mp4 is pre-trimmed to exactly the loop's own 0:17-2:06
 * window (ffmpeg -ss 17 -to 126, audio stripped since it's always muted) —
 * so `loop` alone is the whole loop implementation now. No JS polling a
 * player clock, no seekTo, none of the IFrame Player API machinery the
 * embed version needed just to loop somewhere other than the file's own end.
 *
 * scale(1.35) on the video itself: the source has pillarbox bars baked into
 * the actual frame (its picture occupies roughly the middle 75% of the 16:9
 * canvas), so object-fit:cover alone still shows them — cover only crops to
 * this box's aspect ratio, it can't remove content baked into the pixels.
 * Scaling the already-cover-fit video up from center pushes those bars past
 * the edges the same way the iframe's 1.35 cqw/cqh overscan used to.
 *
 * What does the blending, outermost to innermost:
 *  • bottom mask: the whole layer — footage, scrims, grain — goes
 *    transparent right at the hero's bottom edge, so the live attractor
 *    underneath emerges *through* the fading footage rather than a
 *    solid-black band with filaments popping in abruptly. Held fully opaque
 *    until just below the button row (`btnBottomPct`, Hero.jsx's own
 *    measured position via ref + getBoundingClientRect, re-measured on
 *    resize — not a guessed percentage), so the attractor never shows
 *    through the footage anywhere near the text or buttons.
 *  • entrance crossfade: opacity 0 → 1, much shorter now than the embed
 *    version's 1.2s delay — there's no third-party player to boot, just
 *    this origin's own file decoding, so a brief fade is enough to avoid
 *    a bare first frame flashing in.
 *  • grade + scrims: the footage is dimmed and desaturated toward the ink
 *    palette, cast with the same gold radial the attractor's fallback uses,
 *    and scrimmed left (headline sits there) and top (navbar) — the same
 *    treatment SceneBackground gives the attractor, because this layer
 *    paints over that one and has to carry its own copy of it. The left
 *    scrim is masked (scrimFade) to fade out right at the buttons' own
 *    bottom edge too — no text down there to protect.
 *  • the SceneBackground film grain is re-applied here at the same tile +
 *    opacity, so the texture doesn't drop out over the video area.
 *
 * lg+ only: even at 18MB (trimmed + h264, no audio), this is real weight to
 * add to the LCP viewport, and the mobile pass specifically trimmed weight
 * rather than added it — phones keep the attractor alone. Reduced-motion
 * skips it entirely, same as the attractor.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Fallback for the one render before Hero's measurement effect runs.
const FALLBACK_BTN_PCT = 88;

export default function HeroShowreel({ btnBottomPct }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false); // cue the crossfade in

  const btnPct = btnBottomPct ?? FALLBACK_BTN_PCT;
  // Scrim (headline contrast) fades out right at the buttons' own bottom
  // edge, gone 9 points later. Attractor reveal waits an extra 3 points
  // past that — so the footage settles back to full brightness first,
  // then the attractor starts emerging — and is gone by 100% regardless of
  // where that lands, since the hero itself ends there.
  const scrimFade = `linear-gradient(to bottom, black ${btnPct}%, transparent ${btnPct + 9}%)`;
  const mask = `linear-gradient(to bottom, black ${Math.min(btnPct + 3, 99)}%, transparent 100%)`;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    const t = setTimeout(() => setReady(true), 300);
    return () => {
      mq.removeEventListener("change", onChange);
      clearTimeout(t);
    };
  }, []);

  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden transition-opacity duration-[1500ms] ease-out lg:block"
      style={{
        opacity: ready ? 1 : 0,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          transform: "scale(1.35)",
          filter: "saturate(0.92) contrast(1.03) brightness(1.12)",
        }}
        src="/home/showreel.mp4"
      />

      {/* the attractor's own dressing, re-applied over the footage — lighter
          than SceneBackground's own scrims: that layer has to fight a busy
          animating attractor at full strength, this one just needs to keep
          the headline readable over calmer footage. Masked (scrimFade) to
          fade out right at the buttons' own bottom edge — no text down
          there to protect. */}
      <div
        className="absolute inset-0"
        style={{ maskImage: scrimFade, WebkitMaskImage: scrimFade }}
      >
        <div className="absolute inset-0 bg-ink-900/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/45 via-ink-900/18 to-transparent" />
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(55% 45% at 70% 35%, rgba(201,146,61,0.10), transparent 65%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-900/85 to-transparent" />
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}
