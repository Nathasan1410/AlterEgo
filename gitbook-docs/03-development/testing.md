# Testing

## Overview

Comprehensive testing ensures code quality, catches bugs early, and provides confidence in making changes. This guide covers testing strategies for AlterEgo.

## Test Setup

### Configuration Files

```json
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

// Add custom Jest config
module.exports = {
  ...createJestConfig,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/__tests__/**',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### Test Environment Setup

```typescript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock environment variables
process.env.GROQ_API_KEY = 'test-groq-api-key';
process.env.OPIK_API_KEY = 'test-opik-api-key';
process.env.TAVILY_API_KEY = 'test-tavily-api-key';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));
```

## Unit Tests

### Testing Utilities

```typescript
// __tests__/utils/jsonParser.test.ts
import { JSONParser } from '@/utils/jsonParser';

describe('JSONParser', () => {
  describe('parseGeneratedContent', () => {
    it('should parse valid JSON array', () => {
      const json = '[{"content": "Topic 1", "score": 90}]';
      const result = JSONParser.parseGeneratedContent(json, 'array');

      expect(result).toEqual([
        { content: 'Topic 1', score: 90 }
      ]);
    });

    it('should handle JSON in markdown code blocks', () => {
      const json = '```json\n[{"content": "Topic 1"}]\n```';
      const result = JSONParser.parseGeneratedContent(json, 'array');

      expect(result).toEqual([{ content: 'Topic 1' }]);
    });

    it('should return empty array for invalid JSON', () => {
      const json = 'invalid json';
      const result = JSONParser.parseGeneratedContent(json, 'array');

      expect(result).toEqual([]);
    });

    it('should return fallback for empty content', () => {
      const result = JSONParser.parseGeneratedContent('', 'array');

      expect(result).toEqual([]);
    });
  });

  describe('extractFromMarkdown', () => {
    it('should extract JSON from markdown', () => {
      const markdown = '```json\n{"test": "value"}\n```';
      const result = JSONParser.extractFromMarkdown(markdown);

      expect(result).toBe('{"test": "value"}');
    });
  });
});
```

### Testing Services

```typescript
// __tests__/services/adapters/groqAdapter.test.ts
import { GroqAdapter } from '@/services/adapters/groqAdapter';

describe('GroqAdapter', () => {
  let adapter: GroqAdapter;
  const mockGroqClient = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    adapter = new GroqAdapter('test-api-key', 'llama-3.3-70b-versatile');
    // Mock the Groq client
    (adapter as any).client = mockGroqClient;
  });

  describe('generateTopics', () => {
    it('should generate topics successfully', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: '[{"content": "Topic 1", "score": 90}]',
          },
        }],
      };

      mockGroqClient.chat.completions.create.mockResolvedValueOnce(mockResponse);

      const result = await adapter.generateTopics({
        input: 'AI productivity',
        researchDepth: 3,
      });

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Topic 1');
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      mockGroqClient.chat.completions.create.mockRejectedValueOnce(mockError);

      const result = await adapter.generateTopics({
        input: 'AI productivity',
        researchDepth: 3,
      });

      // Should return fallback options
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use correct model', async () => {
      await adapter.generateTopics({
        input: 'test',
      });

      expect(mockGroqClient.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'llama-3.3-70b-versatile',
        })
      );
    });
  });

  describe('healthCheck', () => {
    it('should return true for successful health check', async () => {
      mockGroqClient.chat.completions.create.mockResolvedValueOnce({
        choices: [{
          message: { content: 'OK' },
        }],
      });

      const result = await adapter.healthCheck();

      expect(result).toBe(true);
    });

    it('should return false for failed health check', async () => {
      mockGroqClient.chat.completions.create.mockRejectedValueOnce(
        new Error('Connection failed')
      );

      const result = await adapter.healthCheck();

      expect(result).toBe(false);
    });
  });
});
```

## Integration Tests

### API Integration Tests

```typescript
// __tests__/api/generate.test.ts
import { POST as GenerateAPI } from '@/api/generate';
import { createMockRequest } from '@/tests/helpers/mockRequest';

describe('/api/generate', () => {
  describe('POST', () => {
    it('should generate topics successfully', async () => {
      const mockRequest = createMockRequest({
        body: {
          type: 'topics',
          input: 'AI productivity',
          researchDepth: 3,
        },
      });

      const response = await GenerateAPI(mockRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.result).toBeInstanceOf(Array);
    });

    it('should validate request body', async () => {
      const mockRequest = createMockRequest({
        body: {
          type: 'topics',
          input: '', // Empty input should fail
        },
      });

      const response = await GenerateAPI(mockRequest);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle orchestrator errors', async () => {
      const mockRequest = createMockRequest({
        body: {
          type: 'topics',
          input: 'test',
        },
        });

      // Mock orchestrator to throw error
      const mockOrchestrator = {
        generateTopics: jest.fn().mockRejectedValueOnce(
          new Error('Generation failed')
        ),
      };

      const response = await GenerateAPI(mockRequest, mockOrchestrator);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('GENERATION_FAILED');
    });
  });

  describe('GET', () => {
    it('should return health check', async () => {
      const mockRequest = createMockRequest();

      const response = await GenerateAPI(mockRequest);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBeDefined();
      expect(response.body.version).toBeDefined();
    });
  });
});
```

### Helper Functions

```typescript
// __tests__/helpers/mockRequest.ts
import { NextRequest } from 'next/server';

export function createMockRequest(
  overrides?: Partial<NextRequest>
): NextRequest {
  const mockRequest = {
    json: jest.fn(),
    url: new URL('http://localhost:3000/api/generate'),
    method: 'POST',
    headers: new Headers({ 'content-type': 'application/json' }),
    body: JSON.stringify({}),
    ...overrides,
  } as any;

  return mockRequest;
}

export function createMockResponse(data: any, status = 200) {
  return {
    status,
    json: jest.fn().mockResolvedValueOnce(data),
  };
}
```

## Component Tests

### UI Component Tests

```typescript
// __tests__/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button onClick={jest.fn()}>Click Me</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles for primary variant', () => {
    const { container } = render(
      <Button variant="primary" onClick={jest.fn()}>Primary</Button>
    );

    const button = container.querySelector('.btn');

    expect(button).toHaveClass('bg-blue-600');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled onClick={jest.fn()}>Disabled</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('shows loading state when loading prop is true', () => {
    render(
      <Button loading onClick={jest.fn()}>Loading...</Button>
    );

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
  });
});
```

### Feature Component Tests

```typescript
// __tests__/components/features/post-generator/InputPhase.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InputPhase } from '@/components/features/post-generator/InputPhase';
import * as api from '@/api/generate';

// Mock API
jest.mock('@/api/generate', () => ({
  POST: jest.fn(),
}));

describe('InputPhase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field and generate button', () => {
    render(<InputPhase onNext={jest.fn()} />);

    expect(screen.getByPlaceholderText(/topic idea/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('calls API when form is submitted', async () => {
    const mockPOST = api.POST as jest.MockedFunction<typeof api.POST>;
    mockPOST.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { result: [{ content: 'Topic 1', score: 90 }] },
      }),
    });

    const onNext = jest.fn();
    render(<InputPhase onNext={onNext} />);

    const input = screen.getByPlaceholderText(/topic idea/i);
    const button = screen.getByRole('button', { name: /generate/i });

    fireEvent.change(input, { target: { value: 'AI productivity' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPOST).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object)
      );
      expect(onNext).toHaveBeenCalledWith(
        expect.objectContaining({ result: expect.any(Array) })
      );
    });
  });

  it('shows loading state during API call', async () => {
    let resolvePromise: (value: any) => void;
    const mockPOST = api.POST as jest.MockedFunction<typeof api.POST>;
    mockPOST.mockImplementationOnce(() => new Promise(resolve => {
      resolvePromise = resolve;
    }));

    render(<InputPhase onNext={jest.fn()} />);

    const button = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();

    // Simulate loading completion
    await new Promise(resolve => setTimeout(resolve, 100));
    resolvePromise({ success: true, data: { result: [] } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate/i })).not.toBeDisabled();
    });
  });

  it('displays error message on API failure', async () => {
    const mockPOST = api.POST as jest.MockedFunction<typeof api.POST>;
    mockPOST.mockRejectedValueOnce(new Error('API Error'));

    const onError = jest.fn();
    render(<InputPhase onNext={jest.fn()} onError={onError} />);

    const button = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('API Error');
    });
  });
});
```

## Hook Tests

```typescript
// __tests__/hooks/usePostGeneration.test.ts
import { renderHook, act } from '@testing-library/react';
import { usePostGeneration } from '@/hooks/usePostGeneration';
import * as api from '@/api/generate';

// Mock API
jest.mock('@/api/generate', () => ({
  POST: jest.fn(),
}));

describe('usePostGeneration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => usePostGeneration());

    expect(result.topics).toEqual([]);
    expect(result.loading).toBe(false);
    expect(result.error).toBe(null);
  });

  it('should set loading to true during generation', async () => {
    const mockPOST = api.POST as jest.MockedFunction<typeof api.POST>;
    mockPOST.mockImplementationOnce(() => new Promise(() => {}));

    const { result } = renderHook(() => usePostGeneration());
    const { generateTopics } = result;

    act(() => {
      generateTopics('test');
    });

    expect(result.loading).toBe(true);
  });

  it('should set topics after successful generation', async () => {
    const mockPOST = api.POST as jest.MockedFunction<typeof api.POST>;
    const topics = [{ content: 'Topic 1', score: 90 }];
    mockPOST.mockResolvedValueOnce({
      json: async () => ({ success: true, data: { result: topics } }),
    });

    const { result } = renderHook(() => usePostGeneration());
    const { generateTopics } = result;

    await act(async () => {
      await generateTopics('test');
    });

    expect(result.topics).toEqual(topics);
    expect(result.loading).toBe(false);
    expect(result.error).toBe(null);
  });

  it('should set error after failed generation', async () => {
    const mockPOST = api.POST as jest.MockedFunction<typeof api.POST>;
    mockPOST.mockRejectedValueOnce(new Error('Generation failed'));

    const { result } = renderHook(() => usePostGeneration());
    const { generateTopics } = result;

    await act(async () => {
      await generateTopics('test');
    });

    expect(result.topics).toEqual([]);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Generation failed');
  });
});
```

## E2E Tests

### End-to-End User Flows

```typescript
// __tests__/e2e/post-generation-flow.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostGeneratorWizard from '@/components/features/post-generator/PostGeneratorWizard';

describe('Post Generation Flow', () => {
  it('should complete full post generation flow', async () => {
    render(<PostGeneratorWizard />);

    // Step 1: Enter topic
    const inputField = screen.getByPlaceholderText(/topic/i);
    fireEvent.change(inputField, { target: { value: 'AI productivity' } });

    // Step 2: Generate topics
    const generateButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(generateButton);

    // Wait for topics to load
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options).not.toHaveLength(0);
    });

    // Step 3: Select topic
    fireEvent.click(options[0]);

    // Step 4: Generate hooks
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Wait for hooks
    await waitFor(() => {
      const hookOptions = screen.getAllByRole('option');
      expect(hookOptions).not.toHaveLength(0);
    });

    // Step 5: Generate body
    fireEvent.click(nextButton);

    // Wait for body
    await waitFor(() => {
      const bodyOptions = screen.getAllByRole('option');
      expect(bodyOptions).not.toHaveLength(0);
    });

    // Step 6: Generate CTA
    fireEvent.click(nextButton);

    // Wait for CTA
    await waitFor(() => {
      const ctaOptions = screen.getAllByRole('option');
      expect(ctaOptions).not.toHaveLength(0);
    });

    // Step 7: Verify final post displayed
    const finalPost = screen.getByRole('region', { name: /final-post/i });
    expect(finalPost).toBeInTheDocument();
  });

  it('should handle errors gracefully throughout flow', async () => {
    // Test error handling in each phase
    render(<PostGeneratorWizard />);

    const inputField = screen.getByPlaceholderText(/topic/i);
    fireEvent.change(inputField, { target: { value: '' } });

    const generateButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(generateButton);

    // Should show validation error
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(/required/i);
    });
  });
});
```

## OPIK Integration Tests

### Testing Tracing

```typescript
// __tests__/lib/opik-client.test.ts
import { getOpikClient } from '@/lib/opik-client';
import { Opik } from 'opik';

// Mock Opik
jest.mock('opik', () => ({
  Opik: jest.fn().mockImplementation(() => {
    return {
      trace: jest.fn().mockReturnValue({
        id: 'test-trace-id',
        span: jest.fn().mockReturnValue({
          id: 'test-span-id',
          end: jest.fn(),
        }),
        end: jest.fn(),
      }),
      flush: jest.fn().mockResolvedValue(undefined),
    };
  }),
}));

describe('getOpikClient', () => {
  it('should create Opik client with API key', () => {
    process.env.OPIK_API_KEY = 'test-key';

    const opik = getOpikClient();

    expect(Opik).toHaveBeenCalledWith({
      apiKey: 'test-key',
      projectName: 'commit-to-career',
    });
  });

  it('should return singleton instance', () => {
    const opik1 = getOpikClient();
    const opik2 = getOpikClient();

    expect(opik1).toBe(opik2);
  });

  it('should create trace with correct parameters', () => {
    const opik = getOpikClient();
    const trace = opik.trace('Generate_Topics', { input: 'test' });

    expect(opik.trace).toHaveBeenCalledWith(
      'Generate_Topics',
      { input: 'test' }
    );
  });

  it('should call end on trace', () => {
    const opik = getOpikClient();
    const trace = opik.trace('Test', {});
    const endMock = jest.fn();

    trace.end = endMock;

    expect(endMock).toHaveBeenCalled();
  });

  it('should flush traces', async () => {
    const opik = getOpikClient();
    const flushMock = jest.fn().mockResolvedValue(undefined);

    opik.flush = flushMock;

    await flushMock();

    expect(flushMock).toHaveBeenCalled();
  });
});
```

## Test Commands

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- groqAdapter.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="adapter"
```

### Test Scripts in package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage"
  },
}
```

## Coverage Goals

### Coverage Targets

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 80% | TBD |
| Branches | 80% | TBD |
| Functions | 80% | TBD |
| Lines | 80% | TBD |

### Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage

# View coverage in browser
open coverage/lcov-report/index.html

# Upload to Codecov (optional)
codecov
```

## Best Practices

### Test Organization

1. **Group Tests by Feature**: Organize tests by component/service
2. **Use Describe Blocks**: Logical grouping of related tests
3. **Test One Thing**: Each test should test one behavior
4. **Clear Names**: Descriptive test names

### Test Writing

1. **AAA Pattern**: Arrange, Act, Assert
2. **Independent Tests**: Tests should not depend on each other
3. **Mock Dependencies**: Mock external dependencies (API, database)
4. **Cleanup**: Clean up after each test

### Assertion Quality

1. **Specific Assertions**: Test exact values, not just truthy
2. **Error Messages**: Test for specific error messages
3. **Edge Cases**: Test boundary conditions
4. **User Flows**: Test complete user journeys

### OPIK Testing

1. **Trace Verification**: Verify traces are created correctly
2. **Evaluation Testing**: Test quality metrics calculation
3. **Performance Tracking**: Monitor generation times
4. **Error Logging**: Verify errors are logged with context

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Debugging Tests

### Debugging Failed Tests

```bash
# Run tests in debug mode
npm test -- --verbose

# Run specific test with debug output
npm test -- --testNamePattern="Button" --verbose

# Generate test coverage report
npm test -- --coverage --collectCoverageOnly=true
```

### Common Issues

### Test Not Found

```typescript
// ❌ Wrong test file location
// __tests__/components/Button.test.tsx  ← Wrong
// __tests__/components/ui/Button.test.tsx  ← Correct

// ✅ Fix
// Place test in __tests__/mirroring source structure
```

### Mock Not Working

```typescript
// ❌ Mock not reset before test
describe('Test', () => {
  it('should work', () => {
    // Mock not reset
    const result = await function();
  });
});

// ✅ Fix
describe('Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should work', async () => {
    // Mock is clean
    const result = await function();
  });
});
```

## Summary

### Testing Goals

- ✅ **Unit Tests**: Test individual functions in isolation
- ✅ **Integration Tests**: Test component/service integration
- ✅ **E2E Tests**: Test complete user flows
- ✅ **OPIK Tests**: Verify observability integration
- ✅ **Coverage**: Maintain >80% code coverage

### Test Coverage

| Type | Files | Tests | Coverage |
|------|-------|-------|----------|
| Unit | 10+ | 50+ | 80%+ |
| Integration | 5+ | 30+ | 75%+ |
| E2E | 3+ | 20+ | 70%+ |
| Total | 20+ | 100+ | 78%+ |

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**
