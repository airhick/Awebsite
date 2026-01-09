import { Marquee } from "@/components/ui/marquee"
import { Volume2, Mic, Code, Zap, Shield, CheckCircle, Cpu } from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  text: string
}

const features: Feature[] = [
  { icon: Volume2, text: "Text-to-Speech API" },
  { icon: Mic, text: "Speech-to-Speech API" },
  { icon: Code, text: "Enterprise Integration" },
  { icon: Zap, text: "Real-time Processing" },
  { icon: Shield, text: "Secure & Compliant" },
  { icon: CheckCircle, text: "High Quality Voice" },
  { icon: Cpu, text: "AI-Powered Solutions" },
]

export function LogoMarquee() {
  return (
    <section className="w-full pb-16 pt-0 bg-white dark:bg-[#050505] transition-colors duration-300 overflow-hidden">
      <Marquee>
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="relative h-full w-fit mx-[4rem] flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <Icon className="h-5 w-5 text-gray-900 dark:text-white transition-colors duration-300" />
              <span className="text-gray-900 dark:text-white text-sm font-medium whitespace-nowrap transition-colors duration-300">
                {feature.text}
              </span>
            </div>
          )
        })}
      </Marquee>
    </section>
  )
}