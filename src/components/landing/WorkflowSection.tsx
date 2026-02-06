"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Input",
    description: "Type topic or use voice",
    icon: "🎤",
  },
  {
    number: 2,
    title: "Generate",
    description: "AI generates multiple options",
    icon: "⚡",
  },
  {
    number: 3,
    title: "Select",
    description: "Choose the best from each phase",
    icon: "🎯",
  },
  {
    number: 4,
    title: "Score",
    description: "Get viral score and quality",
    icon: "📊",
  },
  {
    number: 5,
    title: "Publish",
    description: "Copy to LinkedIn",
    icon: "✨",
  },
];

export default function WorkflowSection() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">The Agentic Workflow</h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            A simple 5-step process to create viral content in minutes.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 hidden h-1 bg-gradient-to-r from-[#f97316]/20 via-[#f97316]/50 to-[#f97316]/20 md:block" />

            <div className="relative flex flex-col items-center justify-between md:flex-row">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="relative z-10 flex flex-col items-center px-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#f97316] bg-[#0a0a0a]"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-2xl">{step.icon}</span>

                    {index < steps.length - 1 && (
                      <motion.div
                        className="absolute -right-2 top-1/2 md:hidden"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <ArrowRight className="h-6 w-6 rotate-90 text-[#f97316]" />
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    className="rounded-xl border border-[#262626] bg-[#171717] p-4 transition-colors hover:border-[#f97316]/50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="mb-1 font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-[#a3a3a3]">{step.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
