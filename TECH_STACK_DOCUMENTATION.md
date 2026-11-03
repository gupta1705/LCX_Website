# Lights Camera Experiments (LCX) — Tech Stack & Architecture

**Project:** Lights Camera Experiments (LCX) — an AI-native creative studio
**Type:** Single-page marketing site (5 anchored sections)
**Stack:** Next.js 14 (App Router) · React 18 · Tailwind CSS 3.4 · Three.js / R3F · Framer Motion
**Language:** JavaScript (JSX) — no TypeScript
**Repo:** `gupta1705/TVF-AI-Website` · **Host:** Vercel (auto-deploys on push to `master`)

---

## 1. Overview

A one-page, scroll-driven site built around a single idea: the studio "runs two things at once" — **The Studio** (directed, cinematic films) and **The Engine** (autonomous content systems). The whole thing sits on a near-black canvas with a champagne-to-gold accent scale and a live golden WebGL background that reacts to scroll and cursor.

Design language (internal name: *"The Engraved Ledger"*): gold on near-black, serial plates, schematic readouts, hairline rules — the site behaves like an engraved certificate of value.

---

## 2. Tech Stack

### Runtime dependencies

| Package | Version | Role |
|---|---|---|
| `next` | 14.2 | React framework, App Router, static rendering, font optimization |
| `react` / `react-dom` | 18.3.1 | UI library + DOM renderer |
| `three` | 0.169.0 | WebGL 3D engine (the background attractor) |
| `@react-three/fiber` | 8.17.10 | React renderer for Three.js |
| `@react-three/drei` | 9.114.3 | R3F helpers |
| `@react-three/postprocessing` | 2.16.3 | Bloom + Vignette post effects |
| `framer-motion` | 11.11.17 | All DOM animation (reveals, nav, hero word-cycle, cards) |
| `lucide-react` | 0.460.0 | SVG icon set |

### Dev dependencies

| Package | Version | Role |
|---|---|---|
| `tailwindcss` | 3.4.14 | Utility-first styling |
| `postcss` | 8.4.47 | CSS pipeline |
| `autoprefixer` | 10.4.20 | Vendor prefixing (`background-clip: text`, etc.) |

### Fonts — loaded via `next/font/google` in `app/layout.jsx`

| Role | Face | Config | Where it's used |
|---|---|---|---|
| Sans (`--font-sans`) | **Schibsted Grotesk** | variable 400–900 | Headlines + body |
| Serif (`--font-serif`) | **Zilla Slab** | 400/500/600 + true italic | Gold accent words, big index numerals |
| Mono (`--font-mono`) | **Fragment Mono** | fixed 400 | Eyebrows, tags, serial plates, captions |

All three are deliberately rare choices (away from Inter/Playfair defaults). The serif was switched from Besley → Zilla Slab because Besley's italic swashes on short words like "films" read as extra letters.

### Scripts

```bash
npm run dev     # dev server on :3000 (HMR)
npm run build   # production build → .next/
npm start       # serve the production build
```

---

## 3. Project Structure

```
TVF - AI Website/
├── app/
│   ├── layout.jsx          # Root: fonts, <SceneBackground>, Navbar, Footer, metadata
│   ├── page.jsx            # The single page — stacks the 5 sections
│   ├── globals.css         # Tailwind layers, CSS tokens, .container-px/.eyebrow/gradients
│   └── icon.svg            # Favicon (thermometer glyph)
│
├── components/
│   ├── three/
│   │   ├── SceneBackground.jsx   # Fixed full-screen wrapper: CSS fallback + lazy canvas + scrims
│   │   └── AttractorScene.jsx    # The live Lorenz attractor (R3F canvas, all the 3D logic)
│   │
│   ├── layout/
│   │   ├── Navbar.jsx      # Fixed logo pill + hamburger → off-canvas menu (Framer Motion)
│   │   ├── Logo.jsx        # "the v[i]ral labs" wordmark, inline SVG thermometer for the "i"
│   │   └── Footer.jsx      # Tagline, email, socials
│   │
│   ├── home/
│   │   └── Hero.jsx        # #home — "We make [word] that resonate." + rotating word + CTAs
│   │
│   ├── sections/
│   │   ├── CapabilitiesSection.jsx  # #capabilities — header + pinned Studio/Engine + BrandStack
│   │   ├── WorkSection.jsx          # #work — filmography index (FILMS + SYSTEMS data live here)
│   │   ├── AboutSection.jsx         # #about — origin, approach, manifesto, team
│   │   └── ContactSection.jsx       # #start — StartProjectForm + info panel
│   │
│   ├── capabilities/
│   │   ├── CapabilitiesScroll.jsx   # Pinned scroll morph between "The Studio" and "The Engine"
│   │   ├── BrandStack.jsx           # Auto-shuffling stack of brand cards
│   │   └── VideoFrame.jsx           # Framed media block
│   │
│   ├── work/
│   │   ├── IndexRow.jsx     # Shared row primitives: RuleDraw, RowWash, Cell, IndexNumeral
│   │   ├── FilmCard.jsx     # Film entry (01–04): numeral + text + 16:9 poster/embed
│   │   ├── SystemCard.jsx   # Engine entry (05–06): numeral + text + schematic readout plate
│   │   └── PipelineDiagram.jsx  # Hand-drawn gold SVG pipeline (draws on scroll)
│   │
│   ├── start/
│   │   └── StartProjectForm.jsx  # Front-end-only inquiry form
│   │
│   └── ui/
│       ├── Reveal.jsx       # Scroll-into-view reveal wrapper
│       ├── Magnetic.jsx     # Cursor-follow magnetic wrapper (buttons)
│       ├── CountUp.jsx      # Number count-up on view
│       ├── SectionHeader.jsx / SectionLabel.jsx  # Section title + numbered eyebrow
│       └── MenuToggleIcon.jsx
│
├── public/
│   └── work/                # Brand-logo thumbnails: chaayos-logo.png, laxmipati-logo.png, coffee-logo.png
│
├── lib/site.js             # NAV_LINKS, CTA, SITE constants
├── tailwind.config.js      # Color scales, fonts, container width, keyframes
├── postcss.config.mjs · next.config.mjs · jsconfig.json (@/* → project root)
```

> **Note:** `components/work/WorkCard.jsx` and `WorkGallery.jsx` are legacy/orphaned (not imported anywhere) — the live Work UI is `FilmCard` + `SystemCard` on the `IndexRow` spine.

---

## 4. Architecture

### Rendering model

- **App Router, single route.** `app/page.jsx` renders all five sections in order; there are no sub-routes. The nav "links" are in-page anchors (`#home`, `#capabilities`, `#work`, `#about`, `#start`) with `scroll-mt-24` for the fixed-header offset and CSS `scroll-behavior: smooth`.
- **Server vs client components.** `layout.jsx` and `page.jsx` are server components. Anything interactive is a client component (`"use client"`) — the hero, nav, all three/ and framer-motion pieces, forms.
- **Persistent background.** `<SceneBackground />` is mounted once in the layout (not per-section), so the WebGL scene never remounts as you scroll — it flows continuously behind every section.

### Layout composition

```
app/layout.jsx
├── <SceneBackground/>          fixed, z-0, full-viewport (behind everything)
└── <div z-10>
    ├── <Navbar/>               fixed pill + off-canvas menu
    ├── <main> {children} ──►   app/page.jsx
    │     ├── Hero              #home
    │     ├── CapabilitiesSection  #capabilities
    │     ├── WorkSection          #work
    │     ├── AboutSection         #about
    │     └── ContactSection       #start
    └── <Footer/>
```

### Data

Content is co-located, not fetched. The Work section's `FILMS` and `SYSTEMS` arrays live at the top of `WorkSection.jsx`; brand cards live in `BrandStack.jsx`; nav/CTA/site strings live in `lib/site.js`. No CMS, no API routes, no database.

---

## 5. The WebGL Background (the signature element)

**File:** `components/three/AttractorScene.jsx` — this is the most involved part of the site.

### What it is

**One** Lorenz strange attractor (9,000-vertex additive line), treated like a camera subject. The geometry is computed once and never rebuilt; everything you see is that same form re-posed.

> The earlier version of this doc described "4 morphing attractors" — that is no longer accurate. It's a single Lorenz curve choreographed by the camera, which is both cheaper and more coherent.

### How it reacts

1. **Scroll choreography.** An 11-entry `KEYS` array defines a pose (position, zoom, rotation) at each scroll checkpoint. Scroll progress interpolates between them with a smoothstep, so scrolling reads as one continuous camera move — the same butterfly appears face-on, edge-on (compressed), diving into a wing (rings fill the screen), then wide again. `rotY` climbs monotonically so it always spins forward.
2. **Scroll "body language."** While the page is actively moving, the form spins a touch faster and compresses slightly (`SWIRL_GAIN`, `COMPRESS`), relaxing open when scrolling stops.
3. **Cursor repulsion ("the eye").** With a fine pointer, the filaments part around the cursor's sight-line — a clean cylindrical void that eases open/closed. A small gold focal dot sits at its center and swells with pointer speed. This is the "cursor expands the line" interaction.
4. **Travelling comet glow.** A bright arc runs continuously along the curve (brightest at the head, fading down a tail) via per-vertex colors, so the line looks like it's glowing along its length.

### Post-processing & performance

- `GlowPipeline` renders a quarter-resolution bloom pyramid at up to 30 Hz, reusing its texture between updates. Sharp lines and pointer interaction still render at the display's frame rate; vignette runs in the line/composite shaders.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, the canvas never mounts — a static CSS radial-gradient fallback shows instead.
- **Render budget:** DPR is capped at 1.25 and two million drawing-buffer pixels. Sustained frame rates below 50 FPS lower resolution in two steps, down to 70% of that baseline, without changing geometry or framing. MSAA stays off and pointer repulsion is disabled on coarse pointers.
- **Visibility:** canvas drawing and geometry updates are skipped when it is entirely below the viewport or the tab is hidden. A lightweight frame callback stays scheduled to avoid browser stalls when restarting. Hero video, rotating headline and text shimmer stop offscreen; video also stops in hidden tabs and preserves a visitor's manual pause when scrolling away and back.
- The video-to-loop boundary uses the same top-plane clearance calculation with constants moved outside its vertex loop; the original size and choreography are preserved.
- Buffers/materials are disposed on unmount/HMR; frustum culling is disabled (the choreography swings the form far off-center, so culling would wrongly hide it).
- `SceneBackground.jsx` layers readability scrims (left/bottom/top gradients) and a faint SVG film-grain over the canvas so text stays legible.

---

## 6. Styling & Design System

### Color (hardcoded hex in `tailwind.config.js` — not `var()` wrappers)

| Token | Scale | Notes |
|---|---|---|
| `ink` | 900 `#0A0908` → 500 `#2A261D` | Warm-shifted near-black base |
| `bone` | `#F4F1EA`, `dim #B6B0A4`, `faint #8C857A` | Warm whites for text |
| `gold` | 50 `#FBF1D9` → 800 `#5C3E18`, primary = 500 `#C9923D` | Champagne → deep gold |

`globals.css` also defines `:root` vars (`--gold`, `--gold-bright`, `--ink`) used by the CSS fallback background and a few effects.

### Type scale (responsive)

Headlines use `clamp(min, VWvw, max)` so they grow with the viewport and settle on wide screens. The full ladder was tuned so nothing balloons past the container and the hierarchy stays monotonic. Representative caps at ~2000px: hero **128px**, Studio/Engine titles ~116px, section headers ~108px, down through card titles ~52px. Mobile mins (e.g. hero 2.6rem ≈ 42px) are fixed. Body copy also steps up at `xl`.

### Layout tokens

- **Container:** `max-w-container` = **1600px** (`.container-px` adds it + responsive padding `px-5 sm:px-8 lg:px-10`). Widened from 1240px so content fills large monitors.
- **Breakpoints:** Tailwind defaults — `sm` 640 / `lg` 1024 / `xl` 1280.
- **Letter-spacing:** custom `tightest -0.03em`, `tighter -0.02em` (tuned for Schibsted).

### Reusable CSS (in `@layer components`)

`.container-px`, `.eyebrow` (mono label), `.text-gold-gradient` (background-clip gradient text), `.text-gold-shimmer`, `.gold-flow` (travelling sheen on accent words), `.link-underline` (left-origin underline draw), `.hairline`, `.panel`, `.border-gold-soft`.

### Custom keyframes / animations

`fade-up`, `shimmer`, `marquee`, `pulse-soft`, `gold-flow`, plus the `out-expo` cubic-bezier easing used throughout.

---

## 7. Notable components

| Component | What it does |
|---|---|
| **Hero** | `<h1>` cycles four words (films / campaigns / visuals / systems) on a spring, inside a two-tier clip box so Zilla Slab descenders never clip. Magnetic CTA buttons. |
| **CapabilitiesScroll** | Pinned scroll section that morphs between "The Studio" and "The Engine" with scramble text and mirrored card tilts. |
| **BrandStack** | Auto-advancing card stack (front card slides out, next rises), pauses on hover / off-screen, respects reduced-motion. Placeholder brands. |
| **FilmCard** | Film entry as an index row: giant serif numeral + typographic block + 16:9 poster. YouTube → click-to-load embed; brand logo → `object-contain` poster (with sampled background color) that links out. |
| **SystemCard** | Engine entry: **proofs off the plate** — the machine's output as opaque ink "prints" (ReelForge fans three vertical cuts off a master frame; ParsecDaily stacks its published days), specs conjugated into a figure caption, "live" as a serif `gold-flow` sentence. |
| **IndexNumeral** | Two stacked serif numerals (ghost + gold-gradient) that ignite on row hover. Padded paint-box so the gradient covers the full glyph. |
| **Reveal / Magnetic / CountUp** | Scroll-reveal wrapper, cursor-magnetism, and count-up — all reduced-motion aware. |

---

## 8. Accessibility & UX

- Reduced motion honored globally (CSS) and per-feature (canvas skipped, animations collapsed).
- Windows High-Contrast (`forced-colors`) restores a solid text color where gradient-clipped text would vanish.
- One `<h1>` (hero); sections use `<h2>`+. Screen-reader-only clean sentence backs the animated hero.
- Focus-visible rings on interactive elements; icon-only buttons carry `aria-label`.
- No horizontal scroll at 375 / 1440 / 1999px (verified).

---

## 9. Deployment

- **GitHub → Vercel** auto-deploy on push to `master`. Standard Next.js preset, root directory, no env vars required.
- Commit author email must match a verified GitHub account, or Vercel blocks the build (this bit us once with a placeholder `@example.com` address — fixed by setting the real git email).
- To verify what's actually live vs. local, fetch the deployed hashed CSS and diff the token values — the browser cache/zoom, not the code, is usually the cause of "looks different" reports.

---

## 10. Known limitations / open items

- **StartProjectForm** opens a Gmail draft addressed to the contact email with all entered brief details. The visitor reviews and sends it in Gmail; there is no automatic server-side email delivery. Contact email links also include the current form details.
- **Placeholder content** remains in BrandStack (NOVA/HELIO/…) and the team roles.
- `WorkCard.jsx` / `WorkGallery.jsx` are dead code and can be deleted.
- The contact address is `kartikeyap@lightscameraexperiment.com` (set in `lib/site.js`, shared by the contact section, navigation, footer, form guidance and service contact panels).
- The live domain is `lightscameraexperiment.com` — **"experiment", singular**, not the plural of the studio name. `metadataBase` in `app/layout.jsx` matches it.

---

*Reflects the codebase as of the current `master` (commit `dd47ae7`).*


### Network-aware hero media (November 2026)

- The full 109-second reel is preserved. The hero uses versioned H.264 MP4 variants: 720p (10,438,238 bytes; capped at 800 kbps) and 480p (4,571,748 bytes; capped at 360 kbps), both 25 fps, video-only, with front-loaded MP4 metadata. The original `public/home/showreel.mp4` remains an unused source asset.
- `lib/hero-video.mjs` chooses the light variant for small screens or slower reported connections; unsupported connection APIs fall back to viewport size. Data Saver, 2G, and reduced-motion visitors start with the 34 KB poster and can choose Play. No MP4 URL is attached until playback is wanted and the hero is visible.
- The controller waits for three seconds of contiguous buffered footage, pauses offscreen/in hidden tabs, and preserves manual pause. A 10-second buffering timeout or two playback stalls downgrades the standard source once, preserving position. If the light source also fails, requests stop and the poster with a manual Play option remains. No automatic retry loop.
- `public/_headers` (Cloudflare) and `vercel.json` apply one-year immutable browser caching only to explicitly versioned media. Bump filenames when changing those bytes. Vercel supports byte-range video responses; verify both hosts after deploy.
- FilmCard thumbnails are lazy-loaded and decoded asynchronously. Three oversized logo PNGs (14.67 MB combined) are served as aspect-preserving WebPs up to 1280 pixels wide (113 KB combined). Original PNG sources are retained.
- A local error boundary around the decorative 3D scene preserves website content if the animation chunk or WebGL fails.
- Validate with `node --test lib/hero-video.test.mjs lib/gmail-compose.test.mjs components/three/renderBudget.test.mjs` and `npm run build`. Review playback, pause/resume, a constrained media connection, mobile source selection, poster fallback and deployed cache/range headers.


### Connection and device efficiency (November 2026, follow-up)

- `SceneBackground` does not render/import the Three.js scene until the translated backdrop first intersects the visible viewport. The three deferred chunks total about 837 KB raw (218 KB with local gzip); actual CDN transfer encoding may differ. The initial hero therefore avoids both that download and WebGL setup.
- `lib/device-performance.mjs` uses optional, coarse browser hints: normal devices target 60 rendered frames/sec; devices reporting at most 4 GB memory or 4 CPU threads target 30. Unknown hints retain the normal mode. Explicit Save-Data, 2G/reduced motion, or extremely small reported hardware use a cached 36 KB SVG of the same Lorenz curve instead of importing WebGL. Browsers do not expose all hardware hints, so this is a heuristic, not a hardware benchmark.
- A shared frame budget gates geometry updates, particles, top-edge clearance and all GPU passes together. Lower frame frequency preserves elapsed movement time and frame-normalised pose easing; the original 9,000 points, camera choreography and scale remain unchanged. The light mode updates the halo 15 times/sec; standard mode 30.
- Existing adaptive pixel resolution remains. Sustained frame delivery below 18 fps after resolution has reached its minimum switches to the still fallback for that page visit. Decorative render/chunk failures also select the still.
- Brand cycling creates no interval offscreen, on hover or in hidden tabs. Mobile does not mount the hidden desktop capabilities scroll track. Desktop scroll measurement unsubscribes while hidden/out of view and remeasures on return.
- `VisibleDecorations` pauses gold glints offscreen, in hidden tabs, under reduced motion and in collapsed principles cards. Removed unused serif 600 font variants. Media files and video quality are unchanged in this follow-up.
- Validation: 29 Node tests across the device/frame policy, video buffering, render budget/placement and Gmail draft code; production build; desktop scroll/brand controls; mobile layout; local simulated 4 GB/light and 1 GB/still browser fixtures (fixtures are never committed or deployed). Browser/server checks confirm zero canvas at the initial hero and deferred scene requests only after scrolling.
