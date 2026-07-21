"use client";

import { useState } from "react";
import { Feather, Zap, Cpu, Radar } from "lucide-react";

/**
 * The four principles as one solid object — a "forme", the locked-up frame of
 * type on a press bed: four plates butted edge to edge, held in one chase.
 *
 * This replaces a 3D orbit that lost a fight it could never win. The page's
 * permanent background is a Lorenz attractor drawn as thousands of thin gold
 * CURVES; the orbit was a thin gold curve carrying four thin gold rings, so it
 * dissolved into the very thing it sat on. Two of its four nodes were routinely
 * invisible, and a bright filament could park itself behind a node.
 *
 * The fix is material, not tuning, and works three ways:
 *   1. OCCLUSION. The slab is opaque (#16140F over the page's #0A0908). The
 *      attractor is `fixed inset-0 z-0`, so inside this rectangle it simply
 *      does not exist — separation is a z-order fact, not a contrast tweak.
 *      It is set LIGHTER than the page, not darker: the scene's warm radial
 *      lifts the ambient, so a darker plate would read as a punched hole.
 *   2. NO CURVES. The component contains no arcs and no strokes-as-content —
 *      only filled letterforms and dead-straight 1px seams, against a
 *      background made exclusively of curved strokes.
 *   3. GOLD AS PIGMENT, NOT LIGHT. Gold appears only inside letterforms and in
 *      straight seams. It is never a drawn glowing arc, which is the
 *      background's own material.
 *
 * The one authored mechanic: `relatedIds` is a closed 4-cycle
 * (Story-Speed-Machines-Edge-Story). With the columns in that order every ring
 * edge IS a seam of the object — except the 4↔1 wrap, which is the slab's own
 * outer edges, running off one end and back in the other. Hovering a column
 * lights exactly its two ring edges. The ring the orbit existed to draw is
 * drawn by the object's own joints, with zero added marks.
 *
 * Nothing here animates on its own, and nothing transforms — over a background
 * that never stops moving, any element that shifts position joins the
 * animation. State changes are colour only.
 */

// Re-supplied grain: the plate occludes the sitewide film grain in
// SceneBackground, so without this it reads as pasted-on flat vector. 128px
// tile against the sitewide 160px so the two never beat against each other.
// Plain alpha, no blend mode — a blend mode would force a full-screen
// recomposite every frame over the animating canvas.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='pf'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pf)'/%3E%3C/svg%3E\")";

const PRINCIPLES = [
  {
    id: 1,
    serial: "04.1",
    category: "Craft",
    icon: Feather,
    pre: "",
    accent: "Story",
    post: " over spectacle.",
    blurb:
      "The idea and the emotion do the work. A flawless render that says nothing never leaves the building.",
    related: ["Speed", "Edge"],
  },
  {
    id: 2,
    serial: "04.2",
    category: "Tempo",
    icon: Zap,
    pre: "Speed is a ",
    accent: "feature",
    post: ".",
    blurb:
      "Momentum is part of the value, not a compromise on it. We move at the speed of the platform, not the agency.",
    related: ["Story", "Machines"],
  },
  {
    id: 3,
    serial: "04.3",
    category: "Systems",
    icon: Cpu,
    pre: "Build ",
    accent: "machines",
    post: ", not deliverables.",
    blurb:
      "We ship the system that makes the content, not a folder of one-off assets. The engine outlasts the campaign.",
    related: ["Speed", "Edge"],
  },
  {
    id: 4,
    serial: "04.4",
    category: "Frontier",
    icon: Radar,
    pre: "Stay on the ",
    accent: "edge",
    post: ".",
    blurb:
      "We live on the frontier of what these models can do. The edge moves every week, so do we.",
    related: ["Machines", "Story"],
  },
];

const SEAM_BASE =
  "pointer-events-none absolute z-20 transition-[background-color,box-shadow] duration-[450ms] ease-out-expo";
const SEAM_LIT = "bg-gold-500/60 shadow-[0_0_10px_-1px_rgba(201,146,61,0.45)]";
const SEAM_DIM = "bg-white/[0.09]";

export default function PrinciplesForme() {
  const [activeId, setActiveId] = useState(null);

  // A seam carries the ring edge between principles `a` and `b`.
  const seam = (a, b) => `${SEAM_BASE} ${activeId === a || activeId === b ? SEAM_LIT : SEAM_DIM}`;
  // The 4↔1 wrap lives on the slab's outer edges.
  const wrapLit = activeId === 4 || activeId === 1;

  return (
    <div className="relative isolate mt-12 w-full max-w-[1280px] lg:mt-16">
      <div className="relative overflow-hidden bg-ink-700 shadow-[0_0_0_1px_rgba(10,9,8,0.92),inset_0_1px_0_0_rgba(247,227,181,0.09)]">
        {/* grain, re-supplied over the occluded sitewide layer */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.045]"
          style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
        />

        <ul className="relative z-10 grid grid-cols-1 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            const isActive = activeId === p.id;
            // Below lg the columns stack, so the ring edge between p(i) and
            // p(i-1) is this row's top border rather than a vertical seam.
            const stackedEdgeLit = activeId === p.id || activeId === p.id - 1;
            return (
              <li
                key={p.id}
                tabIndex={0}
                onMouseEnter={() => setActiveId(p.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(p.id)}
                onBlur={() => setActiveId(null)}
                onClick={() => setActiveId((c) => (c === p.id ? null : p.id))}
                className={`relative flex flex-col px-6 py-9 outline-none transition-colors duration-[450ms] ease-out-expo focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gold-400 lg:border-t-0 lg:px-7 lg:py-11 xl:px-8 xl:py-12 ${
                  i > 0 ? "border-t" : "border-t-0"
                } ${
                  i > 0 && stackedEdgeLit ? "border-gold-500/60" : "border-white/[0.09]"
                } ${isActive ? "bg-white/[0.022]" : "bg-transparent"}`}
              >
                <div
                  className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-[450ms] ease-out-expo ${
                    isActive ? "text-gold-300" : "text-bone-faint"
                  }`}
                >
                  <span>{p.serial}</span>
                  <Icon
                    size={12}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={isActive ? "text-gold-400" : "text-bone-faint"}
                  />
                  <span>{p.category}</span>
                </div>

                <p className="mt-6 font-serif text-[clamp(1.5rem,2vw,2rem)] font-medium leading-[1.12] tracking-tight text-bone">
                  {p.pre}
                  <span className={isActive ? "gold-flow italic" : "italic text-gold-gradient"}>
                    {p.accent}
                  </span>
                  {p.post}
                </p>

                <p
                  className={`mt-5 text-[14px] leading-relaxed transition-colors duration-[450ms] ease-out-expo lg:text-[15px] ${
                    isActive ? "text-bone/[0.78]" : "text-bone-dim"
                  }`}
                >
                  {p.blurb}
                </p>

                {/* the seam ring is visual only — state the relation for AT */}
                <span className="sr-only">
                  Related principles: {p.related.join(" and ")}.
                </span>
              </li>
            );
          })}
        </ul>

        {/* The ring, drawn by the object's own joints. Vertical seams only
            exist where the four columns actually sit side by side. */}
        <span aria-hidden="true" className={`${seam(1, 2)} inset-y-0 left-1/4 hidden w-px lg:block`} />
        <span aria-hidden="true" className={`${seam(2, 3)} inset-y-0 left-1/2 hidden w-px lg:block`} />
        <span aria-hidden="true" className={`${seam(3, 4)} inset-y-0 left-3/4 hidden w-px lg:block`} />

        {/* the 4↔1 wrap: off one end of the frame and back in the other */}
        <span
          aria-hidden="true"
          className={`${SEAM_BASE} inset-y-0 left-0 w-px ${wrapLit ? SEAM_LIT : SEAM_DIM}`}
        />
        <span
          aria-hidden="true"
          className={`${SEAM_BASE} inset-y-0 right-0 w-px ${wrapLit ? SEAM_LIT : SEAM_DIM}`}
        />
      </div>
    </div>
  );
}
