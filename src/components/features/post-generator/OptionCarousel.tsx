"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Star } from "lucide-react";
import Card from "../../ui/Card";
import type { GeneratedOption } from "@/src/lib/api-client";

interface OptionCarouselProps {
  options: (string | GeneratedOption)[];
  onSelect: (option: string) => void;
  onRegenerate: () => void;
  itemsPerPage: number;
  stepType: "topics" | "hooks" | "body" | "cta";
  loading?: boolean;
}

export default function OptionCarousel({
  options,
  onSelect,
  onRegenerate,
  itemsPerPage,
  stepType,
  loading = false,
}: OptionCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate pages
  const totalOptionPages = Math.ceil(options.length / itemsPerPage);
  const totalPages = stepType === "cta" ? totalOptionPages + 2 : totalOptionPages + 1;
  const currentOptions = options.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const isCtaNoCtaPage = stepType === "cta" && currentPage === totalOptionPages;
  const isRegeneratePage =
    stepType === "cta" ? currentPage === totalPages - 1 : currentPage === totalPages - 1;

  const getContent = (opt: string | GeneratedOption) =>
    typeof opt === "string" ? opt : opt.content;
  const getScore = (opt: string | GeneratedOption) => (typeof opt === "string" ? null : opt.score);
  const getReasoning = (opt: string | GeneratedOption) =>
    typeof opt === "string" ? null : opt.reasoning;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Scroll wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (e.deltaY > 0) {
          nextPage();
        } else if (e.deltaY < 0) {
          prevPage();
        }
      }, 50);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentPage, totalPages]);

  // Reset to first page when options change
  useEffect(() => {
    setCurrentPage(0);
  }, [options.length, stepType]);

  return (
    <div className="space-y-4">
      {/* PAGINATION AT TOP - ORANGE THEME */}
      <div className="space-y-2">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentPage ? "w-8 bg-orange-600" : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Page {currentPage + 1} of {totalPages}
          <span className="ml-2 text-gray-400">Scroll wheel to navigate</span>
        </div>
      </div>

      {/* OPTIONS BELOW PAGINATION - ORANGE HOVER THEME */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4"
          >
            {isRegeneratePage ? (
              /* Regenerate Page */
              <Card
                variant="default"
                className="group cursor-pointer p-8 text-center transition-all hover:border-orange-500 hover:shadow-xl"
                onClick={onRegenerate}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <RefreshCw className="h-8 w-8 text-orange-600 transition-transform duration-500 group-hover:rotate-180 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="mb-2 text-xl font-bold text-orange-600 dark:text-orange-400">
                      Regenerate Options
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Not satisfied? Click here to generate new {stepType}
                    </p>
                  </div>
                </div>
              </Card>
            ) : isCtaNoCtaPage ? (
              /* No CTA Page */
              <Card
                variant="default"
                className="group cursor-pointer p-8 text-center transition-all hover:border-gray-500 hover:shadow-xl"
                onClick={() => onSelect("")}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/30">
                    <span className="text-3xl">-</span>
                  </div>
                  <div>
                    <p className="mb-2 text-xl font-bold text-gray-600 dark:text-gray-400">
                      No CTA
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Skip the call-to-action for this post
                    </p>
                  </div>
                </div>
              </Card>
            ) : stepType === "body" ? (
              /* Body Step: Single option */
              currentOptions.map((opt, i) => {
                const globalIndex = currentPage * itemsPerPage + i;
                const content = getContent(opt);
                const score = getScore(opt);
                const reasoning = getReasoning(opt);

                return (
                  <Card
                    key={globalIndex}
                    variant="default"
                    className="group relative cursor-pointer p-8 transition-all hover:border-orange-500 hover:shadow-xl"
                    onClick={() => onSelect(content)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                        {String.fromCharCode(65 + globalIndex)}
                      </div>
                      <div className="flex-1">
                        {score !== null && (
                          <div className="mb-2 flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-xs font-bold text-teal-500">
                              <Star className="h-3 w-3 fill-current" />
                              {score}/100 Engagement
                            </span>
                            {reasoning && (
                              <span className="max-w-[200px] truncate text-xs text-gray-500">
                                {reasoning}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words text-base font-medium leading-relaxed text-gray-900 transition-colors group-hover:text-orange-600 md:text-lg dark:text-gray-100 dark:group-hover:text-orange-400">
                          {content}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              /* Regular Options */
              currentOptions.map((opt, i) => {
                const globalIndex = currentPage * itemsPerPage + i;
                const content = getContent(opt);
                const score = getScore(opt);
                const reasoning = getReasoning(opt);

                return (
                  <Card
                    key={globalIndex}
                    variant="default"
                    className="group cursor-pointer p-6 transition-all hover:border-orange-500 hover:shadow-xl"
                    onClick={() => onSelect(content)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                        {String.fromCharCode(65 + globalIndex)}
                      </div>
                      <div className="flex-1">
                        {score !== null && (
                          <div className="mb-1 flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-xs font-bold text-teal-500">
                              <Star className="h-3 w-3 fill-current" />
                              {score}
                            </span>
                            {reasoning && (
                              <span className="text-xs text-gray-500">{reasoning}</span>
                            )}
                          </div>
                        )}
                        <p className="whitespace-normal break-words text-base font-medium leading-relaxed text-gray-900 transition-colors group-hover:text-orange-600 md:text-lg dark:text-gray-100 dark:group-hover:text-orange-400">
                          {content}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
