"use client";

import { motion } from "framer-motion";
import ChatInput from "@/src/components/layout/ChatInput";
import type { Settings } from "../InputPhase";

interface MobileInputPhaseProps {
    onStart: (topic: string, settings: Settings) => void;
    initialSettings: Settings;
    onSettingsChange: (settings: Settings) => void;
}

export default function MobileInputPhase({
    onStart,
    initialSettings,
    onSettingsChange,
}: MobileInputPhaseProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-col justify-between p-4"
        >
            <div className="mt-20 text-center">
                <h1 className="mb-3 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                    AlterEgo
                </h1>
                <p className="text-lg font-medium text-gray-400">
                    What do you want to create?
                </p>
            </div>

            <div className="mb-4 w-full">
                <ChatInput
                    onGenerate={onStart}
                    initialSettings={initialSettings}
                    onSettingsChange={onSettingsChange}
                />
            </div>


        </motion.div>
    );
}
