"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Target } from "lucide-react";
import Button from "@/src/components/ui/Button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 py-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4 text-[#f97316]" />
            <span className="text-sm font-medium text-[#f97316]">Powered by OPIK AI ⭐</span>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Transform Your LinkedIn Presence in{" "}
            <span className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
              Minutes, Not Hours
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-xl text-[#a3a3a3] md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            AI-powered personal branding coach that clones your authentic writing style and crafts
            viral content.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/app">
              <Button variant="primary" size="lg" className="px-10 py-4 text-lg">
                GET STARTED
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 px-10 py-4 text-lg hover:border-[#f97316]/50 hover:bg-[#f97316]/10"
              style={{ color: "white", borderColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Zap className="mr-2 h-5 w-5" style={{ color: "white" }} />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 text-[#a3a3a3]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#f97316]" />
              <span>Style Cloning</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#f97316]" />
              <span>2-Min Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#f97316]" />
              <span>Viral Scoring</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-10 top-1/2 h-20 w-20 rounded-full bg-[#f97316]/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute right-20 top-1/3 h-32 w-32 rounded-full bg-[#f97316]/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </section>
  );
}
