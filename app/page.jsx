import Hero from "@/components/home/Hero";
import CapabilitiesSection from "@/components/sections/CapabilitiesSection";
import WorkSection from "@/components/sections/WorkSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

// Single-page site — the nav tabs smooth-scroll to these anchored sections.
// Home is just the hero (the one-liner lives in it); the depth lives in the
// dedicated sections below so nothing is said twice on one scroll.
export default function HomePage() {
  return (
    <>
      <div id="home" className="scroll-mt-24">
        <Hero />
      </div>
      <CapabilitiesSection />
      <WorkSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
