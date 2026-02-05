"use client";

import { motion } from "framer-motion";
import ChatInput from "@/src/components/layout/ChatInput";

export type Settings = {
  language: string;
  emojiLevel: number;
  tone: number;
  researchDepth: number;
  intent: string;
  length: string;
  magicMode: boolean;
};

export interface InputPhaseProps {
  onStart: (topic: string, settings: Settings) => void;
  initialSettings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export default function InputPhase({
  onStart,
  initialSettings,
  onSettingsChange,
}: InputPhaseProps) {
  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="animate-fade-in-up mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
          Hello, Creator
        </h1>
        <p className="text-base font-medium text-gray-700 md:text-lg dark:text-gray-400">
          What do you want to write today?
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></span>
          Powered by Opik AI Observability
        </div>
      </div>

      <div className="w-full">
        <ChatInput
          onGenerate={onStart}
          initialSettings={initialSettings}
          onSettingsChange={onSettingsChange}
        />
      </div>
    </motion.div>
  );
}
