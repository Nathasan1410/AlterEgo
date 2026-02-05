# Code Style Guidelines

## Overview

Following consistent code style and conventions is crucial for maintaining a clean, readable, and maintainable codebase. This guide covers best practices for AlterEgo.

## File Naming

### File Extensions

```
TypeScript: .ts
React Components: .tsx
Styles: .css
Markdown: .md
Configuration: .json
Environment: .env
```

### Naming Conventions

| Type | Format | Example |
|--------|---------|----------|
| Components | PascalCase | `Button.tsx`, `PostGeneratorWizard.tsx` |
| Utilities | camelCase | `jsonParser.ts`, `apiResponse.ts` |
| Types | camelCase | `generated.ts`, `api.ts`, `errors.ts` |
| Services | camelCase | `groqAdapter.ts`, `tavilyAdapter.ts` |
| Hooks | camelCase + 'use' prefix | `usePostGeneration.ts`, `useViewportCardCount.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_TOKENS`, `DEFAULT_TEMPERATURE` |
| Directories | kebab-case | `components/`, `services/`, `utils/` |

### Examples

```typescript
// ✅ Good
import { Button } from '@/components/ui/Button';
import { usePostGeneration } from '@/hooks/usePostGeneration';
import { GenerationOrchestrator } from '@/services/orchestration';

// ❌ Bad
import Button from '@/components/ui/Button';
import usePostGeneration from '@/hooks/usePostGeneration';
import GenerationOrchestrator from '@/services/orchestration/GenerationOrchestrator';
```

## TypeScript Conventions

### Strict Mode

All TypeScript files use strict mode:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Type Definitions

#### Interfaces vs Types

```typescript
// ✅ Use interfaces for objects
interface UserInput {
  input: string;
  researchDepth?: number;
}

interface GeneratedOption {
  content: string;
  score: number;
  reasoning: string;
}

// ✅ Use types for unions
type GenerationType = 'topics' | 'hooks' | 'body' | 'cta' | 'polish' | 'complete';

// ✅ Use types for primitives when needed
type TopicScore = number;
```

#### Type Imports

```typescript
// ✅ Import types from types file
import { GeneratedOption, TopicInput } from '@/types/generated';

// ❌ Don't define types inline
// Bad: Defining types inline makes code harder to maintain
```

### Generic Types

```typescript
// ✅ Good - Use generics for reusable functions
async function fetchData<T>(
  url: string,
  defaultValue: T
): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data as T;
}

// Usage
const topics = await fetchData<GeneratedOption[]>('/api/generate', []);
```

## React Conventions

### Component Structure

```typescript
// ✅ Good component structure
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import type { GeneratedOption } from '@/types/generated';

interface PostGeneratorProps {
  onNext: (data: any) => void;
  loading?: boolean;
}

export function PostGenerator({ onNext, loading = false }: PostGeneratorProps) {
  const [selected, setSelected] = useState<GeneratedOption | null>(null);

  const handleNext = useCallback(() => {
    if (selected) {
      onNext({ selected });
    }
  }, [selected, onNext]);

  return (
    <div className="post-generator">
      {/* JSX */}
    </div>
  );
}
```

### Hooks

```typescript
// ✅ Good hook structure
import { useState, useEffect, useCallback } from 'react';
import { GeneratedOption } from '@/types/generated';

export function usePostGeneration() {
  const [topics, setTopics] = useState<GeneratedOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTopics = useCallback(async (input: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'topics', input }),
      });

      const data = await response.json();

      if (data.success) {
        setTopics(data.data.result);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to generate topics');
    } finally {
      setLoading(false);
    }
  }, []);

  return { topics, loading, error, generateTopics };
}
```

### Props Type Safety

```typescript
// ✅ Define props interface explicitly
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

// ✅ Use React.FC or function with typed props
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant} ${className}`}
    >
      {children}
    </button>
  );
};
```

## Code Organization

### Imports

```typescript
// ✅ Good imports - grouped and organized
// External libraries
import { useState, useEffect } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Internal modules
import { Button } from '@/components/ui/Button';
import { usePostGeneration } from '@/hooks/usePostGeneration';
import { GeneratedOption } from '@/types/generated';
import { logger } from '@/utils/logger';

// Types
import type { IModelAdapter, IResearchAdapter } from '@/services/adapters/interfaces';
```

### Export Statements

```typescript
// ✅ Good - named exports from index.ts
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { Select } from './Select';

// ❌ Bad - re-exports from individual files
// components/ui/Button.ts
export * from './Button'; // Don't re-export everything
```

## Naming Conventions

### Variables

```typescript
// ✅ Good - descriptive camelCase
const userTopic = 'AI productivity';
const generatedTopics = await generateTopics(input);
const averageScore = topics.reduce((sum, t) => sum + t.score, 0) / topics.length;

// ❌ Bad - unclear names
const x = '...';
const res = await gen(inp);
const avg = r.reduce((a, b) => a + b.s, 0) / r.length;
```

### Functions

```typescript
// ✅ Good - descriptive verb-noun
function generateTopics(input: string): Promise<GeneratedOption[]> { }

function calculateAverageScore(scores: number[]): number { }

function parseJSONResponse(content: string): GeneratedOption[] { }

// ❌ Bad - unclear functions
function gen(inp: string) { }

function calc(s: number[]): number { }

function parse(content: string): any { }
```

### Constants

```typescript
// ✅ Good - UPPER_SNAKE_CASE with descriptive names
export const MAX_TOKENS = 4096;
export const DEFAULT_TEMPERATURE = 0.8;
export const CACHE_TTL = 3600; // 1 hour in seconds
export const GENERATION_COUNTS = {
  TOPICS: 6,
  HOOKS: 3,
  BODY: 2,
  CTA: 4,
};
```

## Comments

### When to Comment

```typescript
// ✅ Comment complex algorithms
// Quick Sort with O(n log n) time complexity
quickSort(array);

// ✅ Comment business logic
// Cache results to avoid expensive API calls
const cached = await this.cache.get(key);
if (cached) return cached;

// ❌ Don't comment obvious code
// Increment index
i++;

// ❌ Don't comment out code instead of deleting
// const oldCode = ...; // TODO: Remove
```

### Comment Style

```typescript
// ✅ Good comments
/**
 * Generates LinkedIn topics based on user input
 * @param input - User's topic idea
 * @returns Array of generated topic options
 */
async function generateTopics(input: string): Promise<GeneratedOption[]> {
  // Validate input before generation
  if (!input || input.trim().length === 0) {
    throw new ValidationError('Input is required', 'input', input);
  }

  // Generate topics using Groq adapter
  const topics = await groqAdapter.generateTopics({ input });

  return topics;
}

// ❌ Bad comments
// gen function
function gen(inp: string) {
  // do stuff
}
```

## Error Handling

### Custom Error Classes

```typescript
// src/types/errors.ts
export class GenerationError extends Error {
  constructor(
    message: string,
    code: string,
    details?: any
  ) {
    super(message);
    this.name = 'GenerationError';
    this.code = code;
    this.details = details;
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    status: number,
    code: string
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    field: string,
    value: any
  ) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}
```

### Error Handling Pattern

```typescript
// ✅ Good error handling
try {
  const result = await groqAdapter.generateTopics(input);

  // Validate result
  if (!result || result.length === 0) {
    throw new GenerationError(
      'No topics generated',
      'NO_TOPICS',
      { input }
    );
  }

  return result;
} catch (error) {
  // Log error with context
  logger.error('Failed to generate topics', error, { input });

  // Re-throw with context
  throw new GenerationError(
    'Failed to generate topics',
    'GENERATION_FAILED',
    { originalError: error, input }
  );
}
```

## Async/Await

### Async Functions

```typescript
// ✅ Good async/await
async function processGeneration(input: TopicInput) {
  // Run independent operations in parallel
  const [topics, hooks] = await Promise.all([
    groqAdapter.generateTopics(input),
    groqAdapter.generateHooks(input),
  ]);

  // Run dependent operations sequentially
  const body = await groqAdapter.generateBody({
    hook: hooks[0].content,
    topic: input.input,
  });

  return { topics, hooks, body };
}

// ❌ Bad - mixing promise chains and await
async function bad(input) {
  const topics = groqAdapter.generateTopics(input)
    .then(t => groqAdapter.generateHooks(t))
    .catch(e => handleError(e));
}
```

## Import Paths

### Absolute vs Relative Imports

```typescript
// ✅ Good - use path aliases (@/)
import { Button } from '@/components/ui/Button';
import { usePostGeneration } from '@/hooks/usePostGeneration';
import { GeneratedOption } from '@/types/generated';

// ❌ Bad - relative imports
import { Button } from '../../../components/ui/Button';
import { usePostGeneration } from '../../hooks/usePostGeneration';

// tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Styling

### Tailwind CSS

```typescript
// ✅ Good - utility classes with responsive design
<div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">
    {title}
  </h2>
  <p className="text-base text-gray-700 leading-relaxed">
    {content}
  </p>
  <Button variant="primary" onClick={handleClick}>
    Generate
  </Button>
</div>

// ❌ Bad - inline styles or !important
<div style={{ color: 'blue', fontSize: '16px', fontWeight: 'bold' }}>
  {title}
</div>
```

### Component Styling

```typescript
// ✅ Good - accept className prop
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`card bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

// Usage
<Card className="p-6 hover:bg-gray-50">
  {content}
</Card>
```

## Performance

### React Performance

```typescript
// ✅ Good - use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} />)}</div>;
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});

// ✅ Good - use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    processed: expensiveOperation(item),
  }));
}, [data]);

// ✅ Good - use useCallback for event handlers
const handleClick = useCallback(() => {
  onOptionSelect(option);
}, [onOptionSelect, option]);
```

### Code Splitting

```typescript
// ✅ Good - dynamic imports for heavy components
import dynamic from 'next/dynamic';

const VoiceInput = dynamic(() => import('@/components/features/voice-input/VoiceInput'), {
  loading: () => <div>Loading voice input...</div>,
  ssr: false,
});

// Usage in component
<VoiceInput />
```

## Testing

### Test Organization

```typescript
// ✅ Good test structure
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button onClick={jest.fn()}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={jest.fn()} disabled>Click Me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Test Naming

```typescript
// ✅ Good - descriptive test names
it('should generate topics successfully', async () => {});
it('should return empty array when input is empty', async () => {});
it('should throw error when API key is invalid', async () => {});
```

## OPIK Integration Patterns

### Tracing

```typescript
// ✅ Good - consistent trace naming
const trace = opik.trace({
  name: 'Generate_Topics',
  input: { topic: input },
  tags: ['orchestrator', 'topics', 'groq'],
  metadata: {
    userId: userId,
    timestamp: Date.now(),
  }
});

// Start span for API call
const groqSpan = trace.span('Groq_API_Call', 'llm');

// Generate topics
const topics = await groqAdapter.generateTopics(input);

// End span
groqSpan.end({ output: topics, tokens: usage.total_tokens });

// End trace
trace.end({ output: topics, duration: Date.now() - startTime });
```

### Evaluation Logging

```typescript
// ✅ Good - log evaluations with context
this.observabilityAdapter.logEvaluation(
  { topic: input }, // Original input
  result.content,        // Generated output
  evaluations,          // Quality scores
);

// Evaluation result structure
{
  metricName: 'Virality Prediction',
  score: 0.85,
  reasoning: 'Strong hook, storytelling elements, and call-to-action presence',
}
```

## Documentation

### JSDoc Comments

```typescript
// ✅ Good JSDoc
/**
 * Generates LinkedIn post topics based on user input
 *
 * @param input - User's topic idea
 * @param researchDepth - Depth of web research (1-5)
 * @returns Promise resolving to array of generated topic options
 *
 * @example
 * ```typescript
 * const topics = await generateTopics({
 *   input: 'AI productivity',
 *   researchDepth: 3,
 * });
 * ```
 *
 * @throws {GenerationError} When generation fails
 * @throws {ValidationError} When input is invalid
 */
async function generateTopics(
  input: TopicInput
): Promise<GeneratedOption[]> {
  // Implementation
}
```

## Code Review Checklist

- [ ] File follows naming conventions
- [ ] TypeScript strict mode enabled
- [ ] No `any` types used (unless necessary)
- [ ] Props interfaces defined for components
- [ ] Error handling implemented
- [ ] Logging added for important operations
- [ ] OPIK traces added for AI operations
- [ ] Tests written for critical functions
- [ ] Code is readable and well-commented
- [ ] No commented out code
- [ ] No console.log in production code
- [ ] Environment variables not hardcoded
- [ ] Secrets not committed to git

## Linting Rules

AlterEgo uses ESLint with Next.js config:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    '@typescript-eslint/recommended',
  ],
  rules: {
    // Custom rules can be added here
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_' 
    }],
    'no-console': ['warn', { 
      allow: ['warn', 'error'] 
    }],
  },
};
```

## Best Practices Summary

### Do's ✅

1. ✅ Use TypeScript strict mode
2. ✅ Define interfaces for props and return types
3. ✅ Use descriptive naming (camelCase for variables, PascalCase for types)
4. ✅ Implement proper error handling
5. ✅ Add OPIK traces for all AI operations
6. ✅ Use React hooks correctly (useState, useEffect, useCallback, useMemo)
7. ✅ Optimize performance with memoization
8. ✅ Write tests for critical functions
9. ✅ Add JSDoc comments for public APIs
10. ✅ Follow consistent formatting with Prettier

### Don'ts ❌

1. ❌ Don't use `any` type unnecessarily
2. ❌ Don't ignore TypeScript errors
3. ❌ Don't use relative imports
4. ❌ Don't write inline styles (use Tailwind)
5. ❌ Don't comment out code (delete it instead)
6. ❌ Don't commit API keys or secrets
7. ❌ Don't ignore error handling
8. ❌ Don't use console.log in production code
9. ❌ Don't create overly complex functions
10. ❌ Don't skip writing tests

## Resources

### Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OPIK AI Documentation](https://docs.opik.ai/)

### Tools

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Husky](https://typicode.github.io/husky/)

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**
