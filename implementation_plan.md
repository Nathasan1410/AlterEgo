# Implementation Plan - AI Quality Upgrade (AlterEgo)

The user reported that the AI output quality is "agak agak" (mediocre) and settings (scale) don't seem to apply properly. To fix this, we will upgrade the underlying models and refine the prompt engineering.

## Goal
Improve the quality of generated content (Hooks, Body, CTA, Polish) and ensure "Tone" and "Emoji" settings are strictly followed by the AI.

## User Review Required
No major breaking changes, but AI latency might increase slightly due to using a larger model (70B vs 8B).

## Proposed Changes

### `lib/ai-service.ts`

1.  **Model Upgrade**:
    *   Change `generateCTA` from `llama-3.1-8b-instant` to `llama-3.3-70b-versatile`.
    *   Change `polishPostContent` from `llama-3.1-8b-instant` to `llama-3.3-70b-versatile`.
    *   Change `generateFinal` from `llama-3.1-8b-instant` to `llama-3.3-70b-versatile`.
    *   *Rationale*: 70B models follow complex instructions (like "Tone: 3") much better than 8B models.

2.  **Prompt Refinement**:
    *   Update `getToneInstruction`: Make instructions more explicit and "forceful" (e.g., using "CRITICAL INSTRUCTION").
    *   Update `getEmojiInstruction`: Ensure "None" really means ZERO emojis.
    *   Update `polishPostContent`: Add "retain original meaning" to prevents hallucinations during polishing.

## Verification Plan

### Manual Verification
1.  **Redeploy to Vercel**.
2.  **Test "Tone" Slider**:
    *   Set Tone to 0 (Formal). Generate Post. -> Expect professional, stiff language.
    *   Set Tone to 10 (Casual). Generate Post. -> Expect slang, lowercase, loose grammar.
3.  **Test "Emoji" Slider**:
    *   Set Emoji to "None". -> Expect 0 emojis.
    *   Set Emoji to "Rich". -> Expect 5+ emojis.
4.  **Quality Check**:
    *   Read the "Polish" result. It should not look robotically summarized.
