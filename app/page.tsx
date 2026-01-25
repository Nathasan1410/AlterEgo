'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PostGeneratorWizard from '@/components/PostGeneratorWizard';
import DarkVeilBackground from '@/components/DarkVeilBackground';
import Sidebar from '@/components/Sidebar';
import { Linkedin } from 'lucide-react';

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
        animate={{ paddingLeft: isSidebarCollapsed ? '72px' : '280px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen relative z-10"
      >
        
        {/* Top Bar */}
        <div className="absolute top-6 right-6 z-50">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] hover:bg-[#006396] text-white font-medium rounded-full text-sm transition-colors shadow-lg shadow-blue-900/20">
            <Linkedin className="w-4 h-4" />
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
