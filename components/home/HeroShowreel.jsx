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
 *  • bottom mask: the whole layer — footage, scrims, grain — fades to
 *    transparent so the live attractor underneath emerges *through* the
 *    footage rather than a solid-black band with filaments popping in
 *    abruptly. Held fully opaque until just below the button row
 *    (`metrics.btnBottom`, Hero.jsx's own measured position via ref +
 *    getBoundingClientRect, re-measured on resize — not a guessed
 *    percentage), so the attractor never shows through the footage anywhere
 *    near the text or buttons.
 *    The buttons can sit only ~64px above the hero's bottom edge, so a fade
 *    that had to finish *at* that edge got squeezed into a few pixels and
 *    read as a hard horizontal cut. So the layer bleeds past the hero's
 *    bottom edge (into the empty space above the next section's heading —
 *    CapabilitiesSection is `relative` so its copy paints over this), and
 *    the fade runs the whole way down that runway on an ease-in-out curve
 *    instead of linearly — a linear alpha ramp leaves visible creases where
 *    it starts and stops. The bleed costs no reframing: the footage box
 *    stays exactly hero-sized, and the bleed is filled by the scale(1.35)
 *    overscan that was already rendering past the hero's bottom edge (just
 *    clipped). How much of that overscan is real picture depends on the
 *    window's shape — most of the source's shots have LETTERBOX bars baked
 *    in — so `bleedFor` computes it per window and the fade ends just
 *    short of the bar, never showing its hard edge.
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

const SCALE = 1.35;
// Black bars baked into the top and bottom of most of the source's shots:
// 57px of its 720px frame each.
const LETTERBOX = 57 / 720;

// How many px of real picture (overscan minus the letterbox bar) the
// footage renders below a hero of this size, less a few px of margin — how
// far the layer can bleed without its fade running into the bar's edge.
// object-cover fits the 16:9 frame to the taller of the box's own height
// or its width's 16:9 height and crops it to the box (on wide windows that
// crop eats into the bar, or past it); SCALE then grows the box about its
// center.
function bleedFor(width, height) {
  const coverH = Math.max(height, (width * 9) / 16);
  const pictureBelowCenter = Math.min(coverH * (0.5 - LETTERBOX), height / 2);
  const pictureBottom = height / 2 + SCALE * pictureBelowCenter;
  return Math.max(0, Math.floor(pictureBottom - height - 4));
}

// Opaque → transparent between two positions on an ease-in-out (cosine)
// curve, written out as stops since CSS gradients only interpolate linearly.
function easedFade(start, end, unit, steps = 12) {
  const stops = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const alpha = (1 + Math.cos(Math.PI * t)) / 2;
    stops.push(`rgba(0,0,0,${alpha.toFixed(3)}) ${(start + (end - start) * t).toFixed(2)}${unit}`);
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export default function HeroShowreel({ metrics }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false); // cue the crossfade in

  const btnPct = metrics ? (metrics.btnBottom / metrics.height) * 100 : FALLBACK_BTN_PCT;
  const bleed = metrics ? bleedFor(metrics.width, metrics.height) : 0;
  // Scrim (headline contrast) fades out right at the buttons' own bottom
  // edge, gone 9 points later — capped at the hero box's own bottom, since
  // the scrims end there and any strength left would show as a seam where
  // the bled footage continues unscrimmed. Attractor reveal waits an extra
  // 3% of the hero past the buttons — so the footage settles back to full
  // brightness first, then the attractor starts emerging — and runs to the
  // bottom of the bleed. In px once measured, since the layer is taller
  // than the hero by a px amount.
  const scrimFade = `linear-gradient(to bottom, black ${btnPct}%, transparent ${Math.min(btnPct + 9, 100)}%)`;
  const mask = metrics
    ? easedFade(
        Math.min(metrics.btnBottom + metrics.height * 0.03, metrics.height),
        metrics.height + bleed,
        "px"
      )
    : easedFade(Math.min(btnPct + 3, 99), 100, "%");

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
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden overflow-hidden transition-opacity duration-[1500ms] ease-out lg:block"
      style={{
        bottom: -bleed,
        opacity: ready ? 1 : 0,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {/* hero-sized, not bled-layer-sized: keeps the footage's framing and
          every hero-relative gradient below exactly where they were. Not
          clipped itself — the video's overscan past its bottom edge is what
          fills the bleed. */}
      <div className="absolute inset-x-0 top-0" style={{ bottom: bleed }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `scale(${SCALE})`,
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
      </div>
      {/* full bled height, so the grain fades out with the footage and hands
          over to SceneBackground's own grain underneath without a seam */}
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}
