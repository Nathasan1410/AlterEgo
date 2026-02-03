/**
 * Prompt Builder
 * Responsible for constructing final prompt strings from inputs
 */

import { PROMPT_TEMPLATES } from "./promptTemplates";
import { TopicInput, HookInput, BodyInput, CTAInput, PolishInput } from "../../models/generated";

export class PromptBuilder {
  static buildTopicsPrompt(input: TopicInput): string {
    return PROMPT_TEMPLATES.TOPICS.replace("{{idea}}", input.input).replace(
      "{{researchDepth}}",
      (input.researchDepth || 3).toString()
    );
  }

  static buildHooksPrompt(input: HookInput): string {
    let prompt = PROMPT_TEMPLATES.HOOKS.replace("{{topic}}", input.topic).replace(
      "{{intent}}",
      input.intent || "viral"
    );
    
    // Add style guidance if provided
    if (input.styleGuidance && input.styleGuidance.trim()) {
      prompt += `\n\nSTYLE GUIDANCE: Use this writing style and approach: "${input.styleGuidance}"`;
    }
    
    return prompt;
  }

  static buildBodyPrompt(input: BodyInput): string {
    let prompt = PROMPT_TEMPLATES.BODY.replace("{{hook}}", input.hook)
      .replace("{{topic}}", input.topic)
      .replace("{{length}}", input.length || "medium")
      .replace("{{tone}}", (input.tone || 5).toString())
      .replace("{{styleProfile}}", input.styleProfile || "Standard Professional")
      .replace("{{researchContext}}", input.researchContext || "None");
    
    // Add style guidance if provided
    if (input.styleGuidance && input.styleGuidance.trim()) {
      prompt += `\n\nADDITIONAL STYLE GUIDANCE: ${input.styleGuidance}`;
    }
    
    return prompt;
  }

  static buildCTAPrompt(input: CTAInput): string {
    const excerpt = input.body.substring(0, 150).replace(/\n/g, " ");
    let prompt = PROMPT_TEMPLATES.CTA.replace("{{bodyExcerpt}}", excerpt).replace(
      "{{intent}}",
      input.intent || "viral"
    );
    
    // Add style guidance if provided
    if (input.styleGuidance && input.styleGuidance.trim()) {
      prompt += `\n\nSTYLE GUIDANCE: ${input.styleGuidance}`;
    }
    
    return prompt;
  }

  static buildPolishPrompt(input: PolishInput): string {
    return PROMPT_TEMPLATES.POLISH.replace("{{content}}", input.content)
      .replace("{{tone}}", input.tone.toString())
      .replace("{{emojiDensity}}", input.emojiDensity.toString())
      .replace("{{language}}", input.language);
  }
}
