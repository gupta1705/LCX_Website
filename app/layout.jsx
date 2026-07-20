import { Schibsted_Grotesk, Zilla_Slab, Fragment_Mono } from "next/font/google";
import "./globals.css";
import SceneBackground from "@/components/three/SceneBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// "The Engraved Ledger" type system — three rarely-used faces, one idea:
// the site behaves like an engraved certificate of value (gold on near-black,
// serial plates, schematic readouts), so the type is set like one.

// SANS — Schibsted Grotesk: a Scandinavian news grotesque with real character.
// Variable wght 400-900, so font-medium/font-semibold map natively.
const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// SERIF — Zilla Slab: sturdy, near-monolinear slab strokes (same reason
// Besley was chosen over a Didone: hairlines shimmer to nothing on the gold
// gradient clip), but with a plainer, less swash-heavy true italic that
// stays legible on short display words (Besley's italic "f"/"l" swashes
// read as extra "o" shapes at a glance).
const serif = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// MONO — Fragment Mono: a monospaced Helvetica, cold and instrument-panel
// precise. Fixed 400 only; label hierarchy is done with color, not weight.
const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  // Placeholder domain until the real one is registered/pointed — flagging
  // rather than guessing at a domain that may or may not exist.
  metadataBase: new URL("https://lightscameraexperiments.com"),
  title: {
    default: "Lights Camera Experiments | An AI-native creative studio",
    template: "%s | LCX",
  },
  description:
    "Lights Camera Experiments builds AI-driven marketing, video, images, and automation for companies that want to move fast and look incredible doing it.",
  keywords: [
    "AI creative studio",
    "AI marketing",
    "AI video",
    "AI images",
    "automation",
    "Lights Camera Experiments",
    "LCX",
  ],
  openGraph: {
    title: "Lights Camera Experiments | An AI-native creative studio",
    description:
      "Story-first. AI-powered. Built to go viral. AI-driven marketing, video, images and automation.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        {/* Persistent golden line-art scene — lives in the layout so it
            flows seamlessly across every tab without remounting. */}
        <SceneBackground />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
