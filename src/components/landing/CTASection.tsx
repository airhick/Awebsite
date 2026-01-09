import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="w-full py-16 px-4 mt-20 mb-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-3xl min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 transition-opacity duration-300"
            style={{backgroundImage: 'url(/lovable-uploads/f205f4a0-427d-4991-8617-497b883351fe.png)'}}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center gap-12 px-8 py-16 max-w-2xl mx-auto text-center z-10">
            <div className="space-y-5">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-gray-900 dark:text-white leading-tight transition-colors duration-300">
                Implement AI solutions in your enterprise
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed max-w-lg mx-auto transition-colors duration-300">
                Get started with our Text-to-Speech and Speech-to-Speech APIs. Build powerful voice applications with enterprise-grade quality and seamless integration.
              </p>
            </div>
            <Button variant="default" className="h-12 px-4 text-base">
              Get Started with APIs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;