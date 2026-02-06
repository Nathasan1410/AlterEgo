"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/src/components/ui";
import OptionCarousel from "./OptionCarousel";


export type HandType = {
  type: "topics" | "hooks" | "body" | "cta" | null;
  options: (string | { content: string; score?: number; reasoning?: string })[] | null;
};
export type DeckType = { topic: string; hook: string; body: string; cta: string; final: string };

export interface BuildingPhaseProps {
  deck: DeckType;
  hand: HandType;
  navigationHistory: Array<"topics" | "hooks" | "body" | "cta">;
  loading: boolean;
  topicsPerPage: number;
  hooksPerPage: number;
  bodiesPerPage: number;
  ctasPerPage: number;
  settings: any;
  onSelect: (option: string) => void;
  onRegenerate: () => void;
  onRegenerateWithStyle: (text: string) => void;
  onBack: () => void;
  onGenerate: (topic: string, settings: any) => void;
  onSettingsChange: (settings: any) => void;
}

const steps = ["Topic", "Hook", "Body", "CTA", "Polish"];
const stepNames: Array<"topics" | "hooks" | "body" | "cta"> = ["topics", "hooks", "body", "cta"];

export default function BuildingPhase({
  deck,
  hand,
  navigationHistory,
  loading,
  topicsPerPage,
  hooksPerPage,
  bodiesPerPage,
  ctasPerPage,
  settings,
  onSelect,
  onRegenerate,
  onRegenerateWithStyle,
  onBack,
  onGenerate,
  onSettingsChange,
}: BuildingPhaseProps) {
  const currentIdx = hand.type ? stepNames.indexOf(hand.type) : -1;
  const itemsPerPage =
    hand.type === "topics"
      ? topicsPerPage
      : hand.type === "hooks"
        ? hooksPerPage
        : hand.type === "body"
          ? bodiesPerPage
          : ctasPerPage;

  return (
    <>
      <motion.div
        className="flex-1 overflow-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 w-full"
          >
            <div className="mb-6 flex items-center justify-between px-4">
              <div className="flex gap-2">
                {steps.map((s, i) => (
                  <div
                    key={s}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${currentIdx !== -1 && i <= currentIdx ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-400 dark:bg-gray-800"}`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {navigationHistory.length > 0 && (
              <button
                onClick={onBack}
                className="mb-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-orange-400"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to {navigationHistory[navigationHistory.length - 1]}
              </button>
            )}

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              ) : hand.options && Array.isArray(hand.options) ? (
                <OptionCarousel
                  options={hand.options}
                  onSelect={onSelect}
                  onRegenerate={onRegenerate}
                  itemsPerPage={itemsPerPage}
                  stepType={hand.type!}
                  loading={loading}
                />
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </>
  );
}
