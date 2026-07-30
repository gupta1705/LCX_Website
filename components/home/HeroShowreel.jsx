"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The TVF AI showreel as the hero's background — YouTube-hosted (no local
 * file exists), so it's an iframe embed dressed to read as one continuous
 * plate with the attractor rather than a video pasted on top of the site.
 * The first attempt at this lived behind the Capabilities header and read
 * exactly like that pasted patch: an opaque rectangle with hard top/bottom
 * seams interrupting the attractor mid-page. Top of page is the one place a
 * full-bleed video has no top seam to fight, and a showreel is hero material
 * anyway.
 *
 * What does the blending, outermost to innermost:
 *  • bottom mask (not a black gradient): the whole layer — footage, scrims,
 *    grain — goes transparent right at the hero's bottom edge, so the live
 *    attractor underneath emerges *through* the fading footage rather than a
 *    solid-black band with filaments popping in abruptly. Held fully opaque
 *    until just below the button row, so the attractor never shows through
 *    the footage anywhere near the text or buttons — a first pass hardcoded
 *    that "just below the buttons" point as a percentage guessed from three
 *    test window sizes, which is exactly as fragile as it sounds: it holds
 *    only at those three sizes, and drifts anywhere else. `btnBottomPct` is
 *    the button row's own real measured position (Hero.jsx, via ref +
 *    getBoundingClientRect, re-measured on resize), so this now starts at
 *    the actual rendered edge on any window, not a guess.
 *  • entrance crossfade: opacity 0 → 1 over 1.5s after a 1.2s delay. The
 *    attractor is already animating underneath, so the page opens on it and
 *    the film fades in over it — and the delay outlasts YouTube's boot
 *    (spinner/black frame), which would otherwise be the first thing seen.
 *  • loop point at 2:06, not the video's own end: a first pass used the
 *    URL-only trick (`loop=1`+`playlist=<same id>`+`end=126`), which works,
 *    but a `playlist` param — even a single-video one, purely to make `loop`
 *    honor `end` — puts the embed in "playlist mode," and YouTube shows its
 *    playlist prev/next-track chrome over the footage for a few seconds on
 *    load regardless of `controls=0` (that param only hides the scrubber
 *    bar, not playlist navigation). Replaced with the real IFrame Player
 *    API instead: no `playlist`/`loop` params at all, just `enablejsapi=1`
 *    and a poll on `getCurrentTime()` that calls `seekTo(0)` on crossing
 *    2:06 — the loop still happens, but nothing about it reads as a
 *    playlist to the player, so that chrome never has a reason to render.
 *  • grade + scrims: the footage is dimmed and desaturated toward the ink
 *    palette, cast with the same gold radial the attractor's fallback uses,
 *    and scrimmed left (headline sits there) and top (navbar) — the same
 *    treatment SceneBackground gives the attractor, because this layer
 *    paints over that one and has to carry its own copy of it.
 *  • the SceneBackground film grain is re-applied here at the same tile +
 *    opacity, so the texture doesn't drop out over the video area.
 *
 * Sizing: container-type:size + cqw/cqh gives object-fit:cover math against
 * this box's real aspect ratio. The 1.35 overscan on both axes is not
 * optional polish — the upload carries baked-in pillarbox bars (its picture
 * occupies roughly the middle 75% of the 16:9 frame, per the first
 * integration's screenshot), so a plain cover crop still shows black bars;
 * 1.35 ≥ 1/0.75 pushes them past the edges.
 *
 * lg+ only: a YouTube embed is megabytes of third-party boot over the LCP
 * viewport, and the mobile pass just got the site lean — phones keep the
 * attractor alone. Reduced-motion skips it entirely, same as the attractor.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Fallback for the one render before Hero's measurement effect runs.
const FALLBACK_BTN_PCT = 88;

// 2:06 — the loop point, not the video's own runtime.
const LOOP_END_SECONDS = 126;

export default function HeroShowreel({ btnBottomPct }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false); // cue the crossfade in
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const pollRef = useRef(null);

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
    const t = setTimeout(() => setReady(true), 1200);
    return () => {
      mq.removeEventListener("change", onChange);
      clearTimeout(t);
    };
  }, []);

  // Wire the IFrame Player API to the embed once it's in the DOM, and poll
  // its own clock to jump back to 0 on crossing LOOP_END_SECONDS — see the
  // file-header note on why this replaced the loop=1+playlist URL trick.
  useEffect(() => {
    if (!mounted || reduced) return;
    let cancelled = false;

    const startPolling = (player) => {
      pollRef.current = setInterval(() => {
        if (typeof player.getCurrentTime !== "function") return;
        if (player.getCurrentTime() >= LOOP_END_SECONDS) player.seekTo(0, true);
      }, 500);
    };

    const createPlayer = () => {
      if (cancelled || !iframeRef.current) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING && !pollRef.current) startPolling(e.target);
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        createPlayer();
      };
    }

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
      playerRef.current?.destroy?.();
    };
  }, [mounted, reduced]);

  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden transition-opacity duration-[1500ms] ease-out lg:block"
      style={{
        opacity: ready ? 1 : 0,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <div className="absolute inset-0" style={{ containerType: "size" }}>
        <iframe
          ref={iframeRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "max(135cqw, 240cqh)",
            height: "max(75.94cqw, 135cqh)",
            filter: "saturate(0.92) contrast(1.03) brightness(1.12)",
          }}
          // enablejsapi=1: required for the postMessage API (above) to seek
          // this player. No loop/playlist param — see the file-header note.
          src="https://www.youtube-nocookie.com/embed/y_4g0q1_HnI?autoplay=1&mute=1&start=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1"
          title="TVF AI showreel"
          allow="autoplay; encrypted-media"
          frameBorder="0"
          tabIndex={-1}
        />
      </div>

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
