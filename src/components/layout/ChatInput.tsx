"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card } from "../ui";
import SettingsPanel from "./SettingsPanel";
import VoiceInput from "../features/voice-input/VoiceInput";
import { Globe, Sparkles } from "lucide-react";

interface ChatInputProps {
  onGenerate: (topic: string, settings: any) => void;
  onRegenerate?: (text: string, settings: any) => void;
  currentStep?: "topics" | "hooks" | "body" | "cta" | null;
  initialSettings: any;
  onSettingsChange: (settings: any) => void;
  onOpenStyleOnboarding?: () => void;
  hasStyleProfile?: boolean;
}

export default function ChatInput({
  onGenerate,
  onRegenerate,
  currentStep,
  initialSettings,
  onSettingsChange,
  onOpenStyleOnboarding,
  hasStyleProfile = false,
}: ChatInputProps) {
  const [topic, setTopic] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [model, setModel] = useState("Llama 3 (Fast)");
  const [researchMode, setResearchMode] = useState(false);

  // Local state for chips before generating
  const [intent, setIntent] = useState(initialSettings.intent || "viral");
  const [length, setLength] = useState(initialSettings.length || "medium");
  const [magicMode, setMagicMode] = useState(initialSettings.magicMode || false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    onSettingsChange({ intent, length, magicMode, researchMode });
    onGenerate(topic, { intent, length, magicMode, researchMode });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Handle voice transcription - set as topic
  const handleTranscription = (text: string) => {
    setTopic(text);
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="group relative"
      >
        {/* Outer Container - Using Glass variant */}
        <div className="relative z-10 rounded-3xl border border-white/50 bg-white/70 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          {/* Subtle Orange Glow (Reduced) */}
          <div className="absolute -inset-1 rounded-3xl bg-orange-500 opacity-5 blur-2xl transition duration-500 group-hover:opacity-10"></div>

          {/* 1. Header Row (Model + Style + Settings) */}
          <div className="relative z-30 mb-4 flex items-center justify-between border-b border-stone-200 pb-3 dark:border-zinc-800">
            {/* Model Selector */}
            <div className="group/model relative z-40">
              <button
                suppressHydrationWarning
                className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-all hover:bg-stone-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500"></span>
                {model}
                <svg
                  className="h-3 w-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div className="invisible absolute left-0 top-full mt-2 w-48 origin-top-left transform rounded-xl border border-stone-200 bg-white opacity-0 shadow-xl transition-all group-hover/model:visible group-hover/model:opacity-100 dark:border-zinc-800 dark:bg-zinc-900">
                {["Llama 3 (Fast)", "DeepSeek V3", "Mistral Large"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className="w-full px-4 py-3 text-left text-sm text-stone-700 first:rounded-t-xl last:rounded-b-xl hover:bg-stone-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Style Profile Button - TEAL for Success/Active */}
              <button
                onClick={onOpenStyleOnboarding}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  hasStyleProfile
                    ? "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/20 dark:text-teal-400"
                    : "border-stone-200 bg-stone-100 text-stone-600 hover:bg-stone-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
                title="Personalize with your writing style"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {hasStyleProfile ? "Style Active" : "My Style"}
              </button>

              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="relative z-40 cursor-pointer rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                title="Settings"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 2. Textarea - REFINED INPUT (Solid White) */}
          <div className="group/input relative">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to post about today? Type or use voice..."
              className="relative z-10 min-h-[120px] w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-4 text-lg leading-relaxed text-stone-900 placeholder-stone-400 shadow-inner outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
              autoFocus
            />
          </div>

          {/* 3. Bottom Toolbar */}
          <div className="relative z-30 mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative z-30 flex items-center gap-2">
              {/* Voice Input */}
              <VoiceInput onTranscription={handleTranscription} />

              {/* Dropdowns - Stone Neutrals */}
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="relative z-30 cursor-pointer rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <option value="viral">Viral</option>
                <option value="storytelling">Story</option>
                <option value="educational">Edu</option>
              </select>

              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="relative z-30 cursor-pointer rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>

              {/* Research Toggle (Blue) */}
              <button
                onClick={() => setResearchMode(!researchMode)}
                className={`relative z-30 flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  researchMode
                    ? "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-400"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
                title="Enable web research"
              >
                <Globe className="h-3 w-3" />
                Research
              </button>

              {/* Magic Toggle (Violet for AI) */}
              <button
                onClick={() => setMagicMode(!magicMode)}
                className={`relative z-30 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  magicMode
                    ? "border-violet-200 bg-violet-50 text-violet-600 shadow-sm dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <span className="mr-1">✨</span> Magic
              </button>
            </div>

            {/* PRIMARY ACTION - Strong Orange */}
            <Button
              onClick={currentStep ? () => onRegenerate?.(topic, { intent, length, magicMode, researchMode }) : handleGenerate}
              disabled={currentStep ? false : !topic.trim()}
              variant="primary"
              className="px-6 py-2 shadow-lg shadow-orange-500/20"
            >
              {currentStep ? "Regenerate" : "Generate"}
            </Button>
          </div>

          {/* 4. Suggestions */}
          {!topic && (
            <div className="relative z-20 mt-4 border-t border-stone-200 pt-3 dark:border-zinc-800">
              <div className="mb-2 flex items-center gap-3 text-xs text-stone-500 dark:text-zinc-500">
                <span>Try asking:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Remote Work Tips",
                  "AI in Marketing",
                  "Startup Lessons",
                  "My Coding Journey",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="relative z-20 cursor-pointer rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-left text-xs text-stone-600 transition-colors hover:bg-stone-100 hover:text-orange-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-orange-400"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-16 z-50 w-80"
            >
              <Card
                variant="glass"
                className="border border-stone-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-800 dark:text-zinc-100">
                    Studio Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    X
                  </button>
                </div>
                <SettingsPanel
                  language={initialSettings.language || "id"}
                  setLanguage={(l) => onSettingsChange({ ...initialSettings, language: l })}
                  emojiLevel={initialSettings.emojiLevel}
                  setEmojiLevel={(v) => onSettingsChange({ ...initialSettings, emojiLevel: v })}
                  tone={initialSettings.tone}
                  setTone={(v) => onSettingsChange({ ...initialSettings, tone: v })}
                  researchDepth={initialSettings.researchDepth}
                  setResearchDepth={(v) =>
                    onSettingsChange({ ...initialSettings, researchDepth: v })
                  }
                />
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
