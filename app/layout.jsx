import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SceneBackground from "@/components/three/SceneBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
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
