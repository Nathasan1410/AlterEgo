/**
 * Prompt Builder
 * Responsible for constructing final prompt strings from inputs
 */

import { PROMPT_TEMPLATES } from './promptTemplates';
import { TopicInput, HookInput, BodyInput, CTAInput, PolishInput } from '../../models/generated';

export class PromptBuilder {
  
  static buildTopicsPrompt(input: TopicInput): string {
    return PROMPT_TEMPLATES.TOPICS
      .replace('{{idea}}', input.idea)
      .replace('{{researchDepth}}', (input.researchDepth || 3).toString());
  }

  static buildHooksPrompt(input: HookInput): string {
    return PROMPT_TEMPLATES.HOOKS
      .replace('{{topic}}', input.topic)
      .replace('{{intent}}', input.intent || 'viral');
  }

  static buildBodyPrompt(input: BodyInput): string {
    return PROMPT_TEMPLATES.BODY
      .replace('{{hook}}', input.hook)
      .replace('{{topic}}', input.topic)
      .replace('{{length}}', input.length || 'medium')
      .replace('{{tone}}', (input.tone || 5).toString())
      .replace('{{styleProfile}}', input.styleProfile || 'Standard Professional')
      .replace('{{researchContext}}', input.researchContext || 'None');
  }

  static buildCTAPrompt(input: CTAInput): string {
    const excerpt = input.body.substring(0, 150).replace(/\n/g, ' ');
    return PROMPT_TEMPLATES.CTA
      .replace('{{bodyExcerpt}}', excerpt)
      .replace('{{intent}}', input.intent || 'viral');
  }

  static buildPolishPrompt(input: PolishInput): string {
    return PROMPT_TEMPLATES.POLISH
      .replace('{{content}}', input.content)
      .replace('{{tone}}', input.tone.toString())
      .replace('{{emojiDensity}}', input.emojiDensity.toString())
      .replace('{{language}}', input.language);
  }
}
