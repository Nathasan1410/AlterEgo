export const GENERATION_LIMITS = {
  MIN_TOPIC_LENGTH: 3,
  MAX_TOPIC_LENGTH: 500,
  MIN_POST_LENGTH: 10,
  MAX_POST_LENGTH: 5000,
  MAX_OPTIONS_PER_GENERATION: 10,
} as const;

export const TONE_SCALE = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 5,
  LABELS: {
    1: "Very Formal",
    3: "Formal",
    5: "Balanced",
    7: "Casual",
    9: "Very Casual",
  },
} as const;

export const EMOJI_LEVELS = {
  NONE: 0,
  MINIMAL: 2,
  MODERATE: 5,
  RICH: 8,
  DEFAULT: 5,
  LABELS: {
    0: "None",
    2: "Minimal",
    5: "Moderate",
    8: "Rich",
  },
} as const;

export const INTENT_TYPES = {
  VIRAL: "viral",
  STORYTELLING: "storytelling",
  EDUCATIONAL: "educational",
  DEFAULT: "viral",
} as const;

export const LENGTH_OPTIONS = {
  SHORT: "short",
  MEDIUM: "medium",
  LONG: "long",
  DEFAULT: "medium",
} as const;

export const LANGUAGE_OPTIONS = {
  INDONESIAN: "id",
  ENGLISH: "en",
  DEFAULT: "id",
} as const;

export const API_ENDPOINTS = {
  GENERATE: "/api/generate",
  RESEARCH: "/api/research",
  TRANSCRIBE: "/api/transcribe",
  ANALYZE_STYLE: "/api/analyze-style",
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  GENERATION_ERROR: "GENERATION_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  AUTH_ERROR: "AUTH_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  API_ERROR: "API_ERROR",
} as const;

export const CACHE_TTL = {
  TOPICS: 3600,
  HOOKS: 1800,
  BODY: 900,
  CTA: 900,
  STYLE_PROFILE: 7200,
} as const;

export const VIEWPORT = {
  MOBILE_BREAKPOINT: 768,
} as const;

export const GENERATION_COUNTS = {
  TOPICS: 6,
  HOOKS: 3,
  BODY: 2,
  CTA: 4,
} as const;
