import { z } from "zod";
import {
  GENERATION_LIMITS,
  TONE_SCALE,
  EMOJI_LEVELS,
  INTENT_TYPES,
  LENGTH_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../lib/constants";

export const TopicInputSchema = z.object({
  idea: z
    .string()
    .min(GENERATION_LIMITS.MIN_TOPIC_LENGTH, "Topic must be at least 3 characters")
    .max(GENERATION_LIMITS.MAX_TOPIC_LENGTH, "Topic cannot exceed 500 characters"),
  researchDepth: z
    .number()
    .min(1, "Research depth must be at least 1")
    .max(10, "Research depth cannot exceed 10")
    .optional()
    .default(3),
  language: z
    .enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.ENGLISH),
});

export const HookInputSchema = z.object({
  topic: z
    .string()
    .min(GENERATION_LIMITS.MIN_TOPIC_LENGTH, "Topic must be at least 3 characters")
    .max(GENERATION_LIMITS.MAX_TOPIC_LENGTH, "Topic cannot exceed 500 characters"),
  intent: z
    .enum([INTENT_TYPES.VIRAL, INTENT_TYPES.STORYTELLING, INTENT_TYPES.EDUCATIONAL])
    .optional()
    .default(INTENT_TYPES.VIRAL),
  language: z
    .enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.ENGLISH),
});

export const BodyInputSchema = z.object({
  hook: z
    .string()
    .min(5, "Hook must be at least 5 characters")
    .max(1000, "Hook cannot exceed 1000 characters"),
  topic: z.string().min(GENERATION_LIMITS.MIN_TOPIC_LENGTH).max(GENERATION_LIMITS.MAX_TOPIC_LENGTH),
  intent: z
    .enum([INTENT_TYPES.VIRAL, INTENT_TYPES.STORYTELLING, INTENT_TYPES.EDUCATIONAL])
    .optional(),
  length: z
    .enum([LENGTH_OPTIONS.SHORT, LENGTH_OPTIONS.MEDIUM, LENGTH_OPTIONS.LONG])
    .optional()
    .default(LENGTH_OPTIONS.MEDIUM),
  tone: z.number().min(TONE_SCALE.MIN).max(TONE_SCALE.MAX).optional().default(TONE_SCALE.DEFAULT),
  emojiLevel: z
    .number()
    .min(EMOJI_LEVELS.NONE)
    .max(EMOJI_LEVELS.RICH)
    .optional()
    .default(EMOJI_LEVELS.MODERATE),
  language: z
    .enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.ENGLISH),
  styleProfile: z.string().optional(),
  researchContext: z.string().optional(),
});

export const CTAInputSchema = z.object({
  body: z.string().min(10, "Body must be at least 10 characters"),
  intent: z
    .enum([INTENT_TYPES.VIRAL, INTENT_TYPES.STORYTELLING, INTENT_TYPES.EDUCATIONAL])
    .optional()
    .default(INTENT_TYPES.VIRAL),
  language: z
    .enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.ENGLISH),
});

export const PolishInputSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  tone: z
    .number()
    .min(TONE_SCALE.MIN, `Tone must be at least ${TONE_SCALE.MIN}`)
    .max(TONE_SCALE.MAX, `Tone cannot exceed ${TONE_SCALE.MAX}`)
    .optional()
    .default(TONE_SCALE.DEFAULT),
  emojiDensity: z
    .number()
    .min(EMOJI_LEVELS.NONE)
    .max(EMOJI_LEVELS.RICH)
    .optional()
    .default(EMOJI_LEVELS.MODERATE),
  language: z
    .enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.ENGLISH),
});

export const CompleteInputSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  intent: z
    .enum([INTENT_TYPES.VIRAL, INTENT_TYPES.STORYTELLING, INTENT_TYPES.EDUCATIONAL])
    .optional()
    .default(INTENT_TYPES.VIRAL),
  length: z
    .enum([LENGTH_OPTIONS.SHORT, LENGTH_OPTIONS.MEDIUM, LENGTH_OPTIONS.LONG])
    .optional()
    .default(LENGTH_OPTIONS.MEDIUM),
  tone: z
    .number()
    .min(TONE_SCALE.MIN, `Tone must be at least ${TONE_SCALE.MIN}`)
    .max(TONE_SCALE.MAX, `Tone cannot exceed ${TONE_SCALE.MAX}`)
    .optional()
    .default(TONE_SCALE.DEFAULT),
  emojiDensity: z
    .number()
    .min(EMOJI_LEVELS.NONE)
    .max(EMOJI_LEVELS.RICH)
    .optional()
    .default(EMOJI_LEVELS.MODERATE),
  language: z
    .enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.ENGLISH),
});

export const ResearchInputSchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters").optional(),
  type: z.enum(["search", "trending", "context"]).optional().default("search"),
  industry: z.string().optional().default(""),
});

export const StyleAnalysisInputSchema = z.object({
  posts: z
    .array(z.string())
    .min(1, "At least one post is required")
    .max(50, "Cannot analyze more than 50 posts"),
});

export const TranscriptionInputSchema = z.object({
  audio: z.any().refine((file) => file instanceof File, "Audio file is required"),
  language: z
    .enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.INDONESIAN),
});
