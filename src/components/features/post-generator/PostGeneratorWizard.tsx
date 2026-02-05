"use client";

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Canvas from "@/src/components/canvas/Canvas";
import MobileCanvas from "@/src/components/canvas/MobileCanvas";
import InputPhase from "./InputPhase";
import BuildingPhase from "./BuildingPhase";
import ConfirmationPhase from "./ConfirmationPhase";
import ResultPhase from "./ResultPhase";
import { usePostGeneration } from "@/src/hooks/usePostGeneration";
import type { Settings } from "./InputPhase";

export type { Settings };

export default function PostGeneratorWizard() {
  const {
    phase,
    deck,
    hand,
    settings,
    loading,
    opikScores,
    isMobile,
    navigationHistory,
    optionsCache,
    topicsPerPage,
    hooksPerPage,
    bodiesPerPage,
    ctasPerPage,
    handleStart,
    handleOptionSelect,
    handleRegenerate,
    handleRegenerateWithStyle,
    handleBack,
    handleConfirmPolish,
    handleRePolish,
    handleCopy,
    handleEdit,
    reset,
    setSettings,
  } = usePostGeneration();

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start justify-center gap-8 overflow-x-hidden px-12 py-6">
      <div className="flex max-w-3xl flex-1 flex-col" style={{ minHeight: "calc(100vh - 48px)" }}>
        {phase === "input" && (
          <InputPhase
            onStart={handleStart}
            initialSettings={settings}
            onSettingsChange={setSettings}
          />
        )}

        {phase === "building" && (
          <BuildingPhase
            deck={deck}
            hand={hand}
            navigationHistory={navigationHistory}
            loading={loading}
            topicsPerPage={topicsPerPage}
            hooksPerPage={hooksPerPage}
            bodiesPerPage={bodiesPerPage}
            ctasPerPage={ctasPerPage}
            settings={settings}
            onSelect={handleOptionSelect}
            onRegenerate={handleRegenerate}
            onRegenerateWithStyle={handleRegenerateWithStyle}
            onBack={handleBack}
            onGenerate={handleStart}
            onSettingsChange={setSettings}
          />
        )}

        {phase === "confirm" && (
          <ConfirmationPhase
            deck={deck}
            onConfirm={handleConfirmPolish}
            onEdit={handleEdit}
            loading={loading}
          />
        )}

        {phase === "result" && (
          <ResultPhase
            deck={deck}
            scores={opikScores}
            onCopy={handleCopy}
            onRePolish={handleRePolish}
            onReset={reset}
            loading={loading}
          />
        )}
      </div>

      <AnimatePresence>
        {phase === "building" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="sticky top-10 hidden h-[calc(100vh-3rem)] w-96 lg:block"
          >
            <div className="h-full overflow-hidden rounded-3xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
              <Canvas deck={deck} currentStep={hand.type} settings={settings} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "building" && <MobileCanvas deck={deck} currentStep={hand.type} />}
    </div>
  );
}
