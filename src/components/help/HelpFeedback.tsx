"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";

interface HelpFeedbackProps {
  onFeedback?: (helpful: boolean) => void;
}

export default function HelpFeedback({ onFeedback }: HelpFeedbackProps) {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    setFeedback(helpful ? "yes" : "no");
    onFeedback?.(helpful);
    setShowThankYou(true);

    setTimeout(() => {
      setShowThankYou(false);
      setFeedback(null);
    }, 3000);
  };

  return (
    <div className="mt-6 border-t border-zinc-800 pt-6">
      {!showThankYou ? (
        <div>
          <p className="mb-3 text-sm text-zinc-400">Was this helpful?</p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFeedback(true)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                feedback === "yes"
                  ? "bg-green-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              Yes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFeedback(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                feedback === "no"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              No
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-400"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Thank you for your feedback!</span>
        </motion.div>
      )}
    </div>
  );
}
