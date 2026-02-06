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
}

export default function MobileCanvas({ deck, currentStep }: MobileCanvasProps) {
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
        {/* Progress Dots */}
        <div className="mb-3 flex justify-center gap-2">
          {pieces.map((piece, i) => (
            <button
              key={piece.key}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? `w-8 bg-gradient-to-r ${piece.color}`
                  : piece.value
                    ? `w-1.5 bg-gradient-to-r ${piece.color} opacity-50`
                    : "w-1.5 bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
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
