// Single-page site — links are in-page anchors, not routes.
export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export const CTA = { label: "Start a Project", href: "#start" };

export const SITE = {
  name: "Lights Camera Experiments",
  // Compact mark for tight spaces (nav, favicon-scale contexts) — the
  // full name is always available via SITE.name for anywhere with room.
  shortName: "LCX",
  // Placeholder pending a real inbox on the new domain — was already an
  // open item under the old name (see TECH_STACK_DOCUMENTATION.md), just
  // carried forward renamed rather than newly introduced.
  email: "hello@lightscameraexperiments.com",
  tagline: "Story-first. AI-powered. Made to resonate.",
};
