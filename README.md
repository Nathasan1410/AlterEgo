# CommitToCareer (AlterEgo) - AI LinkedIn Post Generator

> Full documentation has been moved to the [`docs/`](./docs/) directory.

## Quick Links

- **[Documentation Index](./docs/README.md)** - All project documentation
- **[Progress Report](./docs/PROGRESS-REPORT-03-02-26.md)** - Latest progress and milestones
- **[Task Prioritization](./docs/task-prioritization.md)** - Task list and execution order
- **[Clean Code Plan](./docs/clean-code-plan.md)** - File structure and refactoring standards
- **[Issues & Fixes](./docs/issues-fixes.md)** - Identified issues and solutions

## Project Overview

AlterEgo is an AI-powered LinkedIn post generator that helps professionals create viral, engaging content tailored to their personal writing style.

**Tech Stack:**
- **Frontend:** Next.js 16, React 18, Tailwind CSS
- **Backend:** Next.js API Routes
- **AI Models:** Groq (LLaMA 3.3), OpenAI (Whisper)
- **Observability:** Opik
- **Validation:** Zod
- **Language:** TypeScript

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set your API keys in .env
# GROQ_API_KEY=your_key
# OPIK_API_KEY=your_key
# TAVILY_API_KEY=your_key

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
HACKATHON-OpikAI/
├── docs/                    # All documentation
│   ├── reports/            # Builder and auditor reports
│   └── ...                # Planning documents
├── src/                    # All source code
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and clients
│   ├── services/           # Business logic
│   ├── types/              # TypeScript types
│   ├── schemas/            # Zod validation schemas
│   └── utils/              # Utility functions
├── tests/                  # Test files
├── public/                 # Static assets
└── package.json
```

## Current Progress

- **Critical Tasks:** 5/5 complete ✅
- **High Priority Tasks:** 4/8 complete (50%)
- **Overall Progress:** 56% (9/21 tasks)

See [Progress Report](./docs/PROGRESS-REPORT-03-02-26.md) for details.

## Key Features

- ✅ **Style Analysis:** Analyze user's writing from LinkedIn posts
- ✅ **Content Generation:** Generate topics, hooks, body, and CTAs
- ✅ **Research Integration:** Web search for context
- ✅ **Voice Input:** Audio transcription for hands-free input
- ✅ **Viral Scoring:** AI-powered content quality assessment
- ✅ **Multi-language:** Support for Indonesian and English

## Development Status

**Last Updated:** 2026-02-03

**Completed Milestones:**
- ✅ Milestone 1: Foundation & Structure
- ✅ Milestone 2: API Standardization & Validation

**In Progress:**
- 🔄 Milestone 3: Component Refactoring
- 📋 Milestone 4: Infrastructure & Polish

**Next Session Focus:**
1. Complete H4 (error handler integration)
2. Extract PostGeneratorWizard phases (H5)
3. Create usePostGeneration hook (H6)

## Documentation

- [Progress Report](./docs/PROGRESS-REPORT-03-02-26.md)
- [Task Prioritization](./docs/task-prioritization.md)
- [Clean Code Plan](./docs/clean-code-plan.md)
- [Issues & Fixes](./docs/issues-fixes.md)
- [Optimization Plan](./docs/optimization-plan.md)
- [Future Implementation Plan](./docs/future-implementation-plan.md)
- [Product Profile](./docs/product-profile.md)

## Audit Reports

Latest audit reports available in [docs/reports/](./docs/reports/):

- [Session 1 Audit](./docs/reports/auditor-report-session-1.md)
- [Sessions 2-3 Audit](./docs/reports/auditor-report-sessions-2-3.md)
- [Session 4 Audit](./docs/reports/auditor-report-session-4.md)
- [Audit Summary](./docs/reports/auditor-summary.md)

## License

MIT

---

**Hackathon Project:** AlterEgo (CommitToCareer)
**Status:** Active Development
**Last Updated:** 2026-02-03
