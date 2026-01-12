import { useState } from "react";
import { ChevronLeft, ChevronRight, Target, Zap, TrendingUp, Database, Users, Clock, Shield, CheckCircle } from "lucide-react";

const CaseStudiesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      quote: "AI-driven forecasting cut inventory waste by 40% for TrailForge",
      description: "ScaleByte's sales team struggled with follow-up delays. Our AI sales assistant automated outreach, lead scoring, and CRM updates—resulting in faster responses and more closed deals.",
      stats: [
        { icon: Target, text: "3x More Deals" },
        { icon: Zap, text: "40% Faster Responses" },
        { icon: TrendingUp, text: "95% Lead Accuracy" },
        { icon: Database, text: "CRM Fully Synced" }
      ]
    },
    {
      quote: "Customer support efficiency increased by 60% with automated AI responses",
      description: "TechFlow's support team was overwhelmed with tickets. Our AI chatbot handled 80% of routine inquiries, allowing agents to focus on complex issues and improve customer satisfaction.",
      stats: [
        { icon: Users, text: "80% Auto-Resolved" },
        { icon: Clock, text: "60% Faster Support" },
        { icon: Shield, text: "99% Uptime" },
        { icon: CheckCircle, text: "95% Satisfaction" }
      ]
    },
    {
      quote: "Marketing ROI improved by 250% through intelligent campaign optimization",
      description: "GrowthCorp struggled with ad spend efficiency. Our AI marketing assistant optimized campaigns in real-time, targeting the right audiences and maximizing conversion rates.",
      stats: [
        { icon: TrendingUp, text: "250% ROI Boost" },
        { icon: Target, text: "85% Better Targeting" },
        { icon: Zap, text: "Real-time Optimization" },
        { icon: Database, text: "Full Attribution" }
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="w-full py-12 lg:py-16 px-4 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-16">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="text-hero-foreground text-base font-normal leading-relaxed">
              Case Studies
            </span>
            <h2 className="text-hero-foreground text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight max-w-4xl">
              See How Smart AI Automation Transforms Businesses
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full">
            {/* Image Container */}
            <div className="flex-1 max-w-2xl">
              <div className="relative w-full aspect-square lg:h-[577px] lg:aspect-auto overflow-hidden rounded-[30px]">
                {/* Background Image */}
                <img 
                  src="/lovable-uploads/9b72fac8-5af1-41de-9a1e-b196856ba36f.png" 
                  alt="Business dashboard"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Card */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lg:w-[496px] lg:h-[465px] backdrop-blur-sm rounded-[21px] border border-hero-secondary-border shadow-lg p-[50px]" style={{backgroundColor: 'rgba(11, 11, 12, 0.77)'}}>
                  <img 
                    src="/lovable-uploads/2caba8db-decb-4315-a598-5a7d45243432.png" 
                    alt="Dashboard interface"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 max-w-2xl">
              <div className="flex flex-col gap-12 lg:gap-20">
                {/* Testimonial Section */}
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-5">
                    <blockquote className="text-hero-foreground text-2xl lg:text-3xl font-normal leading-tight">
                      "{currentSlideData.quote}"
                    </blockquote>
                    <p className="text-hero-muted text-base font-normal leading-relaxed">
                      {currentSlideData.description}
                    </p>
                  </div>
                  
                  {/* Navigation Arrows */}
                  <div className="flex gap-2">
                    <button 
                      onClick={prevSlide}
                      className="p-3 bg-hero-secondary-bg/10 hover:bg-hero-secondary-bg/20 rounded-xl transition-colors duration-200"
                    >
                      <ChevronLeft className="w-6 h-6 text-hero-foreground" />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="p-3 bg-hero-foreground hover:bg-hero-foreground/90 rounded-xl transition-colors duration-200"
                    >
                      <ChevronRight className="w-6 h-6 text-background" />
                    </button>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="flex flex-col gap-6">
                  {currentSlideData.stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <div className="w-6 h-6 flex-shrink-0">
                        <stat.icon className="w-6 h-6 text-hero-foreground" />
                      </div>
                      <span className="text-hero-muted text-base font-normal leading-relaxed">
                        {stat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;