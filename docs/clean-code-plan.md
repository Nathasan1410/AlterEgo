# Clean Code & Better File/Component Placement Plan

## Executive Summary

This document outlines a comprehensive plan to improve code quality, file organization, and component placement in AlterEgo. The goal is to create a maintainable, scalable, and developer-friendly codebase that follows industry best practices.

## Current State Analysis

### File Structure Assessment

```
HACKATHON-OpikAI/
├── app/                          # Next.js app directory
├── components/                    # ❌ ISSUE: Not in src/
│   ├── ui/                        # UI components
│   └── [14 component files]      # ❌ ISSUE: All mixed together
├── lib/                          # ❌ ISSUE: Mixed with src/
│   ├── ai-service.ts              # ❌ ISSUE: 743 lines, legacy
│   ├── api-client.ts             # ❌ ISSUE: Should be in src/
│   ├── scoring.ts
│   ├── style-analyzer.ts
│   ├── tavily-client.ts
│   ├── opik-client.ts
│   └── opik-evaluators.ts
├── src/                         # ✅ GOOD: Modern structure
│   ├── api/
│   ├── cache/
│   ├── config/
│   ├── evaluators/
│   ├── models/
│   ├── services/
│   │   ├── adapters/
│   │   ├── orchestration/
│   │   └── prompts/
│   └── (no components directory) # ❌ ISSUE: Missing
├── hooks/                        # ❌ ISSUE: Not in src/
├── tests/                        # ✅ GOOD: Organized
│   └── unit/
└── [various .md files]          # ❌ ISSUE: Mixed with code
```

### Issues Identified

| Issue | Severity | Impact |
|-------|----------|---------|
| Components outside src/ | High | Inconsistent imports, hard to navigate |
| Mixed /lib/ and /src/ | High | Unclear where to put new code |
| Large component files (657 lines) | Medium | Hard to test, maintain |
| Duplicate JSON parsing logic | High | DRY violation, maintenance burden |
| Legacy code (ai-service.ts) | Critical | 743 lines of dead code |
| No clear component categories | Medium | Components all in one directory |
| Hooks outside src/ | Low | Inconsistent with other code |
| Missing utilities directory | Low | Utility functions scattered |
| Inconsistent naming | Low | camelCase vs. PascalCase confusion |

---

## Target File Structure

### Final Goal Structure

```
HACKATHON-OpikAI/
├── public/                        # Static assets
│   ├── images/
│   ├── fonts/
│   └── sw.js                     # Service worker
├── docs/                          # ✅ Documentation
│   ├── optimization-plan.md
│   ├── future-implementation-plan.md
│   ├── issues-fixes.md
│   ├── product-profile.md
│   ├── clean-code-plan.md
│   └── api/                       # API documentation
├── scripts/                        # ✅ Utility scripts
│   ├── runEvaluation.ts
│   ├── seedData.ts
│   └── migrate.ts
├── tests/                          # ✅ All tests
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   ├── e2e/                       # E2E tests (Playwright)
│   └── setup.ts                    # Test setup
├── src/                            # ✅ All source code
│   ├── app/                        # Next.js app directory
│   │   ├── api/                    # API routes
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   ├── research/
│   │   │   │   └── route.ts
│   │   │   ├── transcribe/
│   │   │   │   └── route.ts
│   │   │   └── analyze-style/
│   │   │       └── route.ts
│   │   ├── (auth)/                 # Auth routes
│   │   ├── (dashboard)/             # Dashboard routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/                   # ✅ All React components
│   │   ├── ui/                     # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts              # Barrell export
│   │   │
│   │   ├── features/                # Feature-specific components
│   │   │   ├── post-generator/      # Post generation feature
│   │   │   │   ├── PostGeneratorWizard.tsx
│   │   │   │   ├── InputPhase.tsx
│   │   │   │   ├── BuildingPhase.tsx
│   │   │   │   ├── ConfirmationPhase.tsx
│   │   │   │   ├── ResultPhase.tsx
│   │   │   │   └── OptionCarousel.tsx
│   │   │   │
│   │   │   ├── style-onboarding/   # Style analysis feature
│   │   │   │   ├── StyleOnboarding.tsx
│   │   │   │   ├── StyleUploader.tsx
│   │   │   │   └── StylePreview.tsx
│   │   │   │
│   │   │   ├── voice-input/        # Voice input feature
│   │   │   │   ├── VoiceInput.tsx
│   │   │   │   ├── AudioRecorder.tsx
│   │   │   │   └── TranscriptionStatus.tsx
│   │   │   │
│   │   │   ├── research/           # Research feature
│   │   │   │   ├── ResearchToggle.tsx
│   │   │   │   ├── ResearchResults.tsx
│   │   │   │   └── SourceAttribution.tsx
│   │   │   │
│   │   │   ├── analytics/          # Analytics feature
│   │   │   │   ├── ViralScoreCard.tsx
│   │   │   │   ├── ScoreBreakdown.tsx
│   │   │   │   └── TrendChart.tsx
│   │   │   │
│   │   │   └── canvas/            # Canvas/preview
│   │   │       ├── Canvas.tsx
│   │   │       ├── MobileCanvas.tsx
│   │   │       ├── PostPreview.tsx
│   │   │       └── FocusSummary.tsx
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   └── feedback/                # Feedback components
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Toast.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/                        # ✅ Utilities and clients
│   │   ├── api-client.ts           # API client
│   │   ├── scoring.ts              # Scoring logic
│   │   ├── style-analyzer.ts       # Style analysis
│   │   ├── tavily-client.ts        # Tavily client
│   │   ├── opik-client.ts         # Opik client
│   │   ├── opik-evaluators.ts    # Evaluation logic
│   │   └── constants.ts            # App constants
│   │
│   ├── services/                   # ✅ Business logic
│   │   ├── adapters/              # External service adapters
│   │   │   ├── interfaces.ts
│   │   │   ├── groqAdapter.ts
│   │   │   ├── tavilyAdapter.ts
│   │   │   ├── opikAdapter.ts
│   │   │   ├── index.ts
│   │   │   └── [future adapters]
│   │   │
│   │   ├── orchestration/          # Orchestration layer
│   │   │   ├── generationOrchestrator.ts
│   │   │   └── index.ts
│   │   │
│   │   └── prompts/                # Prompt templates
│   │       ├── promptTemplates.ts
│   │       ├── promptBuilder.ts
│   │       └── index.ts
│   │
│   ├── cache/                      # ✅ Cache implementations
│   │   ├── interfaces.ts
│   │   ├── memoryCache.ts          # Renamed from simpleCache
│   │   ├── redisCache.ts           # New
│   │   └── index.ts
│   │
│   ├── models/                     # ✅ TypeScript types
│   │   ├── generated.ts
│   │   ├── user.ts                # Future
│   │   ├── post.ts                # Future
│   │   └── index.ts
│   │
│   ├── config/                     # ✅ Configuration
│   │   ├── config.ts
│   │   ├── constants.ts           # Moved from lib/
│   │   └── index.ts
│   │
│   ├── evaluators/                 # ✅ Evaluation logic
│   │   ├── index.ts
│   │   ├── contentEvaluator.ts
│   │   └── styleEvaluator.ts
│   │
│   ├── hooks/                      # ✅ Custom React hooks
│   │   ├── usePostGeneration.ts
│   │   ├── useViewportCardCount.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── index.ts
│   │
│   ├── utils/                      # ✅ Pure utility functions
│   │   ├── jsonParser.ts           # New - shared JSON parsing
│   │   ├── validation.ts           # New - Zod schemas
│   │   ├── errorHandler.ts         # New - error handling
│   │   ├── logger.ts              # New - logging
│   │   ├── formatDate.ts
│   │   ├── generateId.ts
│   │   ├── classNames.ts
│   │   └── index.ts
│   │
│   ├── schemas/                    # ✅ Zod validation schemas
│   │   ├── generation.ts
│   │   ├── user.ts                # Future
│   │   └── index.ts
│   │
│   ├── types/                      # ✅ Shared type definitions
│   │   ├── api.ts                 # API types
│   │   ├── components.ts           # Component props
│   │   ├── errors.ts              # Custom error types
│   │   └── index.ts
│   │
│   └── middleware/                 # ✅ Next.js middleware
│       ├── rateLimit.ts
│       ├── auth.ts                # Future
│       └── index.ts
│
├── .github/                       # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── test.yml
│
├── .env.example                    # ✅ Environment template
├── .eslintrc.json                 # ✅ ESLint config
├── .prettierrc                    # ✅ NEW: Prettier config
├── .gitignore
├── jest.config.js                  # ✅ Jest config
├── next.config.js                  # ✅ Next.js config
├── next-env.d.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Refactoring Plan

### Phase 1: File Structure Cleanup (Week 1)

#### 1.1 Move Components to src/

**Current Issue:** Components are in `/components/` outside `src/`

**Action:**
```bash
# Create new directory structure
mkdir -p src/components/ui
mkdir -p src/components/features/post-generator
mkdir -p src/components/features/style-onboarding
mkdir -p src/components/features/voice-input
mkdir -p src/components/features/research
mkdir -p src/components/features/analytics
mkdir -p src/components/features/canvas
mkdir -p src/components/layout
mkdir -p src/components/feedback

# Move components
mv components/ui/* src/components/ui/
mv components/PostGeneratorWizard.tsx src/components/features/post-generator/
mv components/OptionCarousel.tsx src/components/features/post-generator/
mv components/StyleOnboarding.tsx src/components/features/style-onboarding/
mv components/VoiceInput.tsx src/components/features/voice-input/
mv components/Canvas.tsx src/components/features/canvas/
mv components/MobileCanvas.tsx src/components/features/canvas/
mv components/FocusSummary.tsx src/components/features/canvas/
mv components/OpikScoreCard.tsx src/components/features/analytics/
mv components/SettingsPanel.tsx src/components/layout/
mv components/Sidebar.tsx src/components/layout/
mv components/DarkVeilBackground.tsx src/components/layout/
mv components/WaveBackground.tsx src/components/layout/

# Remove old directory
rm -rf components/
```

**Update Imports:**
```typescript
// Before
import Button from '@/components/ui/Button';

// After
import Button from '@/components/ui/Button';
// (Same path, but now consistent with other src/ imports)
```

**Estimated Time:** 1-2 hours

---

#### 1.2 Move Hooks to src/

**Current Issue:** Hooks are in `/hooks/` outside `src/`

**Action:**
```bash
# Create hooks directory in src
mkdir -p src/hooks

# Move hooks
mv hooks/*.ts src/hooks/

# Remove old directory
rm -rf hooks/
```

**Update Imports:**
```typescript
// Before
import useViewportCardCount from '@/hooks/useViewportCardCount';

// After
import useViewportCardCount from '@/hooks/useViewportCardCount';
```

**Estimated Time:** 30 minutes

---

#### 1.3 Move Lib to src/

**Current Issue:** Mix of `/lib/` and `/src/` creates confusion

**Action:**
```bash
# Move everything from lib to src/lib
mv lib/* src/lib/

# Remove old directory
rm -rf lib/
```

**Update Imports:**
```typescript
// No change needed - both were imported via @/
// But this eliminates confusion about where to put new code
```

**Estimated Time:** 30 minutes

---

#### 1.4 Remove Legacy Code

**Current Issue:** `src/lib/ai-service.ts` (743 lines) is dead code

**Action:**
```bash
# Verify no imports
grep -r "lib/ai-service" --exclude-dir=node_modules .
grep -r "@/lib/ai-service" --exclude-dir=node_modules .

# If no results, delete
rm src/lib/ai-service.ts
```

**Estimated Time:** 30 minutes

---

### Phase 2: Component Extraction & Modularization (Week 1-2)

#### 2.1 Extract PostGeneratorWizard Phases

**Current Issue:** `PostGeneratorWizard.tsx` is 657 lines with multiple responsibilities

**Action:** Extract into smaller, focused components

```typescript
// src/components/features/post-generator/InputPhase.tsx
// 60-80 lines

export interface InputPhaseProps {
  onStart: (topic: string, settings: Settings) => void;
  initialSettings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export default function InputPhase({
  onStart,
  initialSettings,
  onSettingsChange
}: InputPhaseProps) {
  // Only handles input phase UI
}

// ---------------------------------------------------------

// src/components/features/post-generator/BuildingPhase.tsx
// 100-120 lines

export interface BuildingPhaseProps {
  deck: DeckType;
  hand: HandType;
  onSelect: (option: string) => void;
  onRegenerate: () => void;
  onBack: () => void;
}

export default function BuildingPhase({
  deck,
  hand,
  onSelect,
  onRegenerate,
  onBack
}: BuildingPhaseProps) {
  // Only handles building phase UI
}

// ---------------------------------------------------------

// src/components/features/post-generator/ConfirmationPhase.tsx
// 80-100 lines

export interface ConfirmationPhaseProps {
  deck: DeckType;
  onConfirm: () => void;
  onEdit: () => void;
}

export default function ConfirmationPhase({
  deck,
  onConfirm,
  onEdit
}: ConfirmationPhaseProps) {
  // Only handles confirmation phase UI
}

// ---------------------------------------------------------

// src/components/features/post-generator/ResultPhase.tsx
// 80-100 lines

export interface ResultPhaseProps {
  deck: DeckType;
  scores: ScoreType[];
  onCopy: () => void;
  onRePolish: () => void;
  onReset: () => void;
}

export default function ResultPhase({
  deck,
  scores,
  onCopy,
  onRePolish,
  onReset
}: ResultPhaseProps) {
  // Only handles result phase UI
}

// ---------------------------------------------------------

// src/components/features/post-generator/PostGeneratorWizard.tsx
// Reduced to ~150 lines

export default function PostGeneratorWizard() {
  const {
    phase, deck, hand, settings, optionsCache,
    handleStart, selectTopic, selectHook, selectBody, selectCTA,
    handleBack, handleConfirmPolish, handleRePolish
  } = usePostGeneration();

  return (
    <>
      {phase === 'input' && (
        <InputPhase
          onStart={handleStart}
          initialSettings={settings}
          onSettingsChange={setSettings}
        />
      )}
      {phase === 'building' && (
        <BuildingPhase
          deck={deck}
          hand={hand}
          onSelect={handleSelect}
          onRegenerate={handleRegenerate}
          onBack={handleBack}
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
          onReset={reset}
        />
      )}
    </>
  );
}
```

**Benefits:**
- Each component is ~100 lines (easier to understand)
- Can test phases independently
- Reusable phases in other contexts
- Clear separation of concerns

**Estimated Time:** 6-8 hours

---

#### 2.2 Extract Custom Hooks

**Current Issue:** State logic embedded in components

**Action:** Extract into custom hooks

```typescript
// src/hooks/usePostGeneration.ts
// 150-200 lines

export interface UsePostGenerationReturn {
  // State
  phase: CraftingPhase;
  deck: DeckType;
  hand: HandType;
  settings: Settings;
  optionsCache: OptionsCache;
  
  // Actions
  handleStart: (topic: string, settings: Settings) => void;
  selectTopic: (topic: string) => void;
  selectHook: (hook: string) => void;
  selectBody: (body: string) => void;
  selectCTA: (cta: string) => void;
  handleBack: () => void;
  handleConfirmPolish: () => void;
  handleRePolish: () => void;
  reset: () => void;
}

export function usePostGeneration(): UsePostGenerationReturn {
  const [phase, setPhase] = useState<CraftingPhase>('input');
  const [deck, setDeck] = useState<DeckType>({...});
  const [hand, setHand] = useState<HandType>({...});
  const [settings, setSettings] = useState<Settings>({...});
  const [optionsCache, setOptionsCache] = useState<OptionsCache>({...});

  const handleStart = useCallback((topic: string, newSettings: Settings) => {
    setInitialInput(topic);
    setSettings({ ...settings, ...newSettings });
    setPhase('building');
    // ... generation logic
  }, [settings]);

  const selectTopic = useCallback(async (topic: string) => {
    // ... topic selection logic
  }, []);

  // ... other handlers

  return {
    phase, deck, hand, settings, optionsCache,
    handleStart, selectTopic, selectHook, selectBody, selectCTA,
    handleBack, handleConfirmPolish, handleRePolish, reset
  };
}
```

**Benefits:**
- Component becomes a pure UI
- Logic is testable independently
- Reusable in other components
- Clear data flow

**Estimated Time:** 4-6 hours

---

### Phase 3: Code Deduplication (Week 2)

#### 3.1 Extract JSON Parser Utility

**Current Issue:** Duplicate JSON parsing in multiple files

**Action:** Create shared utility

```typescript
// src/utils/jsonParser.ts
// 100-150 lines

export class JSONParser {
  /**
   * Robust JSON parser with multiple fallback strategies
   * Handles:
   * - Markdown code blocks (```json)
   * - Mixed uppercase/lowercase keys
   * - Array vs object wrappers
   * - Malformed JSON
   */
  static parseGeneratedContent(
    content: string,
    expectedType: 'array' | 'object'
  ): GeneratedOption[] {
    const strategies = [
      () => this.parseDirect(content),
      () => this.parseArray(content),
      () => this.parseObject(content),
      () => this.parseUppercaseKeys(content)
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
      const normalized = {};
      for (const [key, value] of Object.entries(obj)) {
        normalized[key.toLowerCase()] = value;
      }
      return normalized;
    }
    return null;
  }

  private static parseUppercaseKeys(content: string): any {
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

  private static validateAndTransform(
    result: any,
    expectedType: 'array' | 'object'
  ): GeneratedOption[] {
    // Validation and transformation logic
  }

  private static getFallback(
    expectedType: 'array' | 'object'
  ): GeneratedOption[] {
    return [{
      content: 'Generation error. Please try again.',
      score: 0,
      reasoning: 'Parse failed'
    }];
  }
}

// Usage
// src/services/adapters/groqAdapter.ts

import { JSONParser } from '@/utils/jsonParser';

private parseGeneratedOptions(content: string): GeneratedOption[] {
  return JSONParser.parseGeneratedContent(content, 'array');
}

// Also update lib/scoring.ts (if it has JSON parsing)
```

**Benefits:**
- Single source of truth
- Bug fixes apply everywhere
- Easier to test
- Clear responsibility

**Estimated Time:** 3-4 hours

---

#### 3.2 Consolidate Constants

**Current Issue:** Constants scattered across files

**Action:** Create shared constants file

```typescript
// src/lib/constants.ts

// Generation limits
export const GENERATION_LIMITS = {
  MIN_TOPIC_LENGTH: 3,
  MAX_TOPIC_LENGTH: 500,
  MIN_POST_LENGTH: 10,
  MAX_POST_LENGTH: 5000,
  MAX_OPTIONS_PER_GENERATION: 10,
} as const;

// Tone scale
export const TONE_SCALE = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 5,
  LABELS: {
    1: 'Very Formal',
    3: 'Formal',
    5: 'Balanced',
    7: 'Casual',
    9: 'Very Casual',
  },
} as const;

// Emoji levels
export const EMOJI_LEVELS = {
  NONE: 'none',
  MINIMAL: 'minimal',
  MODERATE: 'moderate',
  RICH: 'rich',
} as const;

// Intent types
export const INTENT_TYPES = {
  VIRAL: 'viral',
  STORYTELLING: 'storytelling',
  EDUCATIONAL: 'educational',
} as const;

// Length options
export const LENGTH_OPTIONS = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
} as const;

// Language options
export const LANGUAGE_OPTIONS = {
  INDONESIAN: 'id',
  ENGLISH: 'en',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  GENERATE: '/api/generate',
  RESEARCH: '/api/research',
  TRANSCRIBE: '/api/transcribe',
  ANALYZE_STYLE: '/api/analyze-style',
} as const;

// Cache TTL
export const CACHE_TTL = {
  TOPICS: 3600,      // 1 hour
  HOOKS: 1800,       // 30 minutes
  BODY: 900,         // 15 minutes
  CTA: 900,          // 15 minutes
  STYLE_PROFILE: 7200, // 2 hours
} as const;

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  GENERATION_ERROR: 'GENERATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// Usage
// src/components/ChatInput.tsx

import { GENERATION_LIMITS, TONE_SCALE, EMOJI_LEVELS } from '@/lib/constants';

const isValidTopic = topic.length >= GENERATION_LIMITS.MIN_TOPIC_LENGTH;
```

**Benefits:**
- Centralized configuration
- Type-safe constants
- Easy to update
- Clear what's constant vs. dynamic

**Estimated Time:** 2-3 hours

---

### Phase 4: Code Quality Improvements (Week 2-3)

#### 4.1 Add TypeScript Strict Mode Enhancements

**Current Issue:** Some `any` types, loose checking

**Action:** Strengthen type safety

```typescript
// tsconfig.json - Already strict, but add these:

{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,              // ✅ Already enabled
    "strictNullChecks": true,           // ✅ Already enabled
    "strictFunctionTypes": true,         // ✅ Already enabled
    "noUnusedLocals": true,            // ✅ Already enabled
    "noUnusedParameters": true,         // ✅ Already enabled
    "exactOptionalPropertyTypes": true,  // ⬅️ ADD
    "noImplicitReturns": true,         // ⬅️ ADD
    "noFallthroughCasesInSwitch": true, // ⬅️ ADD
    "noUncheckedIndexedAccess": true,    // ⬅️ ADD
  }
}
```

**Fix `any` Types:**
```typescript
// Before (src/lib/api-client.ts)
const data: any = await response.json();

// After (src/types/api.ts)
export interface GenerationResponse<T> {
  success: boolean;
  data: T;
  error: APIError | null;
  meta: APIMetadata;
}

// In api-client.ts
const data: GenerationResponse<GeneratedOption[]> = await response.json();

// ---------------------------------------------------------

// Before (src/components/PostGeneratorWizard.tsx)
const [settings, setSettings] = useState<any>({...});

// After (src/types/components.ts)
export interface Settings {
  language: 'id' | 'en';
  emojiLevel: number;
  tone: number;
  researchDepth: number;
  intent: 'viral' | 'storytelling' | 'educational';
  length: 'short' | 'medium' | 'long';
  magicMode: boolean;
}

const [settings, setSettings] = useState<Settings>({...});
```

**Estimated Time:** 4-6 hours

---

#### 4.2 Implement Standard Error Handling

**Current Issue:** Generic try-catch, no error classes

**Action:** Create custom error system

```typescript
// src/types/errors.ts

export class GenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
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

// ---------------------------------------------------------

// src/utils/errorHandler.ts

import { NextResponse } from 'next/server';
import { GenerationError, ValidationError, APIError, RateLimitError } from '@/types/errors';
import { logger } from '@/utils/logger';

export function handleError(error: unknown): NextResponse {
  // Log error with context
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
```

**Estimated Time:** 3-4 hours

---

#### 4.3 Add Input Validation with Zod

**Current Issue:** No schema validation

**Action:** Implement Zod schemas

```typescript
// src/schemas/generation.ts

import { z } from 'zod';

export const TopicInputSchema = z.object({
  idea: z.string()
    .min(GENERATION_LIMITS.MIN_TOPIC_LENGTH, 'Topic must be at least 3 characters')
    .max(GENERATION_LIMITS.MAX_TOPIC_LENGTH, 'Topic cannot exceed 500 characters'),
  researchDepth: z.number()
    .min(1, 'Research depth must be at least 1')
    .max(10, 'Research depth cannot exceed 10')
    .optional()
    .default(3),
  language: z.enum([LANGUAGE_OPTIONS.INDONESIAN, LANGUAGE_OPTIONS.ENGLISH])
    .optional()
    .default(LANGUAGE_OPTIONS.ENGLISH),
});

export const HookInputSchema = z.object({
  topic: z.string()
    .min(GENERATION_LIMITS.MIN_TOPIC_LENGTH)
    .max(GENERATION_LIMITS.MAX_TOPIC_LENGTH),
  intent: z.enum([
    INTENT_TYPES.VIRAL,
    INTENT_TYPES.STORYTELLING,
    INTENT_TYPES.EDUCATIONAL
  ]).optional().default(INTENT_TYPES.VIRAL),
  language: z.enum([
    LANGUAGE_OPTIONS.INDONESIAN,
    LANGUAGE_OPTIONS.ENGLISH
  ]).optional().default(LANGUAGE_OPTIONS.ENGLISH),
});

export const BodyInputSchema = z.object({
  hook: z.string()
    .min(5, 'Hook must be at least 5 characters')
    .max(1000, 'Hook cannot exceed 1000 characters'),
  topic: z.string()
    .min(GENERATION_LIMITS.MIN_TOPIC_LENGTH)
    .max(GENERATION_LIMITS.MAX_TOPIC_LENGTH),
  intent: z.string().optional(),
  length: z.enum([
    LENGTH_OPTIONS.SHORT,
    LENGTH_OPTIONS.MEDIUM,
    LENGTH_OPTIONS.LONG
  ]).optional().default(LENGTH_OPTIONS.MEDIUM),
  tone: z.number()
    .min(TONE_SCALE.MIN)
    .max(TONE_SCALE.MAX)
    .optional()
    .default(TONE_SCALE.DEFAULT),
  emojiLevel: z.enum([
    EMOJI_LEVELS.NONE,
    EMOJI_LEVELS.MINIMAL,
    EMOJI_LEVELS.MODERATE,
    EMOJI_LEVELS.RICH
  ]).optional().default(EMOJI_LEVELS.MODERATE),
  language: z.enum([
    LANGUAGE_OPTIONS.INDONESIAN,
    LANGUAGE_OPTIONS.ENGLISH
  ]).optional().default(LANGUAGE_OPTIONS.ENGLISH),
  styleProfile: z.string().optional(),
  researchContext: z.string().optional(),
});

// Usage
// src/api/generate/route.ts

import { validateRequest } from '@/utils/validation';
import { TopicInputSchema, HookInputSchema, BodyInputSchema } from '@/schemas/generation';

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
      case 'body':
        validated = validateRequest(BodyInputSchema, body);
        break;
    }

    if (validated.error) {
      return NextResponse.json(
        { success: false, error: validated.error },
        { status: 400 }
      );
    }

    // Proceed with validated data
    const result = await orchestrator.generateTopics(validated.data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleError(error);
  }
}
```

**Estimated Time:** 4-6 hours

---

### Phase 5: Code Organization Best Practices (Week 3)

#### 5.1 Establish Barrel Exports (Index Files)

**Goal:** Simplify imports with barrel exports

```typescript
// src/components/ui/index.ts

export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Slider } from './Slider';
export { default as Skeleton } from './Skeleton';
export { default as Modal } from './Modal';
export { default as Toast } from './Toast';

// Usage (instead of individual imports):
import { Button, Card, Input } from '@/components/ui';

// ---------------------------------------------------------

// src/components/features/index.ts

export { default as PostGeneratorWizard } from './post-generator/PostGeneratorWizard';
export { default as StyleOnboarding } from './style-onboarding/StyleOnboarding';
export { default as VoiceInput } from './voice-input/VoiceInput';
export { default as Canvas } from './canvas/Canvas';
export { default as MobileCanvas } from './canvas/MobileCanvas';
export { default as OpikScoreCard } from './analytics/OpikScoreCard';

// Usage:
import { PostGeneratorWizard, StyleOnboarding, VoiceInput } from '@/components/features';

// ---------------------------------------------------------

// src/services/adapters/index.ts

export { GroqAdapter } from './groqAdapter';
export { TavilyAdapter } from './tavilyAdapter';
export { OpikAdapter } from './opikAdapter';
export { type IModelAdapter, type IResearchAdapter, type IObservabilityAdapter } from './interfaces';

// Usage:
import { GroqAdapter, type IModelAdapter } from '@/services/adapters';

// ---------------------------------------------------------

// src/hooks/index.ts

export { usePostGeneration } from './usePostGeneration';
export { useViewportCardCount } from './useViewportCardCount';
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';

// Usage:
import { usePostGeneration, useDebounce } from '@/hooks';

// ---------------------------------------------------------

// src/utils/index.ts

export { JSONParser } from './jsonParser';
export { formatDate } from './formatDate';
export { generateId } from './generateId';
export { classNames } from './classNames';
export { handleError } from './errorHandler';
export { logger } from './logger';
export { validateRequest } from './validation';

// Usage:
import { JSONParser, formatDate, generateId } from '@/utils';
```

**Benefits:**
- Cleaner imports
- Auto-completion from barrel
- Easier to refactor (update index file only)
- Clear public API of each module

**Estimated Time:** 2-3 hours

---

#### 5.2 Standardize Naming Conventions

**Goal:** Consistent naming across codebase

**Rules:**

```typescript
// 1. Files
// - Components: PascalCase (e.g., PostGeneratorWizard.tsx)
// - Utilities: camelCase (e.g., jsonParser.ts)
// - Types: camelCase (e.g., api.ts, errors.ts)
// - Hooks: camelCase starting with 'use' (e.g., usePostGeneration.ts)
// - Constants: camelCase (e.g., constants.ts)

// 2. Components
// - Component name: PascalCase (PostGeneratorWizard)
// - Props interface: [ComponentName]Props (PostGeneratorWizardProps)
// - Export: default export for components
export default function PostGeneratorWizard() { }

// 3. Hooks
// - Hook name: camelCase starting with 'use' (usePostGeneration)
// - Return type: Use[HookName]Return (UsePostGenerationReturn)
export function usePostGeneration(): UsePostGenerationReturn { }

// 4. Types/Interfaces
// - Name: PascalCase (Settings, DeckType, GeneratedOption)
// - Boolean: prefix with 'is' or 'has' (isLoading, hasError)
// - Arrays: plural (topics, options, scores)

// 5. Functions
// - Name: camelCase starting with verb (handleStart, selectTopic, validateRequest)
// - Async functions: no special prefix, clear from return type
async function generateTopics() { }
async function validateRequest() { }

// 6. Constants
// - SCREAMING_SNAKE_CASE for global constants (API_ENDPOINTS, ERROR_CODES)
// - PascalCase for enums/objects (GENERATION_LIMITS, TONE_SCALE)
export const API_ENDPOINTS = { ... };
export const GENERATION_LIMITS = { ... };

// 7. CSS Classes
// - kebab-case for utility classes
// - camelCase for custom Tailwind components
.className="flex items-center gap-4"  // ✅
.className="customContainer"          // ✅
```

**Examples of Fixes:**

```typescript
// Before: Inconsistent
// components/OptionCarousel.tsx
export default function OptionCarousel(options: any, onSelect: Function) { }

// After: Consistent
export interface OptionCarouselProps {
  options: GeneratedOption[];
  onSelect: (option: string) => void;
  onRegenerate: () => void;
}

export default function OptionCarousel(props: OptionCarouselProps) { }

// ---------------------------------------------------------

// Before
const [isLoading, setIsLoading] = useState(false);

// After
const [isLoading, setIsLoading] = useState(false);  // ✅ Already good
```

**Estimated Time:** 2-3 hours (review + rename)

---

#### 5.3 Add Documentation with JSDoc

**Goal:** Self-documenting code

```typescript
// src/components/ui/Button.tsx

/**
 * Primary button component with multiple variants
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 * 
 * @param props - Button properties
 * @param props.children - Button content
 * @param props.variant - Visual style ('primary', 'secondary', 'ghost', 'destructive')
 * @param props.onClick - Click handler
 * @param props.disabled - Disabled state
 * @param props.loading - Show loading state
 * @returns JSX.Element
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * Primary button component
 * 
 * Supports loading state, multiple variants, and full TypeScript typing
 */
export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = ''
}: ButtonProps): JSX.Element {
  // Implementation
}

// ---------------------------------------------------------

// src/services/adapters/groqAdapter.ts

/**
 * Groq Adapter - Implements IModelAdapter for Groq LLM
 * 
 * Provides methods for generating topics, hooks, body, CTA, and polishing content
 * using Groq's fast inference API.
 * 
 * @example
 * ```typescript
 * const adapter = new GroqAdapter(apiKey, 'llama-3.3-70b-versatile');
 * const topics = await adapter.generateTopics({ idea: 'AI productivity' });
 * ```
 */
export class GroqAdapter implements IModelAdapter {
  readonly name = 'Groq';
  readonly version = 'llama-3.3-70b-versatile';
  
  private client: Groq;
  private model: string;

  /**
   * Creates a new Groq adapter instance
   * 
   * @param apiKey - Groq API key
   * @param model - Model to use (default: llama-3.3-70b-versatile)
   */
  constructor(apiKey: string, model: string = 'llama-3.3-70b-versatile') {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  /**
   * Generate topic options for a given idea
   * 
   * @param input - Topic generation parameters
   * @param context - Optional trace context for observability
   * @returns Array of generated topic options with scores
   */
  async generateTopics(
    input: TopicInput,
    context?: TraceContext
  ): Promise<GeneratedOption[]> {
    // Implementation
  }

  /**
   * Check if Groq API is accessible
   * 
   * @returns True if health check passes
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.chat.completions.create({
        messages: [{ role: 'user', content: 'Hi' }],
        model: this.model,
        max_tokens: 1
      });
      return true;
    } catch {
      return false;
    }
  }
}

// ---------------------------------------------------------

// src/utils/jsonParser.ts

/**
 * Robust JSON parser with multiple fallback strategies
 * 
 * Handles various JSON formats returned by LLMs:
 * - Markdown code blocks (```json)
 * - Mixed uppercase/lowercase keys
 * - Array vs object wrappers
 * - Malformed JSON
 * 
 * @class
 */
export class JSONParser {
  /**
   * Parse generated content with multiple strategies
   * 
   * @param content - Raw content from LLM
   * @param expectedType - Expected output type ('array' or 'object')
   * @returns Parsed and validated GeneratedOption array
   * 
   * @example
   * ```typescript
   * const options = JSONParser.parseGeneratedContent(llmResponse, 'array');
   * // Returns: [{ content: 'Option 1', score: 85 }, ...]
   * ```
   */
  static parseGeneratedContent(
    content: string,
    expectedType: 'array' | 'object'
  ): GeneratedOption[] {
    // Implementation
  }
}
```

**Estimated Time:** 6-8 hours (document all major modules)

---

#### 5.4 Add Prettier Configuration

**Goal:** Consistent code formatting

```bash
# Install Prettier
npm install -D prettier prettier-plugin-tailwindcss

# Create .prettierrc
```

```json
// .prettierrc

{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js",
  "tailwindFunctions": ["cn", "cls"]
}
```

```json
// .prettierignore

node_modules
.next
out
build
coverage
*.md
package-lock.json
pnpm-lock.yaml
yarn.lock
```

```json
// package.json - Add scripts

{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Estimated Time:** 1 hour

---

### Phase 6: Performance & Optimization (Week 3-4)

#### 6.1 Implement Code Splitting

**Goal:** Reduce initial bundle size

```typescript
// src/app/page.tsx

import dynamic from 'next/dynamic';

// Lazy load heavy components
const PostGeneratorWizard = dynamic(
  () => import('@/components/features/post-generator/PostGeneratorWizard'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading generator...</div>
      </div>
    ),
    ssr: false // Client-side only
  }
);

const StyleOnboarding = dynamic(
  () => import('@/components/features/style-onboarding/StyleOnboarding'),
  { ssr: false }
);

const SettingsPanel = dynamic(
  () => import('@/components/layout/SettingsPanel'),
  { ssr: false }
);

// Light components load normally
import { Button, Card } from '@/components/ui';

export default function Home() {
  return (
    <div>
      <PostGeneratorWizard />
      <StyleOnboarding />
    </div>
  );
}
```

**Estimated Time:** 2-3 hours

---

#### 6.2 Add React Performance Optimizations

**Goal:** Reduce unnecessary re-renders

```typescript
// src/components/features/post-generator/BuildingPhase.tsx

import { memo, useCallback, useMemo } from 'react';

// Memoize the entire component
export default memo(function BuildingPhase({
  deck,
  hand,
  onSelect,
  onRegenerate,
  onBack
}: BuildingPhaseProps) {
  // Memoize expensive calculations
  const totalPages = useMemo(
    () => Math.ceil((hand.options?.length || 0) / itemsPerPage),
    [hand.options, itemsPerPage]
  );

  const currentOptions = useMemo(
    () => (hand.options || []).slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ),
    [hand.options, currentPage, itemsPerPage]
  );

  // Memoize handlers
  const handleSelect = useCallback((option: string) => {
    onSelect(option);
  }, [onSelect]);

  const handleRegenerate = useCallback(() => {
    onRegenerate();
  }, [onRegenerate]);

  return (
    <div>
      {/* Render options */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.deck === nextProps.deck &&
    prevProps.hand === nextProps.hand
  );
});

// ---------------------------------------------------------

// src/components/ui/Button.tsx

import { memo } from 'react';

export const Button = memo(function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = ''
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
});
```

**Estimated Time:** 4-6 hours

---

#### 6.3 Add Lazy Loading for Images

**Goal:** Optimize image loading

```typescript
// src/components/ui/Avatar.tsx

import Image from 'next/image';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

export default function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={sizeMap[size]}
      height={sizeMap[size]}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8BAAzA7+q9jzA8=" // Tiny placeholder
    />
  );
}
```

**Estimated Time:** 2-3 hours

---

## Migration Checklist

### Phase 1: Structure Cleanup
- [ ] Create new directory structure in src/
- [ ] Move components to src/components/
- [ ] Move hooks to src/hooks/
- [ ] Move lib/* to src/lib/
- [ ] Delete old /components/, /hooks/, /lib/ directories
- [ ] Update all import paths
- [ ] Verify build succeeds

### Phase 2: Component Extraction
- [ ] Extract InputPhase from PostGeneratorWizard
- [ ] Extract BuildingPhase from PostGeneratorWizard
- [ ] Extract ConfirmationPhase from PostGeneratorWizard
- [ ] Extract ResultPhase from PostGeneratorWizard
- [ ] Create usePostGeneration hook
- [ ] Update PostGeneratorWizard to use new structure
- [ ] Test all phases work correctly

### Phase 3: Code Deduplication
- [ ] Create src/utils/jsonParser.ts
- [ ] Update GroqAdapter to use jsonParser
- [ ] Update any other files with JSON parsing
- [ ] Create src/lib/constants.ts
- [ ] Move constants from various files to constants.ts
- [ ] Update files to import from constants

### Phase 4: Code Quality
- [ ] Fix all `any` types
- [ ] Create src/types/errors.ts
- [ ] Create src/utils/errorHandler.ts
- [ ] Create src/utils/logger.ts
- [ ] Update API routes to use error handler
- [ ] Create src/schemas/generation.ts
- [ ] Add validation to all API routes

### Phase 5: Best Practices
- [ ] Create index.ts (barrel exports) for all directories
- [ ] Review and standardize naming conventions
- [ ] Add JSDoc to all public APIs
- [ ] Install and configure Prettier
- [ ] Add format scripts to package.json

### Phase 6: Performance
- [ ] Implement code splitting with dynamic imports
- [ ] Add React.memo to child components
- [ ] Add useMemo to expensive calculations
- [ ] Add useCallback to event handlers
- [ ] Optimize image loading with Next/Image

---

## Success Metrics

### Code Quality Metrics

| Metric | Current | Target | Measurement |
|--------|----------|---------|-------------|
| **Average File Size** | 200-300 lines | < 150 lines | File size analysis |
| **Largest Component** | 657 lines | < 200 lines | Find large files |
| **Duplicate Code** | ~500 lines | < 50 lines | Code similarity analysis |
| **TypeScript Coverage** | ~70% | > 95% | tsc --noEmit |
| **Test Coverage** | ~15% | > 60% | Jest coverage |
| **Bundle Size** | ~500 KB | < 300 KB | Bundle analyzer |

### Developer Experience Metrics

| Metric | Current | Target | Measurement |
|--------|----------|---------|-------------|
| **Import Time** | Moderate | < 500ms | Build time |
| **Hot Reload** | ~2s | < 1s | Dev experience |
| **Auto-completion** | Partial | Full | IDE experience |
| **Documentation Coverage** | ~30% | > 80% | JSDoc coverage |

### Maintainability Metrics

| Metric | Current | Target | Measurement |
|--------|----------|---------|-------------|
| **Cyclomatic Complexity** | High | Low | ESLint complexity |
| **Code Smells** | Multiple | None | SonarQube |
| **Technical Debt** | High | Low | Developer feedback |
| **Onboarding Time** | 2-3 days | < 1 day | New hire time |

---

## Potential Risks & Mitigations

### Risk 1: Breaking Changes from File Moves

**Risk:** Imports break, build fails

**Mitigation:**
- Use `@/` path aliases (already configured)
- Move all files at once
- Update imports systematically
- Run build and tests after each phase

### Risk 2: Component Extraction Bugs

**Risk:** New components don't work together

**Mitigation:**
- Extract one phase at a time
- Test thoroughly before proceeding
- Keep old code commented out initially
- Have rollback plan

### Risk 3: Performance Overhead

**Risk:** Too many React.memo/useMemo/memo hurts performance

**Mitigation:**
- Profile before and after
- Only optimize hot paths
- Remove unnecessary optimizations
- Use React DevTools Profiler

### Risk 4: Type Errors from Strict Mode

**Risk:** Too many TypeScript errors

**Mitigation:**
- Add strict checks incrementally
- Fix errors in batches
- Use `@ts-expect-error` for truly unavoidable cases
- Document exceptions

---

## Implementation Timeline

### Week 1: Structure Cleanup (16-20 hours)
- Day 1-2: Move components to src/
- Day 3: Move hooks and lib to src/
- Day 4-5: Remove legacy code, update imports

### Week 2: Component Extraction & Deduplication (20-24 hours)
- Day 1-2: Extract phases from PostGeneratorWizard
- Day 3: Create usePostGeneration hook
- Day 4: Create jsonParser utility
- Day 5: Create constants file

### Week 3: Code Quality (16-20 hours)
- Day 1-2: Fix TypeScript issues, add error handling
- Day 3-4: Add Zod validation, create barrel exports

### Week 4: Performance & Polish (12-16 hours)
- Day 1-2: Add code splitting, performance optimizations
- Day 3-4: Documentation, formatting, final testing

**Total Estimated Time:** 64-80 hours (8-10 business days)

---

## Before & After Comparison

### Before

```typescript
// File: components/PostGeneratorWizard.tsx (657 lines)
// Issues:
// - Mixed concerns (UI + logic + data)
// - No separation of phases
// - Duplicate state management
// - Hard to test
// - No documentation

export default function PostGeneratorWizard() {
  const [phase, setPhase] = useState<any>('input');
  const [deck, setDeck] = useState<any>({...});
  const [hand, setHand] = useState<any>({...});
  
  // ... 600 more lines of mixed code
}

// File: lib/ai-service.ts (743 lines)
// Issues:
// - Legacy code
// - Duplicate JSON parsing
// - No clear structure
// - Dead code
```

### After

```typescript
// File: src/components/features/post-generator/PostGeneratorWizard.tsx (~150 lines)
// Benefits:
// - Pure orchestration
// - Clear phase separation
// - Logic in hook
// - Easy to test
// - Documented

import { usePostGeneration } from '@/hooks/usePostGeneration';
import { InputPhase, BuildingPhase, ConfirmationPhase, ResultPhase } from './';

export default function PostGeneratorWizard() {
  const {
    phase, deck, hand, settings,
    handleStart, selectTopic, selectHook, selectBody, selectCTA
  } = usePostGeneration();

  return (
    <>
      {phase === 'input' && <InputPhase onStart={handleStart} />}
      {phase === 'building' && <BuildingPhase {...} />}
      {phase === 'confirm' && <ConfirmationPhase {...} />}
      {phase === 'result' && <ResultPhase {...} />}
    </>
  );
}

// File: src/hooks/usePostGeneration.ts (~150 lines)
// Benefits:
// - Isolated logic
// - Testable
// - Reusable
// - Type-safe

// File: src/utils/jsonParser.ts (~100 lines)
// Benefits:
// - Single source of truth
// - Documented
// - Tested
// - No duplicates

// File: src/lib/constants.ts (~100 lines)
// Benefits:
// - Centralized
// - Type-safe
// - Easy to update
// - Clear naming
```

---

## Conclusion

This clean code plan provides a comprehensive roadmap for transforming AlterEgo's codebase into a maintainable, scalable, and developer-friendly codebase. By following this plan, we will:

1. **Eliminate technical debt** through structure cleanup and legacy code removal
2. **Improve maintainability** with smaller, focused components
3. **Increase code quality** through type safety, validation, and error handling
4. **Enhance performance** through code splitting and React optimizations
5. **Establish best practices** through naming conventions, documentation, and formatting

The phased approach allows for incremental improvements while maintaining system stability. Each phase builds on the previous one, ensuring that the codebase is always in a working state.

**Key recommendations for immediate action:**
1. Start with structure cleanup (quickest win, biggest impact)
2. Extract components while they're fresh in memory
3. Create reusable utilities to eliminate duplication
4. Add type safety and validation to prevent future bugs
5. Document as you go—don't leave it for later

By following this plan, the codebase will be production-ready and easy to extend for future features outlined in the future implementation plan.
