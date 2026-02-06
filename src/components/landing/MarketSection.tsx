"use client";

import { motion } from "framer-motion";
import { Users, PenTool, Megaphone, TrendingUp, Zap, DollarSign } from "lucide-react";
import BentoCard from "./MagicBento";

const marketStats = [
  {
    number: "900M+",
    label: "LinkedIn users globally",
    icon: Users,
  },
  {
    number: "100M+",
    label: "Professional content creators",
    icon: PenTool,
  },
  {
    number: "50M+",
    label: "B2B marketers",
    icon: Megaphone,
  },
  {
    number: "73%",
    label: "YoY AI adoption growth",
    icon: TrendingUp,
  },
  {
    number: "15%",
    label: "YoY LinkedIn user growth",
    icon: Zap,
  },
  {
    number: "$8B+",
    label: "Annual content marketing spend",
    icon: DollarSign,
  },
];

export default function MarketSection() {
  return (
    <section className="bg-[#0a0a0a]/50 px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            A $8B Market Opportunity
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            Massive market with explosive growth and no dominant player.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {marketStats.map((stat, index) => (
            <BentoCard
              key={index}
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10">
                  <stat.icon className="h-6 w-6 text-[#f97316]" />
                </div>
              }
              title={stat.number}
              description={stat.label}
              size="sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
