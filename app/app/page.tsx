"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PostGeneratorWizard from "@/src/components/features/post-generator/PostGeneratorWizard";
import DarkVeilBackground from "@/src/components/layout/DarkVeilBackground";
import Sidebar from "@/src/components/layout/Sidebar";
import { HelpModal } from "@/src/components/help";
import { Linkedin, Menu, HelpCircle, Github, Book } from "lucide-react";
import { usePostGeneration } from "@/src/hooks/usePostGeneration";

export default function AppPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const postGenData = usePostGeneration();
  const { phase } = postGenData;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DarkVeilBackground />

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#050505]/80 p-4 backdrop-blur-md md:hidden">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="-ml-2 p-2 text-zinc-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHelpOpen(true)}
              className="rounded-full bg-white/10 p-2 text-zinc-400 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <a
              href="https://github.com/Nathasan1410/AlterEgo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-2 text-zinc-400 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://nathasan1410.gitbook.io/alter-ego/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-2 text-zinc-400 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <Book className="h-4 w-4" />
            </a>
            <button className="flex items-center gap-2 rounded-full bg-[#0077b5] px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-blue-900/20">
              <Linkedin className="h-3 w-3" />
              <span>Connect</span>
            </button>
          </div>
        </div>
      )}

      <motion.div
        animate={{
          paddingLeft: isMobile ? "0px" : isSidebarCollapsed ? "72px" : "280px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10 min-h-screen"
      >
        <div className="absolute right-6 top-6 z-50 hidden md:flex items-center gap-3">
          {/* Hide secondary buttons during building and result phases on desktop to avoid overlap */}
          {phase !== 'building' && phase !== 'result' && (
            <>
              <button
                onClick={() => setHelpOpen(true)}
                className="flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-400 backdrop-blur-md transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </button>
              <a
                href="https://github.com/Nathasan1410/AlterEgo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-400 backdrop-blur-md transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <Github className="h-4 w-4" />
                Github
              </a>
              <a
                href="https://nathasan1410.gitbook.io/alter-ego/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-400 backdrop-blur-md transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <Book className="h-4 w-4" />
                Gitbook
              </a>
            </>
          )}
          <button className="flex items-center gap-2 rounded-full bg-[#0077b5] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-900/20 transition-colors hover:bg-[#006396]">
            <Linkedin className="h-4 w-4" />
            Connect LinkedIn
          </button>
        </div>

        <div className="container mx-auto pt-20 md:pt-4">
          <PostGeneratorWizard {...postGenData} />
        </div>

      </motion.div>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </main >
  );
}
