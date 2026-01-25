import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Sparkles, Globe, Smile, Zap, Search } from 'lucide-react';

interface FocusSummaryProps {
  input: string;
  settings: {
    language: string;
    emojiLevel: number | string;
    tone: number;
    researchDepth: number;
    intent: string;
    length: string;
    magicMode: boolean;
  };
  onEdit: () => void;
}

export default function FocusSummary({ input, settings, onEdit }: FocusSummaryProps) {
  
  // Helper to get labels
  const getLanguageLabel = (lang: string) => lang === 'id' ? 'Indonesian' : 'English';
  
  const getToneLabel = (val: number) => {
    if (val <= 3) return 'Formal';
    if (val <= 7) return 'Balanced';
    return 'Casual';
  };

  const getResearchLabel = (val: number) => {
    if (val <= 2) return 'Basic';
    if (val <= 4) return 'Standard';
    return 'Deep Dive';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between"
    >
      {/* Left: User Prompt */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
          Your topic
        </p>
        <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-medium text-white truncate" title={input}>
            "{input}"
            </h3>
            <button 
                onClick={onEdit}
                className="p-1.5 text-gray-500 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/5"
                title="Edit Prompt"
            >
                <Edit2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Right: Settings Chips */}
      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
        
        {/* Magic Mode Badge (if active) */}
        {settings.magicMode && (
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-xs font-bold text-white flex items-center gap-1 shadow-lg shadow-purple-900/20">
            <Sparkles className="w-3 h-3" />
            Magic Mode
          </div>
        )}

        {/* Intent */}
        <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {settings.intent}
        </div>

        {/* Tone */}
        <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300 flex items-center gap-1">
           <Smile className="w-3 h-3" />
           {getToneLabel(settings.tone)}
        </div>

         {/* Research */}
         <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300 flex items-center gap-1">
           <Search className="w-3 h-3" />
           {getResearchLabel(settings.researchDepth)}
        </div>

        {/* Language */}
        <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {getLanguageLabel(settings.language)}
        </div>
        
        {/* Model Badge (Static for now as we use Llama 3) */}
        <div className="px-3 py-1 bg-orange-900/30 border border-orange-500/30 text-orange-400 rounded-full text-xs font-medium">
            Llama 3.3 70B
        </div>

      </div>
    </motion.div>
  );
}
