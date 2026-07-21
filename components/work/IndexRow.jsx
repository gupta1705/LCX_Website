// Index-row primitives. Entrance is static — no scroll fade-up / rule-draw
// (that "everything eases in as you scroll" pattern reads as generic/AI), and
// the per-row top hairline is gone with every other segment rule on the site:
// the rows are separated by generous padding and the oversized index numeral,
// which is enough. The hover effects (row wash, numeral ignite) stay; they're
// intent, not entrance.

/** Gold breath across the row on hover — opacity only, no layout shift. */
export function RowWash() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold-500/[0.05] via-gold-500/[0.015] to-transparent opacity-0 transition-opacity duration-500 ease-out-expo group-hover:opacity-100"
    />
  );
}

/** One grid cell of an index row. `delay` is accepted but ignored (static). */
export function Cell({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

/**
 * Oversized serif index numeral — a ghost at rest that ignites into the gold
 * gradient on row hover. Two stacked layers because gradient text can't
 * transition its color.
 */
export function IndexNumeral({ n }) {
  // Font size + tight leading live on the wrapper so the spans inherit them,
  // which keeps `em` units (the padding/margin below) in the numeral's scale.
  // leading-[0.8] makes the line-box shorter than the glyph ink, so each layer
  // gets vertical padding to grow its box past the glyph — critical for the
  // gold layer, whose `background-clip: text` gradient only paints inside its
  // box (without the padding the descending curves of 3/4/5/0 render
  // transparent). The wrapper's matching negative margin cancels that padding
  // so the numeral's on-screen position and footprint are unchanged.
  return (
    <div
      className="grid select-none font-serif text-[clamp(3.5rem,7.5vw,8.75rem)] italic leading-[0.8] tracking-[-0.04em] [margin-block:-0.3em]"
      aria-hidden="true"
    >
      <span className="[grid-area:1/1] py-[0.3em] text-bone/[0.14] transition-opacity duration-[600ms] ease-out-expo group-hover:opacity-40">
        {n}
      </span>
      <span className="[grid-area:1/1] py-[0.3em] text-gold-gradient opacity-0 transition-opacity duration-[600ms] ease-out-expo group-hover:opacity-100">
        {n}
      </span>
    </div>
  );
}
