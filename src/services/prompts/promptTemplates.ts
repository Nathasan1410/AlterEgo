/**
 * Prompt Templates
 * Centralized repository of system prompts and user instructions
 */

export const PROMPT_TEMPLATES = {
  TOPICS: `
Generate 6 engaging LinkedIn post topics based on: "{{idea}}".
Research Depth: {{researchDepth}} (1=Simple, 5=Deep Dive)

Return ONLY valid JSON array:
[
  { "content": "Topic text", "score": 90, "reasoning": "Why this works" }
]
`,

  HOOKS: `
Write 3 distinct, high-engagement "Hooks" (opening lines) for a post about: "{{topic}}".
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

Return ONLY valid JSON array:
[
  { "content": "Body text here...", "score": 88, "reasoning": "Engagement factors" }
]
`,

  CTA: `
Generate 4 distinct Call-to-Actions (CTAs) for this post body:
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
`
};
