import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { LogoMarquee } from "@/components/LogoMarquee";
import FeatureSection from "@/components/FeatureSection";
import FeatureSection2 from "@/components/FeatureSection2";
import FeatureSection3 from "@/components/FeatureSection3";
import JourneySection from "@/components/JourneySection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import { Footer } from "@/components/ui/footer-section";

const Index = () => {
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

export default Index;
