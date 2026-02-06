"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Target,
  FileText,
  Megaphone,
  Settings as SettingsIcon,
  ChevronRight,
  Search,
  Smile,
  Volume2,
} from "lucide-react";
import { useState } from "react";

interface CanvasProps {
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

interface AccordionItemProps {
  title: string;
  content: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  isEmpty: boolean;
}

function AccordionItem({
  title,
  content,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  isExpanded,
  onToggle,
  isEmpty,
}: AccordionItemProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border-2 transition-all ${isEmpty
        ? "border-dashed border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800/30"
        : `${bgColor} ${borderColor} shadow-lg`
        }`}
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
    >
      {/* Gradient Accent */}
      {!isEmpty && (
        <div
          className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${color} rounded-t-xl`}
        />
      )}

      {/* Header - Clickable */}
      <button
        onClick={onToggle}
        disabled={isEmpty}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-black/5 disabled:cursor-not-allowed"
      >
        <div
          className={`rounded-lg p-2 ${!isEmpty ? `bg-gradient-to-br ${color}` : "bg-gray-200 dark:bg-gray-700"}`}
        >
          <Icon className={`h-4 w-4 ${!isEmpty ? "text-white" : "text-gray-400"}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h4
              className={`text-sm font-bold ${!isEmpty ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
            >
              {title}
            </h4>
            {!isEmpty && <span className="text-xs text-green-600 dark:text-green-400">Done</span>}
          </div>
          {!isEmpty && !isExpanded && (
            <p className="line-clamp-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              {content}
            </p>
          )}
          {isEmpty && <p className="text-xs italic text-gray-400">Not selected yet</p>}
        </div>
        {!isEmpty && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </motion.div>
        )}
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && !isEmpty && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 px-4 pb-4 pt-2 dark:border-gray-700">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import SettingsPanel from "../layout/SettingsPanel";

export default function Canvas({ deck, currentStep, settings, onSettingsChange, originalPrompt }: CanvasProps & { onSettingsChange?: (settings: any) => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("topic");

  // ORANGE THEME colors
  const pieces = [
    {
      key: "topic",
      label: "Topic",
      value: deck.topic,
      icon: Target,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      key: "hook",
      label: "Hook",
      value: deck.hook,
      icon: Sparkles,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      key: "body",
      label: "Body",
      value: deck.body,
      icon: FileText,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      key: "cta",
      label: "CTA",
      value: deck.cta,
      icon: Megaphone,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
  ];

  const toggleSection = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6 pb-20 md:pb-6">
      {/* Header - ORANGE GRADIENT */}
      <div className="text-center">
        <h3 className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-lg font-bold text-transparent">
          Your Post Canvas
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Click to expand and view full content
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1">
        {pieces.map((piece, i) => (
          <div
            key={piece.key}
            className={`h-1.5 flex-1 rounded-full transition-all ${piece.value ? `bg-gradient-to-r ${piece.color}` : "bg-gray-200 dark:bg-gray-700"
              }`}
          />
        ))}
      </div>

      {/* Accordion Pieces */}
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto">
        {pieces.map((piece) => (
          <AccordionItem
            key={piece.key}
            title={piece.label}
            content={piece.value}
            icon={piece.icon}
            color={piece.color}
            bgColor={piece.bgColor}
            borderColor={piece.borderColor}
            isExpanded={expandedSection === piece.key}
            onToggle={() => toggleSection(piece.key)}
            isEmpty={!piece.value}
          />
        ))}

        {/* Compact Settings Summary */}
        {settings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-t border-white/10 pt-4"
          >
            <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <SettingsIcon className="h-3.5 w-3.5 text-gray-400" />
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Settings</h4>
              </div>

              {/* Prompt Section */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-gray-500 uppercase">Prompt :</span>
                <p className="font-medium text-gray-200 text-sm leading-snug">
                  {originalPrompt || deck.topic || "Drafting..."}
                </p>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Intent */}
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300 capitalize">
                  {settings.intent}
                </div>
                {/* Length */}
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300 capitalize">
                  {settings.length}
                </div>

                {/* Research */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300" title="Research Depth">
                  <Search className="w-3 h-3 text-sky-400" />
                  <span>{settings.researchDepth}</span>
                </div>

                {/* Emoji */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300" title="Emoji Density">
                  <Smile className="w-3 h-3 text-orange-400" />
                  <span>{settings.emojiLevel}</span>
                </div>

                {/* Tone */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300" title="Voice / Tone">
                  <Volume2 className="w-3 h-3 text-teal-400" />
                  <span>{settings.tone}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
