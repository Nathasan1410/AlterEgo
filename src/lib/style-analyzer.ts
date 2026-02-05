// Style Analyzer - Extract user's writing "DNA"
// This is the core of ultra-personalization

import Groq from "groq-sdk";
import { logger } from "../utils/logger";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface StyleProfile {
  tone: string; // e.g., "Casual & Friendly", "Professional", "Witty"
  formatting: string; // e.g., "Short paragraphs", "Bullet points", "Story-like"
  vocabulary: string[]; // Signature words/phrases
  emojiUsage: string; // e.g., "Minimal", "Moderate", "Heavy"
  sentenceLength: string; // e.g., "Short punchy", "Medium", "Long flowing"
  hooks: string; // How they start posts
  closings: string; // How they end posts (CTA style)
  uniqueTraits: string[]; // Special characteristics
  rawAnalysis: string; // Full LLM analysis
}

/**
 * Analyze user's past posts to extract their writing style DNA
 */
export async function analyzeUserStyle(pastPosts: string[]): Promise<StyleProfile> {
  if (pastPosts.length === 0) {
    return getDefaultStyleProfile();
  }

  const postsText = pastPosts.map((post, i) => `--- Post ${i + 1} ---\n${post}`).join("\n\n");

  const prompt = `You are an expert writing style analyst. Analyze these LinkedIn posts written by the same person and extract their unique writing "DNA".

${postsText}

Provide a detailed style analysis in the following JSON format:
{
  "tone": "Describe their overall tone (e.g., Casual & Friendly, Professional & Authoritative, Witty & Sarcastic)",
  "formatting": "How do they structure posts (e.g., Short paragraphs, Bullet points, Numbered lists, Story format)",
  "vocabulary": ["list", "of", "signature", "words", "or", "phrases", "they", "use"],
  "emojiUsage": "How much do they use emojis (None, Minimal, Moderate, Heavy)",
  "sentenceLength": "Their typical sentence style (Short punchy sentences, Medium balanced, Long flowing)",
  "hooks": "How do they typically start posts to grab attention",
  "closings": "How do they end posts (CTA style, question, statement)",
  "uniqueTraits": ["list", "of", "unique", "characteristics"]
}

Return ONLY valid JSON, no markdown or explanation.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        rawAnalysis: content,
      };
    }

    return getDefaultStyleProfile();
  } catch (error) {
    logger.error("Style analysis error", error instanceof Error ? error : undefined, {
      pastPostsCount: pastPosts.length,
    });
    return getDefaultStyleProfile();
  }
}

/**
 * Generate a style injection prompt for content generation
 */
export function generateStylePrompt(profile: StyleProfile): string {
  return `
CRITICAL - MIMIC THIS WRITING STYLE:
- Tone: ${profile.tone}
- Formatting: ${profile.formatting}
- Sentence Style: ${profile.sentenceLength}
- Emoji Usage: ${profile.emojiUsage}
- Signature Vocabulary: ${profile.vocabulary.join(", ")}
- Hook Style: ${profile.hooks}
- Closing Style: ${profile.closings}
${profile.uniqueTraits.length > 0 ? `- Unique Traits: ${profile.uniqueTraits.join(", ")}` : ""}

Write EXACTLY like this person would write. Match their voice perfectly.
`.trim();
}

/**
 * Default style profile for new users
 */
function getDefaultStyleProfile(): StyleProfile {
  return {
    tone: "Professional yet approachable",
    formatting: "Short paragraphs with line breaks",
    vocabulary: [],
    emojiUsage: "Minimal",
    sentenceLength: "Medium balanced",
    hooks: "Start with a bold statement or question",
    closings: "End with a call-to-action or question",
    uniqueTraits: [],
    rawAnalysis: "",
  };
}

/**
 * Quick style check - compare generated content against user style
 * Returns a similarity score 0-1
 */
export async function checkStyleConsistency(
  generatedContent: string,
  styleProfile: StyleProfile
): Promise<{ score: number; feedback: string }> {
  const prompt = `Compare this generated LinkedIn post against the user's style profile.

GENERATED POST:
${generatedContent}

USER'S STYLE PROFILE:
- Tone: ${styleProfile.tone}
- Formatting: ${styleProfile.formatting}
- Emoji Usage: ${styleProfile.emojiUsage}
- Sentence Style: ${styleProfile.sentenceLength}

Rate how well the generated post matches the user's style on a scale of 0 to 1.
Provide brief feedback on what matches and what doesn't.

Return JSON format:
{
  "score": 0.85,
  "feedback": "Brief explanation"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { score: 0.7, feedback: "Unable to analyze style match" };
  } catch (error) {
    logger.error("Style check error", error instanceof Error ? error : undefined, {
      generatedContentLength: generatedContent.length,
    });
    return { score: 0.7, feedback: "Style check failed" };
  }
}
