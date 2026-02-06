"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/src/components/ui/Button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/10 via-[#f97316]/5 to-transparent" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Sparkles className="h-4 w-4 text-[#f97316]" />
            <span className="text-sm font-medium text-[#f97316]">Start your free trial today</span>
          </motion.div>

          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Ready to Transform Your LinkedIn Presence?
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-[#a3a3a3]">
            Join thousands of professionals creating viral content with AlterEgo.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/app">
              <Button variant="primary" size="lg" className="px-10 py-4 text-lg">
                GET STARTED FREE
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="px-10 py-4 text-lg text-white hover:text-[#f97316]"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              Watch Demo
            </Button>
          </div>

          <motion.p
            className="mt-8 text-sm text-[#a3a3a3]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            No credit card required. Start creating viral content in minutes.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
