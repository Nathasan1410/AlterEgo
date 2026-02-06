"use client";

import { usePostGeneration } from "@/src/hooks/usePostGeneration";
import MobileInputPhase from "./MobileInputPhase";
import MobileBuildingPhase from "./MobileBuildingPhase";
import MobileResultPhase from "./MobileResultPhase";
import MobileCanvas from "@/src/components/canvas/MobileCanvas";
import ConfirmationPhase from "../ConfirmationPhase"; // Reuse simple confirmation or make mobile one? 
// ConfirmationPhase is simple text, let's reuse or wrap it. 
// Actually let's just make a simple mobile confirm wrapper if needed.
// For now, I'll use the desktop one but wrapped.

// We need to import the hook return type or mock it? 
// The hook is used inside the parent, but here we can just accept props or re-call the hook??
// No, the parent (PostGeneratorWizard) calls the hook. 
// But wait, the request is to "recreate the whole thing" for mobile.
// If I create MobilePostGeneratorWizard, does it use the hook itself? 
// PostGeneratorWizard.tsx uses the hook. 
// If I use the hook here too, we might duplicate state if they are swappable.
// BUT, `isMobile` is determined inside the hook.
// So `PostGeneratorWizard` calls the hook, then decides whether to render Desktop or Mobile wizard.
// So `MobilePostGeneratorWizard` should accept the hook's return values as props.

import type { UsePostGenerationReturn } from "@/src/hooks/usePostGeneration";

export default function MobilePostGeneratorWizard(props: UsePostGenerationReturn) {
    const {
        phase,
        deck,
        hand,
        settings,
        opikScores,
        loading,
        error,
        navigationHistory,
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
        clearError,
        setSettings,
        originalPrompt,
    } = props;

    const itemsPerPage =
        hand.type === "topics"
            ? topicsPerPage
            : hand.type === "hooks"
                ? hooksPerPage
                : hand.type === "body"
                    ? bodiesPerPage
                    : ctasPerPage;

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#050505]">
            {/* Error Banner */}
            {error && (
                <div className="mx-4 mt-4 rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-200">
                    <p className="text-sm">{error}</p>
                    <button onClick={clearError} className="mt-2 text-xs underline">Dismiss</button>
                </div>
            )}

            {/* Main Content Area */}
            {phase === "input" && (
                <MobileInputPhase
                    onStart={handleStart}
                    initialSettings={settings}
                    onSettingsChange={setSettings}
                />
            )}

            {phase === "building" && (
                <>
                    <MobileBuildingPhase
                        deck={deck}
                        hand={hand}
                        navigationHistory={navigationHistory}
                        loading={loading}
                        itemsPerPage={itemsPerPage}
                        onSelect={handleOptionSelect}
                        onRegenerate={handleRegenerate}
                        onBack={handleBack}
                    />
                    {/* Mobile Canvas (Sticky Bottom Sheet) */}
                    <MobileCanvas
                        deck={deck}
                        currentStep={hand.type}
                        settings={settings}
                        originalPrompt={originalPrompt}
                    />
                </>
            )}

            {phase === "confirm" && (
                <div className="p-4 pt-20">
                    <ConfirmationPhase
                        deck={deck}
                        onConfirm={handleConfirmPolish}
                        onEdit={handleEdit}
                        loading={loading}
                    />
                </div>
            )}

            {phase === "result" && (
                <MobileResultPhase
                    deck={deck}
                    scores={opikScores}
                    onCopy={handleCopy}
                    onRePolish={handleRePolish}
                    onReset={reset}
                    loading={loading}
                />
            )}
        </div>
    );
}
