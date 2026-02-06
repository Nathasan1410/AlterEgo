"use client";

import { motion } from "framer-motion";
import { Target, Star, Gauge, Workflow, Globe2, Zap } from "lucide-react";
import BentoCard from "./MagicBento";

const advantages = [
  {
    icon: Target,
    title: "Purpose-Built for LinkedIn",
    description: "Not generic AI, optimized for LinkedIn's algorithm and best practices.",
  },
  {
    icon: Star,
    title: "Style Cloning",
    description: "First-to-market digital twin technology. Clone your authentic voice.",
  },
  {
    icon: Gauge,
    title: "OPIK Observability",
    description: "Real-time AI tracing and quality monitoring. Powered by OPIK AI.",
  },
  {
    icon: Workflow,
    title: "Agentic Workflow",
    description: "Multi-agent system: Researcher → Drafting → Self-Correction.",
  },
  {
    icon: Globe2,
    title: "Multi-Language",
    description: "Support for Indonesian and English. Reach global audiences.",
  },
  {
    icon: Zap,
    title: "Sub-Second Inference",
    description: "Powered by Groq Llama 3.3 70B. Lightning fast AI responses.",
  },
];

export default function CompetitiveSection() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">What Sets Us Apart</h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Features that make AlterEgo the superior choice for LinkedIn content creation.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((advantage, index) => (
              <BentoCard
                key={index}
                icon={
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10">
                    <advantage.icon className="h-6 w-6 text-[#f97316]" />
                  </div>
                }
                title={advantage.title}
                description={advantage.description}
                size="md"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
