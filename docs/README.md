# AlterEgo - AI LinkedIn Post Generator

> **Hackathon Submission** - Commit To Change Hackathon 2026
> **Category:** Productivity & Work Habits
> **Status:** 🟢 Active Development (56% Complete)
> **Last Updated:** 2026-02-03

---

## 🌟 Overview

**AlterEgo** is not just a text generator. It is an **Agentic Workflow** that acts as your professional Ghostwriter. It clones your writing style and uses a multi-step agentic process to craft viral content.

### The Agentic Pipeline
1. **Researcher Agent:** Scrapes viral structures and analyzes your past posts to build a "Style DNA"
2. **Drafting Agent:** Generates 3 Hook variations and 2 Body options based on viral frameworks
3. **Self-Correction Agent (The "Critic"):** Before showing you the result, this agent reads the draft, checks it against your "Tone" settings (0-10 Scale), and rewrites it to ensure maximum impact

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Nathasan1410/AlterEgo.git
cd AlterEgo

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your API keys
```

### Environment Variables

```env
GROQ_API_KEY=your_groq_api_key_here
OPIK_API_KEY=your_opik_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here

# Optional
USE_MOCK=false
ENABLE_CACHE=false
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
npm test
```

### Run Evaluation (For Judges)

```bash
npm run evaluate
```

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 18
- Tailwind CSS
- Framer Motion (animations)

**Backend:**
- Next.js API Routes
- Zod (input validation)
- Custom error handling
- Structured logging

**AI/ML:**
- Groq SDK (LLaMA 3.3 70B)
- OpenAI Whisper (audio transcription)

**Observability:**
- Opik AI (full traceability)
- Custom logger with LogLevel enum

**Code Quality:**
- TypeScript 5
- Prettier (100% formatting compliance)
- ESLint (configuration)
- Jest (11 tests passing)

### Project Structure

```
HACKATHON-OpikAI/
├── src/                          # All source code
│   ├── app/                      # Next.js app directory
│   ├── components/               # React components
│   │   ├── features/           # Feature-specific components
│   │   │   ├── post-generator/
│   │   │   ├── style-onboarding/
│   │   │   ├── voice-input/
│   │   │   ├── canvas/
│   │   │   └── analytics/
│   │   ├── layout/             # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and clients
│   ├── services/                # Business logic
│   │   ├── adapters/           # External service adapters
│   │   ├── orchestration/      # Orchestration layer
│   │   └── prompts/           # AI prompt templates
│   ├── types/                   # TypeScript types
│   ├── schemas/                 # Zod validation schemas
│   ├── config/                  # Configuration
│   └── utils/                   # Utility functions
├── tests/                        # Test files
├── docs/                         # All documentation
│   └── reports/                # Builder & auditor reports
├── public/                       # Static assets
└── app/                          # Next.js app directory
```

---

## ✨ Features

### Core Features
- ✅ **Style Analysis:** Analyze user's writing from LinkedIn posts
- ✅ **Content Generation:** Generate topics, hooks, body, and CTAs
- ✅ **Research Integration:** Web search for context via Tavily
- ✅ **Voice Input:** Audio transcription for hands-free input
- ✅ **Viral Scoring:** AI-powered content quality assessment
- ✅ **Multi-language:** Support for Indonesian and English
- ✅ **Style Onboarding:** Extract user's writing DNA
- ✅ **Canvas View:** Visual post preview
- ✅ **Custom Settings:** Tone (1-10), emoji level, intent, length

### Technical Features
- ✅ **API Validation:** 100% coverage with Zod schemas
- ✅ **Standardized Responses:** Consistent API response format
- ✅ **Error Handling:** Custom error classes with structured logging
- ✅ **Type Safety:** Zero TypeScript errors
- ✅ **Code Formatting:** 100% Prettier compliance
- ✅ **Observability:** Full Opik traceability for all AI calls

---

## 📊 Progress

### Overall: 56% Complete (9/21 tasks)

#### Milestones
- ✅ **Milestone 1:** Foundation & Structure (100%)
- ✅ **Milestone 2:** API Standardization (100%)
- 🔄 **Milestone 3:** Component Refactoring (0%)
- 📋 **Milestone 4:** Infrastructure & Polish (0%)

#### Task Completion by Priority

**🔴 Critical Tasks (5/5 - 100%)**
- ✅ Move components, hooks, lib to src/
- ✅ Remove legacy code (743 lines)
- ✅ Add ESLint & Prettier
- ✅ Create jsonParser utility
- ✅ Verify build and tests

**🟠 High Priority Tasks (4/8 - 50%)**
- ✅ Create shared constants
- ✅ Standardize API responses
- ✅ Add Zod validation schemas
- ⚠️ Create error handling system (infrastructure done, integration pending)
- 📋 Extract PostGeneratorWizard phases
- 📋 Create usePostGeneration hook
- 📋 Add rate limiting middleware
- 📋 Create barrel exports

**🟡 Medium Priority Tasks (0/8 - 0%)**
- 📋 Fix TypeScript `any` types
- 📋 Add React.memo optimizations
- 📋 Implement code splitting
- 📋 Add useMemo/useCallback
- 📋 Increase test coverage
- 📋 Add JSDoc documentation
- 📋 Implement Redis cache
- 📋 Add environment variable validation

**🟢 Low Priority Tasks (0/5 - 0%)**
- 📋 Add API documentation
- 📋 Bundle size optimization
- 📋 Add keyboard shortcuts
- 📋 Add onboarding flow
- 📋 Implement Magic Mode

---

## 🎯 Opik Integration

### Full Traceability
Every AI thought process is tracked. You can see exactly how the **Self-Correction Agent** modifies text by viewing traces in the Opik Dashboard.

### Dataset Evaluation (LLM-as-a-Judge)
We include a robust evaluation script to prove our AI's quality. Run it locally to see agents in action:

```bash
npm run evaluate
```

This script runs a dataset of topics through agents and scores them based on:
- **Virality Score:** Does the hook use strong psychological triggers?
- **Style Adherence:** Does the body match requested length and tone?

---

## 📝 Documentation

### User Documentation
- [Progress Report](./docs/PROGRESS-REPORT-03-02-26.md) - Latest progress and milestones
- [Release Notes](./docs/RELEASE-NOTES.md) - What's new in each update

### Developer Documentation
- [Task Prioritization](./docs/task-prioritization.md) - Task list and execution order
- [Clean Code Plan](./docs/clean-code-plan.md) - File structure and refactoring standards
- [Issues & Fixes](./docs/issues-fixes.md) - Identified issues and solutions
- [Optimization Plan](./docs/optimization-plan.md) - Performance and scalability improvements

### Audit Reports
All reports available in [docs/reports/](./docs/reports/):
- [Session 1](./docs/reports/auditor-report-session-1.md)
- [Sessions 2-3](./docs/reports/auditor-report-sessions-2-3.md)
- [Session 4](./docs/reports/auditor-report-session-4.md)
- [Audit Summary](./docs/reports/auditor-summary.md)

---

## 🧪 Development Status

### Build & Test Status
| Check | Status | Details |
|-------|--------|---------|
| **TypeScript Compilation** | ✅ Pass | 0 errors |
| **Tests** | ✅ Pass | 11/11 passing |
| **Code Formatting** | ✅ Pass | 100% Prettier |
| **ESLint** | ⚠️ Config Issue | Script needs fix |

### Code Quality Metrics
| Metric | Current | Target |
|--------|----------|--------|
| **TypeScript Errors** | 0 | 0 ✅ |
| **Test Coverage** | ~15% | >60% 🔄 |
| **API Validation** | 100% | 100% ✅ |
| **API Standardization** | 100% | 100% ✅ |
| **Code Formatting** | 100% | 100% ✅ |
| **Legacy Code** | 0 lines | 0 lines ✅ |

---

## 🚦 Roadmap

### Immediate Next Steps (Session 5)
1. Complete H4 integration (error handler in API routes)
2. Extract PostGeneratorWizard phases (H5)
3. Create usePostGeneration hook (H6)

### Short Term (Next 1-2 days)
- Component refactoring
- State management extraction
- Rate limiting implementation
- Barrel exports

### Medium Term (Next 1 week)
- React performance optimizations
- Code splitting
- Comprehensive testing
- Redis cache implementation

### Long Term (Next 2-3 weeks)
- Complete all medium priority tasks
- Start low priority tasks
- Full documentation
- Bundle optimization

---

## 🤝 Contributing

### Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Use Prettier for formatting: `npm run format`
- Run TypeScript check: `npm run typecheck`
- Run tests: `npm test`

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code refactoring
- `docs:` for documentation changes
- `test:` for adding tests
- `chore:` for maintenance tasks

---

## 🐛 Known Issues

### Priority 1: H4 Integration (HIGH)
- Error handler infrastructure created but not integrated into API routes
- API routes still using manual error handling with console.error

### Priority 2: Missing JSDoc (MEDIUM)
- No JSDoc on public APIs
- Poor developer experience

### Priority 3: Missing Tests (MEDIUM)
- No unit tests for new utilities/schemas
- Uncertain test coverage beyond existing 11 tests

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Credits

**Built with ❤️ for Future of Work**

**Tech Stack:**
- Next.js
- Groq (LLaMA 3.3)
- Opik AI Observability
- Tavily Web Search
- OpenAI Whisper

---

## 📞 Support & Feedback

For questions, issues, or suggestions:
- Open an [Issue](https://github.com/Nathasan1410/AlterEgo/issues)
- Contact: [nathasan1410@gmail.com](mailto:nathasan1410@gmail.com)

---

**Hackathon Project:** AlterEgo (CommitToCareer)
**Status:** 🟢 Active Development
**Last Updated:** 2026-02-03
**Overall Progress:** 56% (9/21 tasks)
**Next Milestone:** Component Refactoring (2-3 days)

---

> *"The best way to predict the future is to create it."* - Peter Drucker
