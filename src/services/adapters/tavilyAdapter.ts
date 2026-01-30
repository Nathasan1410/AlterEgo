/**
 * Tavily Adapter - Implementation of IResearchAdapter
 */

import { tavily } from '@tavily/core';
import { IResearchAdapter, ResearchResult } from './interfaces';

export class TavilyAdapter implements IResearchAdapter {
  readonly name = 'Tavily';
  
  private client: any;

  constructor(apiKey: string) {
    this.client = tavily({ apiKey });
  }

  async search(query: string, maxResults: number = 5): Promise<ResearchResult[]> {
    try {
      const response = await this.client.search(query, {
        searchDepth: 'advanced',
        maxResults,
        includeAnswer: true,
        includeRawContent: false,
      });

      return response.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score || 0
      }));
    } catch (error) {
      console.error('Tavily search error:', error);
      return [];
    }
  }

  async getTrending(industry: string): Promise<ResearchResult[]> {
    const query = `latest trending news ${industry} ${new Date().toISOString().split('T')[0]}`;
    return this.search(query, 3);
  }

  async getPostContext(topic: string): Promise<string> {
    const research = await this.search(topic, 3);
    
    if (!research.length) return '';

    const contextParts = research.map(r => `- ${r.title}: ${r.content.slice(0, 200)}...`);
    return `Recent information about "${topic}":\n${contextParts.join('\n')}`;
  }
}
