import { useState, useCallback, useEffect } from "react";
import { generateContent, polishPost } from "@/src/lib/api-client";
import { VIEWPORT } from "@/src/lib/constants";
import { useViewportCardCount } from "./useViewportCardCount";
import { logger } from "@/src/utils/logger";
import type { GeneratedOption } from "@/src/lib/api-client";
import type { Settings } from "@/src/components/features/post-generator/InputPhase";
import type { HandType, DeckType } from "@/src/components/features/post-generator/BuildingPhase";

type Phase = "input" | "building" | "confirm" | "result";
type Step = "topics" | "hooks" | "body" | "cta";

export interface UsePostGenerationReturn {
  phase: Phase;
  deck: DeckType;
  hand: HandType;
  settings: Settings;
  loading: boolean;
  opikScores: any[];
  isMobile: boolean;
  navigationHistory: Array<Step>;
  optionsCache: Record<Step, (string | GeneratedOption)[] | undefined>;
  topicsPerPage: number;
  hooksPerPage: number;
  bodiesPerPage: number;
  ctasPerPage: number;
  error: string | null;
  handleStart: (topic: string, s: Partial<Settings>) => void;
  handleOptionSelect: (opt: string) => void;
  handleRegenerate: () => void;
  handleRegenerateWithStyle: (txt: string) => void;
  handleBack: () => void;
  handleConfirmPolish: () => void;
  handleRePolish: () => void;
  handleCopy: () => void;
  handleEdit: () => void;
  reset: () => void;
  clearError: () => void;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function usePostGeneration(): UsePostGenerationReturn {
  const [phase, setPhase] = useState<Phase>("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<DeckType>({ topic: "", hook: "", body: "", cta: "", final: "" });
  const [hand, setHand] = useState<HandType>({ type: null, options: null });
  const [settings, setSettings] = useState<Settings>({
    language: "id",
    emojiLevel: 5,
    tone: 5,
    researchDepth: 3,
    intent: "viral",
    length: "medium",
    magicMode: false,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<Array<Step>>([]);
  const [optionsCache, setOptionsCache] = useState<
    Record<Step, (string | GeneratedOption)[] | undefined>
  >({} as Record<Step, (string | GeneratedOption)[] | undefined>);
  const [opikScores, setOpikScores] = useState<any[]>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth < VIEWPORT.MOBILE_BREAKPOINT);
    const f = () => setIsMobile(window.innerWidth < VIEWPORT.MOBILE_BREAKPOINT);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
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

  const handleStart = useCallback(
    async (topicInput: string, newSettings: Partial<Settings>) => {
      setSettings((p) => ({ ...p, ...newSettings }));
      setPhase("building");
      setLoading(true);
      setError(null);
      setHand({ type: "topics", options: null });
      try {
        const data = await generateContent("topics", {
          input: topicInput,
          researchDepth: settings.researchDepth,
        });
        if (data.result) {
          setHand({ type: "topics", options: data.result });
        } else {
          setError("Failed to generate topics. Please try again.");
        }
      } catch (e) {
        logger.error("Error generating topics", e instanceof Error ? e : undefined, { topicInput });
        setError("Failed to generate topics. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [settings.researchDepth]
  );

  const selectStep = useCallback(
    async (step: Step, option: string, nextStep: Step | null, params: any) => {
      if (hand.options && Array.isArray(hand.options)) {
        setOptionsCache((p) => ({ ...p, [step]: hand.options! }));
        setNavigationHistory((p) => [...p, step]);
      }
      setDeck((p) => ({ ...p, [step === "topics" ? "topic" : step]: option }));
      if (nextStep) {
        setLoading(true);
        setError(null);
        setHand({ type: nextStep, options: null });
        try {
          const data = await generateContent(nextStep, params);
          if (data.result) {
            setHand({ type: nextStep, options: data.result });
            setOptionsCache((p) => ({ ...p, [nextStep]: data.result }));
          } else {
            setError(`Failed to generate ${nextStep}. Please try again.`);
          }
        } catch (e) {
          logger.error(`Error generating ${nextStep}`, e instanceof Error ? e : undefined, {
            params,
          });
          setError(`Failed to generate ${nextStep}. Please try again.`);
        } finally {
          setLoading(false);
        }
      } else {
        setHand({ type: null, options: null });
        setPhase("confirm");
        setError(null);
      }
    },
    [hand.options]
  );

  const selectTopic = useCallback(
    (t: string) => selectStep("topics", t, "hooks", { topic: t, intent: settings.intent }),
    [selectStep, settings.intent]
  );
  const selectHook = useCallback(
    (h: string) =>
      selectStep("hooks", h, "body", {
        hook: h,
        topic: deck.topic,
        intent: settings.intent,
        length: settings.length,
      }),
    [selectStep, deck.topic, settings.intent, settings.length]
  );
  const selectBody = useCallback(
    (b: string) => selectStep("body", b, "cta", { body: b, intent: settings.intent }),
    [selectStep, settings.intent]
  );
  const selectCTA = useCallback((c: string) => selectStep("cta", c, null, {}), [selectStep]);

  const handleOptionSelect = useCallback(
    (opt: string) => {
      const actions = { topics: selectTopic, hooks: selectHook, body: selectBody, cta: selectCTA };
      const a = actions[hand.type as Step];
      if (a) a(opt);
    },
    [hand.type, selectTopic, selectHook, selectBody, selectCTA]
  );

  const regenerateStep = useCallback(async (step: Step, params: any) => {
    setLoading(true);
    setError(null);
    setHand({ type: step, options: null });
    try {
      const data = await generateContent(step, params);
      if (data.result) {
        setHand({ type: step, options: data.result });
      } else {
        setError(`Failed to regenerate ${step}. Please try again.`);
      }
    } catch (e) {
      logger.error(`Error regenerating ${step}`, e instanceof Error ? e : undefined, { params });
      setError(`Failed to regenerate ${step}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    const p: Record<Step, any> = {
      topics: { input: deck.topic || "general topics", researchDepth: settings.researchDepth },
      hooks: { topic: deck.topic, intent: settings.intent },
      body: {
        hook: deck.hook,
        topic: deck.topic,
        intent: settings.intent,
        length: settings.length,
      },
      cta: { body: deck.body, intent: settings.intent },
    };
    if (hand.type) regenerateStep(hand.type, p[hand.type]);
  }, [deck, settings, hand.type, regenerateStep]);

  const handleRegenerateWithStyle = useCallback(
    (txt: string) => {
      const p: Record<Step, any> = {
        topics: { input: deck.topic || "general topics", researchDepth: settings.researchDepth },
        hooks: { topic: deck.topic, intent: settings.intent, styleGuidance: txt },
        body: {
          hook: deck.hook,
          topic: deck.topic,
          intent: settings.intent,
          length: settings.length,
          styleGuidance: txt,
        },
        cta: { body: deck.body, intent: settings.intent, styleGuidance: txt },
      };
      setSettings((p) => ({ ...p }));
      if (hand.type) regenerateStep(hand.type, p[hand.type]);
    },
    [deck, settings, hand.type, regenerateStep]
  );

  const handleConfirmPolish = useCallback(async () => {
    setPhase("result");
    setLoading(true);
    setError(null);
    try {
      const d = `${deck.hook}\n\n${deck.body}\n\n${deck.cta}`;
      const data = await polishPost({
        content: d,
        tone: settings.tone,
        emojiDensity: settings.emojiLevel,
        language: settings.language,
      });
      if (data.result) {
        setDeck((p) => ({ ...p, final: data.result }));
        if (data.scores) setOpikScores(data.scores);
      } else {
        setError("Failed to polish post. Please try again.");
      }
    } catch (e) {
      logger.error("Error polishing post", e instanceof Error ? e : undefined);
      setError("Failed to polish post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [deck, settings]);

  const handleRePolish = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = `${deck.hook}\n\n${deck.body}\n\n${deck.cta}`;
      const data = await polishPost({
        content: d,
        tone: settings.tone,
        emojiDensity: settings.emojiLevel,
        language: settings.language,
      });
      if (data.result) {
        setDeck((p) => ({ ...p, final: data.result }));
        if (data.scores) setOpikScores(data.scores);
      } else {
        setError("Failed to re-polish post. Please try again.");
      }
    } catch (e) {
      logger.error("Error re-polishing post", e instanceof Error ? e : undefined);
      setError("Failed to re-polish post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [deck, settings]);

  const handleBack = useCallback(() => {
    if (navigationHistory.length === 0) return;
    const ps = navigationHistory[navigationHistory.length - 1];
    setNavigationHistory((p) => p.slice(0, -1));
    const du: Record<Step, Partial<DeckType>> = {
      topics: { topic: "", hook: "", body: "", cta: "", final: "" },
      hooks: { hook: "", body: "", cta: "", final: "" },
      body: { body: "", cta: "", final: "" },
      cta: { cta: "", final: "" },
    };
    setDeck((p) => ({ ...p, ...du[ps] }));
    setHand({ type: ps, options: optionsCache[ps] || [] });
    setError(null);
    if (ps === "cta") setPhase("building");
  }, [navigationHistory, optionsCache]);

  const handleCopy = useCallback(
    () => navigator.clipboard.writeText(deck.final || ""),
    [deck.final]
  );
  const handleEdit = useCallback(() => {
    setPhase("building");
    setHand({ type: "cta", options: optionsCache.cta || [] });
    setError(null);
  }, [optionsCache.cta]);
  const reset = useCallback(() => {
    setPhase("input");
    setDeck({ topic: "", hook: "", body: "", cta: "", final: "" });
    setHand({ type: null, options: null });
    setLoading(false);
    setNavigationHistory([]);
    setOptionsCache({} as Record<Step, (string | GeneratedOption)[] | undefined>);
    setOpikScores([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    phase,
    deck,
    hand,
    settings,
    loading,
    opikScores,
    isMobile,
    navigationHistory,
    optionsCache,
    topicsPerPage,
    hooksPerPage,
    bodiesPerPage,
    ctasPerPage,
    error,
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
  };
}
