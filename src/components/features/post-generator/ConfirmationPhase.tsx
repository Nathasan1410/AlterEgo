"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui";

export interface ConfirmationPhaseProps {
  deck: { topic: string; hook: string; body: string; cta: string; final: string };
  onConfirm: () => void;
  onEdit: () => void;
  loading: boolean;
}

const ReviewSection = ({
  label,
  content,
  isBody = false,
}: {
  label: string;
  content: string;
  isBody?: boolean;
}) => (
  <div>
    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
      {label}:
    </p>
    <p
      className={`text-lg leading-relaxed text-gray-900 dark:text-white ${isBody ? "whitespace-pre-wrap" : ""}`}
    >
      {content}
    </p>
  </div>
);

export default function ConfirmationPhase({
  deck,
  onConfirm,
  onEdit,
  loading,
}: ConfirmationPhaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto mt-8 max-w-3xl"
    >
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Ready to Polish?
        </h2>

        <div className="mb-8 space-y-6 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
          <ReviewSection label="Hook" content={deck.hook} />
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <ReviewSection label="Body" content={deck.body} isBody />
          </div>
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <ReviewSection label="CTA" content={deck.cta || "(No CTA)"} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-orange-700 hover:to-orange-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>{" "}
                Polishing...
              </>
            ) : (
              <>Yes, Polish!</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={loading}
            className="flex-1 rounded-xl bg-gray-200 px-8 py-4 text-lg font-bold text-gray-900 transition-all hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Edit Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
