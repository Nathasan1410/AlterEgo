export interface APIResponse<T = unknown> {
  success: boolean;
  data: T;
  error: APIError | null;
  meta: APIMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

export interface APIMetadata {
  requestId: string;
  timestamp: string;
  duration: number;
  version: string;
}

export interface GenerationResponseData {
  result: GeneratedOption[] | string | { polished: string; scores: unknown[] };
  options?: GeneratedOption[];
  scores?: unknown[];
}

export interface GeneratedOption {
  content: string;
  score?: number;
  reasoning?: string;
}

export interface ResearchResponseData {
  query: string;
  results: SearchResult[];
  context?: string;
  trending?: SearchResult[];
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  published_date?: string;
}

export interface StyleAnalysisResponseData {
  profile: StyleProfile;
  stylePrompt: string;
}

export interface StyleProfile {
  tone: string;
  formatting: string;
  vocabulary: string[];
  emojiUsage: string;
  sentenceLength: string;
  hooks: string;
  closings: string;
  uniqueTraits: string[];
  rawAnalysis: string;
}

export interface TranscriptionResponseData {
  text: string;
  language: string;
  duration: number;
}
