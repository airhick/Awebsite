import { Star, Quote } from "lucide-react";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, EnterpriseCorp",
      company: "EnterpriseCorp",
      content: "The Text-to-Speech API integration was seamless. We've implemented voice AI across our customer service platform, delivering natural, clear voice interactions that our customers love.",
      rating: 5,
      image: `${import.meta.env.BASE_URL}lovable-uploads/f205f4a0-427d-4991-8617-497b883351fe.png`
    },
    {
      name: "Michael Chen",
      role: "VP of Engineering, GlobalTech",
      company: "GlobalTech",
      content: "Our Speech-to-Speech API implementation transformed our call center operations. The high-quality voice recognition and synthesis capabilities reduced costs while improving customer satisfaction.",
      rating: 5,
      image: `${import.meta.env.BASE_URL}lovable-uploads/829efb0e-d3ef-44df-b375-e2f710dfb0bc.png`
    },
    {
      name: "Emily Rodriguez",
      role: "Product Director, ServiceTech",
      company: "ServiceTech",
      content: "Implementing enterprise AI solutions with these APIs was straightforward. The clear documentation and robust APIs enabled us to deploy voice AI capabilities across multiple departments in weeks.",
      rating: 5,
      image: `${import.meta.env.BASE_URL}lovable-uploads/f4b94bd5-9414-4b09-b564-c52434a0c77b.png`
    }
  ];

  return (
    <section className="w-full py-12 lg:py-8 px-4 bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 p-4 bg-gray-200 dark:bg-white/10 transition-colors duration-300 border border-gray-300 dark:border-white/20 transition-colors duration-300 rounded-2xl backdrop-blur-md mb-8">
            <Quote className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
            <span className="text-gray-700 dark:text-white transition-colors duration-300 text-sm font-normal leading-relaxed">
              Customer Stories
            </span>
          </div>
          
          <h2 className="text-gray-900 dark:text-white transition-colors duration-300 text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight mb-6">
            Trusted by industry leaders
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            See how enterprises worldwide are implementing AI solutions with our Text-to-Speech and Speech-to-Speech APIs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-[30px] border border-gray-300 dark:border-white/20 transition-colors duration-300 shadow-lg backdrop-blur-sm h-full" >
                <div className="p-8 flex flex-col h-full">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="w-5 h-5 fill-hero-foreground text-gray-900 dark:text-white transition-colors duration-300" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-900 dark:text-white transition-colors duration-300 text-base lg:text-lg font-normal leading-relaxed mb-8 flex-grow">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 transition-colors duration-300 border border-gray-300 dark:border-white/20 transition-colors duration-300">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-gray-900 dark:text-white transition-colors duration-300 text-base font-normal leading-relaxed">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 text-sm font-normal leading-relaxed">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;