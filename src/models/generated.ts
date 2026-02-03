/**
 * Core Type Definitions for CommitToCareer
 * These contracts ensure type safety across all modules
 */

// Base type for all generated content with scoring
export interface GeneratedOption {
  content: string;
  score?: number;
  reasoning?: string;
  metadata?: Record<string, any>;
}

// Input types for generation
export interface TopicInput {
  idea: string;
  researchDepth?: number;
  language?: string;
}

export interface HookInput {
  topic: string;
  intent?: "viral" | "storytelling" | "educational";
  language?: string;
}

export interface BodyInput {
  hook: string;
  topic: string;
  intent?: string;
  length?: "short" | "medium" | "long";
  tone?: number;
  emojiLevel?: number;
  language?: string;
  styleProfile?: string;
  researchContext?: string;
}

export interface CTAInput {
  body: string;
  intent?: string;
  language?: string;
}

export interface PolishInput {
  content: string;
  tone: number;
  emojiDensity: number;
  language: string;
}

// Generation stages
export type GenerationStage = "topics" | "hooks" | "body" | "cta" | "polish" | "complete";

// Evaluation result
export interface EvaluationResult {
  metricName: string;
  score: number;
  reasoning: string;
}

// Cache entry
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Trace context for observability
export interface TraceContext {
  traceId: string;
  spanId?: string;
  parentSpanId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
