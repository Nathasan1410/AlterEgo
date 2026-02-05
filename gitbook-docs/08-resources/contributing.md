# Contributing

We love contributions! Thank you for considering helping improve AlterEgo.

## How to Contribute

### Reporting Bugs

If you find a bug:

1. Check existing [GitHub Issues](https://github.com/your-repo/commit-to-career/issues)
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version)
   - Screenshots/logs if applicable

### Suggesting Features

We welcome feature suggestions:

1. Check existing issues and pull requests
2. Create a new issue with:
   - Clear title
   - Problem statement
   - Proposed solution
   - Alternative approaches considered
   - Impact/urgency

### Pull Requests

We accept pull requests for:

- Bug fixes
- New features
- Documentation improvements
- Performance improvements
- Code refactoring

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/commit-to-career.git
cd commit-to-career
```

### 2. Create Feature Branch

```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

- Write clean, readable code
- Follow code style guidelines
- Add tests for new features
- Update documentation
- Add comments for complex logic

### 4. Test Your Changes

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm test

# Test locally
npm run dev
```

### 5. Commit Changes

```bash
# Stage your changes
git add .

# Commit with clear message
git commit -m "feat: add new feature description"

# Use conventional commits:
# feat: new feature
# fix: bug fix
# docs: documentation changes
# style: formatting changes
# refactor: code refactoring
# test: adding or updating tests
# chore: build process or auxiliary tool changes
```

### 6. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
# Describe your changes, reference related issues
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types
- Use interfaces over types where appropriate
- Avoid `any` type

```typescript
// Good
interface UserInput {
  topic: string;
  tone: number;
}

async function generateContent(input: UserInput): Promise<GeneratedOption[]> {
  // ...
}

// Bad
async function generateContent(input: any): Promise<any> {
  // ...
}
```

### Naming Conventions

- **Files**: kebab-case (`user-service.ts`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TOKENS`)
- **Interfaces**: PascalCase with 'I' prefix (`IUserAdapter`)

### Code Organization

```
src/
├── components/       # React components
│   ├── ui/         # Reusable UI components
│   └── features/    # Feature-specific components
├── services/       # Business logic
│   ├── adapters/   # External service adapters
│   └── orchestration/  # Coordination logic
├── hooks/          # Custom React hooks
├── lib/            # Utilities and clients
├── types/          # TypeScript types
└── utils/          # Utility functions
```

### Error Handling

- Use custom error classes
- Handle errors gracefully
- Log errors appropriately
- Provide helpful error messages

```typescript
// Good
import { GenerationError } from '@/types/errors';

try {
  const result = await generateTopics(input);
  return result;
} catch (error) {
  logger.error("Generation failed", error);
  throw new GenerationError(
    "Failed to generate topics",
    "GENERATION_FAILED",
    { originalError: error }
  );
}
```

### Testing

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Use descriptive test names
- Mock external dependencies
- Test error cases

```typescript
// Good
describe('GroqAdapter', () => {
  describe('generateTopics', () => {
    it('should generate 6 topics', async () => {
      const adapter = new GroqAdapter(apiKey);
      const topics = await adapter.generateTopics({ input: 'test' });
      expect(topics).toHaveLength(6);
    });

    it('should handle API errors', async () => {
      // Test error handling
    });
  });
});
```

### Documentation

- Add JSDoc comments for complex functions
- Update README for new features
- Add inline comments for non-obvious logic
- Keep comments up-to-date

```typescript
/**
 * Generates LinkedIn topics based on user input
 *
 * @param input - User input with topic idea
 * @param context - Optional trace context for OPIK
 * @returns Array of generated topic options
 *
 * @example
 * const topics = await groqAdapter.generateTopics({
 *   input: "AI productivity"
 * });
 */
async generateTopics(input: TopicInput, context?: TraceContext): Promise<GeneratedOption[]>
```

## Project-Specific Guidelines

### OPIK AI Integration

- Always trace AI generations
- Include relevant metadata
- Log evaluations
- Handle OPIK errors gracefully

```typescript
const trace = opik.trace({
  name: "Generate_Topics",
  input,
  tags: ["generation", "topics"],
  metadata: {
    model: "llama-3.3-70b-versatile",
    temperature: 0.8
  }
});

try {
  const result = await generate(input);
  trace.end({ output: result });
} catch (error) {
  trace.end({ error });
}
```

### Adapter Pattern

- Implement interfaces completely
- Keep adapters stateless where possible
- Handle provider-specific errors
- Provide fallbacks

```typescript
export class GroqAdapter implements IModelAdapter {
  readonly name = "Groq";
  readonly version = "llama-3.3-70b-versatile";

  async generateTopics(input: TopicInput): Promise<GeneratedOption[]> {
    // Implementation
  }

  async healthCheck(): Promise<boolean> {
    // Implementation
  }
}
```

### Prompt Engineering

- Use centralized prompt templates
- Make prompts clear and specific
- Provide examples in prompts
- Test prompt variations

```typescript
export const PROMPT_TEMPLATES = {
  TOPICS: `
Generate 6 engaging LinkedIn post topics based on: "{{idea}}".

Requirements:
- Topics should be viral and attention-grabbing
- Use LinkedIn professional tone
- Include relevant industry insights

Return ONLY valid JSON array:
[
  { "content": "Topic text", "score": 90, "reasoning": "Why this works" }
]
`
};
```

## Getting PRs Merged

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] No linting warnings
- [ ] Documentation updated
- [ ] Tests added for new features
- [ ] Commits follow conventional commits

### Review Process

1. Automated checks must pass
2. At least one maintainer approval
3. All review comments addressed
4. No merge conflicts with main branch

### Merge Strategy

- Squash commits for small PRs
- Rebase for feature branches
- Merge commit for major releases

## Recognition

Contributors are recognized in:

- CONTRIBUTORS.md file
- Release notes
- Documentation acknowledgments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Check our [FAQ](./faq)
- Join our [Discord](https://discord.gg/alterego)
- Contact us at support@alterego.ai

Thank you for contributing! 🚀
