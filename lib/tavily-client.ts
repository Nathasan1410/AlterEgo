// Tavily Client for Web Research
// Fetches trending news and context for LinkedIn posts

import { tavily } from '@tavily/core';

// Initialize Tavily client
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || '' });

export interface ResearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface ResearchResponse {
  results: ResearchResult[];
  query: string;
  answer?: string;
}

/**
 * Search for relevant news and information about a topic
 * Great for adding current context to LinkedIn posts
 */
export async function searchTopic(topic: string, maxResults: number = 5): Promise<ResearchResponse> {
  try {
    const response = await tavilyClient.search(topic, {
      searchDepth: 'advanced',
      maxResults,
      includeAnswer: true,
      includeRawContent: false,
    });

    return {
      query: topic,
      answer: response.answer,
      results: response.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score || 0,
      })),
    };
  } catch (error) {
    console.error('Tavily search error:', error);
    return {
      query: topic,
      results: [],
    };
  }
}

/**
 * Get trending news in a specific industry/niche
 */
export async function getTrendingNews(industry: string): Promise<ResearchResponse> {
  const query = `latest trending news ${industry} ${new Date().toISOString().split('T')[0]}`;
  return searchTopic(query, 3);
}

/**
 * Research a specific claim or statistic for fact-checking
 */
export async function factCheck(claim: string): Promise<ResearchResponse> {
  const query = `fact check: ${claim}`;
  return searchTopic(query, 3);
}

/**
 * Get context for a viral post topic
 */
export async function getPostContext(topic: string): Promise<string> {
  const research = await searchTopic(topic, 3);
  
  if (!research.results.length) {
    return '';
  }

  // Compile research into a context string for the LLM
  const contextParts = research.results.map(r => 
    `- ${r.title}: ${r.content.slice(0, 200)}...`
  );

  return `
Recent information about "${topic}":
${research.answer ? `Summary: ${research.answer}\n` : ''}
Sources:
${contextParts.join('\n')}
  `.trim();
}
