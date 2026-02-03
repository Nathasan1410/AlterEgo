# Issues & Fixes Plan for AlterEgo

## Executive Summary

This document identifies issues found in the AlterEgo (CommitToCareer) codebase and provides detailed plans to fix them. Issues are categorized by severity (Critical, High, Medium, Low) and type (Code Quality, Performance, Security, Infrastructure).

## 1. Critical Issues 🔴

### 1.1 Duplicate Code: JSON Parsing Logic

**Location:**
- `lib/ai-service.ts` (lines 191-213, 260-292, 434-465)
- `src/services/adapters/groqAdapter.ts` (lines 104-152)

**Issue:**
Both files implement nearly identical JSON parsing strategies:
1. Direct parse after cleaning markdown
2. Extract array using regex
3. Extract object and convert to array

This violates DRY principle and makes maintenance difficult.

**Impact:**
- Bug fixes must be applied in multiple places
- Increased risk of inconsistencies
- Harder to test

**Fix Plan:**
```typescript
// Create shared utility
// src/utils/jsonParser.ts

export class JSONParser {
  /**
   * Robust JSON parser with multiple fallback strategies
   */
  static parseGeneratedContent(content: string, expectedType: 'array' | 'object'): any[] {
    const strategies = [
      () => this.parseDirect(content),
      () => this.parseArray(content),
      () => this.parseObject(content),
      () => this.parseUppercaseKeys(content) // Handle uppercase keys like "Content"
    ];

    for (const strategy of strategies) {
      try {
        const result = strategy();
        if (result) {
          return this.validateAndTransform(result, expectedType);
        }
      } catch {
        continue;
      }
    }

    return this.getFallback(expectedType);
  }

  private static parseDirect(content: string): any {
    const clean = content.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  private static parseArray(content: string): any {
    const match = content.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : null;
  }

  private static parseObject(content: string): any {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const obj = JSON.parse(match[0]);
      // Handle uppercase keys
      const normalized = {};
      for (const [key, value] of Object.entries(obj)) {
        normalized[key.toLowerCase()] = value;
      }
      return normalized;
    }
    return null;
  }

  private static parseUppercaseKeys(content: string): any {
    // Specifically handle "Content" vs "content" case
    try {
      const obj = JSON.parse(content);
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
        result[normalizedKey] = value;
      }
      return result;
    } catch {
      return null;
    }
  }

  private static validateAndTransform(result: any, expectedType: 'array' | 'object'): any[] {
    if (Array.isArray(result)) {
      return result;
    }
    if (expectedType === 'array' && typeof result === 'object') {
      // Convert object to array
      if (Object.keys(result).some(k => /^\d+$/.test(k))) {
        return Object.values(result);
      }
      return [result];
    }
    return result;
  }

  private static getFallback(expectedType: 'array' | 'object'): any[] {
    return expectedType === 'array'
      ? [{ content: 'Generation error. Please try again.', score: 0 }]
      : { content: 'Generation error. Please try again.', score: 0 };
  }
}

// Then in groqAdapter.ts:
import { JSONParser } from '@/utils/jsonParser';

private parseGeneratedOptions(content: string): GeneratedOption[] {
  return JSONParser.parseGeneratedContent(content, 'array');
}

// Then update lib/ai-service.ts to use same utility
```

**Files to Create:**
- `src/utils/jsonParser.ts`

**Files to Modify:**
- `src/services/adapters/groqAdapter.ts` - Remove duplicate logic
- `lib/ai-service.ts` - Remove duplicate logic (or deprecate entire file)

**Estimated Effort:** 3-4 hours
**Priority:** Critical

---

### 1.2 Legacy Code: `lib/ai-service.ts` vs Orchestrator

**Location:**
- `lib/ai-service.ts` (743 lines)
- `src/services/orchestration/generationOrchestrator.ts` (187 lines)
- `src/api/generate.ts` (140 lines)
- `app/api/generate/route.ts` (4 lines - just a proxy)

**Issue:**
Two complete AI generation systems coexist:
1. Legacy: `lib/ai-service.ts` - Direct Groq calls with Opik tracing
2. New: Orchestrator with adapters pattern

The new system uses the legacy `ai-service.ts` in some paths, creating confusion and technical debt.

**Impact:**
- Code maintenance burden
- Confusing for new developers
- Potential for inconsistent behavior
- 743 lines of effectively dead code

**Fix Plan:**

**Option A: Complete Migration (Recommended)**
```typescript
// 1. Remove lib/ai-service.ts entirely
// 2. Ensure all routes use orchestrator
// 3. Move evaluation functions to src/evaluators/

// app/api/generate/route.ts - Already correct, just imports from src/api/generate

// src/api/generate.ts - Ensure it uses orchestrator exclusively
// Currently has some legacy code comments, clean those up
```

**Option B: Gradual Deprecation**
1. Add @deprecated JSDoc tags to `lib/ai-service.ts`
2. Add warnings in console when legacy functions are called
3. Set deadline for removal
4. Migrate incrementally

**Recommended Steps:**
```typescript
// Step 1: Verify all generation uses orchestrator
// Check these files:
// - src/api/generate.ts - Uses orchestrator ✓
// - app/api/generate/route.ts - Just proxy ✓

// Step 2: Check if any component imports from lib/ai-service.ts
$ grep -r "from.*lib/ai-service" --exclude-dir=node_modules .
$ grep -r "@/lib/ai-service" --exclude-dir=node_modules .

// Step 3: If no imports, delete the file
// rm lib/ai-service.ts

// Step 4: Run tests to verify nothing breaks
// npm test
```

**Files to Delete:**
- `lib/ai-service.ts`

**Files to Verify:**
- All components for imports from `lib/ai-service`

**Estimated Effort:** 2-3 hours
**Priority:** Critical

---

### 1.3 Mixed File Organization

**Location:**
- `/lib/` directory contains: `ai-service.ts`, `api-client.ts`, `scoring.ts`, `style-analyzer.ts`, `tavily-client.ts`, `opik-client.ts`, `opik-evaluators.ts`
- `/src/` directory contains: `services/`, `cache/`, `models/`, `config/`, `evaluators/`
- Components are in `/components/` (not `/src/components/`)

**Issue:**
Inconsistent file structure mixing legacy and new patterns.

**Impact:**
- Confusing imports
- Harder to navigate codebase
- Unclear where to add new code

**Fix Plan:**
```bash
# Reorganize to pure src/ structure
src/
├── app/              # Next.js app directory
├── components/        # All React components
│   ├── ui/           # Reusable UI components
│   └── features/     # Feature-specific components
├── lib/              # Utility functions and clients
│   ├── api-client.ts
│   ├── scoring.ts
│   ├── style-analyzer.ts
│   ├── tavily-client.ts
│   └── opik-client.ts
├── services/         # Business logic
│   ├── adapters/
│   ├── orchestration/
│   └── prompts/
├── cache/            # Cache implementations
├── models/           # TypeScript types
├── config/           # Configuration
├── evaluators/       # Evaluation logic
├── hooks/            # Custom React hooks
└── utils/            # Pure utility functions
```

**Migration Steps:**
```bash
# Move components to src/components/
mkdir -p src/components/ui src/components/features
mv components/*.tsx src/components/features/
mv components/ui/* src/components/ui/
rm -rf components/

# Update all imports
# Find all imports from '@/components' and keep them as is
# Find all imports from '@/lib' and keep them as is
```

**Estimated Effort:** 4-6 hours
**Priority:** Critical

---

### 1.4 Missing ESLint Configuration (FIXED)

**Status:** ✅ FIXED
- Created `.eslintrc.json`
- Added lint script to package.json

**No action needed.**

---

## 2. High Priority Issues 🟠

### 2.1 Inconsistent API Response Formats

**Location:**
- `src/api/generate.ts` - Returns different shapes
- `lib/api-client.ts` - Handles multiple response shapes

**Issue:**
API responses are inconsistent:
```typescript
// Sometimes returns:
{ success: true, result: string, scores: [] }

// Sometimes returns:
{ success: true, result: [], options: [] }

// Sometimes returns:
{ result: string, scores: [] }
```

**Impact:**
- Client must handle multiple cases
- Increased bug risk
- Poor developer experience
- Hard to document

**Fix Plan:**
```typescript
// Define standard response shape
// src/types/api.ts

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error: APIError | null;
  meta: APIMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export interface APIMetadata {
  requestId: string;
  timestamp: string;
  duration: number;
  version: string;
}

// Wrapper function to standardize responses
// src/utils/apiResponse.ts

export function createResponse<T>(
  data: T,
  error: APIError | null = null
): APIResponse<T> {
  return {
    success: !error,
    data,
    error,
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
      duration: 0, // Set by middleware
      version: '3.0.0'
    }
  };
}

// Update all API routes to use standard response
// src/api/generate.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orchestrator = getOrchestrator();
    const result = await orchestrator.generateTopics(body);

    return NextResponse.json(createResponse(result));
  } catch (error) {
    return NextResponse.json(
      createResponse(null, {
        code: 'GENERATION_ERROR',
        message: error.message
      }),
      { status: 500 }
    );
  }
}

// Update client to handle standard response
// lib/api-client.ts

async function handleResponse<T>(response: Response): Promise<T> {
  const data: APIResponse<T> = await response.json();

  if (!data.success) {
    throw new APIError(data.error?.code, data.error?.message);
  }

  return data.data;
}
```

**Files to Create:**
- `src/types/api.ts`
- `src/utils/apiResponse.ts`

**Files to Modify:**
- `src/api/generate.ts`
- `lib/api-client.ts`
- All API route files

**Estimated Effort:** 4-6 hours
**Priority:** High

---

### 2.2 Large Component File: PostGeneratorWizard.tsx

**Location:**
- `components/PostGeneratorWizard.tsx` (657 lines)

**Issue:**
Single component handles too many responsibilities:
- State management for all generation steps
- Navigation logic
- Options caching
- Regeneration handlers
- Settings management
- Multiple phase rendering

**Impact:**
- Hard to test
- Hard to maintain
- Performance issues (full re-renders)
- Violates Single Responsibility Principle

**Fix Plan:**
```typescript
// Extract into smaller components

// 1. State management hook
// hooks/usePostGeneration.ts

export function usePostGeneration() {
  const [phase, setPhase] = useState<CraftingPhase>('input');
  const [deck, setDeck] = useState<DeckType>({...});
  const [hand, setHand] = useState<HandType>({...});
  const [settings, setSettings] = useState({...});
  const [optionsCache, setOptionsCache] = useState({...});

  // Handlers
  const handleStart = useCallback(...);
  const selectTopic = useCallback(...);
  const selectHook = useCallback(...);
  const selectBody = useCallback(...);
  const selectCTA = useCallback(...);
  const handleBack = useCallback(...);

  return {
    phase, deck, hand, settings, optionsCache,
    setPhase, setDeck, setHand, setSettings,
    handleStart, selectTopic, selectHook, selectBody, selectCTA, handleBack
  };
}

// 2. Extract phase components
// components/InputPhase.tsx
export function InputPhase({ onStart, settings, onSettingsChange }: Props) { ... }

// components/BuildingPhase.tsx
export function BuildingPhase({ deck, hand, onSelect, onRegenerate }: Props) { ... }

// components/ConfirmationPhase.tsx
export function ConfirmationPhase({ deck, onConfirm, onEdit }: Props) { ... }

// components/ResultPhase.tsx
export function ResultPhase({ deck, scores, onCopy, onRePolish, onReset }: Props) { ... }

// 3. Main wizard just orchestrates
// components/PostGeneratorWizard.tsx (reduced to ~150 lines)

export default function PostGeneratorWizard() {
  const {
    phase, deck, hand, settings, optionsCache,
    handleStart, selectTopic, selectHook, selectBody, selectCTA,
    handleBack, handleConfirmPolish, handleRePolish
  } = usePostGeneration();

  return (
    <>
      {phase === 'input' && <InputPhase onStart={handleStart} />}
      {phase === 'building' && (
        <BuildingPhase
          deck={deck}
          hand={hand}
          onSelect={handleSelect}
          onRegenerate={handleRegenerate}
        />
      )}
      {phase === 'confirm' && (
        <ConfirmationPhase
          deck={deck}
          onConfirm={handleConfirmPolish}
          onEdit={handleEdit}
        />
      )}
      {phase === 'result' && (
        <ResultPhase
          deck={deck}
          scores={scores}
          onCopy={handleCopy}
          onRePolish={handleRePolish}
          onReset={handleReset}
        />
      )}
    </>
  );
}
```

**Files to Create:**
- `hooks/usePostGeneration.ts`
- `components/InputPhase.tsx`
- `components/BuildingPhase.tsx`
- `components/ConfirmationPhase.tsx`
- `components/ResultPhase.tsx`

**Files to Modify:**
- `components/PostGeneratorWizard.tsx` - Reduce to orchestrator

**Estimated Effort:** 8-12 hours
**Priority:** High

---

### 2.3 No Input Validation

**Location:**
- All API routes
- Client-side inputs

**Issue:**
No schema validation for:
- API request bodies
- User inputs
- Generated content

**Impact:**
- API errors from malformed input
- XSS vulnerabilities
- Poor error messages
- Debugging difficulties

**Fix Plan:**
```typescript
// Add Zod validation
// npm install zod

// src/schemas/generation.ts

import { z } from 'zod';

export const TopicInputSchema = z.object({
  idea: z.string().min(3).max(500),
  researchDepth: z.number().min(1).max(10).optional().default(3),
  language: z.enum(['id', 'en']).optional().default('id')
});

export const HookInputSchema = z.object({
  topic: z.string().min(3).max(500),
  intent: z.enum(['viral', 'storytelling', 'educational']).optional().default('viral'),
  language: z.enum(['id', 'en']).optional().default('id')
});

export const BodyInputSchema = z.object({
  hook: z.string().min(5).max(1000),
  topic: z.string().min(3).max(500),
  intent: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional().default('medium'),
  tone: z.number().min(1).max(10).optional().default(5),
  emojiLevel: z.string().optional().default('moderate'),
  language: z.enum(['id', 'en']).optional().default('id'),
  styleProfile: z.string().optional(),
  researchContext: z.string().optional()
});

export const CTAInputSchema = z.object({
  body: z.string().min(5).max(2000),
  intent: z.string().optional(),
  language: z.enum(['id', 'en']).optional().default('id')
});

export const PolishInputSchema = z.object({
  content: z.string().min(10).max(5000),
  tone: z.number().min(1).max(10).optional().default(5),
  emojiDensity: z.number().min(0).max(10).optional().default(5),
  language: z.enum(['id', 'en']).optional().default('id')
});

// Validation helper
// src/utils/validation.ts

import { ZodError } from 'zod';

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { data: T; error: string | null } {
  try {
    const validated = schema.parse(data);
    return { data: validated, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    return { data: null, error: 'Validation failed' };
  }
}

// Use in API routes
// src/api/generate.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate based on type
    let validated;
    switch (body.type) {
      case 'topics':
        validated = validateRequest(TopicInputSchema, body);
        break;
      case 'hooks':
        validated = validateRequest(HookInputSchema, body);
        break;
      // ... other cases
    }

    if (validated.error) {
      return NextResponse.json(
        { success: false, error: validated.error },
        { status: 400 }
      );
    }

    // Proceed with validated data
    const orchestrator = getOrchestrator();
    const result = await orchestrator.generateTopics(validated.data);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // ...
  }
}

// Client-side validation
// components/ChatInput.tsx

import { validateRequest } from '@/utils/validation';
import { TopicInputSchema } from '@/schemas/generation';

const handleGenerate = () => {
  if (!topic.trim()) return;

  const { error } = validateRequest(TopicInputSchema, {
    idea: topic,
    researchDepth: settings.researchDepth
  });

  if (error) {
    alert(error); // Or show in UI
    return;
  }

  onGenerate(topic, settings);
};
```

**Install:**
```bash
npm install zod
npm install -D @types/zod
```

**Files to Create:**
- `src/schemas/generation.ts`
- `src/utils/validation.ts`

**Files to Modify:**
- `src/api/generate.ts`
- `components/ChatInput.tsx`
- All other input components

**Estimated Effort:** 6-8 hours
**Priority:** High

---

### 2.4 Poor Error Handling

**Location:**
- All API routes and services

**Issue:**
Generic try-catch blocks without:
- Error classification
- User-friendly messages
- Error logging
- Recovery strategies

**Impact:**
- Users see cryptic errors
- Debugging is difficult
- No error tracking

**Fix Plan:**
```typescript
// Create custom error classes
// src/utils/errors.ts

export class GenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class RateLimitError extends Error {
  constructor(
    public retryAfter: number,
    message = 'Rate limit exceeded'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Error handler middleware
// src/utils/errorHandler.ts

import { NextResponse } from 'next/server';
import { GenerationError, ValidationError, APIError } from './errors';
import { logger } from './logger';

export function handleError(error: unknown): NextResponse {
  // Log error
  logger.error('API Error', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });

  // Handle known errors
  if (error instanceof GenerationError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: 400 }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid ${error.field}: ${error.message}`
        }
      },
      { status: 400 }
    );
  }

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code || 'API_ERROR',
          message: error.message
        }
      },
      { status: error.status }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    },
    { status: 500 }
  );
}

// Use in API routes
// src/api/generate.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // ... logic
  } catch (error) {
    return handleError(error);
  }
}
```

**Files to Create:**
- `src/utils/errors.ts`
- `src/utils/errorHandler.ts`
- `src/utils/logger.ts`

**Files to Modify:**
- All API routes
- All services

**Estimated Effort:** 4-6 hours
**Priority:** High

---

### 2.5 No Rate Limiting

**Location:**
- All API endpoints

**Issue:**
No protection against:
- API abuse
- Excessive usage
- DDoS attacks
- Cost overruns

**Impact:**
- Security vulnerability
- Potential API cost blowout
- Poor user experience under attack

**Fix Plan:**
```typescript
// Add Upstash Redis rate limiting
// npm install @upstash/ratelimit @upstash/redis

// src/lib/rateLimit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  if (!success) {
    throw new RateLimitError(
      Math.ceil((reset - Date.now()) / 1000),
      'Rate limit exceeded. Please try again later.'
    );
  }

  return { limit, remaining, reset };
}

// Middleware
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

export async function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';

    try {
      const { limit, remaining } = await checkRateLimit(identifier);

      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());

      return response;
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: error.message,
              retryAfter: error.retryAfter
            }
          },
          {
            status: 429,
            headers: {
              'Retry-After': error.retryAfter.toString()
            }
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};
```

**Install:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Environment Variables:**
```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Files to Create:**
- `src/lib/rateLimit.ts`
- `middleware.ts`

**Estimated Effort:** 3-4 hours
**Priority:** High

---

## 3. Medium Priority Issues 🟡

### 3.1 No React Performance Optimizations

**Location:**
- All React components

**Issue:**
- No React.memo on child components
- No useMemo for expensive calculations
- No useCallback for event handlers
- Full component re-renders on state changes

**Impact:**
- Unnecessary renders
- Poor performance with many options
- Battery drain on mobile

**Fix Plan:**
```typescript
// Apply to all components
// components/OptionCarousel.tsx

import { memo, useMemo, useCallback } from 'react';

// Memoize entire component
export default memo(function OptionCarousel({
  options,
  onSelect,
  onRegenerate,
  itemsPerPage,
  stepType,
  loading = false
}: OptionCarouselProps) {
  // Memoize calculations
  const totalOptionPages = useMemo(
    () => Math.ceil(options.length / itemsPerPage),
    [options.length, itemsPerPage]
  );

  const currentOptions = useMemo(
    () => options.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ),
    [options, currentPage, itemsPerPage]
  );

  // Memoize handlers
  const handleSelect = useCallback((opt: string) => {
    onSelect(opt);
  }, [onSelect]);

  const handleRegenerate = useCallback(() => {
    onRegenerate();
  }, [onRegenerate]);

  // ... rest of component
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.options === nextProps.options &&
    prevProps.loading === nextProps.loading
  );
});

// Also apply to:
// - components/Canvas.tsx
// - components/ChatInput.tsx
// - components/ui/Card.tsx
// - components/ui/Button.tsx
```

**Estimated Effort:** 4-6 hours
**Priority:** Medium

---

### 3.2 No Code Splitting

**Location:**
- `app/page.tsx`
- `app/layout.tsx`

**Issue:**
All components loaded upfront, including:
- Heavy libraries (framer-motion)
- Large components (ChatInput, PostGeneratorWizard)
- Onboarding modals
- Settings panels

**Impact:**
- Large initial bundle size
- Slow page load
- Poor mobile experience

**Fix Plan:**
```typescript
// Lazy load non-critical components
// app/page.tsx

import dynamic from 'next/dynamic';

// Lazy load heavy components
const PostGeneratorWizard = dynamic(
  () => import('@/components/PostGeneratorWizard'),
  {
    loading: () => <div className="animate-pulse">Loading...</div>,
    ssr: false // Only load on client
  }
);

const StyleOnboarding = dynamic(
  () => import('@/components/StyleOnboarding'),
  { ssr: false }
);

const SettingsPanel = dynamic(
  () => import('@/components/SettingsPanel'),
  { ssr: false }
);

// Lazy load animation library
const FramerMotion = dynamic(() => import('framer-motion'), { ssr: false });
```

**Estimated Effort:** 2-3 hours
**Priority:** Medium

---

### 3.3 Type Safety Issues

**Location:**
- Various files with `any` types

**Issue:**
TypeScript `any` types used in:
- `components/PostGeneratorWizard.tsx` - state objects
- `lib/api-client.ts` - API responses
- `src/services/adapters/groqAdapter.ts` - parsed data

**Impact:**
- No compile-time type checking
- Runtime type errors possible
- Poor IDE autocomplete

**Fix Plan:**
```typescript
// Replace all 'any' with specific types

// Example 1: PostGeneratorWizard state
// components/PostGeneratorWizard.tsx

// Before:
const [settings, setSettings] = useState<any>({...});

// After:
interface Settings {
  language: 'id' | 'en';
  emojiLevel: number;
  tone: number;
  researchDepth: number;
  intent: 'viral' | 'storytelling' | 'educational';
  length: 'short' | 'medium' | 'long';
  magicMode: boolean;
}

const [settings, setSettings] = useState<Settings>({...});

// Example 2: API response
// lib/api-client.ts

// Before:
const data: any = await response.json();

// After:
interface GenerationResponse {
  result: GeneratedOption[];
  success: boolean;
  scores?: any[]; // Still any for scores, but better than entire object
}

const data: GenerationResponse = await response.json();

// Example 3: Adapter return
// src/services/adapters/groqAdapter.ts

// Before:
const parsed: any = JSON.parse(content);

// After:
interface ParsedOption {
  content: string;
  score: number;
  reasoning: string;
  metadata?: Record<string, unknown>;
}

const parsed: ParsedOption = JSON.parse(content);
```

**Estimated Effort:** 6-8 hours
**Priority:** Medium

---

### 3.4 In-Memory Cache Only

**Location:**
- `src/cache/simpleCache.ts`

**Issue:**
Cache doesn't persist across:
- Server restarts
- Multiple server instances
- Different environments

**Impact:**
- Lost cache on deployment
- No distributed caching
- Reduced performance on restart

**Fix Plan:**
```typescript
// Implement Redis cache
// npm install ioredis

// src/cache/redisCache.ts

import Redis from 'ioredis';
import { ICacheAdapter, CacheEntry } from '../services/adapters/interfaces';

export class RedisCache implements ICacheAdapter {
  private client: Redis;
  private defaultTTL: number;

  constructor(redisUrl: string, defaultTTLSeconds: number = 300) {
    this.client = new Redis(redisUrl);
    this.defaultTTL = defaultTTLSeconds;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;

    const entry: CacheEntry<T> = JSON.parse(data);

    // Check TTL (stored as timestamp)
    if (Date.now() - entry.timestamp > entry.ttl) {
      await this.delete(key);
      return null;
    }

    return entry.data;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: (ttlSeconds || this.defaultTTL) * 1000
    };

    await this.client.setex(
      key,
      ttlSeconds || this.defaultTTL,
      JSON.stringify(entry)
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.client.flushdb();
  }
}

// Update config
// src/config/config.ts

export const config = {
  // ... other config
  cache: {
    type: process.env.CACHE_TYPE || 'memory', // 'memory' or 'redis'
    redisUrl: process.env.REDIS_URL || ''
  }
};

// Update orchestrator
// src/services/orchestration/index.ts

import { RedisCache } from '../../cache/redisCache';
import { SimpleCache } from '../../cache/simpleCache';
import { config } from '../../config/config';

const cacheAdapter = config.features.enableCache
  ? config.cache.type === 'redis'
    ? new RedisCache(config.cache.redisUrl)
    : new SimpleCache()
  : undefined;
```

**Install:**
```bash
npm install ioredis
npm install -D @types/ioredis
```

**Environment Variables:**
```env
REDIS_URL=redis://localhost:6379
CACHE_TYPE=redis
```

**Files to Create:**
- `src/cache/redisCache.ts`

**Files to Modify:**
- `src/config/config.ts`
- `src/services/orchestration/index.ts`

**Estimated Effort:** 3-4 hours
**Priority:** Medium

---

### 3.5 Test Coverage Gaps

**Location:**
- `tests/` directory

**Issue:**
Only 11 tests in 3 files:
- `orchestrator.test.ts` - Tests orchestrator logic
- `simpleCache.test.ts` - Tests cache
- `promptBuilder.test.ts` - Tests prompt building

Missing tests for:
- API routes
- Adapters (Groq, Tavily, Opik)
- Components
- Utilities
- Error handling
- Input validation

**Impact:**
- Bugs not caught early
- Refactoring is risky
- Confidence in code is low

**Fix Plan:**
```typescript
// Add missing test suites

// 1. API Route Tests
// tests/api/generate.test.ts

import { POST } from '@/app/api/generate/route';
import { NextRequest } from 'next/server';

describe('API: Generate', () => {
  it('should generate topics with valid input', async () => {
    const request = new NextRequest('http://localhost/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        type: 'topics',
        input: 'Test topic',
        researchDepth: 3
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result).toBeDefined();
    expect(Array.isArray(data.result)).toBe(true);
  });

  it('should return 400 for invalid input', async () => {
    const request = new NextRequest('http://localhost/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        type: 'topics',
        input: '' // Invalid: too short
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});

// 2. Adapter Tests
// tests/adapters/groqAdapter.test.ts

import { GroqAdapter } from '@/services/adapters/groqAdapter';

describe('GroqAdapter', () => {
  let adapter: GroqAdapter;

  beforeEach(() => {
    adapter = new GroqAdapter(process.env.GROQ_API_KEY);
  });

  it('should generate topics', async () => {
    const result = await adapter.generateTopics({
      idea: 'Test topic'
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].content).toBeDefined();
  });

  it('should handle JSON parsing errors', async () => {
    // Mock response with invalid JSON
    // Test fallback behavior
  });
});

// 3. Component Tests
// tests/components/OptionCarousel.test.ts

import { render, screen, fireEvent } from '@testing-library/react';
import OptionCarousel from '@/components/OptionCarousel';

describe('OptionCarousel', () => {
  const mockOptions = [
    { content: 'Option A', score: 85 },
    { content: 'Option B', score: 90 }
  ];

  it('should render options', () => {
    render(
      <OptionCarousel
        options={mockOptions}
        onSelect={jest.fn()}
        onRegenerate={jest.fn()}
        itemsPerPage={2}
        stepType="topics"
      />
    );

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('should call onSelect when option clicked', () => {
    const onSelect = jest.fn();
    render(
      <OptionCarousel
        options={mockOptions}
        onSelect={onSelect}
        onRegenerate={jest.fn()}
        itemsPerPage={2}
        stepType="topics"
      />
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(onSelect).toHaveBeenCalledWith('Option A');
  });
});

// 4. E2E Tests
// tests/e2e/user-flow.spec.ts

import { test, expect } from '@playwright/test';

test('complete post generation flow', async ({ page }) => {
  await page.goto('/');

  // Enter topic
  await page.fill('textarea[placeholder*="What do you want to post"]', 'Tips for junior devs');

  // Click generate
  await page.click('button:has-text("Generate")');

  // Wait for topics
  await expect(page.locator('[data-testid="option-card"]').first()).toBeVisible();

  // Select topic
  await page.click('[data-testid="option-card"] >> text=/Tips for junior/');

  // Wait for hooks
  await page.waitForTimeout(2000);

  // Select hook
  await page.click('[data-testid="option-card"]').first();

  // Continue through flow...
  // Final result should be visible
  await expect(page.locator('text=Your Viral Post is Ready')).toBeVisible();
});
```

**Install:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
```

**Files to Create:**
- `tests/api/generate.test.ts`
- `tests/api/research.test.ts`
- `tests/api/transcribe.test.ts`
- `tests/adapters/groqAdapter.test.ts`
- `tests/adapters/tavilyAdapter.test.ts`
- `tests/adapters/opikAdapter.test.ts`
- `tests/components/OptionCarousel.test.ts`
- `tests/components/ChatInput.test.ts`
- `tests/components/PostGeneratorWizard.test.ts`
- `tests/utils/jsonParser.test.ts`
- `tests/utils/validation.test.ts`
- `tests/e2e/user-flow.spec.ts`

**Estimated Effort:** 16-20 hours
**Priority:** Medium

---

## 4. Low Priority Issues 🟢

### 4.1 Missing Environment Variable Validation

**Location:**
- `src/config/config.ts`
- `src/services/orchestration/index.ts`

**Issue:**
No validation that required environment variables are set:
- `GROQ_API_KEY`
- `OPIK_API_KEY`
- `TAVILY_API_KEY`

**Impact:**
- Runtime errors when keys are missing
- Hard to debug
- Poor developer experience

**Fix Plan:**
```typescript
// Add validation on startup
// src/config/config.ts

import { z } from 'zod';

const ConfigSchema = z.object({
  groq: z.object({
    apiKey: z.string().min(1, 'GROQ_API_KEY is required'),
    defaultModel: z.string()
  }),
  tavily: z.object({
    apiKey: z.string().optional()
  }),
  opik: z.object({
    apiKey: z.string().min(1, 'OPIK_API_KEY is required'),
    projectName: z.string()
  }),
  features: z.object({
    useMock: z.boolean(),
    enableCache: z.boolean()
  })
});

export const config = ConfigSchema.parse({
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    defaultModel: 'llama-3.3-70b-versatile'
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY
  },
  opik: {
    apiKey: process.env.OPIK_API_KEY,
    projectName: 'commit-to-career'
  },
  features: {
    useMock: process.env.USE_MOCK === 'true',
    enableCache: process.env.ENABLE_CACHE === 'true'
  }
});

// Or use simpler approach
const requiredEnvVars = ['GROQ_API_KEY', 'OPIK_API_KEY'];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

**Estimated Effort:** 1-2 hours
**Priority:** Low

---

### 4.2 No API Documentation

**Location:**
- Missing

**Issue:**
No documentation for:
- API endpoints
- Request/response formats
- Error codes
- Authentication (when added)
- Rate limits

**Impact:**
- Hard to integrate
- Poor developer experience
- Questions from users

**Fix Plan:**
```typescript
// Add OpenAPI/Swagger specification
// Create OpenAPI spec
// docs/api/openapi.yaml

openapi: 3.0.0
info:
  title: AlterEgo API
  version: 3.0.0
  description: AI-powered LinkedIn post generation API

servers:
  - url: https://alterego.ai/api
    description: Production server

paths:
  /generate:
    post:
      summary: Generate content
      description: Generate topics, hooks, body, or CTA options
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - type
                - input
              properties:
                type:
                  type: string
                  enum: [topics, hooks, body, cta, polish, complete]
                input:
                  type: string
                  description: Input text or context
                intent:
                  type: string
                  enum: [viral, storytelling, educational]
                length:
                  type: string
                  enum: [short, medium, long]
                tone:
                  type: number
                  minimum: 1
                  maximum: 10
                emojiLevel:
                  type: string
                  enum: [none, minimal, moderate, rich]
                language:
                  type: string
                  enum: [id, en]
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        content:
                          type: string
                        score:
                          type: number
                        reasoning:
                          type: string
                  error:
                    type: object
                    nullable: true
                  meta:
                    type: object
                    properties:
                      requestId:
                        type: string
                      timestamp:
                        type: string
                      duration:
                        type: number
        '400':
          description: Bad request
        '429':
          description: Rate limit exceeded
        '500':
          description: Internal server error

  /research:
    post:
      summary: Web research
      description: Search the web for context
      # ... similar structure

  /transcribe:
    post:
      summary: Transcribe audio
      description: Convert speech to text
      # ... similar structure

components:
  schemas:
    GeneratedOption:
      type: object
      properties:
        content:
          type: string
        score:
          type: number
        reasoning:
          type: string

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object

# Add Swagger UI
// app/api/docs/route.ts

import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AlterEgo API',
      version: '3.0.0',
    },
  },
  apis: ['./src/api/*.ts'], // Path to the API docs
};

const openapiSpecification = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(openapiSpecification);
}
```

**Install:**
```bash
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

**Estimated Effort:** 4-6 hours
**Priority:** Low

---

### 4.3 No Bundle Size Optimization

**Location:**
- `next.config.js`

**Issue:**
No bundle analysis, unknown bundle sizes, potential for large unused dependencies.

**Impact:**
- Slow page load
- Poor mobile experience
- Higher bandwidth costs

**Fix Plan:**
```javascript
// next.config.js

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['opik'],
  swcMinify: true, // Use SWC compiler for minification

  // Optimize images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize imports
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
```

**Install:**
```bash
npm install -D @next/bundle-analyzer
```

**Environment Variables:**
```env
ANALYZE=true
```

**Run Analysis:**
```bash
npm run build
# This will open bundle analyzer
```

**Estimated Effort:** 2-3 hours
**Priority:** Low

---

## 5. Issues Already Fixed ✅

### 5.1 ESLint Configuration Missing ✅
**Status:** FIXED - Created `.eslintrc.json`

### 5.2 Test Script Missing ✅
**Status:** FIXED - Added test script to package.json

### 5.3 TypeScript Error in Test ✅
**Status:** FIXED - Fixed Promise return type in orchestrator.test.ts

---

## 6. Recommended Fix Order

### Week 1: Critical Fixes
1. ✅ Remove duplicate JSON parsing (3-4 hours)
2. ✅ Remove legacy `lib/ai-service.ts` (2-3 hours)
3. ✅ Standardize API responses (4-6 hours)
4. ✅ Add input validation with Zod (6-8 hours)

**Total:** ~20 hours (2-3 days)

### Week 2: High Priority
1. ✅ Refactor PostGeneratorWizard component (8-12 hours)
2. ✅ Implement error handling (4-6 hours)
3. ✅ Add rate limiting (3-4 hours)

**Total:** ~20 hours (2-3 days)

### Week 3-4: Medium Priority
1. ✅ React performance optimizations (4-6 hours)
2. ✅ Implement Redis cache (3-4 hours)
3. ✅ Improve type safety (6-8 hours)
4. ✅ Add tests (16-20 hours)

**Total:** ~35 hours (4-5 days)

### Month 2: Low Priority & Polish
1. ✅ Environment variable validation (1-2 hours)
2. ✅ API documentation (4-6 hours)
3. ✅ Bundle optimization (2-3 hours)
4. ✅ Code splitting (2-3 hours)

**Total:** ~12 hours (1-2 days)

---

## Summary Table

| Issue | Severity | Effort | Priority | Status |
|-------|----------|---------|----------|--------|
| Duplicate JSON parsing | Critical | 3-4 hours | P0 | Open |
| Legacy ai-service.ts | Critical | 2-3 hours | P0 | Open |
| Mixed file organization | Critical | 4-6 hours | P0 | Open |
| Inconsistent API responses | High | 4-6 hours | P1 | Open |
| Large PostGeneratorWizard | High | 8-12 hours | P1 | Open |
| No input validation | High | 6-8 hours | P1 | Open |
| Poor error handling | High | 4-6 hours | P1 | Open |
| No rate limiting | High | 3-4 hours | P1 | Open |
| No React optimizations | Medium | 4-6 hours | P2 | Open |
| No code splitting | Medium | 2-3 hours | P2 | Open |
| Type safety issues | Medium | 6-8 hours | P2 | Open |
| In-memory cache only | Medium | 3-4 hours | P2 | Open |
| Test coverage gaps | Medium | 16-20 hours | P2 | Open |
| No env var validation | Low | 1-2 hours | P3 | Open |
| No API documentation | Low | 4-6 hours | P3 | Open |
| No bundle optimization | Low | 2-3 hours | P3 | Open |

**Total Estimated Effort:** ~90-100 hours (12-15 days)

---

## Success Metrics

- **Code Quality:** Duplicate code reduced by 80%, all critical issues resolved
- **Test Coverage:** Target 60% coverage (from current ~15%)
- **Type Safety:** Zero `any` types in production code
- **Performance:** Lighthouse score > 90
- **Security:** All high-severity vulnerabilities patched

## Conclusion

This issues & fixes plan provides a comprehensive roadmap for improving code quality, performance, and maintainability. The prioritized approach allows for quick wins (critical issues) while working toward a more robust, scalable codebase.

Key recommendations for immediate action:
1. Fix duplicate code first (easiest win)
2. Remove legacy code (clean up)
3. Standardize APIs (improves DX)
4. Add validation (security + UX)

Addressing these issues will make the codebase production-ready and easier to maintain for future development.
