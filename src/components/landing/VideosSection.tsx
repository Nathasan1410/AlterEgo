"use client";

import { motion } from "framer-motion";
import { Play, Maximize2 } from "lucide-react";

export default function VideosSection() {
  return (
    <section className="bg-[#0a0a0a]/50 px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">See AlterEgo in Action</h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Watch our pitch deck and demo video to learn more about the platform.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            className="group relative cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#262626] bg-[#171717]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f97316] transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-10 w-10 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-white">Pitch Deck</h3>
                <p className="text-sm text-[#a3a3a3]">
                  Learn about AlterEgo's vision and market opportunity
                </p>
              </div>
            </div>
            <motion.div className="absolute inset-0 rounded-2xl bg-[#f97316]/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>

          <motion.div
            className="group relative cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#262626] bg-[#171717]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f97316] transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-10 w-10 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-white">Demo Video</h3>
                <p className="text-sm text-[#a3a3a3]">
                  See how to generate viral LinkedIn posts in minutes
                </p>
              </div>
            </div>
            <motion.div className="absolute inset-0 rounded-2xl bg-[#f97316]/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
