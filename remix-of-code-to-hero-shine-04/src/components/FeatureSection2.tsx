import { Settings, Bot } from "lucide-react";

const FeatureSection2 = () => {
  return (
    <section className="w-full py-12 lg:py-8 px-4 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
          {/* Left Content - Now on right for desktop */}
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-col lg:space-y-20">
              {/* Header Section */}
              <div className="space-y-5 order-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-3 p-4 bg-hero-badge-bg border border-hero-badge-border rounded-2xl backdrop-blur-md">
                  <div className="w-6 h-6 relative">
                    <Settings className="w-6 h-6 text-hero-foreground" />
                  </div>
                  <span className="text-hero-badge-text text-sm font-normal leading-relaxed">
                    Powered by AI
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-hero-foreground text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight">
                  Accelerating workflows through automation
                </h2>

                {/* Description */}
                <p className="text-hero-muted text-base lg:text-lg font-normal leading-relaxed max-w-md">
                  Smart automation reduces manual tasks by 40%, streamlining operations for faster results.
                </p>
              </div>

              {/* Image Container - Mobile Only */}
              <div className="flex-1 max-w-2xl lg:hidden order-2 my-8">
                <div className="relative w-full aspect-square overflow-hidden rounded-[30px]">
                  {/* Background Image */}
                  <img 
                    src="/lovable-uploads/1906ba74-dcef-444d-b278-272e00657770.png" 
                    alt="Dashboard preview"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Card */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] backdrop-blur-sm rounded-[21px] border border-hero-secondary-border shadow-lg p-[50px]" style={{backgroundColor: 'rgba(11, 11, 12, 0.77)'}}>
                    <img 
                      src="/lovable-uploads/f50e3718-0f61-42b3-90bf-4faac4b4f036.png" 
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
                    <Bot className="w-6 h-6 text-hero-foreground" />
                  </div>
                  <span className="text-hero-muted text-base lg:text-lg font-normal leading-relaxed">
                    Smart AI Assistants
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-6 h-6 flex-shrink-0">
                    <Settings className="w-6 h-6 text-hero-foreground" />
                  </div>
                  <span className="text-hero-muted text-base lg:text-lg font-normal leading-relaxed">
                    40% Faster Execution
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
                src="/lovable-uploads/1906ba74-dcef-444d-b278-272e00657770.png" 
                alt="Dashboard preview"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lg:w-[496px] lg:h-[465px] backdrop-blur-sm rounded-[21px] border border-hero-secondary-border shadow-lg p-[50px]" style={{backgroundColor: 'rgba(11, 11, 12, 0.77)'}}>
                <img 
                  src="/lovable-uploads/f50e3718-0f61-42b3-90bf-4faac4b4f036.png" 
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

export default FeatureSection2;