import { Button } from "@/components/ui/button";
import { Lightbulb, Zap, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import dashboardImage from "@/assets/dashboard.png";
import BlurText from "@/components/animations/BlurText";
import { motion } from "motion/react";
import ParticlesBackground from "@/components/ParticlesBackground";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/e923e67d71fed3e0853ec57f0348451e/manifest/video.m3u8";

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

  return <section className="w-full min-h-screen px-8 md:px-16 pt-32 flex items-start justify-center overflow-hidden relative">
      {/* Background Video Layer */}
      <div className="absolute inset-x-0 top-0 z-[1]" style={{ height: '110vh' }}>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
        />
        {/* Video bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      {/* Color Overlay */}
      <div className="absolute inset-0 w-full h-full z-[2]" style={{
      backgroundColor: '#D9D9D9',
      mixBlendMode: 'multiply',
      opacity: 0.7
    }} />

      {/* Floating Particles */}
      <div className="absolute inset-x-0 top-0 z-[3] pointer-events-none" style={{ height: '110vh' }}>
        <ParticlesBackground />
      </div>
      
      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[5] bg-gradient-to-t from-background to-transparent pointer-events-none" />
      <div className="w-full max-w-[1280px] flex flex-col items-center gap-20 relative z-[4]">
        <div className="w-full max-w-3xl flex flex-col items-center gap-8">
          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">
              <Lightbulb className="w-4 h-4 text-hero-foreground" />
              <span className="text-white/80 text-sm font-medium">
                Smarter Business
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">
              <Zap className="w-4 h-4 text-hero-foreground" />
              <span className="text-white/80 text-sm font-medium">
                AI-powered
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-hero-foreground" />
              <span className="text-white/80 text-sm font-medium">
                Instantly
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col items-center gap-6 text-center">
            <BlurText
              text="Platform For Next Level Innovation"
              delay={100}
              direction="bottom"
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[92px] text-hero-foreground font-normal leading-tight tracking-tight"
            />
            <motion.p 
              className="text-lg md:text-xl text-white/90 font-normal leading-relaxed max-w-4xl drop-shadow-lg"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
            </motion.p>
          </div>

          {/* Call to action buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Button variant="hero" className="w-full sm:w-auto">
              Get Started for Free
            </Button>
            <div className="p-[1px] rounded-[10px] bg-gradient-to-r from-orange-500 to-blue-500 w-full sm:w-auto">
              <Button variant="hero-secondary" className="w-full">
                Let's Get Connected
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Image */}
        <motion.div 
          className="w-full max-w-5xl mt-8"
          initial={{ filter: 'blur(10px)', opacity: 0, y: 30 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <img 
            src={dashboardImage} 
            alt="Dashboard preview" 
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;