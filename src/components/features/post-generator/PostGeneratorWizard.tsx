"use client";

import { useState, useEffect } from "react";
import { generateContent, polishPost } from "@/src/lib/api-client";
import { VIEWPORT } from "@/src/lib/constants";
import Canvas from "@/src/components/canvas/Canvas";
import MobileCanvas from "@/src/components/canvas/MobileCanvas";
import { useViewportCardCount } from "@/src/hooks/useViewportCardCount";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import InputPhase from "./InputPhase";
import BuildingPhase, { type HandType, type DeckType } from "./BuildingPhase";
import ConfirmationPhase from "./ConfirmationPhase";
import ResultPhase from "./ResultPhase";
import type { GeneratedOption } from "@/src/lib/api-client";

type CraftingPhase = "input" | "building" | "confirm" | "result";

export type { Settings } from "./InputPhase";

export default function PostGeneratorWizard() {
  const [phase, setPhase] = useState<CraftingPhase>("input");
  const [loading, setLoading] = useState(false);
  const [initialInput, setInitialInput] = useState("");

  const [deck, setDeck] = useState<DeckType>({
    topic: "",
    hook: "",
    body: "",
    cta: "",
    final: "",
  });

  const [hand, setHand] = useState<HandType>({ type: null, options: null });

  const [settings, setSettings] = useState({
    language: "id",
    emojiLevel: 5,
    tone: 5,
    researchDepth: 3,
    intent: "viral",
    length: "medium",
    magicMode: false,
  });

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

  const [navigationHistory, setNavigationHistory] = useState<
    Array<"topics" | "hooks" | "body" | "cta">
  >([]);

  const [optionsCache, setOptionsCache] = useState<{
    topics?: (string | GeneratedOption)[];
    hooks?: (string | GeneratedOption)[];
    body?: (string | GeneratedOption)[];
    cta?: (string | GeneratedOption)[];
  }>({});

  const [opikScores, setOpikScores] = useState<any[]>([]);

  const handleStart = async (topicInput: string, newSettings: any) => {
    setInitialInput(topicInput);
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

  const handleOptionSelect = (option: string) => {
    if (hand.type === "topics") selectTopic(option);
    if (hand.type === "hooks") selectHook(option);
    if (hand.type === "body") selectBody(option);
    if (hand.type === "cta") selectCTA(option);
  };

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

  const handleRegenerate = () => {
    if (hand.type === "topics") regenerateTopics();
    if (hand.type === "hooks") regenerateHooks();
    if (hand.type === "body") regenerateBody();
    if (hand.type === "cta") regenerateCTA();
  };

  const handleRegenerateWithStyle = (text: string) => {
    setSettings((prev) => ({ ...prev }));
    if (hand.type === "topics") regenerateTopics();
    if (hand.type === "hooks") regenerateHooks(text);
    if (hand.type === "body") regenerateBody(text);
    if (hand.type === "cta") regenerateCTA(text);
  };

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

  const handleCopy = () => {
    navigator.clipboard.writeText(deck.final || "");
  };

  const handleEdit = () => {
    setPhase("building");
    setHand({ type: "cta", options: optionsCache.cta || [] });
  };

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
