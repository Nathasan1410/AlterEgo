# Prompt Engineering

## Overview

Prompt engineering is the art of crafting effective instructions for LLMs to produce high-quality, relevant outputs. For AlterEgo, well-designed prompts are crucial for generating engaging LinkedIn content.

## Prompt Engineering Principles

### 1. Be Specific

✅ **Good**: Specific about output requirements
```
Generate 6 engaging LinkedIn post topics about "AI productivity".
Each topic should:
- Be viral and attention-grabbing
- Use LinkedIn professional tone
- Include relevant industry insights
- Be actionable and valuable

Return as JSON array.
```

❌ **Bad**: Vague instructions
```
Generate some topics about AI.
```

### 2. Provide Examples

✅ **Good**: Show expected output format
```
Generate 6 engaging LinkedIn post topics about "AI productivity".

Example output:
[
  {
    "content": "I wish someone told me this 5 years ago...",
    "score": 92,
    "reasoning": "Strong hook, curiosity-inducing, relatable"
  }
]
```

❌ **Bad**: No examples or unclear format
```
Generate topics. Use JSON format.
```

### 3. Use System Messages

✅ **Good**: Set context and behavior
```
You are a LinkedIn content strategist with 10+ years of experience.

Your task is to generate engaging LinkedIn post topics.

Guidelines:
- Topics should be viral and attention-grabbing
- Use LinkedIn professional tone
- Include relevant industry insights
- Be actionable and valuable

Generate topics and return as JSON array with structure:
[
  {
    "content": "Topic text",
    "score": 0-100,
    "reasoning": "Why this works (10-20 words)"
  }
]
```

❌ **Bad**: No system message
```
Generate 6 topics.
```

### 4. Specify Output Format

✅ **Good**: Explicit format requirements
```
Return ONLY valid JSON array with exactly 6 objects:
[
  {
    "content": "Topic text",
    "score": number between 0-100,
    "reasoning": "Brief explanation (10-20 words)"
  }
]

Format requirements:
- Valid JSON syntax
- No markdown code blocks
- No comments in JSON
- No extra text before or after JSON
```

### 5. Use Temperature Wisely

✅ **Good**: Balanced temperature for creativity
```
Temperature: 0.8
Purpose: Balance creativity and relevance

Generate 6 topics with temperature 0.8 to introduce variety while maintaining coherence.
```

❌ **Bad**: Extreme temperature values
```
Temperature: 1.5 (too random)
Temperature: 0.0 (too deterministic)

High temperature may produce nonsensical results. Low temperature may produce repetitive results.
```

## AlterEgo Prompt Templates

### Topics Prompt

```typescript
export const TOPICS_PROMPT = `
You are a LinkedIn content strategist with 10+ years of experience.

Generate 6 engaging LinkedIn post topics based on: "{{idea}}"
Research Depth: {{researchDepth}} (1=Simple, 5=Deep Dive)

Requirements:
- Topics should be viral and attention-grabbing
- Use LinkedIn professional tone
- Include relevant industry insights
- Be actionable and valuable
- Each topic should be 3-15 words

Return ONLY valid JSON array with exactly 6 objects:
[
  {
    "content": "Topic text",
    "score": number between 0-100,
    "reasoning": "Why this works (10-20 words)"
  }
]

Examples of viral topics:
- "I wish someone told me this 5 years ago..."
- "The AI productivity secret nobody talks about"
- "7 productivity hacks that changed my career"
- "Why successful professionals quit at 10pm"
- "The one skill that doubled my productivity"
- "Productivity myths that are holding you back"
```;
```

### Hooks Prompt

```typescript
export const HOOKS_PROMPT = `
You are a LinkedIn content strategist with 10+ years of experience.

Write 3 distinct, high-engagement "Hooks" (opening lines) for a post about: "{{topic}}"
Intent: {{intent}}

RULES:
1. Styles: Storytelling, Educational, Promotional, Viral
2. Keep it punchy and scroll-stopping
3. 20-50 characters maximum per hook
4. Hook must immediately grab attention
5. Create curiosity or desire to learn more

Return ONLY valid JSON array with exactly 3 objects:
[
  {
    "content": "Hook text",
    "score": number between 0-100,
    "reasoning": "Why this hook works (10-20 words)"
  }
]

Hook styles:
- Storytelling: "I never thought..." "The day I discovered..."
- Educational: "Here's what I learned about..." "The truth about..."
- Promotional: "Introducing..." "Announcing..." "Presenting..."
- Viral: "Stop scrolling if..." "I wish someone told me..." "Nobody talks about..."

Examples of viral hooks:
- "I wish someone told me this 5 years ago"
- "Stop scrolling if you want to know..."
- "The one productivity hack that changed everything"
- "Here's what nobody tells you about..."
- "7 things I wish I knew earlier"
```;
```

### Body Prompt

```typescript
export const BODY_PROMPT = `
You are a LinkedIn Ghostwriter. Write MAIN BODY for a LinkedIn post.

Hook: "{{hook}}"
Topic: "{{topic}}"
Length: {{length}}
Tone: {{tone}}/10
Style Context: {{styleProfile}}
Research Context: {{researchContext}}

CRITICAL INSTRUCTIONS:
1. Return a JSON ARRAY of exactly 2 objects
2. Each object MUST have three fields: "content", "score", "reasoning"
3. The "content" field MUST contain the FULL POST BODY TEXT (3-5 sentences minimum, actual post content)
4. The "score" field MUST be a number between 1-100
5. The "reasoning" field MUST be a brief explanation (10-20 words) of why this body works
6. DO NOT put the reasoning text in the content field
7. DO NOT put a number in the content field
8. The content must be actual post content, not a description or summary

Content Guidelines:
- 3-5 sentences for LinkedIn (not an article)
- Professional but conversational tone
- Include at least one actionable insight
- Use bullet points or numbered lists
- Add relevant statistics or data points when appropriate
- Maintain the hook's promise from the opening line

Example of good body:
"The full post body text goes here. Write actual engaging content that readers would see in a LinkedIn post. Multiple sentences with valuable insights and clear narrative. Add bullet points for readability."

INCORRECT Examples (DO NOT do these):
- "88" (number in content field)
- "This post effectively weaves together..." (description instead of content)
- "Strong opening hook maintains reader interest..." (reasoning text in content field)
```;
```

### CTA Prompt

```typescript
export const CTA_PROMPT = `
Generate 4 distinct Call-to-Actions (CTAs) for this LinkedIn post:

"{{bodyExcerpt}}..."

Intent: {{intent}}

Types: Engagement (Question), Value (Offer), Debate, Soft Sell

Requirements:
- Action-oriented and clear
- 10-30 characters per CTA
- Align with post intent and tone
- Create desire to engage or learn more

Return ONLY valid JSON array with exactly 4 objects:
[
  {
    "content": "CTA text",
    "score": number between 0-100,
    "reasoning": "Conversion power (10-20 words)"
  }
]

CTA Examples:
Engagement:
- "What's your take?"
- "Thoughts?"
- "Share your experience"
- "Agree or disagree?"

Value:
- "Get the full guide"
- "Download the template"
- "Join the community"
- "Learn more in the comments"

Debate:
- "Unpopular opinion but here it is..."
- "Controversial take on..."
- "Do you agree with this?"
- "Let's discuss..."

Soft Sell:
- "DM me for details"
- "Link in bio"
- "Check the comments"
- "Read more below"
```;
```

### Polish Prompt

```typescript
export const POLISH_PROMPT = `
Polish this LinkedIn post for maximum engagement.

Original Content:
"{{content}}"

Instructions:
Tone: {{tone}}/10 (1=Very Casual, 10=Very Professional)
Emoji Density: {{emojiDensity}} (none, low, medium, high)
Language: {{language}}

- Fix grammar and flow
- Improve readability with line breaks
- Add 3 relevant hashtags at the bottom
- Maintain the core message and value

Return ONLY the final polished text string. Do NOT include any JSON structure, markdown, or explanations.

Polishing Guidelines:
- Line breaks between paragraphs for readability
- Correct spelling and grammar
- Enhance clarity without changing meaning
- Add personality appropriate for tone level
- Use emojis sparingly and strategically
- Ensure hashtags are relevant and trending

Tone Levels:
1: Very Casual: Lots of emojis, informal language, exclamation marks
2: Casual: Some emojis, conversational
3: Professional: Few emojis, formal language
4: Very Professional: No emojis, highly formal

Emoji Density:
- none: No emojis
- low: 1-2 emojis per paragraph
- medium: 3-5 emojis per paragraph
- high: 6-10 emojis per paragraph

Hashtag Strategy:
- Use 2-3 broad hashtags for reach
- Include 1-2 specific hashtags for targeting
- Mix trending and evergreen hashtags

Example polish transformation:
Original: "AI productivity is important. Here are some tips."

Polished (Professional, Medium Emojis):
"AI productivity is crucial for career growth. 💪

Here are some proven strategies:

1. Time blocking 🕐
2. Automation 🤖
3. Prioritization ⚡

#Productivity #AI #CareerGrowth"
```;
```

## Prompt Builder

```typescript
// src/services/prompts/promptBuilder.ts
export class PromptBuilder {
  static buildTopicsPrompt(input: TopicInput): string {
    return PROMPT_TEMPLATES.TOPICS
      .replace("{{idea}}", input.input)
      .replace("{{researchDepth}}", String(input.researchDepth || 3));
  }

  static buildHooksPrompt(input: HookInput): string {
    return PROMPT_TEMPLATES.HOOKS
      .replace("{{topic}}", input.topic)
      .replace("{{intent}}", input.intent || 'educational');
  }

  static buildBodyPrompt(input: BodyInput): string {
    return PROMPT_TEMPLATES.BODY
      .replace("{{hook}}", input.hook)
      .replace("{{topic}}", input.topic)
      .replace("{{length}}", input.length || 'medium')
      .replace("{{tone}}", String(input.tone || 7))
      .replace("{{styleProfile}}", JSON.stringify(input.styleProfile))
      .replace("{{researchContext}}", input.researchContext || '');
  }

  static buildCTAPrompt(input: CTAInput): string {
    return PROMPT_TEMPLATES.CTA
      .replace("{{bodyExcerpt}}", input.body.substring(0, 100))
      .replace("{{intent}}", input.intent || 'educational');
  }

  static buildPolishPrompt(input: PolishInput): string {
    return PROMPT_TEMPLATES.POLISH
      .replace("{{content}}", input.content)
      .replace("{{tone}}", String(input.tone || 7))
      .replace("{{emojiDensity}}", input.emojiDensity || 'medium')
      .replace("{{language}}", input.language || 'en');
  }
}
```

## Temperature Tuning

### Temperature Guidelines

| Generation Type | Temperature | Reason |
|--------------|-------------|--------|
| Topics | 0.8 | Balance creativity and relevance |
| Hooks | 0.8 | More creative for attention-grabbing |
| Body | 0.8 | Maintain hook promise, add detail |
| CTA | 0.7 | More predictable and actionable |
| Polish | 0.7 | Refine without changing meaning |

### Why These Temperatures

**0.8**: Optimal for LinkedIn content
- High enough for creative variety
- Low enough for coherence
- Produces viral-worthy ideas
- Maintains professional tone

**Lower (<0.5)**: Too deterministic
- Repetitive outputs
- Less creative
- Boring content

**Higher (>1.0)**: Too random
- Incoherent content
- Nonsensical outputs
- Poor grammar
- Confusing messages

## Token Management

### Token Limits

| Generation Type | Input Tokens | Output Tokens | Total |
|--------------|-------------|--------|----------|
| Topics | ~200 | ~400 | ~600 |
| Hooks | ~150 | ~300 | ~450 |
| Body | ~300 | ~800 | ~1100 |
| CTA | ~100 | ~150 | ~250 |
| Polish | Variable | Variable | ~800 |

### Token Optimization

```typescript
// Limit input length
const MAX_INPUT_LENGTH = 500;

// Request optimal output size
const OPTIMAL_OUTPUT_TOKENS = {
  topics: 400,
  hooks: 300,
  body: 800,
  cta: 150,
};

// Use max_tokens parameter
const response = await client.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: OPTIMAL_OUTPUT_TOKENS[type],
  temperature: 0.8,
});
```

## Output Parsing

### Robust JSON Parsing

```typescript
// src/utils/jsonParser.ts
export class JSONParser {
  static parseGeneratedContent(content: string): GeneratedOption[] {
    try {
      const parsed = JSON.parse(content);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Expected array');
      }
      
      return parsed.map((item: any) => ({
        content: item.content,
        score: item.score || 70,
        reasoning: item.reasoning || 'Generated',
      }));
    } catch (error) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch) {
        return JSONParser.parseGeneratedContent(jsonMatch[1]);
      }
      
      // Return fallback
      return Array(expectedCount)
        .fill(null)
        .map((_, i) => ({
          content: `Option ${String.fromCharCode(65 + i)} (Fallback)`,
          score: 70,
          reasoning: 'Fallback due to error',
        }));
    }
  }
}
```

## Prompt Testing

### Testing Strategy

```typescript
// __tests__/services/prompts/promptBuilder.test.ts
import { PromptBuilder } from '@/services/prompts/promptBuilder';

describe('PromptBuilder', () => {
  describe('buildTopicsPrompt', () => {
    it('should replace idea placeholder', () => {
      const result = PromptBuilder.buildTopicsPrompt({
        input: 'AI productivity',
        researchDepth: 3,
      });
      
      expect(result).toContain('AI productivity');
      expect(result).not.toContain('idea}}');
    });

    it('should handle missing research depth', () => {
      const result = PromptBuilder.buildTopicsPrompt({
        input: 'AI productivity',
      });
      
      expect(result).toContain('Research Depth: 3');
    });
  });

  describe('buildHooksPrompt', () => {
    it('should replace topic and intent placeholders', () => {
      const result = PromptBuilder.buildHooksPrompt({
        topic: 'AI productivity',
        intent: 'educational',
      });
      
      expect(result).toContain('AI productivity');
      expect(result).toContain('educational');
    });
  });
});
```

## Best Practices

### 1. Iterative Improvement

- Test prompts with real examples
- Evaluate outputs quality
- Adjust prompts based on results
- Track which prompts work best

### 2. A/B Testing

- Test multiple prompt variations
- Compare output quality
- Use metrics to evaluate
- Select best-performing prompt

### 3. Prompt Templates

- Use version-controlled prompt templates
- Document prompt changes
- Maintain prompt library
- Share effective prompts with team

### 4. Context Engineering

- Include relevant background information
- Add style profile for personalization
- Use research context for currency
- Adjust tone based on intent

### 5. Quality Validation

- Validate outputs against criteria
- Check for coherence and relevance
- Ensure formatting is correct
- Verify no prohibited content

## OPIK Integration

### Log Prompt Metrics

```typescript
// In orchestrator
const trace = this.observabilityAdapter.trace('Generate_Topics', input, {
  tags: ['prompt-engineering', 'topics', 'groq'],
  metadata: {
    prompt: builtPrompt,
    promptLength: builtPrompt.length,
    temperature: 0.8,
  }
});

// After generation
trace.end({
  output: result,
  metadata: {
    outputCount: result.length,
    averageScore: result.reduce((sum, t) => sum + t.score, 0) / result.length,
  }
});
```

### Evaluate Prompt Effectiveness

```typescript
// Track prompt performance over time
interface PromptMetrics {
  promptType: string;
  successRate: number;
  averageScore: number;
  averageTime: number;
  timestamp: number;
}

const metrics: PromptMetrics[] = [];

// After each generation
metrics.push({
  promptType: 'topics',
  successRate: successCount / totalAttempts,
  averageScore: averageScore,
  averageTime: averageTimeMs,
  timestamp: Date.now(),
});

// Log to OPIK
this.observabilityAdapter.logEvaluation(
  { promptType, temperature: 0.8 },
  result,
  metrics,
);
```

## Troubleshooting

### Common Prompt Issues

#### Low Quality Output

**Problem**: AI generates generic or poor quality content

**Solutions**:
- Increase temperature slightly (0.7 → 0.8 → 0.85)
- Add more specific requirements
- Provide better examples in prompt
- Use system message to set context

#### Inconsistent Output

**Problem**: Similar outputs across multiple generations

**Solutions**:
- Increase temperature for more variety
- Add randomness to prompt
- Use different hooks or angles
- A/B test prompt variations

#### Parsing Errors

**Problem**: JSON output doesn't match expected format

**Solutions**:
- Add explicit JSON format instructions
- Use strict JSON mode in API
- Implement robust fallback parsing
- Add multiple format examples

#### Wrong Format

**Problem**: AI returns markdown or other unwanted formatting

**Solutions**:
- Specify "Return ONLY valid JSON" explicitly
- Add "No markdown, no comments" instructions
- Test and validate JSON parser
- Handle edge cases gracefully

## Summary

Prompt engineering is critical for AlterEgo's quality. Well-designed prompts:

- ✅ Generate engaging, viral-worthy content
- ✅ Maintain consistent quality across generations
- ✅ Optimize for LinkedIn's algorithm
- ✅ Support style personalization
- ✅ Enable multi-language generation

**Key Principles**:
1. Be specific and clear
2. Provide examples and format requirements
3. Use appropriate temperature (0.8 for most cases)
4. Test and iterate on prompts
5. Monitor quality with OPIK AI

**Next Steps**:
- [ ] Test all prompts with real inputs
- [ ] A/B test prompt variations
- [ ] Track quality metrics over time
- [ ] Optimize based on OPIK insights

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**
