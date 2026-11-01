# Lights Camera Experiments (LCX)

**Live site:** [lightscameraexperiment.com](https://www.lightscameraexperiment.com/)

The website for **Lights Camera Experiments**, an AI-native creative studio built for TVF.
*Story-first. AI-powered. Made to resonate.*

It is a single-page, scroll-driven site with five anchored sections (Home, Capabilities,
Services, Work, About) plus a "Start a Project" enquiry flow. All of it sits on a live,
gold-on-black WebGL background that reacts to scroll and cursor.

---

## Highlights

- **Live Lorenz attractor background.** About 9,000 integrated points from the Lorenz system,
  rendered with React Three Fiber. Scrolling drives a camera choreography (rotation, zoom,
  travel keyframes) and the cursor pushes the points away.
- **Custom glow pipeline.** A hand-built bloom pass replaces the stock post-processing
  chain. The sharp lines draw straight to screen and only the glow runs through
  quarter-resolution buffers. This holds 60fps on integrated GPUs where the old chain
  ran at about 32fps.
- **Render budget.** The pixel ratio is capped by a 2-megapixel budget, so large monitors
  and high-DPR screens don't overload the GPU. Offscreen media is paused.
- **Enquiry flow without a backend.** The project form opens a pre-filled Gmail draft
  (name, company, service, budget, brief) to the LCX inbox. There are no API routes and
  no servers.
- **Fully static.** `next build` exports plain HTML/CSS/JS, so any static host can serve it.

## Tech stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 14 (App Router, static export) · React 18 |
| 3D         | Three.js · React Three Fiber · Drei |
| Animation  | Framer Motion |
| Styling    | Tailwind CSS 3.4 · PostCSS · Autoprefixer |
| Icons      | Lucide |
| Fonts      | Schibsted Grotesk · Zilla Slab · Fragment Mono (via `next/font`) |
| Hosting    | Cloudflare (static assets, `wrangler.jsonc`) |

## Project structure

```
app/                 # layout, the single page, global styles
components/
  three/             # attractor scene, glow pipeline, render budget
  home/              # hero + showreel
  sections/          # capabilities, services, work, about, contact
  capabilities/      # scroll-driven capability panels
  work/              # film / system cards, index rows
  start/             # "Start a Project" form
  layout/            # navbar, logo, footer
  ui/                # buttons, reveals, count-ups, magnetic hover
lib/
  site.js            # site name, nav links, enquiry email
  services.js        # service groups and descriptions
  gmail-compose.mjs  # builds the pre-filled Gmail draft URL
```

Site copy lives in `lib/site.js` and `lib/services.js`. Edit those to change the
enquiry email, navigation, or the services listed on the page.

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build and deploy

```bash
npm run build
```

This writes the static site to `out/`. To preview the build locally:

```bash
npm start
```

To deploy to Cloudflare:

```bash
npx wrangler deploy
```

## Tests

After `npm install`, run:

```bash
node --test
```

This runs the unit tests for the render budget, attractor placement and the Gmail draft builder.

More detail on the design system, fonts and architecture is in
[`TECH_STACK_DOCUMENTATION.md`](TECH_STACK_DOCUMENTATION.md).
