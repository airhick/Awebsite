import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import { LogoMarquee } from "./LogoMarquee";
import FeatureSection from "./FeatureSection";
import FeatureSection2 from "./FeatureSection2";
import FeatureSection3 from "./FeatureSection3";
import JourneySection from "./JourneySection";
import CaseStudiesSection from "./CaseStudiesSection";
import TestimonialSection from "./TestimonialSection";
import CTASection from "./CTASection";
import { Footer } from "@/components/ui/footer-section";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LogoMarquee />
      <FeatureSection />
      <FeatureSection2 />
      <FeatureSection3 />
      <JourneySection />
      <CaseStudiesSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default LandingPage;

