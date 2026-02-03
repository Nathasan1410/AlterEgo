import { GenerationOrchestrator } from "../../src/services/orchestration/generationOrchestrator";
import {
  IModelAdapter,
  IResearchAdapter,
  IObservabilityAdapter,
  ICacheAdapter,
} from "../../src/services/adapters/interfaces";

// Mock implementations
const mockModelAdapter = {
  name: "MockModel",
  version: "1.0",
  healthCheck: jest.fn().mockResolvedValue(true),
  generateTopics: jest.fn().mockResolvedValue([{ content: "Topic A", score: 90 }]),
  generateHooks: jest.fn().mockResolvedValue([{ content: "Hook A", score: 80 }]),
  generateBody: jest.fn().mockResolvedValue([{ content: "Body A", score: 85 }]),
  generateCTA: jest.fn().mockResolvedValue([{ content: "CTA A", score: 88 }]),
  polishContent: jest.fn().mockResolvedValue({ content: "Polished", scores: [] }),
} as unknown as IModelAdapter;

const mockResearchAdapter = {
  name: "MockResearch",
  search: jest.fn().mockResolvedValue([]),
  getTrending: jest.fn().mockResolvedValue([]),
} as unknown as IResearchAdapter;

const mockObservabilityAdapter = {
  projectName: "MockOpik",
  trace: jest.fn().mockReturnValue({
    id: "trace-id",
    span: jest.fn().mockReturnValue({ id: "span-id", end: jest.fn() }),
    end: jest.fn(),
  }),
  logEvaluation: jest.fn(),
  flush: jest.fn().mockResolvedValue(undefined),
} as unknown as IObservabilityAdapter;

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
} as unknown as ICacheAdapter;

describe("GenerationOrchestrator", () => {
  let orchestrator: GenerationOrchestrator;

  beforeEach(() => {
    jest.clearAllMocks();
    orchestrator = new GenerationOrchestrator(
      mockModelAdapter,
      mockResearchAdapter,
      mockObservabilityAdapter,
      mockCacheAdapter
    );
  });

  it("should call model adapter and tracing when generating topics", async () => {
    const input = { input: "Test Topic" };
    const result = await orchestrator.generateTopics(input);

    expect(mockObservabilityAdapter.trace).toHaveBeenCalledWith(
      "Generate_Topics",
      input,
      expect.any(Object)
    );
    expect(mockModelAdapter.generateTopics).toHaveBeenCalledWith(input);
    expect(result[0].content).toBe("Topic A");
  });

  it("should check cache before calling model", async () => {
    // First call: Cache miss (mockCacheAdapter.get returns null by default)
    await orchestrator.generateHooks({ topic: "Cached Topic" });
    expect(mockModelAdapter.generateHooks).toHaveBeenCalledTimes(1);

    // Second call: Cache hit
    (mockCacheAdapter.get as jest.Mock).mockResolvedValueOnce([
      { content: "Cached Hook", score: 99 },
    ]);
    const result = await orchestrator.generateHooks({ topic: "Cached Topic" });

    expect(mockModelAdapter.generateHooks).toHaveBeenCalledTimes(1); // Still 1 call, not 2
    expect(result[0].content).toBe("Cached Hook");
  });

  it("should orchestrate complete post generation", async () => {
    const result = await orchestrator.generateCompletePost("My Topic", {
      intent: "viral",
      length: "short",
      tone: 5,
      language: "en",
    });

    expect(mockModelAdapter.generateHooks).toHaveBeenCalled();
    expect(mockModelAdapter.generateBody).toHaveBeenCalled();
    expect(mockModelAdapter.generateCTA).toHaveBeenCalled();
    expect(mockModelAdapter.polishContent).toHaveBeenCalled();
    expect(result.result).toBe("Polished");
  });
});
