"use client";

import { motion } from "framer-motion";
import BentoCard from "./MagicBento";

const techStack = [
  {
    name: "Next.js 16",
    description: "Modern React framework with App Router",
    category: "Framework",
  },
  {
    name: "Groq Llama 3.3 70B",
    description: "Sub-second AI inference engine",
    category: "AI",
  },
  {
    name: "OPIK AI",
    description: "Real-time observability and quality monitoring",
    category: "AI",
  },
  {
    name: "Tavily AI",
    description: "Real-time web research and context",
    category: "AI",
  },
  {
    name: "OpenAI Whisper",
    description: "State-of-the-art voice transcription",
    category: "AI",
  },
  {
    name: "TypeScript",
    description: "Type-safe development",
    category: "Language",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    category: "Styling",
  },
  {
    name: "Framer Motion",
    description: "Production-ready animation library",
    category: "Animation",
  },
];

const categoryColors = {
  Framework: "bg-blue-500/10 text-blue-500",
  AI: "bg-purple-500/10 text-purple-500",
  Language: "bg-yellow-500/10 text-yellow-500",
  Styling: "bg-pink-500/10 text-pink-500",
  Animation: "bg-green-500/10 text-green-500",
};

export default function TechStackSection() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            Built on Cutting-Edge Technology
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Powered by the latest in AI and web technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="rounded-xl border border-[#262626] bg-[#171717] p-6 transition-all hover:border-[#f97316]/50">
                <div className="mb-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${categoryColors[tech.category as keyof typeof categoryColors]}`}
                  >
                    {tech.category}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{tech.name}</h3>
                <p className="text-sm text-[#a3a3a3]">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
