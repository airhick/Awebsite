import { Settings, Bot } from "lucide-react";

const FeatureSection2 = () => {
  return (
    <section className="w-full py-12 lg:py-8 px-4 bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
          {/* Left Content - Now on right for desktop */}
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
                    Voice AI Technology
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-gray-900 dark:text-white transition-colors duration-300 text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight">
                  Enterprise AI automation with voice APIs
                </h2>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed max-w-md">
                  Accelerate your enterprise workflows with intelligent voice automation. Our APIs enable seamless integration of Text-to-Speech and Speech-to-Speech capabilities into your business processes.
                </p>
              </div>

              {/* Image Container - Mobile Only */}
              <div className="flex-1 max-w-2xl lg:hidden order-2 my-8">
                <div className="relative w-full aspect-square overflow-hidden rounded-[30px]">
                  {/* Background Image */}
                  <img 
                    src={`${import.meta.env.BASE_URL}images/Group 3.png`}
                    alt="Dashboard preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-6 max-w-md order-3">
                <div className="flex items-center gap-6">
                  <div className="w-6 h-6 flex-shrink-0">
                    <Bot className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed">
                    Enterprise Integration
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-6 h-6 flex-shrink-0">
                    <Settings className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed">
                    Real-time Voice Processing
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Container - Desktop Only - Now on left for desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl my-8">
            <div className="relative w-full aspect-square lg:h-[577px] lg:aspect-auto overflow-hidden rounded-[30px]">
              {/* Background Image */}
              <img 
                src={`${import.meta.env.BASE_URL}images/Group 3.png`}
                alt="Dashboard preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection2;