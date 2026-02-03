import { PromptBuilder } from "../../src/services/prompts/promptBuilder";
import { TopicInput, HookInput, BodyInput } from "../../src/models/generated";

describe("PromptBuilder", () => {
  describe("buildTopicsPrompt", () => {
    it("should replace placeholders correctly", () => {
      const input: TopicInput = { input: "AI Productivity", researchDepth: 5 };
      const prompt = PromptBuilder.buildTopicsPrompt(input);

      expect(prompt).toContain("AI Productivity");
      expect(prompt).toContain("Research Depth: 5");
    });

    it("should use default research depth if not provided", () => {
      const input: TopicInput = { input: "Remote Work" };
      const prompt = PromptBuilder.buildTopicsPrompt(input);

      expect(prompt).toContain("Research Depth: 3");
    });
  });

  describe("buildHooksPrompt", () => {
    it("should insert topic and intent", () => {
      const input: HookInput = { topic: "Coding", intent: "storytelling" };
      const prompt = PromptBuilder.buildHooksPrompt(input);

      expect(prompt).toContain('post about: "Coding"');
      expect(prompt).toContain("Intent: storytelling");
    });
  });

  describe("buildBodyPrompt", () => {
    it("should construct full body prompt", () => {
      const input: BodyInput = {
        hook: "My Hook",
        topic: "My Topic",
        length: "short",
        tone: 8,
        styleProfile: "Casual",
        researchContext: "Some facts",
      };
      const prompt = PromptBuilder.buildBodyPrompt(input);

      expect(prompt).toContain('Hook: "My Hook"');
      expect(prompt).toContain("Length: short");
      expect(prompt).toContain("Tone: 8/10");
      expect(prompt).toContain("Style Context: Casual");
      expect(prompt).toContain("Research Context: Some facts");
    });
  });
});
