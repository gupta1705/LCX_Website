import { Megaphone, Clapperboard, Aperture, Workflow, LayoutGrid } from "lucide-react";

const ICONS = { Megaphone, Clapperboard, Aperture, Workflow };

/**
 * One Labs Experiment, following the case template: name + client → one-line
 * problem → exactly 3 "what we did" bullets → the result (an illustrative
 * figure, or a visual when there's no number). NON-NAVIGATING <article> — no
 * detail routes exist yet; the "Labs Experiment" badge frames it as spec work.
 * Result figures are STATIC (not CountUp) so the grid doesn't fire six count
 * animations on scroll.
 */
export default function WorkCard({ caseItem, wide = false }) {
  const { category, client, projectName, problem, did = [], result, resultType, icon } = caseItem;
  const Icon = ICONS[icon] || Aperture;
  const VisualIcon = category === "Automation" ? Workflow : LayoutGrid;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 ease-out-expo hover:border-gold-soft hover:bg-white/[0.04]">
      {/* hover wash — own overflow-hidden wrapper */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <span className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold-500/0 blur-3xl transition-all duration-700 group-hover:bg-gold-500/15" />
      </span>

      {/* visual — never-empty gold frame */}
      <div className={`relative overflow-hidden ${wide ? "aspect-video" : "aspect-[4/3]"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_0%,rgba(201,146,61,0.14),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-3 rounded-xl ring-1 ring-white/10" />
        <div className="absolute inset-0 grid place-items-center">
          <Icon className="h-12 w-12 text-gold-500/30" strokeWidth={1} aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-ink-900/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-200 backdrop-blur-sm">
          {category}
        </span>
        <span className="absolute right-4 top-4 rounded-full border border-gold-soft bg-ink-900/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-300 backdrop-blur-sm">
          Labs Experiment
        </span>
      </div>

      {/* body */}
      <div className="relative flex flex-1 flex-col gap-3 p-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">{client}</span>
        <h3 className="text-lg font-medium tracking-tight text-bone">{projectName}</h3>
        <p className="text-sm leading-relaxed text-bone-dim">{problem}</p>

        <div className="mt-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-300">What we did</p>
          <ul className="mt-3 space-y-2.5">
            {did.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm leading-relaxed text-bone-dim">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* result closer — pinned to the bottom for a consistent baseline */}
        <div className="mt-auto pt-5">
          <span className="block hairline" />
          <dl className="mt-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-300">The result</dt>
            {resultType === "number" ? (
              <dd>
                <p className="mt-2 font-sans text-[clamp(1.8rem,4vw,2.6rem)] leading-none tracking-tightest text-gold-gradient">
                  {result}
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-faint">
                  Illustrative figure
                </p>
              </dd>
            ) : (
              <dd className="relative mt-2 overflow-hidden rounded-xl border border-gold-soft bg-ink-900/55 px-4 py-3">
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_0%,rgba(201,146,61,0.12),transparent_60%)]" />
                <div className="relative flex items-center gap-3">
                  <VisualIcon className="h-5 w-5 shrink-0 text-gold-500/40" strokeWidth={1.5} aria-hidden="true" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-200">{result}</p>
                </div>
              </dd>
            )}
          </dl>
        </div>
      </div>

      {/* baseline gold rule on hover */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold-500 to-transparent transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
    </article>
  );
}
