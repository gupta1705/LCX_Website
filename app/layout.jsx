import { Schibsted_Grotesk, Besley, Fragment_Mono } from "next/font/google";
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

// SERIF — Besley: a Clarendon with a TRUE drawn italic. Its sturdy,
// near-monolinear slab strokes carry the gold gradient clip at every size
// (where a Didone's hairlines would shimmer to nothing on the dark canvas).
const serif = Besley({
  subsets: ["latin"],
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
  metadataBase: new URL("https://thevirallabs.com"),
  title: {
    default: "The Viral Labs | An AI-native creative studio",
    template: "%s | The Viral Labs",
  },
  description:
    "The Viral Labs builds AI-driven marketing, video, images, and automation for companies that want to move fast and look incredible doing it.",
  keywords: [
    "AI creative studio",
    "AI marketing",
    "AI video",
    "AI images",
    "automation",
    "The Viral Labs",
  ],
  openGraph: {
    title: "The Viral Labs | An AI-native creative studio",
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
