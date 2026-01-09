const JourneySection = () => {
  const cards = [
    {
      title: "Enterprise Solutions",
      description: "We specialize in implementing AI solutions for large-scale enterprise deployments with robust APIs and integrations.",
      image: "/lovable-uploads/829efb0e-d3ef-44df-b375-e2f710dfb0bc.png"
    },
    {
      title: "Voice AI Technology", 
      description: "Advanced Text-to-Speech and Speech-to-Speech APIs built for enterprise-grade quality and reliability.",
      image: "/lovable-uploads/f4b94bd5-9414-4b09-b564-c52434a0c77b.png"
    },
    {
      title: "Seamless Integration",
      description: "Easy-to-integrate APIs that enable businesses to quickly implement voice AI capabilities into their existing systems.",
      image: "/lovable-uploads/8c0a0f76-8c4f-4512-8dd6-f59bd453c8fc.png"
    }
  ];

  return (
    <section className="w-full mt-[150px] pb-12 lg:pb-16 px-4 bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-16">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 lg:gap-26">
            <div className="flex-1 max-w-2xl">
              <div className="flex flex-col gap-4">
                <span className="text-gray-900 dark:text-white transition-colors duration-300 text-base font-normal leading-relaxed">
                  Our Journey
                </span>
                <h2 className="text-gray-900 dark:text-white transition-colors duration-300 text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight">
                  Enterprise AI solutions, built for scale
                </h2>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base font-normal leading-relaxed">
                Implementing powerful AI solutions with clear Text-to-Speech and Speech-to-Speech APIs. Delivering enterprise-grade voice AI capabilities that integrate seamlessly into your business infrastructure.
              </p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="group">
                <div className="p-4 pb-8 rounded-2xl border border-gray-300 dark:border-white/20 transition-colors duration-300 bg-gray-200 dark:bg-gray-800 transition-colors duration-300/5 backdrop-blur-sm hover:bg-gray-200 dark:bg-gray-800 transition-colors duration-300/10 transition-all duration-300">
                  {/* Card Image */}
                  <div className="relative w-full h-64 mb-6 overflow-hidden rounded-xl">
                    <img 
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div className="flex flex-col items-center text-center gap-2">
                    <h3 className="text-gray-900 dark:text-white transition-colors duration-300 text-2xl font-normal leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 opacity-70 text-base font-normal leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;