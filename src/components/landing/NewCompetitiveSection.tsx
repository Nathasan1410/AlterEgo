"use client";

import { motion } from "framer-motion";
import { Target, Star, Gauge, Gamepad2, Mic, Zap } from "lucide-react";

const advantages = [
  {
    icon: Gauge,
    title: "Opik Observability",
    description: "Unlike black-box generators, see exactly why text was chosen and get a predicted viral score. Don't just guess, know.",
  },
  {
    icon: Gamepad2,
    title: "Gamified Card Picker",
    description: "You're in control. Easily pick topics and styles with a fun, hassle-free card interface. No more fighting with prompts.",
  },
  {
    icon: Mic,
    title: "Voice-Supported Creation",
    description: "Describe your ideas naturally for deeper, faster personalization vs. typing.",
  },
  {
    icon: Star,
    title: "Authentic Style Cloning",
    description: "The core of AlterEgo, Clone your authentic voice with a personalized style.",
  },
  {
    icon: Zap,
    title: "Multi-Agent Intelligence",
    description: "Powered by advanced LLMs and Tavily for deep research and context-aware generation.",
  },
  {
    icon: Target,
    title: "Purpose-Built for LinkedIn",
    description: "Optimized specifically for LinkedIn's algorithm and professional context. Not just generic AI.",
  },
];

export default function NewCompetitiveSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">Why AlterEgo is Different</h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Features that put you in control and guarantee quality.
          </p>
        </motion.div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-start rounded-2xl border border-[#262626] bg-[#171717] p-8 transition-all duration-300 hover:border-[#f97316]/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10">
                <advantage.icon className="h-6 w-6 text-[#f97316]" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{advantage.title}</h3>
              <p className="text-sm text-[#a3a3a3]">{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
