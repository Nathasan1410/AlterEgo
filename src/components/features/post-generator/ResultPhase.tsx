"use client";

import { Button } from "@/src/components/ui";
import OpikScoreCard from "@/src/components/analytics/OpikScoreCard";

export interface ResultPhaseProps {
  deck: {
    topic: string;
    hook: string;
    body: string;
    cta: string;
    final: string;
  };
  scores: any[];
  onCopy: () => void;
  onRePolish: () => void;
  onReset: () => void;
  loading: boolean;
}

export default function ResultPhase({
  deck,
  scores,
  onCopy,
  onRePolish,
  onReset,
  loading,
}: ResultPhaseProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl p-4">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-2xl font-bold text-transparent">
              Your Viral Post is Ready!
            </h2>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></span>
              Traced by Opik AI
            </div>
          </div>

          {scores && scores.length > 0 && <OpikScoreCard scores={scores} />}
        </div>

        <pre className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-6 font-sans text-lg leading-relaxed text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
          {deck.final || "Polishing your masterpiece..."}
        </pre>

        <div className="mt-6 flex flex-wrap gap-4">
          <Button onClick={onCopy}>Copy Text</Button>
          <Button
            variant="outline"
            onClick={onRePolish}
            disabled={loading}
            style={{ color: "#ffffff", borderColor: "#52525b" }}
            className="hover:bg-zinc-800"
          >
            {loading ? "Re-polishing..." : "Re-Polish"}
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            style={{ color: "#ffffff", borderColor: "#52525b" }}
            className="hover:bg-zinc-800"
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
