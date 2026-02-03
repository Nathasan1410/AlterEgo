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
    return this.withCache(this.getCacheKey("topics", input), async () => {
      const trace = this.observabilityAdapter.trace("Generate_Topics", input, {
        tags: ["orchestrator", "topics"],
      });

      // Future: Use researchAdapter if input.researchDepth > 3
      // const research = await this.researchAdapter.search(input.input);

      const result = await this.modelAdapter.generateTopics(input);

      trace.end();
      return result;
    });
  }

  /**
   * Step 2: Generate Hooks
   */
  async generateHooks(input: HookInput): Promise<GeneratedOption[]> {
    return this.withCache(this.getCacheKey("hooks", input), async () => {
      const trace = this.observabilityAdapter.trace("Generate_Hooks", input, {
        tags: ["orchestrator", "hooks"],
      });
      const result = await this.modelAdapter.generateHooks(input);
      trace.end();
      return result;
    });
  }

  /**
   * Step 3: Generate Body
   * Injects style and research context
   */
  async generateBody(input: BodyInput): Promise<GeneratedOption[]> {
    return this.withCache(this.getCacheKey("body", input), async () => {
      const trace = this.observabilityAdapter.trace("Generate_Body", input, {
        tags: ["orchestrator", "body"],
      });

      // If research context is requested but not provided, fetch it
      if (!input.researchContext && input.topic && input.topic.length > 5) {
        // Only fetch if explicit intention (logic can be refined)
        // input.researchContext = await this.researchAdapter.getPostContext(input.topic);
      }

      const result = await this.modelAdapter.generateBody(input);
      trace.end();
      return result;
    });
  }

  /**
   * Step 4: Generate CTA
   */
  async generateCTA(input: CTAInput): Promise<GeneratedOption[]> {
    return this.withCache(this.getCacheKey("cta", input), async () => {
      const trace = this.observabilityAdapter.trace("Generate_CTA", input, {
        tags: ["orchestrator", "cta"],
      });
      const result = await this.modelAdapter.generateCTA(input);
      trace.end();
      return result;
    });
  }

  /**
   * Step 5: Polish Content
   */
  async polishContent(input: PolishInput): Promise<{ content: string; scores?: any[] }> {
    // Polish is usually unique, maybe shorter TTL or no cache
    // But let's cache it for consistency
    return this.withCache(this.getCacheKey("polish", input), async () => {
      const trace = this.observabilityAdapter.trace("Polish_Content", input, {
        tags: ["orchestrator", "polish"],
      });

      const result = await this.modelAdapter.polishContent(input);

      // Evaluate result
      const scores = await evaluateContent(result.content);

      // Log evaluation
      this.observabilityAdapter.logEvaluation(input, result.content, scores);

      trace.end();
      return { content: result.content, scores };
    });
  }

  /**
   * Full Flow: Generate Complete Post (Shortcut)
   * Runs the full pipeline in one go (simplified)
   */
  async generateCompletePost(topic: string, params: any): Promise<any> {
    const trace = this.observabilityAdapter.trace(
      "Generate_Complete_Post",
      { topic, params },
      { tags: ["orchestrator", "complete"] }
    );

    // 1. Hook
    const hooks = await this.generateHooks({ topic, intent: params.intent });
    const selectedHook = hooks[0]?.content || topic;

    // 2. Body
    const bodies = await this.generateBody({
      hook: selectedHook,
      topic,
      intent: params.intent,
      length: params.length,
      tone: params.tone,
      emojiLevel: params.emojiDensity, // Mapping param name
      language: params.language,
    });
    const selectedBody = bodies[0]?.content || "";

    // 3. CTA
    const ctas = await this.generateCTA({ body: selectedBody, intent: params.intent });
    const selectedCTA = ctas[0]?.content || "";

    // 4. Polish (Assembly done implicitly or via polish prompt)
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
  }
}
