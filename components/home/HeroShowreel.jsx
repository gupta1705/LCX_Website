"use client";

import { useEffect, useState } from "react";

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
 *    grain — goes transparent over the hero's last ~40%, so the live
 *    attractor underneath emerges *through* the fading footage. A gradient
 *    to ink-900 would instead end in a solid-black band with filaments
 *    popping in abruptly below the hero's edge.
 *  • entrance crossfade: opacity 0 → 1 over 1.5s after a 1.2s delay. The
 *    attractor is already animating underneath, so the page opens on it and
 *    the film fades in over it — and the delay outlasts YouTube's boot
 *    (spinner/black frame), which would otherwise be the first thing seen.
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

const MASK =
  "linear-gradient(to bottom, black 55%, rgba(0,0,0,0.55) 78%, transparent 97%)";

export default function HeroShowreel() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false); // cue the crossfade in

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

  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden transition-opacity duration-[1500ms] ease-out lg:block"
      style={{
        opacity: ready ? 1 : 0,
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      <div className="absolute inset-0" style={{ containerType: "size" }}>
        <iframe
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "max(135cqw, 240cqh)",
            height: "max(75.94cqw, 135cqh)",
            filter: "saturate(0.82) contrast(1.06) brightness(0.82)",
          }}
          src="https://www.youtube-nocookie.com/embed/y_4g0q1_HnI?autoplay=1&mute=1&loop=1&playlist=y_4g0q1_HnI&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1"
          title="TVF AI showreel"
          allow="autoplay; encrypted-media"
          frameBorder="0"
          tabIndex={-1}
        />
      </div>

      {/* the attractor's own dressing, re-applied over the footage */}
      <div className="absolute inset-0 bg-ink-900/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/45 to-ink-900/15" />
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
