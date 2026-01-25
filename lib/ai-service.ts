// lib/ai-service.ts
// AI Service with Opik Tracing for Hackathon Demo

import { Groq } from 'groq-sdk';
import { Opik } from 'opik';
import viralPosts from '@/data/viral_posts.json';

// ============================================
// CLIENTS
// ============================================

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

// Opik client singleton
let opikClient: Opik | null = null;
const getOpikClient = () => {
  if (!opikClient) {
    opikClient = new Opik({
      apiKey: process.env.OPIK_API_KEY,
      projectName: 'commit-to-career'
    });
  }
  return opikClient;
};

// ============================================
// HELPERS
// ============================================

export const detectInputType = (input: string): 'draft' | 'topic' => {
  const wordCount = input.split(/\s+/).length;
  const hasMultipleSentences = (input.match(/[.!?]+/g) || []).length > 2;
  const hasNewlines = input.includes('\n');
  if (wordCount > 50 || hasNewlines || hasMultipleSentences) {
    return 'draft';
  }
  return 'topic';
};

export const ALLOWED_MODELS = {
  'llama-3.3-70b-versatile': 'Llama 3.3 70B (Versatile)',
  'llama-3.1-8b-instant': 'Llama 3.1 8B (Instant)',
};

export type ModelId = keyof typeof ALLOWED_MODELS;

// ============================================
// TONE & STYLE HELPERS
// ============================================

export const getToneInstruction = (toneValue: number = 5): string => {
  if (toneValue <= 2) {
    return `CRITICAL TONE INSTRUCTION: STRICTLY FORMAL & AUTHORITATIVE. Use academic/corporate vocabulary. No slang. Zero casualness.`;
  }
  if (toneValue <= 4) {
    return `TONE: Professional & Structured. Clear, concise, and business-focused.`;
  }
  if (toneValue <= 6) {
    return `TONE: Balanced Professional. Friendly but credible. Approachable expert voice.`;
  }
  if (toneValue <= 8) {
    return `TONE: Casual & Conversational. Write like you're talking to a friend. Use contractions (I'm, It's).`;
  }
  return `CRITICAL TONE INSTRUCTION: HIGHLY CASUAL & FUN. Use slang, idioms, and loose grammar. extremely personal and emotional.`;
};

export const getEmojiInstruction = (emojiLevel: string | number = 'moderate'): string => {
  let level: string;
  if (typeof emojiLevel === 'number') {
    if (emojiLevel <= 1) level = 'none';
    else if (emojiLevel <= 3) level = 'minimal';
    else if (emojiLevel <= 7) level = 'moderate';
    else level = 'rich';
  } else {
    level = emojiLevel;
  }

  switch (level) {
    case 'none': return `STRICT RULE: DO NOT USE ANY EMOJIS. ZERO EMOJIS.`;
    case 'minimal': return `EMOJI USAGE: Use exactly 1-2 emojis total. Preferred at the end of paragraphs.`;
    case 'moderate': return `EMOJI USAGE: Use 3-5 emojis. Good for bullet points or emphasis.`;
    case 'rich': return `EMOJI USAGE: Heavy emoji usage (5+). Use them in bullet points, headers, and for emotion.`;
    default: return getEmojiInstruction('moderate');
  }
};

export const getLanguageInstruction = (language: string = 'id'): string => {
  if (language === 'en') {
    return `**LANGUAGE: ENGLISH** - Write entirely in English.`;
  }
  return `**LANGUAGE: INDONESIAN** - Write in Bahasa Indonesia, keep English idioms/terms.`;
};

// ============================================
// VIRAL CONTEXT HELPER
// ============================================

interface ViralPost {
  id: number;
  intent: string;
  length: string;
  body: string;
}

const getViralContext = (count = 2, intent = 'viral', length = 'medium') => {
  const posts = viralPosts as ViralPost[];
  let pool = posts.filter((p) =>
    (!intent || p.intent === intent) && (!length || p.length === length)
  );
  if (pool.length === 0) {
    pool = posts.filter((p) => !length || p.length === length);
  }
  if (pool.length === 0) {
    pool = posts.filter((p) => !intent || p.intent === intent);
  }
  if (pool.length === 0) pool = posts;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ============================================
// MAIN FUNCTIONS WITH OPIK TRACING
// ============================================

/**
 * Generate LinkedIn Hooks with Opik Tracing
 */
export async function generateHooks(topic: string, intent: string = 'viral') {
  const groq = getGroqClient();
  const opik = getOpikClient();

  const dateContext = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const prompt = `
  You are a viral LinkedIn Ghostwriter.
  Current Date: ${dateContext}.
  
  Write 3 distinct, high-engagement "Hooks" (opening lines) for a post about: "${topic}".
  
  INTENT: ${intent.toUpperCase()}
  
  RULES:
  1. NO FABRICATED STORIES - Don't invent specific past events.
  2. Styles: Storytelling, Educational, Promotional, Viral
  3. Keep it punchy and scroll-stopping.

  Return ONLY a JSON array of strings.
  `;

  // START OPIK TRACE
  const trace = opik.trace({
    name: "Generate_LinkedIn_Hooks",
    input: { topic, intent },
    tags: ["production", "linkedin-agent", "hook-generation"],
    metadata: { model: "llama-3.3-70b-versatile" }
  });

  try {
    const llmSpan = trace.span({
      name: "Groq_LLM_Call",
      type: "llm",
      input: { model: "llama-3.3-70b-versatile", prompt_length: prompt.length },
      metadata: { provider: "groq" }
    });

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || '[]';

    llmSpan.end();

    const cleanJson = content.replace(/```json|```/g, '').trim();
    let hooks = [];
    try {
      const parsed = JSON.parse(cleanJson);
      hooks = Array.isArray(parsed) ? parsed : (parsed.result || parsed.hooks || []);
    } catch (e) {
      // Fallback regex parsing
      hooks = content.match(/"([^"]*)"/g)?.map(s => s.replace(/"/g, '')) || [];
    }

    trace.end();
    return hooks.slice(0, 5); // Return up to 5 hooks

  } catch (error) {
    trace.end();
    console.error("Hook generation error:", error);
    return ["Hook generation failed - please try again"];
  }
}

/**
 * Generate Topics with Opik Tracing
 */
export async function generateTopics(input: string, researchDepth: number = 3) {
  const groq = getGroqClient();
  const opik = getOpikClient();

  const prompt = `
  Generate 6 engaging LinkedIn post topics based on the idea: "${input}".
  
  Research Depth: ${researchDepth} (1=Simple, 5=Deep Dive)
  
  Return ONLY a JSON array of strings. Example: ["Topic 1", "Topic 2"]
  `;

  const trace = opik.trace({
    name: "Generate_Topics",
    input: { input, researchDepth },
    tags: ["production", "linkedin-agent", "topic-generation"],
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const cleanJson = content.replace(/```json|```/g, '').trim();
    let topics = [];
    try {
      topics = JSON.parse(cleanJson);
    } catch {
      topics = content.split('\n').filter(l => l.includes('"')).map(l => l.replace(/^[-\d.]+\s*"?|"?$/g, ''));
    }

    trace.end();
    return Array.isArray(topics) ? topics : [];
  } catch (error) {
    trace.end();
    return [];
  }
}

/**
 * Generate LinkedIn Body with Opik Tracing
 */
export async function generateBody(
  hook: string,
  topic: string,
  intent: string = 'viral',
  length: string = 'medium',
  tone: number = 5,
  emojiLevel: string = 'moderate',
  language: string = 'id',
  styleProfile?: string,   // NEW: Style Injection
  researchContext?: string // NEW: Tavily Context
) {
  const groq = getGroqClient();
  const opik = getOpikClient();

  const viralExamples = getViralContext(2, intent, length)
    .map((post, i) => `[Example ${i + 1}]\n${post.body}`)
    .join('\n\n');

  let lengthInstruction = '';
  switch (length) {
    case 'short': lengthInstruction = "50-100 words, compact."; break;
    case 'long': lengthInstruction = "200+ words, detailed."; break;
    default: lengthInstruction = "100-200 words, balanced.";
  }

  const prompt = `
  You are a LinkedIn Ghostwriter. It is 2026.
  
  Write the MAIN BODY for a LinkedIn post.
  Hook: "${hook}"
  Topic: "${topic}"
  Length: ${lengthInstruction}
  Intent: ${intent.toUpperCase()}
  
  ${getLanguageInstruction(language)}
  ${getToneInstruction(tone)}
  ${getEmojiInstruction(emojiLevel)}
  
  ${styleProfile ? `USER STYLE PROFILE (MIMIC THIS):\n${styleProfile}\n` : ''}
  ${researchContext ? `RESEARCH CONTEXT (USE FACTS):\n${researchContext}\n` : ''}

  STYLE REFERENCES:
  ${viralExamples}
  
  Write 2 distinct versions (Option A and Option B).
  Return JSON: { "optionA": "text...", "optionB": "text..." }
  `;

  // START OPIK TRACE
  const trace = opik.trace({
    name: "Generate_LinkedIn_Body",
    input: { hook, topic, intent, styleProfile, researchContext },
    tags: ["production", "linkedin-agent", "body-generation"],
    metadata: { model: "llama-3.3-70b-versatile" }
  });

  try {
    const llmSpan = trace.span({
      name: "Groq_LLM_Call",
      type: "llm",
      input: { model: "llama-3.3-70b-versatile" },
      metadata: { provider: "groq" }
    });

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content || '{}';

    llmSpan.end();

    const cleanContent = content.replace(/```json|```/g, '');
    const parsed = JSON.parse(cleanContent);
    const result = parsed.result || parsed;

    trace.end();

    // Standardize to array for frontend
    if (result.optionA && result.optionB) {
      return [result.optionA, result.optionB];
    }
    return Object.values(result).filter(v => typeof v === 'string');

  } catch (error) {
    trace.end();
    console.error("Body generation error:", error);
    return ["Generation failed. Please try again."];
  }
}

/**
 * Generate Call to Action (CTA)
 */
export async function generateCTA(
  input: string, // Body content
  intent: string = 'viral'
) {
  const groq = getGroqClient();
  const opik = getOpikClient();

  const prompt = `
  Generate 4 distinct Call-to-Actions (CTAs) for this LinkedIn post body:
  "${input.substring(0, 300)}..."
  
  Intent: ${intent}
  
  Types to generate:
  1. Engagement (Ask a question)
  2. Value (Offer a resource/tip)
  3. Debate (Provoke discussion)
  4. Soft Sell (Newsletter/Link)
  
  Return ONLY a JSON array of strings.
  Example: ["Agree?", "Link in bio!"]
  `;

  const trace = opik.trace({
    name: "Generate_CTA",
    input: { input, intent },
    tags: ["production", "linkedin-agent", "cta-generation"],
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // UPGRADED from 8b
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const cleanJson = content.replace(/```json|```/g, '').trim();
    // ... (rest of parsing logic)
    const ctas = JSON.parse(cleanJson);

    trace.end();

    // Ensure we return strings, not objects
    if (Array.isArray(ctas)) {
      return ctas.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // If LLM returns { cta: "text", type: "value" }, extract the text
          return item.cta || item.Cta || item.CTA || item.text || item.content || JSON.stringify(item);
        }
        return String(item);
      });
    }
    return [];
  } catch (error) {
    trace.end();
    return ["Thoughts?", "Agree?", "Let me know in the comments 👇", "Follow for more!"];
  }
}

/**
 * Polish Post (Tone, Grammar, Emoji)
 */
export async function polishPostContent(
  content: string,
  tone: number,
  emojiDensity: number,
  language: string
) {
  const groq = getGroqClient();
  const opik = getOpikClient();

  const prompt = `
  You are an expert Editor. Polish this LinkedIn post.
  
  Content:
  ${content}
  
  CRITICAL INSTRUCTIONS:
  ${getToneInstruction(tone)}
  ${getEmojiInstruction(emojiDensity)}
  ${getLanguageInstruction(language)}
  
  Steps:
  1. Fix grammar and flow.
  2. Improve readability with line breaks.
  3. Add 3 relevant hashtags at the bottom.
  4. DO NOT change the core meaning or facts.
  
  Return ONLY the final polished text.
  `;

  const trace = opik.trace({
    name: "Polish_Post",
    input: { content, tone, emojiDensity, language },
    tags: ["production", "linkedin-agent", "polish"],
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // UPGRADED from 8b
    });

    const polished = completion.choices[0]?.message?.content || content;
    trace.end();
    return polished;
  } catch (error) {
    trace.end();
    return content;
  }
}

/**
 * Generate Final Post with CTA and Hashtags
 */
export async function generateFinal(
  hook: string,
  body: string,
  context: string,
  ctaType: 'value' | 'promotional' | 'none' = 'value'
) {
  const groq = getGroqClient();
  const opik = getOpikClient();

  let ctaInstruction = '';
  if (ctaType === 'none') {
    ctaInstruction = 'NO CTA. Just end the post.';
  } else if (ctaType === 'promotional') {
    ctaInstruction = 'PROMOTIONAL CTA - invite to newsletter/offer.';
  } else {
    ctaInstruction = 'VALUE CTA - ask for engagement (Thoughts? Agree?)';
  }

  const prompt = `
  Assemble the final LinkedIn post.
  
  Hook: ${hook}
  Body: ${body}
  Topic: ${context}
  
  Task:
  1. Create CTA: ${ctaInstruction}
  2. Generate 3-5 hashtags
  3. Return JSON: { "finalPost": "Full text with Hook + Body + CTA + Hashtags" }
  `;

  const trace = opik.trace({
    name: "Generate_Final_Post",
    input: { hook, body: body.substring(0, 200), context, ctaType },
    tags: ["production", "linkedin-agent", "final-assembly"],
    metadata: { model: "llama-3.3-70b-versatile" } // Updated metadata
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // UPGRADED from 8b
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content.replace(/```json|```/g, ''));
    const result = parsed.result || parsed;

    trace.end();

    return result;

  } catch (error) {
    trace.end();
    return { finalPost: `${hook}\n\n${body}\n\nThoughts?\n\n#LinkedIn #Career` };
  }
}

/**
 * Full Pipeline: Generate Complete LinkedIn Post
 */
export async function generateCompletePost(
  topic: string,
  options: {
    intent?: string;
    length?: string;
    tone?: number;
    emojiLevel?: string;
    language?: string;
    ctaType?: 'value' | 'promotional' | 'none';
  } = {}
) {
  const opik = getOpikClient();

  // PARENT TRACE - Shows full workflow in Opik
  const parentTrace = opik.trace({
    name: "Complete_Post_Generation",
    input: { topic, ...options },
    tags: ["production", "linkedin-agent", "full-pipeline"],
    metadata: { workflow: "complete-generation" }
  });

  try {
    const {
      intent = 'viral',
      length = 'medium',
      tone = 5,
      emojiLevel = 'moderate',
      language = 'id',
      ctaType = 'value'
    } = options;

    // Step 1: Generate Hooks
    const hooks = await generateHooks(topic, intent);
    const selectedHook = hooks[0] || topic;

    // Step 2: Generate Body
    const bodyOptions = await generateBody(
      selectedHook, topic, intent, length, tone, emojiLevel, language
    );
    // Handle array return from generateBody
    const selectedBody = Array.isArray(bodyOptions) ? bodyOptions[0] : (bodyOptions as any).optionA || '';

    // Step 3: Assemble Final
    const final = await generateFinal(selectedHook, selectedBody, topic, ctaType);

    const result = {
      hook: selectedHook,
      body: selectedBody,
      finalPost: final.finalPost,
      allHooks: hooks,
      bodyOptions
    };

    parentTrace.end();

    // Flush to ensure traces are sent
    await opik.flush();

    return result;

  } catch (error) {
    parentTrace.end();
    throw error;
  }
}

// Export flush function for cleanup
export async function flushTraces() {
  const opik = getOpikClient();
  await opik.flush();
}
