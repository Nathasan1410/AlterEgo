# CommitToCareer: AI Agent for Professional Growth

> **Hackathon Submission** - Commit To Change Hackathon 2026
> **Category**: Productivity & Work Habits / Personal Growth

## The Problem

New Year's resolutions to "find a better job" or "build a network" often fail due to:
- **Writer's block** - Not knowing what to post
- **Inconsistency** - Posting once then disappearing for months  
- **Low engagement** - Generic content that doesn't resonate

## The Solution

**CommitToCareer** is an Agentic AI Workflow that acts as your personal LinkedIn ghostwriter. It doesn't just autocomplete text - it **iterates, critiques, and optimizes** your content for maximum impact.

### Key Features

1. **Hook Generator** - Creates attention-grabbing opening lines using viral frameworks
2. **Body Writer** - Generates substantive content with proper tone and length
3. **Self-Critique Agent** - Evaluates content quality before showing to user
4. **Full Observability** - Every AI decision is traced and measurable

## Hackathon Integration: Opik & Traceability

We built this project with an **"Observability First"** mindset:

### 1. Full Tracing
Every generation step (Hook -> Body -> CTA) is traced in Opik:

```typescript
const trace = opik.trace({
  name: "Generate_LinkedIn_Hooks",
  input: { topic, intent },
  tags: ["production", "linkedin-agent"]
});
```

### 2. LLM-as-a-Judge Evaluation
We use Opik to evaluate if generated hooks meet viral frameworks:

```typescript
const hookScores = {
  has_hook_pattern: hook.includes('?') ? 1 : 0.5,
  is_concise: hook.split(' ').length <= 20 ? 1 : 0.5,
  virality_score: calculated_average
};
```

### 3. Dataset Testing
Run `npm run evaluate` to see our AI quality testing in action:

```bash
npm run evaluate
# Output shows scores for each test case
# Check Opik Dashboard to see full traces
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Next.js API Routes |
| LLM Provider | Groq LPU (Llama 3.3 70B) |
| AI Observability | **Opik (Comet.ml)** |
| Language | TypeScript |

## Quick Start

### Prerequisites
- Node.js 18+
- Groq API Key
- Opik API Key (from Comet.ml)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/commit-to-career.git
cd commit-to-career

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev
```

### Environment Variables

```env
OPIK_API_KEY=your_opik_api_key
GROQ_API_KEY=your_groq_api_key
```

## Demo

### Generate a LinkedIn Post
1. Open http://localhost:3000
2. Enter your topic (e.g., "Why consistency beats talent")
3. Click "Generate LinkedIn Post"
4. See hook options and final post

### View Traces in Opik
1. Go to https://www.comet.com/opik
2. Open "commit-to-career" project
3. See full trace of each generation:
   - Input parameters
   - LLM calls with tokens used
   - Output with scores
   - Error handling

### Run Evaluation
```bash
npm run evaluate
```

This runs our test dataset through the AI and logs quality scores to Opik.

## Project Structure

```
/
├── app/
│   ├── api/generate/route.ts    # API endpoint with Opik tracing
│   ├── page.tsx                 # Main UI
│   └── layout.tsx               # App layout
├── lib/
│   ├── ai-service.ts            # AI functions with Opik integration
│   └── opik-client.ts           # Opik SDK wrapper
├── scripts/
│   └── runEvaluation.ts         # Evaluation script for demo
├── data/
│   └── viral_posts.json         # RAG context for viral style
└── package.json
```

## Why Opik?

Traditional LLM applications are **black boxes**. You don't know:
- Why a generation failed
- Which prompts work best
- How to improve quality over time

**Opik provides:**
- Real-time visibility into every AI decision
- Quality metrics and scoring
- Easy debugging when things go wrong
- Data for continuous improvement

## Team

Built for Commit To Change Hackathon 2026

## License

MIT License
