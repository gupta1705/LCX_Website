import { Database, Bot, Send } from "lucide-react";

/**
 * Gold-framed, translucent visual placeholder for the three standard pillars.
 * Translucent bg lets the global attractor breathe through. Decorative only.
 * variant:
 *  - "single"  → one framed 3:2 surface with a low-opacity watermark icon
 *  - "gallery" → 2x2 mini-grid (distinguishes AI Images)
 *  - "diagram" → Source → Agent → Publish node chips (conveys "the machine")
 */
const DIAGRAM_NODES = [
  { Icon: Database, label: "Source" },
  { Icon: Bot, label: "Agent" },
  { Icon: Send, label: "Publish" },
];

export default function PillarFrame({ variant = "single", Icon, caption }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gold-soft bg-ink-900/55 p-4 backdrop-blur-sm sm:p-6">
      {/* inner hairline ring */}
      <div className="pointer-events-none absolute inset-2 rounded-xl ring-1 ring-white/10" />
      {/* gold wash on hover (matches Home card language) */}
      <span className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold-500/0 blur-3xl transition-all duration-700 group-hover:bg-gold-500/15" />

      <div className="relative">
        {variant === "single" && (
          <div className="grid aspect-[3/2] place-items-center rounded-xl bg-[radial-gradient(120%_90%_at_30%_0%,rgba(201,146,61,0.14),transparent_60%)]">
            {Icon && (
              <Icon
                className="h-14 w-14 text-gold-500/30"
                strokeWidth={1}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {variant === "gallery" && (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid aspect-square place-items-center rounded-lg border border-white/[0.07] bg-ink-900/55"
              >
                {i === 0 && Icon && (
                  <Icon
                    className="h-8 w-8 text-gold-500/35"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {variant === "diagram" && (
          <div className="flex aspect-[3/2] flex-col justify-center px-1">
            {DIAGRAM_NODES.map((n, i) => (
              <div key={n.label}>
                <div className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-ink-800/60 px-4 py-3">
                  <n.Icon
                    className="h-4 w-4 text-gold-300"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim">
                    {n.label}
                  </span>
                </div>
                {i < DIAGRAM_NODES.length - 1 && (
                  <span className="mx-auto block h-3 w-px bg-gradient-to-b from-gold-500/60 to-transparent" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {caption && (
        <div className="relative mt-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone-faint">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}
