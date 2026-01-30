import { GenerationOrchestrator } from './generationOrchestrator';
import { GroqAdapter } from '../adapters/groqAdapter';
import { TavilyAdapter } from '../adapters/tavilyAdapter';
import { OpikAdapter } from '../adapters/opikAdapter';
import { SimpleCache } from '../../cache/simpleCache';
import { config } from '../../config/config';

let orchestratorInstance: GenerationOrchestrator | null = null;

export const getOrchestrator = (): GenerationOrchestrator => {
  if (!orchestratorInstance) {
    const groqAdapter = new GroqAdapter(config.groq.apiKey, config.groq.defaultModel);
    const tavilyAdapter = new TavilyAdapter(config.tavily.apiKey);
    const opikAdapter = new OpikAdapter(config.opik.apiKey, config.opik.projectName);
    
    // Enable cache if configured
    const cacheAdapter = config.features.enableCache ? new SimpleCache() : undefined;
    
    orchestratorInstance = new GenerationOrchestrator(
      groqAdapter, 
      tavilyAdapter, 
      opikAdapter,
      cacheAdapter
    );
  }
  return orchestratorInstance;
};
