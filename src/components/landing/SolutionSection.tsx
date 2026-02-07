"use client";

import { motion } from "framer-motion";
import { Target, Zap, Mic, Search, TrendingUp, Globe } from "lucide-react";
import BentoCard from "./MagicBento";

export default function SolutionSection() {
  return (
    <section className="bg-[#0a0a0a]/50 px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">Introducing AlterEgo</h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Your AI-powered personal branding coach that clones your authentic writing style.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BentoCard
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10">
                  <Target className="h-6 w-6 text-[#f97316]" />
                </div>
              }
              title="Style Cloning"
              description="Upload past posts and AI learns your unique voice. Create digital twin of your writing style."
              size="sm"
            />

            <BentoCard
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
              }
              title="AI Generation"
              description="Topics, hooks, body, and CTAs generated in 2 minutes. Multiple options for each section."
              size="sm"
            />

            <BentoCard
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Mic className="h-6 w-6 text-blue-500" />
                </div>
              }
              title="Voice-Supported Drafting"
              description="Hands-free personalization. Speak your ideas naturally and let AI capture your authentic style."
              size="sm"
            />

            <BentoCard
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                  <Search className="h-6 w-6 text-green-500" />
                </div>
              }
              title="Web Research"
              description="Real-time context and trends. AI researches your topic to add relevant insights."
              size="sm"
            />

            <BentoCard
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
              }
              title="Viral Scoring"
              description="AI-powered quality assessment (0-100). Know your post's viral potential before publishing."
              size="sm"
            />

            <BentoCard
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
                  <Globe className="h-6 w-6 text-pink-500" />
                </div>
              }
              title="Multi-Language"
              description="Support for Indonesian and English. Create content for global audiences effortlessly."
              size="sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
