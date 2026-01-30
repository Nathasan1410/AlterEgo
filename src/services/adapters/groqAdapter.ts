/**
 * Groq Adapter - Implementation of IModelAdapter for Groq LLM
 */

import { Groq } from 'groq-sdk';
import { PromptBuilder } from '../prompts/promptBuilder';
import { IModelAdapter } from './interfaces';
import type { 
  GeneratedOption, 
  TopicInput, 
  HookInput, 
  BodyInput, 
  CTAInput, 
  PolishInput,
  TraceContext 
} from '../../models/generated';

export class GroqAdapter implements IModelAdapter {
  readonly name = 'Groq';
  readonly version = 'llama-3.3-70b-versatile';
  
  private client: Groq;
  private model: string;

  constructor(apiKey: string, model: string = 'llama-3.3-70b-versatile') {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.chat.completions.create({
        messages: [{ role: 'user', content: 'Hi' }],
        model: this.model,
        max_tokens: 1
      });
      return true;
    } catch {
      return false;
    }
  }

  async generateTopics(input: TopicInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildTopicsPrompt(input);
    return this.generateWithFallback(prompt, 6);
  }

  async generateHooks(input: HookInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildHooksPrompt(input);
    return this.generateWithFallback(prompt, 3);
  }

  async generateBody(input: BodyInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildBodyPrompt(input);
    return this.generateWithFallback(prompt, 2);
  }

  async generateCTA(input: CTAInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildCTAPrompt(input);
    return this.generateWithFallback(prompt, 4);
  }

  async polishContent(input: PolishInput, context?: TraceContext): Promise<{ content: string; scores?: any[] }> {
    const prompt = PromptBuilder.buildPolishPrompt(input);

    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.7
      });

      const content = completion.choices[0]?.message?.content || input.content;
      return { content };
    } catch (error) {
      console.error('Polish error:', error);
      return { content: input.content };
    }
  }

  // Helper method with robust JSON parsing
  private async generateWithFallback(prompt: string, expectedCount: number): Promise<GeneratedOption[]> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content || '[]';
      return this.parseGeneratedOptions(content);
    } catch (error) {
      console.error('Generation error:', error);
      // Return fallback options
      return Array(expectedCount).fill(null).map((_, i) => ({
        content: `Option ${String.fromCharCode(65 + i)} (Fallback)`,
        score: 70,
        reasoning: 'Fallback due to error'
      }));
    }
  }

  private parseGeneratedOptions(content: string): GeneratedOption[] {
    // Multiple parsing strategies
    const strategies = [
      // Strategy 1: Direct parse
      () => JSON.parse(content.replace(/```json|```/g, '').trim()),
      // Strategy 2: Extract array
      () => {
        const match = content.match(/\[[\s\S]*\]/);
        return match ? JSON.parse(match[0]) : null;
      },
      // Strategy 3: Extract object and convert
      () => {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          const obj = JSON.parse(match[0]);
          return Object.values(obj);
        }
        return null;
      }
    ];

    for (const strategy of strategies) {
      try {
        const parsed = strategy();
        if (Array.isArray(parsed)) {
          return parsed.map((p: any) => ({
            content: p.content || p.text || p.topic || p.hook || p.cta || String(p),
            score: p.score || 75,
            reasoning: p.reasoning || 'AI generated',
            metadata: p.metadata
          })).sort((a, b) => (b.score || 0) - (a.score || 0));
        }
      } catch {
        continue;
      }
    }

    // Ultimate fallback
    return [{ content: 'Error parsing response', score: 0, reasoning: 'Parse failed' }];
  }
}
