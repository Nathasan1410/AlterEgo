"use client";

import { useState, useEffect } from "react";
import { generateContent, polishPost } from "@/src/lib/api-client";
import {
  VIEWPORT,
  LANGUAGE_OPTIONS,
  EMOJI_LEVELS,
  TONE_SCALE,
  INTENT_TYPES,
  LENGTH_OPTIONS,
} from "@/src/lib/constants";
import SettingsPanel from "@/src/components/layout/SettingsPanel";
import ChatInput from "@/src/components/layout/ChatInput";
import OpikScoreCard from "@/src/components/analytics/OpikScoreCard";
import Canvas from "@/src/components/canvas/Canvas";
import MobileCanvas from "@/src/components/canvas/MobileCanvas";
import OptionCarousel from "./OptionCarousel";
import { useViewportCardCount } from "@/src/hooks/useViewportCardCount";
import { Button, Card, Skeleton } from "@/src/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import type { GeneratedOption } from "@/src/lib/api-client";

// Types
type CraftingPhase = "input" | "building" | "confirm" | "result";
type DeckType = {
  topic: string;
  hook: string;
  body: string;
  cta: string;
  final: string;
};

export default function PostGeneratorWizard() {
  // --- State ---
  const [phase, setPhase] = useState<CraftingPhase>("input");
  const [loading, setLoading] = useState(false);
  const [initialInput, setInitialInput] = useState(""); // NEW: Store initial prompt

  const [deck, setDeck] = useState<DeckType>({
    topic: "",
    hook: "",
    body: "",
    cta: "",
    final: "",
  });

  // The "Hand" (Current options to choose from)
  const [hand, setHand] = useState<{
    type: "topics" | "hooks" | "body" | "cta" | null;
    options: (string | GeneratedOption)[] | null;
  }>({ type: null, options: null });

  // Settings
  const [settings, setSettings] = useState({
    language: LANGUAGE_OPTIONS.DEFAULT,
    emojiLevel: EMOJI_LEVELS.DEFAULT,
    tone: TONE_SCALE.DEFAULT,
    researchDepth: 3,
    intent: INTENT_TYPES.DEFAULT,
    length: LENGTH_OPTIONS.DEFAULT,
    magicMode: false,
  });

  // Viewport-aware pagination
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < VIEWPORT.MOBILE_BREAKPOINT);
    const handleResize = () => setIsMobile(window.innerWidth < VIEWPORT.MOBILE_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const topicsPerPage = useViewportCardCount({
    stepType: "topics",
    isMobile,
    enabled: hand.type === "topics",
  });
  const hooksPerPage = useViewportCardCount({
    stepType: "hooks",
    isMobile,
    enabled: hand.type === "hooks",
  });
  const bodiesPerPage = useViewportCardCount({
    stepType: "body",
    isMobile,
    enabled: hand.type === "body",
  });
  const ctasPerPage = useViewportCardCount({
    stepType: "cta",
    isMobile,
    enabled: hand.type === "cta",
  });

  // Navigation history for back button
  const [navigationHistory, setNavigationHistory] = useState<
    Array<"topics" | "hooks" | "body" | "cta">
  >([]);

  // Cache generated options to avoid regeneration on back navigation
  const [optionsCache, setOptionsCache] = useState<{
    topics?: (string | GeneratedOption)[];
    hooks?: (string | GeneratedOption)[];
    body?: (string | GeneratedOption)[];
    cta?: (string | GeneratedOption)[];
  }>({});

  // --- Actions ---

  // 1. Start from Chat Input
  const handleStart = async (topicInput: string, newSettings: any) => {
    setInitialInput(topicInput); // Capture input
    setSettings({ ...settings, ...newSettings });
    setPhase("building");
    setLoading(true);
    setHand({ type: "topics", options: null });

    try {
      const data = await generateContent("topics", {
        input: topicInput,
        researchDepth: settings.researchDepth,
      });
      if (data.result) {
        setHand({ type: "topics", options: data.result });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // 2. Select Topic -> Fetch Hooks
  const selectTopic = async (topic: string) => {
    if (hand.options && Array.isArray(hand.options)) {
      setOptionsCache((prev) => ({ ...prev, topics: hand.options! }));
      setNavigationHistory((prev) => [...prev, "topics"]);
    }

    setDeck((prev) => ({ ...prev, topic }));
    setHand({ type: "hooks", options: null });
    setLoading(true);

    try {
      const data = await generateContent("hooks", {
        topic: topic,
        intent: settings.intent,
      });
      if (data.result && data.result.length > 0) {
        setHand({ type: "hooks", options: data.result });
        setOptionsCache((prev) => ({ ...prev, hooks: data.result }));
      }
    } catch (e) {
      console.error("Error generating hooks:", e);
    }
    setLoading(false);
  };

  // 3. Select Hook -> Fetch Body (NO PAYMENT - removed Web3)
  const selectHook = async (hook: string) => {
    if (hand.options && Array.isArray(hand.options)) {
      setOptionsCache((prev) => ({ ...prev, hooks: hand.options! }));
      setNavigationHistory((prev) => [...prev, "hooks"]);
    }

    setDeck((prev) => ({ ...prev, hook }));
    setHand({ type: "body", options: null });
    setLoading(true);

    try {
      const data = await generateContent("body", {
        hook: hook,
        topic: deck.topic,
        intent: settings.intent,
        length: settings.length,
      });
      if (data.result) {
        setHand({ type: "body", options: data.result });
        setOptionsCache((prev) => ({ ...prev, body: data.result }));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // 4. Select Body -> Fetch CTA
  const selectBody = async (body: string) => {
    if (hand.options && Array.isArray(hand.options)) {
      setOptionsCache((prev) => ({ ...prev, body: hand.options! }));
      setNavigationHistory((prev) => [...prev, "body"]);
    }

    setDeck((prev) => ({ ...prev, body }));
    setHand({ type: "cta", options: null });
    setLoading(true);

    try {
      const data = await generateContent("cta", {
        body: body,
        intent: settings.intent,
      });
      if (data.result) {
        setHand({ type: "cta", options: data.result });
        setOptionsCache((prev) => ({ ...prev, cta: data.result }));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // 5. Select CTA -> Go to Confirmation
  const selectCTA = async (cta: string) => {
    if (hand.options && Array.isArray(hand.options)) {
      setOptionsCache((prev) => ({ ...prev, cta: hand.options! }));
      setNavigationHistory((prev) => [...prev, "cta"]);
    }

    setDeck((prev) => ({ ...prev, cta }));
    setHand({ type: null, options: null });
    setPhase("confirm");
  };

  const reset = () => {
    setPhase("input");
    setDeck({ topic: "", hook: "", body: "", cta: "", final: "" });
    setHand({ type: null, options: null });
    setLoading(false);
    setNavigationHistory([]);
    setOptionsCache({});
    setInitialInput("");
  };

  // Back navigation handler
  const handleBack = () => {
    if (navigationHistory.length === 0) return;

    const previousStep = navigationHistory[navigationHistory.length - 1];
    setNavigationHistory((prev) => prev.slice(0, -1));

    switch (previousStep) {
      case "topics":
        if (optionsCache.topics) {
          setHand({ type: "topics", options: optionsCache.topics });
          setDeck((prev) => ({ ...prev, topic: "", hook: "", body: "", cta: "", final: "" }));
        }
        break;
      case "hooks":
        if (optionsCache.hooks) {
          setHand({ type: "hooks", options: optionsCache.hooks });
          setDeck((prev) => ({ ...prev, hook: "", body: "", cta: "", final: "" }));
        }
        break;
      case "body":
        if (optionsCache.body) {
          setHand({ type: "body", options: optionsCache.body });
          setDeck((prev) => ({ ...prev, body: "", cta: "", final: "" }));
        }
        break;
      case "cta":
        if (optionsCache.cta) {
          setHand({ type: "cta", options: optionsCache.cta });
          setDeck((prev) => ({ ...prev, cta: "", final: "" }));
          setPhase("building");
        }
        break;
    }
  };

  // Regenerate Handlers
  const regenerateTopics = async () => {
    setLoading(true);
    try {
      const data = await generateContent("topics", {
        input: deck.topic || "general topics",
        researchDepth: settings.researchDepth,
      });
      if (data.result) {
        setHand({ type: "topics", options: data.result });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const regenerateHooks = async (styleGuidance?: string) => {
    setLoading(true);
    try {
      const data = await generateContent("hooks", {
        topic: deck.topic,
        intent: settings.intent,
        styleGuidance: styleGuidance || "",
      });
      if (data.result && data.result.length > 0) {
        setHand({ type: "hooks", options: data.result });
      }
    } catch (e) {
      console.error("Error regenerating hooks:", e);
    }
    setLoading(false);
  };

  const regenerateBody = async (styleGuidance?: string) => {
    setLoading(true);
    try {
      const data = await generateContent("body", {
        hook: deck.hook,
        topic: deck.topic,
        intent: settings.intent,
        length: settings.length,
        styleGuidance: styleGuidance || "",
      });
      if (data.result) {
        setHand({ type: "body", options: data.result });
      }
    } catch (e) {
      console.error("Error regenerating body:", e);
    }
    setLoading(false);
  };

  const regenerateCTA = async (styleGuidance?: string) => {
    setLoading(true);
    try {
      const data = await generateContent("cta", {
        body: deck.body,
        intent: settings.intent,
        styleGuidance: styleGuidance || "",
      });
      if (data.result) {
        setHand({ type: "cta", options: data.result });
      }
    } catch (e) {
      console.error("Error regenerating CTA:", e);
    }
    setLoading(false);
  };

  // Score State
  const [opikScores, setOpikScores] = useState<any[]>([]);

  // ... existing state ...

  // ... existing functions ...

  const handleConfirmPolish = async () => {
    setPhase("result");
    setLoading(true);
    try {
      const fullDraft = `${deck.hook}\n\n${deck.body}\n\n${deck.cta}`;
      const data = await polishPost({
        content: fullDraft,
        tone: settings.tone,
        emojiDensity: settings.emojiLevel,
        language: settings.language,
      });

      if (data.result) {
        setDeck((prev) => ({ ...prev, final: data.result }));
        // Set Opik Scores
        if (data.scores) {
          setOpikScores(data.scores);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRePolish = async () => {
    setLoading(true);
    try {
      const fullDraft = `${deck.hook}\n\n${deck.body}\n\n${deck.cta}`;
      const data = await polishPost({
        content: fullDraft,
        tone: settings.tone,
        emojiDensity: settings.emojiLevel,
        language: settings.language,
      });
      if (data.result) {
        setDeck((prev) => ({ ...prev, final: data.result }));
        if (data.scores) {
          setOpikScores(data.scores);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // --- Render ---

  // 1. RESULT PHASE
  if (phase === "result") {
    return (
      <div className="relative z-10 mx-auto w-full max-w-4xl p-4">
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          {/* Header with Score */}
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

            {/* OPIK SCORE CARD */}
            {opikScores && opikScores.length > 0 && <OpikScoreCard scores={opikScores} />}
          </div>

          <pre className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-6 font-sans text-lg leading-relaxed text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
            {deck.final || "Polishing your masterpiece..."}
          </pre>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(deck.final || "");
              }}
            >
              Copy Text
            </Button>
            <Button
              variant="outline"
              onClick={handleRePolish}
              disabled={loading}
              style={{ color: "#ffffff", borderColor: "#52525b" }}
              className="hover:bg-zinc-800"
            >
              {loading ? "Re-polishing..." : "Re-Polish"}
            </Button>
            <Button
              variant="outline"
              onClick={reset}
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

  // 2. INPUT / BUILDING PHASE
  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start justify-center gap-8 overflow-x-hidden px-12 py-6">
      {/* LEFT COLUMN: Conditional Layout */}
      <div className="flex max-w-3xl flex-1 flex-col" style={{ minHeight: "calc(100vh - 48px)" }}>
        {/* INPUT PHASE: Centered Layout */}
        {phase === "input" && (
          <motion.div
            className="flex flex-1 flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Greeting - ORANGE THEME */}
            <div className="animate-fade-in-up mb-8 text-center">
              <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                Hello, Creator
              </h1>
              <p className="text-base font-medium text-gray-700 md:text-lg dark:text-gray-400">
                What do you want to write today?
              </p>
              {/* Opik Badge */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></span>
                Powered by Opik AI Observability
              </div>
            </div>

            {/* ChatInput - Centered */}
            <div className="w-full">
              <ChatInput
                onGenerate={handleStart}
                initialSettings={settings}
                onSettingsChange={setSettings}
              />
            </div>
          </motion.div>
        )}

        {/* BUILDING PHASE */}
        {phase === "building" && (
          <>
            <motion.div
              className="flex-1 overflow-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {phase === "building" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 w-full"
                  >
                    {/* Progress Indicator - ORANGE THEME */}
                    <div className="mb-6 flex items-center justify-between px-4">
                      <div className="flex gap-2">
                        {["Topic", "Hook", "Body", "CTA", "Polish"].map((step, i) => {
                          const stepNames = ["topics", "hooks", "body", "cta"];
                          const currentIdx = stepNames.indexOf(hand.type || "");
                          const isActive = currentIdx !== -1 && i <= currentIdx;

                          return (
                            <div
                              key={step}
                              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${isActive ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-400 dark:bg-gray-800"}`}
                            >
                              {step}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Back Button */}
                    {navigationHistory.length > 0 && (
                      <button
                        onClick={handleBack}
                        className="mb-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-orange-400"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back to {navigationHistory[navigationHistory.length - 1]}
                      </button>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      {/* Loading Skeleton */}
                      {loading && (
                        <div className="space-y-3">
                          <Skeleton className="h-24 w-full rounded-2xl" />
                          <Skeleton className="h-24 w-full rounded-2xl" />
                          <Skeleton className="h-24 w-full rounded-2xl" />
                        </div>
                      )}

                      {/* Options Carousel */}
                      {!loading && hand.options && Array.isArray(hand.options) && (
                      <OptionCarousel
                          options={hand.options}
                          onSelect={(opt) => {
                            if (hand.type === "topics") selectTopic(opt);
                            if (hand.type === "hooks") selectHook(opt);
                            if (hand.type === "body") selectBody(opt);
                            if (hand.type === "cta") selectCTA(opt);
                          }}
                          onRegenerate={() => {
                            if (hand.type === "topics") regenerateTopics();
                            if (hand.type === "hooks") regenerateHooks();
                            if (hand.type === "body") regenerateBody();
                            if (hand.type === "cta") regenerateCTA();
                          }}
                          itemsPerPage={
                            hand.type === "topics"
                              ? topicsPerPage
                              : hand.type === "hooks"
                                ? hooksPerPage
                                : hand.type === "body"
                                  ? bodiesPerPage
                                  : ctasPerPage
                          }
                          stepType={hand.type!}
                          loading={loading}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ChatInput - Fixed at bottom */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ChatInput
                onGenerate={handleStart}
                onRegenerate={(text, newSettings) => {
                  // Update settings from chat input
                  setSettings(prev => ({ ...prev, ...newSettings }));
                  if (hand.type === "topics") regenerateTopics();
                  if (hand.type === "hooks") regenerateHooks(text);
                  if (hand.type === "body") regenerateBody(text);
                  if (hand.type === "cta") regenerateCTA(text);
                }}
                currentStep={hand.type}
                initialSettings={settings}
                onSettingsChange={setSettings}
              />
            </motion.div>
          </>
        )}

        {/* CONFIRMATION PHASE */}
        {phase === "confirm" && (
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
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Hook:
                  </p>
                  <p className="text-lg leading-relaxed text-gray-900 dark:text-white">
                    {deck.hook}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Body:
                  </p>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-900 dark:text-white">
                    {deck.body}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    CTA:
                  </p>
                  <p className="text-lg leading-relaxed text-gray-900 dark:text-white">
                    {deck.cta || "(No CTA)"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleConfirmPolish}
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
                      </svg>
                      Polishing...
                    </>
                  ) : (
                    <>Yes, Polish!</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setPhase("building");
                    setHand({ type: "cta", options: optionsCache.cta || [] });
                  }}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-gray-200 px-8 py-4 text-lg font-bold text-gray-900 transition-all hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Edit Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* RIGHT COLUMN: Canvas - Only show during building */}
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

      {/* MOBILE Canvas - Bottom Sheet Carousel */}
      {phase === "building" && <MobileCanvas deck={deck} currentStep={hand.type} />}
    </div>
  );
}
