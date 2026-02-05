# Component Structure

## Overview

AlterEgo's component structure follows a clean, modular architecture that separates concerns between UI components, business logic, and external service integration. This structure makes the codebase maintainable, testable, and scalable.

## Directory Structure

```
HACKATHON-OpikAI/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main dashboard page
│   ├── layout.tsx                # Root layout component
│   ├── globals.css                # Global styles
│   ├── error.tsx                 # Error boundary
│   └── api/                     # API route handlers
│       ├── generate/route.ts       # Content generation endpoint
│       ├── research/route.ts       # Web research endpoint
│       ├── transcribe/route.ts    # Voice transcription endpoint
│       └── analyze-style/route.ts # Style analysis endpoint
│
├── src/                          # Source directory
│   ├── api/                     # API implementations
│   │   └── generate.ts          # Generation API handler
│   │
│   ├── components/               # React components
│   │   ├── ui/                # Reusable UI primitives
│   │   │   ├── index.ts       # UI exports
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── features/            # Feature-specific components
│   │   │   ├── index.ts       # Feature exports
│   │   │   ├── post-generator/
│   │   │   │   ├── PostGeneratorWizard.tsx
│   │   │   │   ├── InputPhase.tsx
│   │   │   │   ├── BuildingPhase.tsx
│   │   │   │   ├── ConfirmationPhase.tsx
│   │   │   │   └── ResultPhase.tsx
│   │   │   ├── voice-input/
│   │   │   ├── style-onboarding/
│   │   │   └── research/
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── index.ts       # Layout exports
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   └── help/               # Help system
│   │       ├── index.ts
│   │       ├── HelpModal.tsx
│   │       ├── HelpContent.tsx
│   │       └── helpTypes.ts
│   │
│   ├── services/                # Business logic
│   │   ├── adapters/           # Adapter pattern for external services
│   │   │   ├── groqAdapter.ts       # Groq LLM adapter
│   │   │   ├── tavilyAdapter.ts     # Tavily research adapter
│   │   │   ├── opikAdapter.ts       # OPIK AI adapter
│   │   │   ├── interfaces.ts        # Adapter interfaces
│   │   │   └── index.ts            # Adapter exports
│   │   │
│   │   ├── orchestration/       # Orchestration layer
│   │   │   ├── generationOrchestrator.ts  # Main orchestrator
│   │   │   └── index.ts       # Orchestrator exports
│   │   │
│   │   └── prompts/            # Prompt engineering
│   │       ├── promptTemplates.ts      # Prompt templates
│   │       ├── promptBuilder.ts        # Prompt builder
│   │       └── index.ts       # Prompt exports
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePostGeneration.ts      # Post generation hook
│   │   ├── useViewportCardCount.ts   # Responsive cards
│   │   └── index.ts       # Hook exports
│   │
│   ├── lib/                     # Libraries and clients
│   │   ├── opik-client.ts        # OPIK AI client
│   │   ├── api-client.ts         # API client
│   │   ├── constants.ts          # Application constants
│   │   ├── scoring.ts            # Viral scoring logic
│   │   ├── style-analyzer.ts      # Style analysis
│   │   ├── tavily-client.ts      # Tavily client
│   │   └── index.ts       # Library exports
│   │
│   ├── utils/                   # Utility functions
│   │   ├── jsonParser.ts        # JSON parsing utilities
│   │   ├── validation.ts        # Validation helpers
│   │   ├── errorHandler.ts     # Error handling
│   │   ├── logger.ts            # Logging
│   │   ├── className.ts         # Class name utilities
│   │   ├── apiResponse.ts      # API response builders
│   │   └── index.ts       # Utility exports
│   │
│   ├── types/                   # TypeScript types
│   │   ├── generated.ts         # Generated content types
│   │   ├── api.ts               # API types
│   │   ├── errors.ts            # Error types
│   │   └── index.ts       # Type exports
│   │
│   ├── schemas/                 # Zod validation schemas
│   │   ├── generation.ts        # Generation input schemas
│   │   └── index.ts       # Schema exports
│   │
│   ├── models/                  # Data models
│   │   ├── generated.ts         # Generated content models
│   │   └── index.ts       # Model exports
│   │
│   ├── evaluators/              # Evaluation functions
│   │   └── index.ts           # Quality evaluators
│   │
│   ├── config/                  # Configuration
│   │   └── config.ts           # App configuration
│   │
│   ├── cache/                   # Cache implementations
│   │   ├── simpleCache.ts       # In-memory cache
│   │   └── index.ts       # Cache exports
│   │
│   └── middleware/              # Middleware
│       ├── rateLimit.ts         # Rate limiting
│       └── index.ts       # Middleware exports
│
├── public/                     # Static assets
│   └── ...
│
├── docs/                       # Documentation
│   └── ...
│
├── .env.example                # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts            # Next.js configuration
└── README.md                  # Project readme
```

## Component Categories

### 1. UI Primitives (src/components/ui/)

Reusable, design system components that can be used anywhere in the application.

**Purpose**: Provide consistent, reusable UI elements

**Examples**:
- `Button.tsx` - Styled button component
- `Card.tsx` - Container card component
- `Input.tsx` - Text input component
- `Select.tsx` - Dropdown select component
- `Textarea.tsx` - Multi-line input component

**Best Practices**:
- Make components generic and reusable
- Use TypeScript interfaces for props
- Support theming (light/dark mode)
- Use Tailwind CSS for styling
- Export from `index.ts` for cleaner imports

**Example**:
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### 2. Feature Components (src/components/features/)

Business logic-specific components that implement particular features.

**Purpose**: Encapsulate feature-specific UI and logic

**Examples**:
- `PostGeneratorWizard.tsx` - Main post generation wizard
- `InputPhase.tsx` - First phase of generation
- `BuildingPhase.tsx` - Selection phase
- `ConfirmationPhase.tsx` - Review phase
- `ResultPhase.tsx` - Final result phase

**Best Practices**:
- Keep components focused on single feature
- Extract common patterns to UI primitives
- Use custom hooks for complex logic
- Include loading and error states
- Support keyboard navigation

**Example**:
```typescript
// components/features/post-generator/InputPhase.tsx
export function InputPhase({ onNext, loading }: PhaseProps) {
  const [input, setInput] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onNext({ input });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">What would you like to write about?</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="E.g., How AI improves productivity"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input}>
          {loading ? 'Generating...' : 'Continue'}
        </Button>
      </form>
    </Card>
  );
}
```

### 3. Layout Components (src/components/layout/)

Layout-related components that structure the application.

**Purpose**: Provide consistent application structure

**Examples**:
- `Header.tsx` - Application header
- `Footer.tsx` - Application footer
- `Sidebar.tsx` - Navigation sidebar

**Best Practices**:
- Keep layout components simple
- Use responsive design (mobile-first)
- Support dark mode
- Include navigation links
- Show user status if applicable

### 4. Help Components (src/components/help/)

Help and documentation components.

**Purpose**: Provide in-app help and documentation

**Examples**:
- `HelpModal.tsx` - Help modal dialog
- `HelpContent.tsx` - Help content renderer
- `helpTypes.ts` - Help content types

**Best Practices**:
- Organize help by topic
- Include code examples
- Make content searchable
- Support keyboard shortcuts
- Update with new features

## Service Layer Components

### 1. Adapters (src/services/adapters/)

Adapter pattern implementation for external services.

**Purpose**: Abstract external service APIs behind consistent interfaces

**GroqAdapter**:
- Implements `IModelAdapter` interface
- Handles Groq API communication
- Manages retry logic and error handling
- Formats requests/responses for Groq

**TavilyAdapter**:
- Implements `IResearchAdapter` interface
- Handles Tavily API communication
- Manages search queries
- Formats search results

**OpikAdapter**:
- Implements `IObservabilityAdapter` interface
- Handles OPIK API communication
- Manages tracing and evaluation
- Formats trace data

**Best Practices**:
- Implement interface completely
- Keep adapters stateless where possible
- Handle provider-specific errors
- Provide fallback behavior
- Document provider-specific quirks

### 2. Orchestrator (src/services/orchestration/)

Central coordinator for all services.

**Purpose**: Coordinate between adapters and manage request flow

**GenerationOrchestrator**:
- Manages generation flow (topics → hooks → body → CTA)
- Implements caching strategy
- Handles errors gracefully
- Integrates OPIK tracing
- Manages request/response lifecycle

**Best Practices**:
- Keep orchestrator stateless
- Use dependency injection
- Implement caching at this layer
- Log all operations
- Provide clear error messages

### 3. Prompts (src/services/prompts/)

Prompt engineering and templates.

**Purpose**: Centralize prompt management

**promptTemplates.ts**:
- Defines all prompt templates
- Uses placeholder variables
- Includes examples in prompts
- Optimized for Llama 3.3

**promptBuilder.ts**:
- Builds prompts from templates
- Handles variable substitution
- Formats prompts for API
- Validates prompt structure

**Best Practices**:
- Keep prompts clear and specific
- Include examples in prompts
- Use consistent formatting
- Test prompts extensively
- Document prompt changes

## Utility Layer Components

### 1. Validators (src/utils/validation.ts)

Input validation helpers.

**Purpose**: Validate user inputs and API responses

**Examples**:
- `validateRequest()` - Validate API requests
- `validateGenerated()` - Validate AI outputs
- `sanitizeInput()` - Sanitize user inputs

**Best Practices**:
- Use Zod for type-safe validation
- Provide clear error messages
- Validate at multiple layers
- Sanitize untrusted inputs
- Log validation failures

### 2. Error Handler (src/utils/errorHandler.ts)

Error handling and standardization.

**Purpose**: Handle errors consistently across application

**Examples**:
- `handleGenerationError()` - Handle generation errors
- `handleAPIError()` - Handle API errors
- `createErrorResponse()` - Create error responses

**Best Practices**:
- Use custom error classes
- Log errors to OPIK
- Don't expose internal details
- Provide helpful error messages
- Include error codes

### 3. JSON Parser (src/utils/jsonParser.ts)

JSON parsing for LLM outputs.

**Purpose**: Parse and validate JSON from LLM responses

**Examples**:
- `parseGeneratedContent()` - Parse AI-generated content
- `validateJSON()` - Validate JSON structure
- `fixJSON()` - Fix malformed JSON

**Best Practices**:
- Handle multiple JSON formats
- Provide fallback behavior
- Log parsing failures
- Validate parsed data
- Support partial JSON

## Type Layer (src/types/)

TypeScript type definitions.

**Purpose**: Provide type safety across application

**Key Types**:
- `GeneratedOption` - Generated content option
- `TopicInput`, `HookInput`, `BodyInput`, `CTAInput` - Generation inputs
- `EvaluationResult` - Quality evaluation result
- `APIResponse<T>` - API response wrapper

**Best Practices**:
- Use interfaces over types where appropriate
- Export from index.ts for cleaner imports
- Document complex types
- Use generics for reusable types
- Keep types in sync with schemas

## Schema Layer (src/schemas/)

Zod validation schemas.

**Purpose**: Runtime type validation

**Key Schemas**:
- `TopicInputSchema` - Validate topic generation input
- `HookInputSchema` - Validate hook generation input
- `BodyInputSchema` - Validate body generation input
- `CTAInputSchema` - Validate CTA generation input
- `PolishInputSchema` - Validate polish input

**Best Practices**:
- Use Zod for runtime validation
- Provide descriptive error messages
- Validate all user inputs
- Keep schemas in sync with types
- Test schema validation

## Best Practices Summary

### File Organization

1. **Group by functionality**: Related files in same directory
2. **Index exports**: Export from index.ts for cleaner imports
3. **Consistent naming**: Use kebab-case for files, PascalCase for components
4. **Logical depth**: Keep directory structure shallow (max 3-4 levels)

### Component Design

1. **Single responsibility**: Each component does one thing well
2. **Reusable**: Components should be generic and reusable
3. **Testable**: Components should be easy to test
4. **Accessible**: Follow accessibility best practices
5. **Performant**: Optimize for performance

### Service Design

1. **Interface-based**: Use interfaces for services
2. **Dependency injection**: Pass dependencies as parameters
3. **Stateless**: Keep services stateless where possible
4. **Error handling**: Handle errors gracefully
5. **Logging**: Log all important operations

### Type Safety

1. **Strict mode**: Enable TypeScript strict mode
2. **No any**: Avoid using `any` type
3. **Runtime validation**: Use Zod for runtime checks
4. **Keep in sync**: Types and schemas should match
5. **Document**: Document complex types

## Testing Structure

```
tests/
├── unit/                     # Unit tests
│   ├── components/           # Component tests
│   ├── services/            # Service tests
│   ├── utils/               # Utility tests
│   └── hooks/              # Hook tests
├── integration/              # Integration tests
│   ├── api/                 # API tests
│   └── services/            # Service integration tests
└── e2e/                    # End-to-end tests
    └── user-flows/          # User flow tests
```

## Component Lifecycle

### 1. Development Lifecycle

1. **Create**: Create component file
2. **Implement**: Write component logic
3. **Style**: Add Tailwind styles
4. **Test**: Write tests
5. **Export**: Add to index.ts
6. **Integrate**: Use in parent component

### 2. Component Dependencies

```
Component
   ↓ imports
   ↓ uses
   ↓
- UI Primitives (from components/ui/)
- Hooks (from hooks/)
- Types (from types/)
- Utilities (from utils/)
- Services (via API, not directly)
```

### 3. Data Flow

```
User Interaction
   ↓
Component Event Handler
   ↓
Hook (if complex logic)
   ↓
API Call (via api-client)
   ↓
API Route
   ↓
Orchestrator
   ↓
Adapter
   ↓
External API
   ↓
Response (reverse flow)
```

## Summary

AlterEgo's component structure is:

- ✅ **Modular**: Clear separation of concerns
- ✅ **Reusable**: Generic UI primitives
- ✅ **Maintainable**: Logical file organization
- ✅ **Type-Safe**: Comprehensive TypeScript types
- ✅ **Testable**: Easy to mock and test
- ✅ **Observable**: OPIK integrated at service level
- ✅ **Scalable**: Ready for growth and new features

This structure demonstrates technical sophistication and best practices suitable for a winning hackathon submission.

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**
