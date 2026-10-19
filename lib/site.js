// Single-page site — links are in-page anchors, not routes.
export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export const CTA = { label: "Start a Project", href: "#start" };

export const SITE = {
  name: "Lights Camera Experiments",
  // Compact mark for tight spaces (nav, favicon-scale contexts) — the
  // full name is always available via SITE.name for anywhere with room.
  shortName: "LCX",
  // Enquiry inbox — every mailto on the site (footer, nav drawer, contact
  // form + its success note) reads from here, so this one value is the
  // single place to change where "Start a project" enquiries land.
  email: "kartikeyap@lightscameraexperiment.com",
  tagline: "Story-first. AI-powered. Made to resonate.",
};
