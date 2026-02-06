/**
 * Prompt Templates
 * Centralized repository of system prompts and user instructions
 */

export const PROMPT_TEMPLATES = {
  TOPICS: `
Generate 10 engaging LinkedIn post topics based on: "{{idea}}".
Research Depth: {{researchDepth}} (1=Simple, 5=Deep Dive)

Return ONLY valid JSON array:
[
  { "content": "Topic text", "score": 90, "reasoning": "Why this works" }
]
`,

  HOOKS: `
Write 10 distinct, high-engagement "Hooks" (opening lines) for a post about: "{{topic}}".
Intent: {{intent}}

RULES:
1. Styles: Storytelling, Educational, Promotional, Viral
2. Keep it punchy and scroll-stopping.

Return ONLY valid JSON array:
[
  { "content": "Hook text", "score": 85, "reasoning": "Why this hook works" }
]
`,

  BODY: `
You are a LinkedIn Ghostwriter. Write the MAIN BODY for a LinkedIn post.
Hook: "{{hook}}"
Topic: "{{topic}}"
Length: {{length}}
Tone: {{tone}}/10
Style Context: {{styleProfile}}
Research Context: {{researchContext}}

CRITICAL INSTRUCTIONS:
1. Return a JSON ARRAY of exactly 5 objects
2. Each object MUST have three fields: "content", "score", "reasoning"
3. The "content" field MUST contain the FULL POST BODY TEXT (3-5 sentences minimum, actual post content)
4. The "score" field MUST be a number between 1-100
5. The "reasoning" field MUST be a brief explanation (10-20 words) of why this body works
6. DO NOT put the reasoning text in the content field
7. DO NOT put a number in the content field
8. The content must be actual post content, not a description or summary

Correct Format:
[
  { 
    "content": "The full post body text goes here. Write actual engaging content that readers would see in a LinkedIn post. Multiple sentences with valuable insights and clear narrative.", 
    "score": 88, 
    "reasoning": "Strong opening hook maintains reader interest throughout the narrative" 
  },
  { 
    "content": "Another distinct body variation here. Different approach or angle on the same topic. Engaging and valuable content for LinkedIn audience.", 
    "score": 92, 
    "reasoning": "Clear value proposition with actionable insights for professionals" 
  }
]

INCORRECT Examples:
- "content": "88" (number in content)
- "content": "This post effectively weaves together..." (description instead of actual content)
- "content": "Strong opening hook..." (reasoning text in content field)
`,

  CTA: `
Generate 8 distinct Call-to-Actions (CTAs) for this post body:
"{{bodyExcerpt}}..."
Intent: {{intent}}

Types: Engagement (Question), Value (Offer), Debate, Soft Sell.

Return ONLY valid JSON array:
[
  { "content": "CTA text", "score": 82, "reasoning": "Conversion power" }
]
`,

  POLISH: `
Polish this LinkedIn post.
Content:
{{content}}

Instructions:
Tone: {{tone}}/10
Emoji Density: {{emojiDensity}}
Language: {{language}}

- Fix grammar and flow.
- Improve readability with line breaks.
- Add 3 relevant hashtags at the bottom.

Return ONLY the final polished text string.
`,
};
