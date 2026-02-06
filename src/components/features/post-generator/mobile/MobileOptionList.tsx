"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RefreshCw, Star, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/src/components/ui";
import type { GeneratedOption } from "@/src/lib/api-client";

interface MobileOptionListProps {
    options: (string | GeneratedOption)[];
    onSelect: (option: string) => void;
    onRegenerate: () => void;
    itemsPerPage: number;
    stepType: "topics" | "hooks" | "body" | "cta";
    loading?: boolean;
}

export default function MobileOptionList({
    options,
    onSelect,
    onRegenerate,
    itemsPerPage,
    stepType,
    loading = false,
}: MobileOptionListProps) {
    const [currentPage, setCurrentPage] = useState(0);

    // Pagination logic
    const totalOptionPages = Math.ceil(options.length / itemsPerPage);
    const totalPages = stepType === "cta" ? totalOptionPages + 2 : totalOptionPages + 1;

    const currentOptions = options.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const isCtaNoCtaPage = stepType === "cta" && currentPage === totalOptionPages;
    const isRegeneratePage = currentPage === totalPages - 1;

    const nextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(p => p + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(p => p - 1);
    };

    const getContent = (opt: string | GeneratedOption) =>
        typeof opt === "string" ? opt : opt.content;
    const getScore = (opt: string | GeneratedOption) => (typeof opt === "string" ? null : opt.score);

    return (
        <div className="flex flex-col gap-4 pb-24">
            {/* Header / Pagination Controls */}
            <div className="flex items-center justify-between px-2 text-sm text-zinc-400">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="p-2 disabled:opacity-30"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 disabled:opacity-30"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3"
                >
                    {isRegeneratePage ? (
                        <div
                            onClick={onRegenerate}
                            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-8 text-center active:scale-95 transition-transform"
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
                                <RefreshCw className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Regenerate Options</h3>
                            <p className="text-sm text-zinc-400">Not happy? Try again.</p>
                        </div>
                    ) : isCtaNoCtaPage ? (
                        <div
                            onClick={() => onSelect("")}
                            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-8 text-center active:scale-95 transition-transform"
                        >
                            <h3 className="text-lg font-bold text-white">No CTA</h3>
                            <p className="text-sm text-zinc-400">Skip Call to Action</p>
                        </div>
                    ) : (
                        currentOptions.map((opt, i) => {
                            const content = getContent(opt);
                            const score = getScore(opt);

                            return (
                                <div
                                    key={i}
                                    onClick={() => onSelect(content)}
                                    className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 active:scale-[0.98] transition-all active:border-orange-500/50"
                                    style={{ minHeight: '120px' }}
                                >
                                    {/* Selection Indicator Gradient */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500 opacity-0 transition-opacity group-active:opacity-100" />

                                    {score && (
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="flex items-center gap-1 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-400 border border-teal-500/20">
                                                <Star className="h-3 w-3" />
                                                {score}
                                            </span>
                                        </div>
                                    )}

                                    <p className="text-[15px] font-medium leading-relaxed text-zinc-200">
                                        {content}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
