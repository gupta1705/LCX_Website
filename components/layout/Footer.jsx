import Link from "next/link";
import Magnetic from "@/components/ui/Magnetic";
import ActionButton from "@/components/ui/ActionButton";
import { NAV_LINKS, CTA, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-900">
      <div className="container-px py-16 lg:py-20">
        {/* Big CTA strip */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/[0.06] pb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            {/* no kicker over the line — the CTA is the line */}
            <h2 className="text-balance font-sans text-[clamp(2rem,5vw,5.5rem)] font-medium leading-[1.05] tracking-tightest text-bone">
              Let&apos;s make your brand{" "}
              <span className="font-serif italic text-gold-gradient">
                impossible to ignore.
              </span>
            </h2>
          </div>
          <Magnetic className="shrink-0">
            <ActionButton as={Link} href={CTA.href} tone="primary" size="lg">
              {CTA.label}
            </ActionButton>
          </Magnetic>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 pt-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="text-base font-semibold tracking-tight text-bone">
                {SITE.name}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-balance text-sm leading-relaxed text-bone-dim">
              An AI-native studio. We design, produce, and automate the content
              that gets brands noticed, faster than an agency, sharper than a
              tool.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="link-underline mt-6 inline-block font-mono text-sm text-gold-300 transition-colors hover:text-gold-100"
            >
              {SITE.email}
            </a>
          </div>

          <div>
            <p className="eyebrow mb-5">Studio</p>
            <ul className="space-y-3">
              {[...NAV_LINKS.slice(1), CTA].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Connect</p>
            <ul className="space-y-3">
              {["Instagram", "LinkedIn", "YouTube", "X / Twitter"].map((s) => (
                <li key={s}>
                  <span className="text-sm text-bone-dim">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-7 text-xs text-bone-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.2em]">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
