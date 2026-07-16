/**
 * Mono technical section label, e.g.  ( 02 ) — CAPABILITIES
 * Echoes the Axiom-style editorial labelling from the brief.
 * tone="dim" (default) for in-section sub-labels; tone="gold" for the brighter
 * eyebrow used by SectionHeader; tone="ink" for light (bone) surfaces.
 */
export default function SectionLabel({ index, children, tone = "dim" }) {
  const textClass =
    tone === "gold" ? "text-gold-300" : tone === "ink" ? "text-ink-900/60" : "text-bone-dim";
  const indexClass = tone === "ink" ? "text-gold-700" : "text-gold-400";
  return (
    <div className="flex items-center gap-3">
      {index != null && <span className={`font-mono text-[11px] ${indexClass}`}>({index})</span>}
      <span className="h-px w-8 bg-gold-500/40" />
      <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${textClass}`}>
        {children}
      </span>
    </div>
  );
}
