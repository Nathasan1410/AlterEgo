"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/src/components/ui";
import MobileOptionList from "./MobileOptionList";
import type { HandType, DeckType } from "../BuildingPhase";

interface MobileBuildingPhaseProps {
    deck: DeckType;
    hand: HandType;
    navigationHistory: string[];
    loading: boolean;
    itemsPerPage: number;
    onSelect: (option: string) => void;
    onRegenerate: () => void;
    onBack: () => void;
}

const steps = ["Topic", "Hook", "Body", "CTA"];

export default function MobileBuildingPhase({
    deck,
    hand,
    navigationHistory,
    loading,
    itemsPerPage,
    onSelect,
    onRegenerate,
    onBack,
}: MobileBuildingPhaseProps) {
    const currentStep = hand.type || "topics";
    const stepIndex = ["topics", "hooks", "body", "cta"].indexOf(currentStep);

    return (
        <div className="flex w-full flex-col px-4 pt-4">
            {/* Top Navigation / Progress */}
            <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                    {navigationHistory.length > 0 ? (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </button>
                    ) : <div />}

                    <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500">
                        {currentStep} Phase
                    </h2>
                    <div /> {/* Spacer */}
                </div>

                {/* Progress Bar */}
                <div className="flex h-1 w-full gap-1 overflow-hidden rounded-full bg-zinc-800">
                    {steps.map((label, idx) => (
                        <div
                            key={label}
                            className={`flex-1 transition-colors duration-300 ${idx <= stepIndex ? "bg-orange-500" : "bg-zinc-800"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-2xl bg-zinc-800" />
                        <Skeleton className="h-32 w-full rounded-2xl bg-zinc-800" />
                        <Skeleton className="h-32 w-full rounded-2xl bg-zinc-800" />
                    </div>
                ) : hand.options ? (
                    <MobileOptionList
                        options={hand.options}
                        onSelect={onSelect}
                        onRegenerate={onRegenerate}
                        itemsPerPage={itemsPerPage}
                        stepType={hand.type!}
                        loading={loading}
                    />
                ) : null}
            </div>
        </div>
    );
}
