import Navbar from "@/components/Navbar";
import { Footer } from "@/components/ui/footer-section";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Award, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

const AboutUs = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/74cb72d57c6a6d6d7807693d02e6707b/manifest/video.m3u8";

    // Check if browser natively supports HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      // Use hls.js for other browsers
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      
      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full min-h-screen px-8 md:px-16 pt-16 flex items-center justify-center overflow-hidden relative">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-[1]" style={{ top: '-50%' }}>
          <video 
            ref={videoRef}
            className="w-full h-full object-cover" 
            style={{
              filter: 'saturate(0)',
              objectPosition: 'center bottom'
            }}
            autoPlay 
            muted 
            loop 
            playsInline
          />
        </div>
        
        {/* Color Overlay */}
        <div className="absolute inset-0 w-full h-full z-[2]" style={{
          backgroundColor: '#D9D9D9',
          mixBlendMode: 'multiply',
          opacity: 0.7
        }} />
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-20 relative z-[3] pt-[120px]">
          <div className="w-full max-w-4xl flex flex-col items-center gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 p-4 bg-hero-badge-bg border border-hero-badge-border rounded-2xl backdrop-blur-md">
              <Users className="w-6 h-6 text-hero-foreground" />
              <span className="text-hero-badge-text text-sm font-normal leading-relaxed">
                About Our Company
              </span>
            </div>

            {/* Main content */}
            <div className="flex flex-col items-center gap-6 text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-hero-foreground font-normal leading-tight tracking-tight">
                Building the Future Through Innovation
              </h1>
              <p className="text-lg md:text-xl text-hero-muted font-normal leading-relaxed opacity-70 max-w-4xl">
                We're passionate about creating technology that empowers businesses and transforms industries. Our mission is to make complex solutions accessible and impactful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-20 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 max-w-2xl">
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-3 p-4 bg-hero-badge-bg border border-hero-badge-border rounded-2xl backdrop-blur-md">
                  <Target className="w-6 h-6 text-hero-foreground" />
                  <span className="text-hero-badge-text text-sm font-normal leading-relaxed">
                    Our Mission
                  </span>
                </div>

                <h2 className="text-hero-foreground text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight">
                  Empowering businesses with cutting-edge technology
                </h2>

                <p className="text-hero-muted text-base lg:text-lg font-normal leading-relaxed">
                  Founded with the vision to bridge the gap between complex technology and practical business solutions, we've been at the forefront of digital transformation for years. Our team combines deep technical expertise with industry knowledge to deliver solutions that truly make a difference.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-6 h-6 flex-shrink-0">
                      <Award className="w-6 h-6 text-hero-foreground" />
                    </div>
                    <span className="text-hero-muted text-base lg:text-lg font-normal leading-relaxed">
                      Industry Recognition & Awards
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-6 h-6 flex-shrink-0">
                      <Heart className="w-6 h-6 text-hero-foreground" />
                    </div>
                    <span className="text-hero-muted text-base lg:text-lg font-normal leading-relaxed">
                      Customer-Centric Approach
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative w-full aspect-square lg:h-[577px] lg:aspect-auto overflow-hidden rounded-[30px]">
                <img 
                  src="/lovable-uploads/f85acb58-198d-4595-ba4f-4de5cbdaeeb5.png" 
                  alt="Our team at work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lg:w-[496px] lg:h-[465px] backdrop-blur-sm rounded-[21px] border border-hero-secondary-border shadow-lg p-[50px]" style={{backgroundColor: 'rgba(11, 11, 12, 0.77)'}}>
                  <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="text-6xl font-bold text-hero-foreground">500+</div>
                    <div className="text-hero-muted text-lg">Projects Delivered</div>
                    <div className="text-4xl font-bold text-hero-foreground">50+</div>
                    <div className="text-hero-muted text-lg">Team Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-20 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-20">
            <div className="inline-flex items-center gap-3 p-4 bg-hero-badge-bg border border-hero-badge-border rounded-2xl backdrop-blur-md">
              <Heart className="w-6 h-6 text-hero-foreground" />
              <span className="text-hero-badge-text text-sm font-normal leading-relaxed">
                Our Values
              </span>
            </div>
            
            <h2 className="text-hero-foreground text-4xl lg:text-5xl font-normal leading-tight">
              What drives us forward
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Innovation First",
                description: "We constantly push boundaries to create groundbreaking solutions that set new industry standards."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Collaborative Spirit",
                description: "Our success is built on strong partnerships and teamwork, both internally and with our clients."
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Excellence",
                description: "We maintain the highest standards in everything we do, from code quality to customer service."
              }
            ].map((value, index) => (
              <div key={index} className="p-8 bg-hero-badge-bg border border-hero-badge-border rounded-2xl backdrop-blur-md">
                <div className="text-hero-foreground mb-6">
                  {value.icon}
                </div>
                <h3 className="text-hero-foreground text-xl font-medium mb-4">
                  {value.title}
                </h3>
                <p className="text-hero-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 mt-20 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full overflow-hidden rounded-3xl min-h-[400px] flex items-center justify-center bg-[#050505] border border-hero-secondary-border">
            <div className="flex flex-col items-center justify-center gap-12 px-8 py-16 max-w-2xl mx-auto text-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-hero-foreground leading-tight">
                  Ready to work with us?
                </h2>
                <p className="text-hero-muted text-lg leading-relaxed max-w-lg mx-auto">
                  Let's discuss how we can help transform your business with innovative technology solutions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button variant="hero" className="w-full sm:w-auto">
                  Start Your Project
                </Button>
                <Button variant="hero-secondary" className="w-full sm:w-auto">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUs;