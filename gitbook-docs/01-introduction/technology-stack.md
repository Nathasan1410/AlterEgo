# Technology Stack

## Core Framework

**Frontend**
- **Next.js 16**: React framework with app router
- **React 18**: UI library
- **TypeScript 5.5**: Type-safe JavaScript
- **Tailwind CSS 3.4**: Utility-first CSS framework

**Backend**
- **Next.js API Routes**: Serverless API endpoints
- **TypeScript**: Type-safe backend
- **Zod 4.3**: Runtime validation

## AI & Machine Learning

### LLM Generation

- **Provider**: Groq API
- **Model**: Llama 3.3 70B (Meta)
- **Model ID**: `llama-3.3-70b-versatile`
- **Context Window**: 128K tokens
- **Max Tokens**: 4096 tokens per request

**Why Groq?**
- ✅ **Speed**: Sub-second inference (10-100x faster)
- ✅ **Quality**: State-of-the-art open-source LLM
- ✅ **Cost**: Affordable, predictable pricing
- ✅ **Open Source**: Transparent, customizable

### Web Research

- **Provider**: Tavily AI
- **SDK**: `@tavily/core`
- **Features**:
  - Real-time web search
  - AI-powered results
  - Configurable search depth

### Observability

**OPIK AI** 🚀

- **SDK**: `opik` (v1.0.0)
- **Purpose**: AI quality monitoring and debugging
- **Features**:
  - Real-time generation tracking
  - Quality metrics
  - Error identification
  - Performance optimization
  - Tracing & debugging

**Why OPIK AI?**
- ✅ Purpose-built for AI applications
- ✅ Real-time monitoring
- ✅ AI-powered quality assessment
- ✅ Easy integration
- ✅ **Sponsor of Commit To Change Hackathon** 🏆

[Learn more about OPIK AI](../06-observability/what-is-opik-ai)

### Voice Transcription (Optional)

- **Provider**: OpenAI
- **Model**: Whisper
- **Features**:
  - High accuracy transcription
  - Multi-language support
  - 95%+ accuracy rate

## Validation & Type Safety

- **Zod 4.3**: Runtime type validation
- **TypeScript 5.5**: Compile-time type checking
- **Strict Mode**: All strict mode options enabled

## Development Tools

- **ESLint**: Code linting (Next.js config)
- **Prettier**: Code formatting with Tailwind plugin
- **Jest 30**: Unit testing
- **ts-jest**: TypeScript support for Jest
- **tsx**: TypeScript execution

## Deployment

- **Vercel**: Production deployment (recommended)
- **Docker**: Containerization (optional)
- **Node.js**: Runtime environment (18.x or higher)

## UI Components

- **Lucide React**: Icon library
- **Framer Motion 12**: Animation library
- **next-themes 0.4**: Dark mode support

## Middleware

- **Custom Rate Limiting**: API rate limiting middleware

## Utilities

- **Custom JSON Parser**: Robust LLM output parsing
- **Error Handler**: Centralized error handling
- **Logger**: Structured logging
- **API Response Builder**: Consistent API responses

## Package Managers

- **npm**: Node package manager
- **pnpm**: Alternative (faster, less disk usage) - compatible

## Key Dependencies

```json
{
  "dependencies": {
    "@tavily/core": "^0.7.1",
    "framer-motion": "^12.29.0",
    "groq-sdk": "^0.5.0",
    "lucide-react": "^0.563.0",
    "next": "^16.1.4",
    "next-themes": "^0.4.6",
    "opik": "^1.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^4.3.6"
  }
}
```

```json
{
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "jest": "^30.2.0",
    "postcss": "^8.4.39",
    "prettier": "^3.8.1",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "tailwindcss": "^3.4.4",
    "ts-jest": "^29.4.6",
    "tsx": "^4.16.2",
    "typescript": "^5.5.3"
  }
}
```

## Why This Stack?

### Next.js
- **Performance**: Server-side rendering, static generation
- **DX**: Great developer experience
- **Ecosystem**: Large community, many integrations
- **Vercel**: Native integration and deployment

### Groq + Llama 3.3
- **Speed**: Sub-second inference
- **Quality**: State-of-the-art LLM
- **Cost**: Affordable, predictable pricing
- **Open Source**: Transparent, customizable

### OPIK AI
- **Observability**: Track AI performance
- **Quality**: Ensure high-quality output
- **Debugging**: Identify issues quickly
- **Improvement**: Data-driven model tuning
- **Sponsorship**: Primary sponsor of hackathon

### TypeScript + Zod
- **Type Safety**: Catch errors at compile time and runtime
- **Autocomplete**: Better IDE support
- **Refactoring**: Safer code changes
- **Documentation**: Self-documenting code

### Adapter Pattern
- **Flexibility**: Easy to swap providers
- **Testing**: Mock dependencies easily
- **Maintainability**: Clear interfaces

## Architecture Patterns

- **Adapter Pattern**: External service abstraction
- **Orchestration Pattern**: Central coordinator
- **Cache Pattern**: Performance optimization
- **Observer Pattern**: OPIK tracing integration

## Version Control & CI/CD

- **Git**: Version control
- **GitHub**: Hosting platform
- **GitHub Actions**: CI/CD pipeline (planned)
- **Vercel**: Automatic deployments

## Monitoring & Observability

- **OPIK AI**: AI-specific observability
- **Console Logs**: Structured logging
- **Error Tracking**: Centralized error handling

## Development Workflow

```bash
# Development
npm run dev          # Start dev server

# Quality
npm run lint         # Lint code
npm run format       # Format code
npm run typecheck    # Type check

# Testing
npm test             # Run tests
npm run evaluate     # Run evaluation scripts

# Production
npm run build        # Build for production
npm start            # Start production server
```

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **API Response Time**: < 2s (cached), < 5s (uncached)
- **AI Generation Time**: < 3s per phase
- **Lighthouse Score**: > 90

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
