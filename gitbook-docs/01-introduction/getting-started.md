# Getting Started

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18.x or higher**: [Download Node.js](https://nodejs.org/)
- **npm or pnpm**: Package manager
- **Git**: [Download Git](https://git-scm.com/)
- **GitHub Account**: For cloning and potential contributions
- **Text Editor**: VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

## Required API Keys

You'll need the following API keys:

### Groq API Key

- **Purpose**: LLM generation (Llama 3.3 70B)
- **Get Key**: [Groq Console](https://console.groq.com/)
- **Cost**: Free tier available (500K requests/day)
- **Env Var**: `GROQ_API_KEY`

### OPIK API Key ⭐

- **Purpose**: AI observability and quality monitoring
- **Get Key**: [OPIK Console](https://www.opik.ai/)
- **Cost**: Free tier available
- **Env Var**: `OPIK_API_KEY`

> **Note**: OPIK AI is the primary sponsor of the Commit To Change 2026 Hackathon. Integration is required for hackathon participation.

### Tavily API Key

- **Purpose**: Web research and context gathering
- **Get Key**: [Tavily Console](https://tavily.com/)
- **Cost**: Free tier available (1K searches/month)
- **Env Var**: `TAVILY_API_KEY`

### OpenAI API Key (Optional)

- **Purpose**: Voice transcription (Whisper)
- **Get Key**: [OpenAI Platform](https://platform.openai.com/)
- **Cost**: Pay-as-you-go
- **Env Var**: `OPENAI_API_KEY`

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/commit-to-career.git
cd commit-to-career
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# Opik (Comet.ml) - AI Observability ⭐
OPIK_API_KEY=your_opik_api_key_here
OPIK_WORKSPACE=default

# Groq - LLM Provider
GROQ_API_KEY=your_groq_api_key_here

# Tavily - Web Research
TAVILY_API_KEY=your_tavily_api_key_here

# OpenAI - Voice Transcription (Optional)
# OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 5. Run Tests

```bash
npm test
# or
pnpm test
```

### 6. Build for Production

```bash
npm run build
# or
pnpm build
```

## Verify Setup

To verify everything is working:

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Generate Content**: Enter a topic and click "Generate"
3. **Check Console**: Look for OPIK traces (if observability is enabled)
4. **Run Tests**: Ensure all tests pass

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Key Issues

If API keys are not working:

1. **Verify Keys**: Ensure keys are correct and active
2. **Check Limits**: Ensure you haven't exceeded free tier limits
3. **Environment Variables**: Ensure `.env` is in project root
4. **Restart Server**: Restart dev server after changing `.env`

### TypeScript Errors

If you see TypeScript errors:

```bash
# Check TypeScript
npx tsc --noEmit

# Install missing types
npm install --save-dev @types/missing-package
```

### Port Already in Use

If port 3000 is in use:

```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check

# Type checking
npm run typecheck

# Run tests
npm test

# Run evaluation scripts
npm run evaluate
```

## Project Structure

After cloning, you should see:

```
commit-to-career/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── page.tsx         # Main page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── src/                 # Business logic
│   ├── api/            # API implementations
│   ├── components/     # React components
│   ├── services/       # Business logic
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Libraries
│   ├── utils/          # Utilities
│   ├── types/          # TypeScript types
│   ├── schemas/        # Zod schemas
│   └── models/         # Data models
├── docs/               # Documentation
├── .env.example        # Environment template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.ts  # Tailwind config
└── next.config.ts      # Next.js config
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPIK_API_KEY` | ✅ Yes | OPIK AI API key for observability |
| `OPIK_WORKSPACE` | No | OPIK workspace (default: "default") |
| `GROQ_API_KEY` | ✅ Yes | Groq API key for LLM generation |
| `TAVILY_API_KEY` | ✅ Yes | Tavily API key for web research |
| `OPENAI_API_KEY` | ❌ No | OpenAI API key for voice transcription |

## Next Steps

After setup:

- [ ] Read [Architecture Overview](../02-architecture/architecture-overview)
- [ ] Learn about [AI Integration](../04-ai-ml)
- [ ] Explore [API Reference](../05-api)
- [ ] Understand [OPIK AI Integration](../06-observability)
- [ ] Prepare for [Deployment](../07-deployment)

## Support

If you need help:

- **Documentation**: This GitBook
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/commit-to-career/issues)
- **OPIK AI Docs**: [https://docs.opik.ai/](https://docs.opik.ai/)
- **Groq Docs**: [https://console.groq.com/docs](https://console.groq.com/docs)
- **Tavily Docs**: [https://docs.tavily.com/](https://docs.tavily.com/)

## Hackathon Setup

For **Commit To Change 2026 Hackathon** participants:

1. **Get OPIK API Key**: [https://www.opik.ai/](https://www.opik.ai/) - Required for hackathon
2. **Get Groq API Key**: [https://console.groq.com/](https://console.groq.com/)
3. **Get Tavily API Key**: [https://tavily.com/](https://tavily.com/)
4. **Ensure OPIK Integration**: Verify OPIK traces are working
5. **Review Hackathon Guide**: See [Hackathon Section](../09-hackathon)

> **Good luck with the hackathon!** 🚀

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
