"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-64 rounded-lg bg-zinc-900 p-3 text-sm text-zinc-200 shadow-xl ${positionClasses[position]}`}
          >
            {content}
            <div
              className={`absolute ${
                position === "top"
                  ? "-bottom-1 left-1/2 -translate-x-1/2 rotate-45"
                  : position === "bottom"
                    ? "-top-1 left-1/2 -translate-x-1/2 rotate-45"
                    : position === "left"
                      ? "-right-1 top-1/2 -translate-y-1/2 rotate-45"
                      : "-left-1 top-1/2 -translate-y-1/2 rotate-45"
              } h-2 w-2 border-b border-r border-zinc-700 bg-zinc-900`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
