/**
 * Generation Orchestrator
 * Coordinates the flow of content generation across different adapters
 */

import {
  IModelAdapter,
  IResearchAdapter,
  IObservabilityAdapter,
  ICacheAdapter,
} from "../adapters/interfaces";
import {
  GeneratedOption,
  TopicInput,
  HookInput,
  BodyInput,
  CTAInput,
  PolishInput,
} from "../../models/generated";
import { evaluateContent } from "../../evaluators";
import { logger } from "../../utils/logger";
import { GenerationError, ValidationError } from "../../types/errors";

export class GenerationOrchestrator {
  private modelAdapter: IModelAdapter;
  private researchAdapter: IResearchAdapter;
  private observabilityAdapter: IObservabilityAdapter;
  private cacheAdapter?: ICacheAdapter;

  constructor(
    modelAdapter: IModelAdapter,
    researchAdapter: IResearchAdapter,
    observabilityAdapter: IObservabilityAdapter,
    cacheAdapter?: ICacheAdapter
  ) {
    this.modelAdapter = modelAdapter;
    this.researchAdapter = researchAdapter;
    this.observabilityAdapter = observabilityAdapter;
    this.cacheAdapter = cacheAdapter;
  }

  private getCacheKey(prefix: string, input: any): string {
    return `${prefix}:${JSON.stringify(input)}`;
  }

  private async withCache<T>(key: string, generator: () => Promise<T>): Promise<T> {
    if (!this.cacheAdapter) return generator();

    const cached = await this.cacheAdapter.get<T>(key);
    if (cached) {
      // Log cache hit if needed
      return cached;
    }

    const result = await generator();
    await this.cacheAdapter.set(key, result);
    return result;
  }

  /**
   * Step 1: Generate Topics
   * Optionally enriches with research if depth is high
   */
  async generateTopics(input: TopicInput): Promise<GeneratedOption[]> {
    try {
      if (!input.input || input.input.trim().length === 0) {
        throw new ValidationError("Topic input is required", "input", input.input);
      }

      return this.withCache(this.getCacheKey("topics", input), async () => {
        const trace = this.observabilityAdapter.trace("Generate_Topics", input, {
          tags: ["orchestrator", "topics"],
        });

        const result = await this.modelAdapter.generateTopics(input);

        trace.end();
        return result;
      });
    } catch (error) {
      logger.error("Failed to generate topics", error instanceof Error ? error : undefined, {
        input,
      });
      throw error instanceof GenerationError
        ? error
        : new GenerationError("Failed to generate topics", "GENERATION_FAILED", {
            originalError: error,
          });
    }
  }

  /**
   * Step 2: Generate Hooks
   */
  async generateHooks(input: HookInput): Promise<GeneratedOption[]> {
    try {
      if (!input.topic || input.topic.trim().length === 0) {
        throw new ValidationError("Topic is required for hooks", "topic", input.topic);
      }

      return this.withCache(this.getCacheKey("hooks", input), async () => {
        const trace = this.observabilityAdapter.trace("Generate_Hooks", input, {
          tags: ["orchestrator", "hooks"],
        });
        const result = await this.modelAdapter.generateHooks(input);
        trace.end();
        return result;
      });
    } catch (error) {
      logger.error("Failed to generate hooks", error instanceof Error ? error : undefined, {
        input,
      });
      throw error instanceof GenerationError
        ? error
        : new GenerationError("Failed to generate hooks", "GENERATION_FAILED", {
            originalError: error,
          });
    }
  }

  /**
   * Step 3: Generate Body
   * Injects style and research context
   */
  async generateBody(input: BodyInput): Promise<GeneratedOption[]> {
    try {
      if (!input.hook || input.hook.trim().length === 0) {
        throw new ValidationError("Hook is required for body", "hook", input.hook);
      }
      if (!input.topic || input.topic.trim().length === 0) {
        throw new ValidationError("Topic is required for body", "topic", input.topic);
      }

      return this.withCache(this.getCacheKey("body", input), async () => {
        const trace = this.observabilityAdapter.trace("Generate_Body", input, {
          tags: ["orchestrator", "body"],
        });

        const result = await this.modelAdapter.generateBody(input);
        trace.end();
        return result;
      });
    } catch (error) {
      logger.error("Failed to generate body", error instanceof Error ? error : undefined, {
        input,
      });
      throw error instanceof GenerationError
        ? error
        : new GenerationError("Failed to generate body", "GENERATION_FAILED", {
            originalError: error,
          });
    }
  }

  /**
   * Step 4: Generate CTA
   */
  async generateCTA(input: CTAInput): Promise<GeneratedOption[]> {
    try {
      if (!input.body || input.body.trim().length === 0) {
        throw new ValidationError("Body is required for CTA", "body", input.body);
      }

      return this.withCache(this.getCacheKey("cta", input), async () => {
        const trace = this.observabilityAdapter.trace("Generate_CTA", input, {
          tags: ["orchestrator", "cta"],
        });
        const result = await this.modelAdapter.generateCTA(input);
        trace.end();
        return result;
      });
    } catch (error) {
      logger.error("Failed to generate CTA", error instanceof Error ? error : undefined, { input });
      throw error instanceof GenerationError
        ? error
        : new GenerationError("Failed to generate CTA", "GENERATION_FAILED", {
            originalError: error,
          });
    }
  }

  /**
   * Step 5: Polish Content
   */
  async polishContent(input: PolishInput): Promise<{ content: string; scores?: any[] }> {
    try {
      if (!input.content || input.content.trim().length === 0) {
        throw new ValidationError("Content is required for polishing", "content", input.content);
      }

      return this.withCache(this.getCacheKey("polish", input), async () => {
        const trace = this.observabilityAdapter.trace("Polish_Content", input, {
          tags: ["orchestrator", "polish"],
        });

        const result = await this.modelAdapter.polishContent(input);

        const scores = await evaluateContent(result.content);

        this.observabilityAdapter.logEvaluation(input, result.content, scores);

        trace.end();
        return { content: result.content, scores };
      });
    } catch (error) {
      logger.error("Failed to polish content", error instanceof Error ? error : undefined, {
        input,
      });
      throw error instanceof GenerationError
        ? error
        : new GenerationError("Failed to polish content", "POLISH_FAILED", {
            originalError: error,
          });
    }
  }

  /**
   * Full Flow: Generate Complete Post (Shortcut)
   * Runs the full pipeline in one go (simplified)
   */
  async generateCompletePost(topic: string, params: any): Promise<any> {
    try {
      if (!topic || topic.trim().length === 0) {
        throw new ValidationError("Topic is required", "topic", topic);
      }

      const trace = this.observabilityAdapter.trace(
        "Generate_Complete_Post",
        { topic, params },
        { tags: ["orchestrator", "complete"] }
      );

      const hooks = await this.generateHooks({ topic, intent: params.intent });
      const selectedHook = hooks[0]?.content || topic;

      const bodies = await this.generateBody({
        hook: selectedHook,
        topic,
        intent: params.intent,
        length: params.length,
        tone: params.tone,
        emojiLevel: params.emojiDensity,
        language: params.language,
      });
      const selectedBody = bodies[0]?.content || "";

      const ctas = await this.generateCTA({ body: selectedBody, intent: params.intent });
      const selectedCTA = ctas[0]?.content || "";

      const draft = `${selectedHook}\n\n${selectedBody}\n\n${selectedCTA}`;
      const final = await this.polishContent({
        content: draft,
        tone: params.tone,
        emojiDensity: params.emojiDensity,
        language: params.language,
      });

      trace.end();
      await this.observabilityAdapter.flush();

      return {
        result: final.content,
        scores: final.scores,
      };
    } catch (error) {
      logger.error("Failed to generate complete post", error instanceof Error ? error : undefined, {
        topic,
        params,
      });
      throw error instanceof GenerationError
        ? error
        : new GenerationError("Failed to generate complete post", "COMPLETE_POST_FAILED", {
            originalError: error,
          });
    }
  }
}
