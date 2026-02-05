# Frequently Asked Questions

## General Questions

### What is AlterEgo?

AlterEgo is an AI-powered LinkedIn post generator that helps professionals create viral, engaging content in minutes instead of hours. It uses advanced AI (Groq Llama 3.3 70B) to generate topics, hooks, body content, and CTAs tailored to your personal writing style.

### How does AlterEgo work?

1. **Input**: Enter a topic or use voice input
2. **Generate**: AI generates multiple options for topics, hooks, body, and CTAs
3. **Select**: Choose the best options from each phase
4. **Score**: Get viral score and quality assessment
5. **Publish**: Copy to LinkedIn and engage

### Is AlterEgo free?

AlterEgo is currently in development for the Commit To Change 2026 Hackathon. Pricing details will be announced after the hackathon.

## Technology Questions

### What AI model does AlterEgo use?

AlterEgo uses Groq's Llama 3.3 70B model, which provides:
- Sub-second inference
- High-quality outputs
- Context window of 128K tokens
- Support for 100+ languages including Indonesian and English

### What is OPIK AI?

OPIK AI is an observability platform for AI applications. It tracks every AI generation, monitors quality metrics, and provides real-time insights. AlterEgo is proudly sponsored by OPIK AI for the Commit To Change 2026 Hackathon.

[Learn more about OPIK AI](../06-observability/what-is-opik-ai)

### Why use Groq instead of OpenAI?

Groq provides:
- 10-100x faster inference
- More affordable pricing
- Open-source models (Llama 3.3)
- Consistent, high-quality output
- Predictable pricing

### How does style cloning work?

Upload 5-10 of your existing LinkedIn posts, and AlterEgo will:
- Analyze your writing patterns
- Identify your tone, formatting, and vocabulary
- Generate new posts that sound like you
- Maintain authenticity while improving quality

## Usage Questions

### Can I use AlterEgo for languages other than English?

Yes! AlterEgo supports:
- Indonesian (Bahasa Indonesia)
- English
- And many other languages supported by Llama 3.3

### How accurate is voice transcription?

AlterEgo uses OpenAI Whisper for voice transcription, which provides:
- 95%+ accuracy rate
- 2-5 second transcription time
- Support for Indonesian and English

### What content can I generate?

You can generate:
- **Topics**: 6 engaging topic ideas
- **Hooks**: 3 attention-grabbing opening lines
- **Body**: 2 informative, engaging posts
- **CTAs**: 4 persuasive call-to-actions
- **Complete Posts**: Full posts with all components

### How do I improve my viral score?

Viral score (0-100) is based on:
- Hook strength and curiosity
- Storytelling elements
- Value proposition
- Call-to-action presence
- Formatting and readability

To improve:
- Use strong hooks
- Include personal stories
- Provide actionable value
- Add relevant CTAs
- Format for readability

## Technical Questions

### What's the architecture?

AlterEgo uses:
- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **AI**: Groq Llama 3.3 70B, Tavily Research, OpenAI Whisper
- **Observability**: OPIK AI
- **Validation**: Zod

[Learn more about Architecture](../02-architecture/architecture-overview)

### How do I deploy AlterEgo?

You can deploy to:
- **Vercel** (recommended): One-click deployment
- **Docker**: Containerized deployment
- **Traditional VPS**: Full control

[See Deployment Guide](../07-deployment/deployment-guide)

### What API endpoints are available?

- `POST /api/generate` - Generate content
- `POST /api/research` - Web research
- `POST /api/transcribe` - Voice transcription
- `POST /api/analyze-style` - Style analysis

[See API Reference](../05-api)

### How does caching work?

AlterEgo implements intelligent caching:
- Caches repeated generation requests
- Configurable TTL (Time To Live)
- Automatic cache invalidation
- Reduces API calls and improves speed

## OPIK AI Questions

### Why is OPIK AI important?

OPIK AI ensures:
- **Quality**: Every generation is monitored for quality
- **Reliability**: Issues are identified and resolved quickly
- **Performance**: Latency and token usage are tracked
- **Improvement**: Data-driven optimizations

### How do I integrate OPIK AI?

See our detailed [OPIK AI Integration Guide](../06-observability/opik-ai-integration).

Basic setup:
```bash
npm install opik
```

```typescript
import { Opik } from "opik";

const opik = new Opik({
  apiKey: process.env.OPIK_API_KEY,
  projectName: "commit-to-career"
});

const trace = opik.trace({
  name: "Generate_Topics",
  input: { topic: "AI productivity" }
});

// Your generation logic

trace.end();
```

### Is my data secure with OPIK AI?

Yes. OPIK AI:
- Does NOT collect personal information
- Does NOT collect LinkedIn account data
- Uses data only for quality monitoring
- Complies with GDPR and CCPA

## Hackathon Questions

### What is the Commit To Change Hackathon?

Commit To Change 2026 is a hackathon focused on AI for productivity and work habits. OPIK AI is the primary sponsor, and AlterEgo is our submission.

### What are the judging criteria?

1. **Innovation** (25%): Creative and novel approach
2. **Technical Excellence** (25%): Code quality and architecture
3. **User Experience** (20%): Intuitive and pleasant UI/UX
4. **Market Potential** (15%): Real market need and scalability
5. **Demo Quality** (15%): Clear, engaging presentation

### How is OPIK AI integrated for the hackathon?

AlterEgo demonstrates OPIK AI integration through:
- Real-time tracing of all AI generations
- Quality monitoring and evaluation
- Performance metrics tracking
- Data-driven improvements

### What makes AlterEgo stand out?

- **Style Cloning**: First-to-market for LinkedIn
- **Quality Focus**: AI-powered viral scoring
- **OPIK Integration**: Production-grade observability
- **Multi-language**: Support for Indonesian and English
- **Voice Input**: Hands-free content creation

## Privacy & Security

### Is my content private?

Yes. Your content:
- Is processed by Groq API according to their privacy policy
- Is NOT stored permanently on our servers
- Is NOT shared with third parties
- Is NOT used for training AI models

### What about LinkedIn data?

We do NOT collect:
- LinkedIn passwords or credentials
- Your LinkedIn connections
- Your LinkedIn engagement data
- Your personal LinkedIn posts (unless you explicitly share them for style cloning)

### Are my API keys secure?

Yes. API keys:
- Are stored in environment variables
- Are never committed to code
- Are used only for making API calls
- Are rotated regularly in production

## Troubleshooting

### My API keys aren't working

1. Verify keys are correct
2. Check API provider dashboards for status
3. Ensure keys haven't expired
4. Check usage limits on free tiers
5. Restart dev server after changing keys

[See Troubleshooting Guide](../07-deployment/troubleshooting)

### Build is failing

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Node.js version (must be 18+)
4. Run type checking: `npm run typecheck`
5. Run linting: `npm run lint`

### Application is slow

1. Check OPIK traces for bottlenecks
2. Enable caching in settings
3. Reduce token usage in prompts
4. Check network connectivity to APIs
5. Monitor API response times

## Pricing & Business

### Will AlterEgo be free?

Pricing will be announced after the hackathon. We plan to offer:
- Free tier with limited generations
- Paid tier with unlimited features
- Team plans for businesses

### Who is AlterEgo for?

- **Founders**: Share insights and build thought leadership
- **Marketers**: Create engaging content at scale
- **Sales Professionals**: Generate posts that convert
- **HR & Recruiters**: Share company culture and jobs
- **Consultants**: Establish authority with valuable content
- **Job Seekers**: Build professional brand online

### Can I use AlterEgo for my business?

Yes! We offer features for:
- Team collaboration
- Brand voice consistency
- Content calendar integration
- Analytics and reporting
- Custom branding

## Contact & Support

### How do I get help?

- **Documentation**: This GitBook
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/commit-to-career/issues)
- **Discord**: [Join Server](https://discord.gg/alterego)
- **Email**: support@alterego.ai

### How do I report a bug?

Create a [GitHub Issue](https://github.com/your-repo/commit-to-career/issues) with:
- Clear title
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs if applicable

### How do I suggest a feature?

Create a [GitHub Issue](https://github.com/your-repo/commit-to-career/issues) with:
- Clear title
- Problem statement
- Proposed solution
- Alternative approaches

## Additional Questions

Still have questions?

- Check our [documentation index](../)
- Join our [Discord](https://discord.gg/alterego)
- Contact us at support@alterego.ai
- Follow us on [Twitter](https://twitter.com/alterego)

---

**Built with ❤️ for the Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**
