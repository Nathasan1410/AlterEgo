import React from "react";
import { motion } from "framer-motion";
import { Edit2, Sparkles, Globe, Smile, Zap, Search } from "lucide-react";

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
  const getLanguageLabel = (lang: string) => (lang === "id" ? "Indonesian" : "English");

  const getToneLabel = (val: number) => {
    if (val <= 3) return "Formal";
    if (val <= 7) return "Balanced";
    return "Casual";
  };

  const getResearchLabel = (val: number) => {
    if (val <= 2) return "Basic";
    if (val <= 4) return "Standard";
    return "Deep Dive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:flex-row"
    >
      {/* Left: User Prompt */}
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Your topic
        </p>
        <div className="flex items-center gap-3">
          <h3 className="truncate text-lg font-medium text-white md:text-xl" title={input}>
            "{input}"
          </h3>
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/5 hover:text-orange-500"
            title="Edit Prompt"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right: Settings Chips */}
      <div className="flex flex-wrap justify-start gap-2 md:justify-end">
        {/* Magic Mode Badge (if active) */}
        {settings.magicMode && (
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-purple-900/20">
            <Sparkles className="h-3 w-3" />
            Magic Mode
          </div>
        )}

        {/* Intent */}
        <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
          <Zap className="h-3 w-3" />
          {settings.intent}
        </div>

        {/* Tone */}
        <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
          <Smile className="h-3 w-3" />
          {getToneLabel(settings.tone)}
        </div>

        {/* Research */}
        <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
          <Search className="h-3 w-3" />
          {getResearchLabel(settings.researchDepth)}
        </div>

        {/* Language */}
        <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
          <Globe className="h-3 w-3" />
          {getLanguageLabel(settings.language)}
        </div>

        {/* Model Badge (Static for now as we use Llama 3) */}
        <div className="rounded-full border border-orange-500/30 bg-orange-900/30 px-3 py-1 text-xs font-medium text-orange-400">
          Llama 3.3 70B
        </div>
      </div>
    </motion.div>
  );
}
