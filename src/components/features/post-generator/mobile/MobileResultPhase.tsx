"use client";

import { Button } from "@/src/components/ui";
import { Check, Copy, RefreshCw, RotateCcw } from "lucide-react";
import { useState } from "react";

interface MobileResultPhaseProps {
    deck: { final: string };
    scores: any[];
    onCopy: () => void;
    onRePolish: () => void;
    onReset: () => void;
    loading: boolean;
}

import OpikScoreCard from "@/src/components/analytics/OpikScoreCard";

export default function MobileResultPhase({
    deck,
    scores,
    onCopy,
    onRePolish,
    onReset,
    loading,
}: MobileResultPhaseProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex min-h-full flex-col p-4 pb-24">
            <div className="mb-6 mt-4 text-center">
                <h2 className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
                    Result Ready!
                </h2>
                <p className="text-sm text-zinc-400">Here is your polished post</p>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2">
                {scores && scores.length > 0 && (
                    <div className="mb-4">
                        <OpikScoreCard scores={scores} />
                    </div>
                )}
                <textarea
                    readOnly
                    value={deck.final}
                    className="h-full w-full resize-none border-none bg-transparent p-4 text-base leading-relaxed text-zinc-200 focus:outline-none focus:ring-0"
                    style={{ minHeight: '300px' }}
                />
            </div>

            {/* Floating Actions */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-xl">
                <div className="flex gap-3">
                    <Button
                        onClick={handleCopy}
                        className={`flex-1 gap-2 shadow-lg ${copied ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Text"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onRePolish}
                        disabled={loading}
                        className="border-zinc-700 p-2 text-zinc-300"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="border-zinc-700 p-2 text-zinc-300"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
