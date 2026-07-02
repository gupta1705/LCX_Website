/**
 * Mono technical section label, e.g.  ( 02 ) — CAPABILITIES
 * Echoes the Axiom-style editorial labelling from the brief.
 * tone="dim" (default) for in-section sub-labels; tone="gold" for the brighter
 * eyebrow used by SectionHeader — one source of truth for the labelled row.
 */
export default function SectionLabel({ index, children, tone = "dim" }) {
  const textClass = tone === "gold" ? "text-gold-300" : "text-bone-dim";
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] text-gold-400">({index})</span>
      <span className="h-px w-8 bg-gold-500/40" />
      <span className={`font-mono text-[11px] uppercase tracking-[0.32em] ${textClass}`}>
        {children}
      </span>
    </div>
  );
}
