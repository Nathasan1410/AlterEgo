"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const competitors = [
  {
    name: "AlterEgo",
    styleCloning: true,
    linkedinOptimization: true,
    observability: true,
    price: "Affordable",
    speed: "Sub-second",
    isAlterEgo: true,
  },
  {
    name: "Jasper AI",
    styleCloning: false,
    linkedinOptimization: false,
    observability: false,
    price: "$49/mo+",
    speed: "Slow",
  },
  {
    name: "Copy.ai",
    styleCloning: false,
    linkedinOptimization: false,
    observability: false,
    price: "$36/mo+",
    speed: "Medium",
  },
  {
    name: "ChatGPT Plus",
    styleCloning: false,
    linkedinOptimization: false,
    observability: false,
    price: "$20/mo",
    speed: "Fast",
  },
];

export default function ComparisonSection() {
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
            Compare with Competitors
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#a3a3a3]">
            See why AlterEgo is the best choice for LinkedIn content creation.
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="mx-auto w-full max-w-6xl">
            <thead>
              <tr>
                <th className="p-4 text-left font-medium text-[#a3a3a3]">Feature</th>
                {competitors.map((competitor) => (
                  <th
                    key={competitor.name}
                    className={`p-4 font-semibold ${
                      competitor.isAlterEgo ? "text-[#f97316]" : "text-white"
                    }`}
                  >
                    {competitor.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Style Cloning",
                  key: "styleCloning",
                },
                {
                  label: "LinkedIn Optimization",
                  key: "linkedinOptimization",
                },
                {
                  label: "Observability",
                  key: "observability",
                },
                {
                  label: "Price",
                  key: "price",
                },
                {
                  label: "Speed",
                  key: "speed",
                },
              ].map((feature, index) => (
                <tr
                  key={index}
                  className={`border-t border-[#262626] ${index % 2 === 0 ? "bg-[#0a0a0a]" : ""}`}
                >
                  <td className="p-4 text-[#a3a3a3]">{feature.label}</td>
                  {competitors.map((competitor) => (
                    <td
                      key={competitor.name}
                      className={`p-4 ${competitor.isAlterEgo ? "text-[#f97316]" : ""}`}
                    >
                      {typeof competitor[feature.key as keyof typeof competitor] === "boolean" ? (
                        competitor[feature.key as keyof typeof competitor] ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      ) : (
                        <span className="text-white">
                          {competitor[feature.key as keyof typeof competitor]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
