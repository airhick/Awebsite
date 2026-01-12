const JourneySection = () => {
  const cards = [
    {
      title: "Finance Focused",
      description: "Our team bridges the gap between finance and tech, driving our commitment to results.",
      image: "/lovable-uploads/829efb0e-d3ef-44df-b375-e2f710dfb0bc.png"
    },
    {
      title: "AI Innovation", 
      description: "We built our leadership team to expertly combine deep finance knowledge with advanced AI.",
      image: "/lovable-uploads/f4b94bd5-9414-4b09-b564-c52434a0c77b.png"
    },
    {
      title: "Client Empowerment",
      description: "Dedicated to helping firms achieve deal flow goals through efficient technology solutions.",
      image: "/lovable-uploads/8c0a0f76-8c4f-4512-8dd6-f59bd453c8fc.png"
    }
  ];

  return (
    <section className="w-full mt-[150px] pb-12 lg:pb-16 px-4 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-16">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 lg:gap-26">
            <div className="flex-1 max-w-2xl">
              <div className="flex flex-col gap-4">
                <span className="text-hero-foreground text-base font-normal leading-relaxed">
                  Our Journey
                </span>
                <h2 className="text-hero-foreground text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight">
                  Tailored AI systems, built for finance
                </h2>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              <p className="text-hero-muted text-base font-normal leading-relaxed">
                Delivering the Latest AI Advancements to Solve Your Specific Goals and Challenges, Ensuring Enhanced Efficiency and Insight Growth.
              </p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="group">
                <div className="p-4 pb-8 rounded-2xl border border-hero-secondary-border bg-hero-secondary-bg/5 backdrop-blur-sm hover:bg-hero-secondary-bg/10 transition-all duration-300">
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
                    <h3 className="text-hero-foreground text-2xl font-normal leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-hero-muted opacity-70 text-base font-normal leading-relaxed">
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