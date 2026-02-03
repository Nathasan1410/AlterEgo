"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PostGeneratorWizard from "@/src/components/features/post-generator/PostGeneratorWizard";
import DarkVeilBackground from "@/src/components/layout/DarkVeilBackground";
import Sidebar from "@/src/components/layout/Sidebar";
import { Linkedin } from "lucide-react";

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DarkVeilBackground />

      {/* Sidebar (Gemini Style) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area - Dynamic Padding */}
      <motion.div
        animate={{ paddingLeft: isSidebarCollapsed ? "72px" : "280px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10 min-h-screen"
      >
        {/* Top Bar */}
        <div className="absolute right-6 top-6 z-50">
          <button className="flex items-center gap-2 rounded-full bg-[#0077b5] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-900/20 transition-colors hover:bg-[#006396]">
            <Linkedin className="h-4 w-4" />
            Connect LinkedIn
          </button>
        </div>

        {/* Content */}
        <div className="container mx-auto pt-4">
          <PostGeneratorWizard />
        </div>
      </motion.div>
    </main>
  );
}
