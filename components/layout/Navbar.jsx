"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import Logo from "./Logo";
import Magnetic from "@/components/ui/Magnetic";
import ActionButton from "@/components/ui/ActionButton";
import { NAV_LINKS, CTA, SITE } from "@/lib/site";

// All five destinations, numbered — tab names unchanged. Single-page anchors.
const MENU_ITEMS = [...NAV_LINKS, CTA];
// Placeholder hrefs — swap for real profile URLs when available.
const SOCIALS = [
  { label: "Instagram", Icon: Instagram, href: "https://instagram.com" },
  { label: "LinkedIn", Icon: Linkedin, href: "https://linkedin.com" },
  { label: "YouTube", Icon: Youtube, href: "https://youtube.com" },
  { label: "X / Twitter", Icon: Twitter, href: "https://x.com" },
];
const EASE = [0.76, 0, 0.24, 1];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [showCta, setShowCta] = useState(false);
  const reduced = useReducedMotion();
  const triggerRef = useRef(null);
  const wasOpen = useRef(false);

  // The top-bar CTA stays hidden while the hero's own "Start a project" button
  // is on screen, then animates into the top-right once it scrolls away — so
  // the two never duplicate, and a persistent CTA is always a click away after.
  useEffect(() => {
    const heroCta = document.getElementById("hero-start-cta");
    if (!heroCta) {
      setShowCta(true); // no hero CTA on this view → keep the nav CTA available
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setShowCta(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(heroCta);
    return () => io.disconnect();
  }, []);

  // lock scroll + ESC while the menu is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // return focus to the trigger whenever the menu closes (ESC, tap, or nav)
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  // scrollspy — the active tab is the last section whose top has crossed the
  // reference line; forced to the last section at the page bottom (the footer
  // otherwise keeps #start from ever reaching the line). Position-based so it
  // is correct after direct jumps, not just incremental scrolling.
  useEffect(() => {
    const ids = MENU_ITEMS.map((m) => m.href.slice(1));
    let raf = 0;
    const pick = () => {
      raf = 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }
      const line = window.innerHeight * 0.4;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // close the menu, then smooth-scroll to the anchor once the body unlocks
  const scrollToHash = (e, href) => {
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    const id = href.slice(1);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el && id !== "home") {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }
      history.replaceState(null, "", id === "home" ? "/" : href);
    }, 130);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`flex items-center justify-between pt-5 transition-[padding] duration-300 ${
            open ? "px-5 sm:px-6" : "px-6 sm:px-10 lg:px-16"
          }`}
        >
          <div
            className={`flex items-center rounded-full border border-white/[0.07] bg-ink-900/90 transition-all duration-300 ${
              open ? "gap-2 p-1.5 pr-4" : "gap-1.5 p-1 pr-3"
            }`}
          >
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`group relative grid place-items-center rounded-full text-bone transition-all duration-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                open ? "h-11 w-11" : "h-10 w-10"
              }`}
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-bone transition-all duration-300 ease-out-expo ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-bone transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-bone transition-all duration-300 ease-out-expo ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
            <Logo size={open ? "lg" : "base"} expanded={open} />
          </div>

          <AnimatePresence>
            {showCta && (
              <motion.div
                key="nav-cta"
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: 26, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: 26, scale: 0.94 }}
                transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE }}
                className="hidden sm:block"
              >
                <Magnetic>
                  <ActionButton
                    as="a"
                    href={CTA.href}
                    onClick={(e) => scrollToHash(e, CTA.href)}
                    tone="primary"
                    size="sm"
                  >
                    {CTA.label}
                  </ActionButton>
                </Magnetic>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <CurvedMenu
            key="menu"
            reduced={reduced}
            activeId={activeId}
            onNavigate={scrollToHash}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CurvedMenu({ reduced, activeId, onNavigate, onClose }) {
  const panelRef = useRef(null);

  // move focus into the dialog on open
  useEffect(() => {
    const first = panelRef.current?.querySelector("a[href], button:not([disabled])");
    first?.focus({ preventScroll: true });
  }, []);

  // trap Tab within the dialog (ESC still closes, handled in Navbar)
  const trapTab = (e) => {
    if (e.key !== "Tab") return;
    const nodes = panelRef.current?.querySelectorAll("a[href], button:not([disabled])");
    if (!nodes || !nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const slide = {
    initial: { x: reduced ? 0 : "calc(-100% - 120px)", opacity: reduced ? 0 : 1 },
    enter: { x: 0, opacity: 1, transition: { duration: reduced ? 0.2 : 0.8, ease: EASE } },
    exit: {
      x: reduced ? 0 : "calc(-100% - 120px)",
      opacity: reduced ? 0 : 1,
      transition: { duration: reduced ? 0.2 : 0.8, ease: EASE },
    },
  };

  return (
    <>
      {/* dim backdrop — makes the drawer read as intentional and closes on tap */}
      <motion.div
        className="fixed inset-0 z-30 bg-ink-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onKeyDown={trapTab}
        variants={slide}
        initial="initial"
        animate="enter"
        exit="exit"
        className="fixed left-0 top-0 z-40 h-[100dvh] w-[85%] max-w-[400px] bg-ink-800 shadow-[10px_0_50px_-12px_rgba(0,0,0,0.85)] sm:max-w-lg"
      >
      <div className="flex h-full flex-col justify-between overflow-y-auto px-8 pb-8 pt-24 sm:px-12">
        <nav>
          <p className="flex items-center gap-3 border-b border-white/10 pb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-bone-faint">
            Navigation
            <span className="ml-auto text-gold-400">(01 to 0{MENU_ITEMS.length})</span>
          </p>
          <ul>
            {MENU_ITEMS.map((item, i) => (
              <li key={item.href}>
                <MenuLink
                  item={item}
                  index={i + 1}
                  active={activeId === item.href.slice(1)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 border-t border-white/10 pt-6">
          <a
            href={`mailto:${SITE.email}`}
            className="font-mono text-sm text-gold-300 transition-colors hover:text-gold-100"
          >
            {SITE.email}
          </a>
          <div className="mt-4 flex items-center gap-4">
            {SOCIALS.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-sm text-bone-dim transition-colors hover:text-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <Curve reduced={reduced} />
      </motion.div>
    </>
  );
}

function MenuLink({ item, index, active, onNavigate }) {
  return (
    <a
      href={item.href}
      onClick={(e) => onNavigate(e, item.href)}
      aria-current={active ? "true" : undefined}
      className="group flex items-baseline gap-4 border-b border-white/10 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800 md:py-6"
    >
      <span
        className={`shrink-0 font-mono text-base tabular-nums transition-colors duration-300 ${
          active ? "text-gold-200" : "text-gold-500/70 group-hover:text-gold-300"
        }`}
      >
        0{index}
      </span>
      {/* plain text so long labels wrap cleanly at spaces, never mid-word */}
      <span
        className={`block text-[clamp(1.2rem,5vw,2.4rem)] uppercase leading-[1.05] tracking-tight transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2 ${
          active ? "translate-x-2 text-gold-200" : "text-bone group-hover:text-gold-100"
        }`}
      >
        {item.label}
      </span>
    </a>
  );
}

function Curve({ reduced }) {
  const [h, setH] = useState(0);

  useEffect(() => {
    const set = () => setH(window.innerHeight);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  if (!h) return null;

  const bulged = `M0 0 L0 ${h} L100 ${h} Q200 ${h / 2} 100 0 Z`;
  const flat = `M0 0 L0 ${h} L100 ${h} Q100 ${h / 2} 100 0 Z`;

  const curve = {
    initial: { d: reduced ? flat : bulged },
    enter: { d: flat, transition: { duration: reduced ? 0.2 : 1, ease: EASE } },
    exit: { d: reduced ? flat : bulged, transition: { duration: reduced ? 0.2 : 0.8, ease: EASE } },
  };

  return (
    <svg
      className="absolute top-0 -right-[99px] h-full w-[100px]"
      style={{ fill: "#0F0E0C" }}
      aria-hidden="true"
    >
      <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
}
