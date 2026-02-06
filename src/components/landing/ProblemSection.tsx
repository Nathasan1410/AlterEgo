"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";
import BentoCard from "./MagicBento";

export default function ProblemSection() {
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
            The Challenge: Creating Viral LinkedIn Content
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Content creation is hard. Most professionals struggle to maintain consistency and
            quality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <BentoCard
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <Clock className="h-6 w-6 text-red-500" />
              </div>
            }
            title="Time-Consuming"
            description="1-2 hours to write a single high-quality post. Time you could spend on growth."
            size="md"
          />

          <BentoCard
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
            }
            title="Inconsistent Quality"
            description="Quality varies based on mood and creativity. You never know what you'll get."
            size="md"
          />

          <BentoCard
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                <TrendingDown className="h-6 w-6 text-orange-500" />
              </div>
            }
            title="Unpredictable Results"
            description="Generic AI tools don't capture your unique voice. Content feels robotic and inauthentic."
            size="md"
          />

          <BentoCard
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            }
            title="Massive Market Gap"
            description="$8B opportunity with no LinkedIn-optimized AI solution. First mover advantage."
            size="md"
          />
        </div>
      </div>
    </section>
  );
}
