"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Sparkles, Target, FileText, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface MobileCanvasProps {
  deck: {
    topic: string;
    hook: string;
    body: string;
    cta: string;
  };
  currentStep: "topics" | "hooks" | "body" | "cta" | null;
  settings?: any;
  originalPrompt?: string;
}

import { Search, Smile, Volume2, Settings as SettingsIcon } from "lucide-react";

export default function MobileCanvas({ deck, currentStep, settings, originalPrompt }: MobileCanvasProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ORANGE THEME colors
  const pieces = [
    {
      key: "topic",
      label: "Topic",
      value: deck.topic,
      icon: Target,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      key: "hook",
      label: "Hook",
      value: deck.hook,
      icon: Sparkles,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      key: "body",
      label: "Body",
      value: deck.body,
      icon: FileText,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      key: "cta",
      label: "CTA",
      value: deck.cta,
      icon: Megaphone,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      key: "settings",
      label: "Config",
      value: "Configuration", // Placeholder for logic
      icon: SettingsIcon,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
    },
  ];

  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -50 && currentIndex < pieces.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentPiece = pieces[currentIndex];
  const Icon = currentPiece.icon;
  const isActive = !!currentPiece.value;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="rounded-t-3xl border-t-2 border-gray-700 bg-gray-900/95 p-4 shadow-2xl backdrop-blur-xl"
      >
        {/* Progress Dots & Label */}
        <div className="mb-3 flex flex-col items-center gap-2">
          <div className="flex justify-center gap-2">
            {pieces.map((piece, i) => (
              <button
                key={piece.key}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === currentIndex
                    ? `w-8 bg-gradient-to-r ${piece.color}`
                    : piece.value
                      ? `w-1.5 bg-gradient-to-r ${piece.color} opacity-50`
                      : "w-1.5 bg-gray-300 dark:bg-gray-700"
                  }`}
              />
            ))}
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-bold bg-gradient-to-r ${currentPiece.color} bg-clip-text text-transparent`}>
            {currentPiece.label}
          </span>
        </div>

        {/* Swipeable Card */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleSwipe}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl p-4 ${isActive ? `${currentPiece.bgColor} border-2 border-gray-200 dark:border-gray-700` : "border-2 border-dashed border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"}`}
            >
              {currentPiece.key === 'settings' && settings ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${currentPiece.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Configuration</h4>
                  </div>

                  {/* Prompt */}
                  <div className="bg-white/40 dark:bg-black/20 rounded-lg p-3 border border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Original Prompt</span>
                    <p className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200 leading-snug">
                      {originalPrompt || deck.topic || "Drafting..."}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="px-2 py-1 rounded-md bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/10 text-[10px] font-medium text-gray-600 dark:text-gray-300 capitalize">
                      {settings.intent}
                    </div>
                    <div className="px-2 py-1 rounded-md bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/10 text-[10px] font-medium text-gray-600 dark:text-gray-300 capitalize">
                      {settings.length}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/10 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                      <Search className="w-3 h-3 text-sky-500" /> {settings.researchDepth}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/10 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                      <Smile className="w-3 h-3 text-orange-500" /> {settings.emojiLevel}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/10 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                      <Volume2 className="w-3 h-3 text-teal-500" /> {settings.tone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg p-2 ${isActive ? `bg-gradient-to-br ${currentPiece.color}` : "bg-gray-300 dark:bg-gray-700"}`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                      >
                        {currentPiece.label}
                      </h4>
                      {isActive && (
                        <span className="text-xs text-green-600 dark:text-green-400">Done</span>
                      )}
                    </div>
                    {isActive ? (
                      <p className="line-clamp-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                        {currentPiece.value}
                      </p>
                    ) : (
                      <p className="text-xs italic text-gray-400">Not selected yet</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Arrows */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="rounded-lg bg-gray-100 p-2 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {pieces.length}
          </span>
          <button
            onClick={() => setCurrentIndex(Math.min(pieces.length - 1, currentIndex + 1))}
            disabled={currentIndex === pieces.length - 1}
            className="rounded-lg bg-gray-100 p-2 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-gray-800"
          >
            <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </motion.div>


    </div>
  );
}
