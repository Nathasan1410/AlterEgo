/**
 * Model Adapter Interface
 * All LLM adapters must implement this interface for interchangeability
 */

import type {
  GeneratedOption,
  TopicInput,
  HookInput,
  BodyInput,
  CTAInput,
  PolishInput,
  TraceContext,
} from "../../models/generated";

export interface IModelAdapter {
  readonly name: string;
  readonly version: string;

  // Core generation methods
  generateTopics(input: TopicInput, context?: TraceContext): Promise<GeneratedOption[]>;
  generateHooks(input: HookInput, context?: TraceContext): Promise<GeneratedOption[]>;
  generateBody(input: BodyInput, context?: TraceContext): Promise<GeneratedOption[]>;
  generateCTA(input: CTAInput, context?: TraceContext): Promise<GeneratedOption[]>;
  polishContent(
    input: PolishInput,
    context?: TraceContext
  ): Promise<{ content: string; scores?: any[] }>;

  // Health check
  healthCheck(): Promise<boolean>;
}

/**
 * Research Adapter Interface (for Tavily, etc.)
 */
export interface IResearchAdapter {
  readonly name: string;

  search(query: string, maxResults?: number): Promise<ResearchResult[]>;
  getTrending(industry: string): Promise<ResearchResult[]>;
}

export interface ResearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

/**
 * Observability Adapter Interface (for Opik, etc.)
 */
export interface IObservabilityAdapter {
  readonly projectName: string;

  trace(name: string, input: any, options?: { tags?: string[]; metadata?: any }): ITrace;
  logEvaluation(input: any, output: any, evaluations: any[], traceId?: string): void;
  flush(): Promise<void>;
}

export interface ITrace {
  id: string;
  span(name: string, type?: string, input?: any): ISpan;
  end(): void;
}

export interface ISpan {
  id: string;
  end(): void;
}

/**
 * Cache Adapter Interface
 */
export interface ICacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
