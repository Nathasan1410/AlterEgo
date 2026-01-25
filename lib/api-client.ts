// API Client for AlterEgo LinkedIn Post Generator
// All API calls to the /api/generate endpoint

export type GenerationType = 'topics' | 'hooks' | 'body' | 'cta';

interface GenerateContentParams {
  input: string;
  context?: string;
  intent?: string;
  length?: string;
  researchDepth?: number;
}

interface GenerateContentResponse {
  result: string[];
  error?: string;
}

interface PolishParams {
  content: string;
  tone: number;
  emojiDensity: number;
  language: string;
}

interface PolishResponse {
  result: string;
  error?: string;
}

/**
 * Generate content (topics, hooks, body, or CTA options)
 * Uses Opik tracing on the backend for observability
 */
export async function generateContent(
  type: GenerationType,
  params: GenerateContentParams
): Promise<GenerateContentResponse> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate content');
    }

    const data = await response.json();
    return { result: data.result || data.options || [] };
  } catch (error) {
    console.error(`Error generating ${type}:`, error);
    return {
      result: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Polish the final post with tone, emoji density, and language adjustments
 * Uses Opik tracing on the backend for observability
 */
export async function polishPost(params: PolishParams): Promise<PolishResponse> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'polish',
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to polish post');
    }

    const data = await response.json();
    return { result: data.result || data.polished || '' };
  } catch (error) {
    console.error('Error polishing post:', error);
    return {
      result: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate a complete post in one call (for faster generation)
 * Uses Opik tracing with parent span on the backend
 */
export async function generateCompletePost(params: {
  topic: string;
  intent: string;
  length: string;
  tone: number;
  emojiDensity: number;
  language: string;
}): Promise<{ result: string; error?: string }> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'complete',
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate complete post');
    }

    const data = await response.json();
    return { result: data.result || '' };
  } catch (error) {
    console.error('Error generating complete post:', error);
    return {
      result: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
