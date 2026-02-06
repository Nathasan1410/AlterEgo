"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Monitor } from "lucide-react";

const screenshots = [
  {
    title: "Style Analysis / Onboarding",
    description: "Upload your past posts to clone your writing style",
    icon: "🔍",
  },
  {
    title: "Post Generation Wizard",
    description: "AI generates multiple options for each section",
    icon: "⚡",
  },
  {
    title: "Focus Mode / Building Phase",
    description: "Build your post with AI suggestions and research",
    icon: "🎯",
  },
  {
    title: "Result Phase with Viral Score",
    description: "Get your viral score and quality assessment",
    icon: "📊",
  },
  {
    title: "Opik Dashboard Integration",
    description: "Real-time observability and quality monitoring",
    icon: "⭐",
  },
  {
    title: "Multi-Language Support",
    description: "Create content in Indonesian and English",
    icon: "🌍",
  },
];

export default function ScreenshotsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % screenshots.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const getCardsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const cardsPerView = getCardsPerView();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

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
            Beautiful, Intuitive Interface
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Explore our app screenshots to see the power of AlterEgo
          </p>
        </motion.div>

        <div
          className="relative mx-auto max-w-7xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 z-20 flex h-12 w-12 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-[#262626] bg-[#171717] transition-all hover:border-[#f97316]/50 hover:bg-[#f97316]/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-[#262626] bg-[#171717] transition-all hover:border-[#f97316]/50 hover:bg-[#f97316]/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </motion.button>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${currentIndex * (100 / cardsPerView)}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {screenshots.map((screenshot, index) => (
                <motion.div
                  key={index}
                  className={`w-full flex-shrink-0 md:w-1/2 lg:w-1/3`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="group overflow-hidden rounded-2xl border border-[#262626] bg-[#171717] transition-all hover:border-[#f97316]/50">
                    <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#171717]">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f97316]/10 transition-transform group-hover:scale-110">
                        <span className="text-4xl">{screenshot.icon}</span>
                      </div>
                      <div className="absolute right-4 top-4">
                        <Monitor className="h-5 w-5 text-[#a3a3a3]" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-lg font-semibold text-white">{screenshot.title}</h3>
                      <p className="text-sm text-[#a3a3a3]">{screenshot.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentIndex === index ? "w-8 bg-[#f97316]" : "bg-[#262626] hover:bg-[#f97316]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
