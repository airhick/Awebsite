import { useState } from "react";
import { ChevronLeft, ChevronRight, Target, Zap, TrendingUp, Database, Users, Clock, Shield, CheckCircle } from "lucide-react";

const CaseStudiesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      quote: "Voice AI integration improved customer engagement by 65%",
      description: "EnterpriseCorp implemented our Text-to-Speech API to power their customer service automation. The clear, natural voice synthesis enabled 24/7 multilingual support, reducing response times and improving customer satisfaction.",
      stats: [
        { icon: Target, text: "65% Engagement Boost" },
        { icon: Zap, text: "Real-time Voice Processing" },
        { icon: TrendingUp, text: "95% Accuracy Rate" },
        { icon: Database, text: "Seamless Integration" }
      ]
    },
    {
      quote: "Speech-to-Speech API reduced call center costs by 50%",
      description: "ServiceTech deployed our Speech-to-Speech API to automate routine customer interactions. The high-quality voice recognition and synthesis handled complex queries, allowing human agents to focus on specialized support.",
      stats: [
        { icon: Users, text: "50% Cost Reduction" },
        { icon: Clock, text: "Instant Responses" },
        { icon: Shield, text: "Enterprise Security" },
        { icon: CheckCircle, text: "99% Uptime" }
      ]
    },
    {
      quote: "Enterprise AI implementation increased operational efficiency by 200%",
      description: "GlobalTech integrated our voice AI APIs across multiple departments. The Text-to-Speech and Speech-to-Speech capabilities enabled automated documentation, multilingual communication, and intelligent voice assistants.",
      stats: [
        { icon: TrendingUp, text: "200% Efficiency Gain" },
        { icon: Target, text: "Multi-language Support" },
        { icon: Zap, text: "API Integration" },
        { icon: Database, text: "Scalable Infrastructure" }
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
    <section className="w-full py-12 lg:py-16 px-4 bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-16">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="text-gray-900 dark:text-white transition-colors duration-300 text-base font-normal leading-relaxed">
              Case Studies
            </span>
            <h2 className="text-gray-900 dark:text-white transition-colors duration-300 text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight max-w-4xl">
              See How Enterprise AI Solutions Transform Businesses
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full">
            {/* Image Container */}
            <div className="flex-1 max-w-2xl">
              <div className="relative w-full aspect-square lg:h-[577px] lg:aspect-auto overflow-hidden rounded-[30px]">
                {/* Background Image */}
                <img 
                  src={`${import.meta.env.BASE_URL}lovable-uploads/9b72fac8-5af1-41de-9a1e-b196856ba36f.png`}
                  alt="Business dashboard"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Card */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lg:w-[496px] lg:h-[465px] backdrop-blur-sm rounded-[21px] border border-gray-300 dark:border-white/20 shadow-lg bg-white/90 dark:bg-[#0b0b0c]/90 transition-colors duration-300 p-[50px]" >
                  <img 
                    src={`${import.meta.env.BASE_URL}lovable-uploads/2caba8db-decb-4315-a598-5a7d45243432.png`}
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
                    <blockquote className="text-gray-900 dark:text-white transition-colors duration-300 text-2xl lg:text-3xl font-normal leading-tight">
                      "{currentSlideData.quote}"
                    </blockquote>
                    <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base font-normal leading-relaxed">
                      {currentSlideData.description}
                    </p>
                  </div>
                  
                  {/* Navigation Arrows */}
                  <div className="flex gap-2">
                    <button 
                      onClick={prevSlide}
                      className="p-3 bg-gray-200 dark:bg-gray-800 transition-colors duration-300/10 hover:bg-gray-200 dark:bg-gray-800 transition-colors duration-300/20 rounded-xl transition-colors duration-200"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="p-3 bg-gray-900 dark:bg-white transition-colors duration-300 hover:bg-gray-900 dark:bg-white transition-colors duration-300/90 rounded-xl transition-colors duration-200"
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
                        <stat.icon className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base font-normal leading-relaxed">
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