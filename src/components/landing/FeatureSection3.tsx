import { Settings, Bot } from "lucide-react";

const FeatureSection3 = () => {
  return (
    <section className="w-full py-12 lg:py-8 px-4 bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-col lg:space-y-20">
              {/* Header Section */}
              <div className="space-y-5 order-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-3 p-4 bg-gray-200 dark:bg-white/10 transition-colors duration-300 border border-gray-300 dark:border-white/20 transition-colors duration-300 rounded-2xl backdrop-blur-md">
                  <div className="w-6 h-6 relative">
                    <Settings className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-gray-700 dark:text-white transition-colors duration-300 text-sm font-normal leading-relaxed">
                    High Quality Voice
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-gray-900 dark:text-white transition-colors duration-300 text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight">
                  Crystal-clear voice synthesis and recognition
                </h2>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed max-w-md">
                  Enterprise-grade Text-to-Speech and Speech-to-Speech APIs deliver natural, high-quality voice output and accurate speech recognition for professional applications.
                </p>
              </div>

              {/* Image Container - Mobile Only */}
              <div className="flex-1 max-w-2xl lg:hidden order-2 my-8">
                <div className="relative w-full aspect-square overflow-hidden rounded-[30px]">
                  {/* Background Image */}
                  <img 
                    src="/lovable-uploads/f85acb58-198d-4595-ba4f-4de5cbdaeeb5.png" 
                    alt="Dashboard preview"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Card */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] backdrop-blur-sm rounded-[21px] border border-gray-300 dark:border-white/20 shadow-lg bg-white/90 dark:bg-[#0b0b0c]/90 transition-colors duration-300 p-[50px]" >
                    <img 
                      src="/lovable-uploads/e9c2b759-be4c-4182-8c00-fd5e50a55690.png" 
                      alt="Dashboard overlay"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-6 max-w-md order-3">
                <div className="flex items-center gap-6">
                  <div className="w-6 h-6 flex-shrink-0">
                    <Bot className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed">
                    Natural Voice Synthesis
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-6 h-6 flex-shrink-0">
                    <Settings className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed">
                    Accurate Speech Recognition
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Container - Desktop Only */}
          <div className="hidden lg:block flex-1 max-w-2xl my-8">
            <div className="relative w-full aspect-square lg:h-[577px] lg:aspect-auto overflow-hidden rounded-[30px]">
              {/* Background Image */}
              <img 
                src="/lovable-uploads/f85acb58-198d-4595-ba4f-4de5cbdaeeb5.png" 
                alt="Dashboard preview"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lg:w-[496px] lg:h-[465px] backdrop-blur-sm rounded-[21px] border border-gray-300 dark:border-white/20 shadow-lg bg-white/90 dark:bg-[#0b0b0c]/90 transition-colors duration-300 p-[50px]" >
                <img 
                  src="/lovable-uploads/e9c2b759-be4c-4182-8c00-fd5e50a55690.png" 
                  alt="Dashboard overlay"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection3;