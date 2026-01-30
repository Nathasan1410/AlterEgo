/**
 * Application Configuration
 * Centralized environment variables and feature flags
 */

export const config = {
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    defaultModel: 'llama-3.3-70b-versatile'
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY || ''
  },
  opik: {
    apiKey: process.env.OPIK_API_KEY || '',
    projectName: 'commit-to-career'
  },
  features: {
    useMock: process.env.USE_MOCK === 'true', // For testing without burning credits
    enableCache: process.env.ENABLE_CACHE === 'true'
  }
};
