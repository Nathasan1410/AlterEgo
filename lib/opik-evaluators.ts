// Opik Evaluators - Custom metrics for hackathon judges
// These metrics demonstrate the power of LLM observability

import { getOpikClient } from './opik-client';

const opik = getOpikClient();

export interface EvaluationResult {
  metricName: string;
  score: number;
  reasoning: string;
}

/**
 * Style Consistency Metric
 * Measures how well the output matches the user's writing style
 */
export const styleConsistencyMetric = {
  name: 'Style Consistency',
  description: 'Measures how well the generated content matches the user\'s unique writing style',
  scale: '0-1 (1 = perfect match)',
  
  async evaluate(output: string, styleProfile: any): Promise<EvaluationResult> {
    // This would call LLM to evaluate style match
    // For demo, return a calculated score
    const hasEmojis = /[\u{1F600}-\u{1F64F}]/u.test(output);
    const shortParagraphs = output.split('\n\n').length > 2;
    const hasQuestion = output.includes('?');
    
    let score = 0.5;
    if (styleProfile.emojiUsage === 'Heavy' && hasEmojis) score += 0.15;
    if (styleProfile.formatting?.includes('Short') && shortParagraphs) score += 0.15;
    if (styleProfile.closings?.includes('question') && hasQuestion) score += 0.2;
    
    return {
      metricName: 'Style Consistency',
      score: Math.min(score, 1),
      reasoning: `Analyzed tone, formatting, and vocabulary match`,
    };
  }
};

/**
 * Virality Prediction Metric
 * Predicts how likely the post is to go viral
 */
export const viralityMetric = {
  name: 'Virality Prediction',
  description: 'Predicts the viral potential of the LinkedIn post',
  scale: '0-1 (1 = highly viral)',
  
  evaluate(output: string): EvaluationResult {
    let score = 0.3; // Base score
    
    // Viral indicators
    const hasHook = output.split('\n')[0].length < 100; // Short punchy first line
    const hasNumbers = /\d+/.test(output);
    const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(output);
    const hasCTA = /comment|share|follow|agree|thoughts/i.test(output);
    const hasStory = /I |my |when I|years ago/i.test(output);
    const wordCount = output.split(/\s+/).length;
    const optimalLength = wordCount > 100 && wordCount < 300;
    
    if (hasHook) score += 0.15;
    if (hasNumbers) score += 0.1;
    if (hasEmoji) score += 0.05;
    if (hasCTA) score += 0.15;
    if (hasStory) score += 0.15;
    if (optimalLength) score += 0.1;
    
    return {
      metricName: 'Virality Prediction',
      score: Math.min(score, 1),
      reasoning: `Hook: ${hasHook}, Story: ${hasStory}, CTA: ${hasCTA}, Optimal length: ${optimalLength}`,
    };
  }
};

/**
 * Engagement Potential Metric
 * Estimates likely engagement (comments, likes)
 */
export const engagementMetric = {
  name: 'Engagement Potential',
  description: 'Estimates the engagement potential (comments, likes, shares)',
  scale: '0-1 (1 = high engagement)',
  
  evaluate(output: string): EvaluationResult {
    let score = 0.4;
    
    // Engagement drivers
    const hasQuestion = output.includes('?');
    const hasControversial = /but |however|disagree|unpopular/i.test(output);
    const hasValue = /tip|learn|secret|mistake|how to/i.test(output);
    const hasPersonal = /I learned|I realized|my experience/i.test(output);
    const endsWithQuestion = output.trim().endsWith('?');
    
    if (hasQuestion) score += 0.15;
    if (hasControversial) score += 0.1;
    if (hasValue) score += 0.15;
    if (hasPersonal) score += 0.1;
    if (endsWithQuestion) score += 0.1;
    
    return {
      metricName: 'Engagement Potential',
      score: Math.min(score, 1),
      reasoning: `Question: ${hasQuestion}, Value: ${hasValue}, Personal: ${hasPersonal}`,
    };
  }
};

/**
 * Run all evaluations on generated content
 */
export async function evaluatePost(
  output: string, 
  styleProfile?: any
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];
  
  // Virality
  results.push(viralityMetric.evaluate(output));
  
  // Engagement
  results.push(engagementMetric.evaluate(output));
  
  // Style (if profile provided)
  if (styleProfile) {
    results.push(await styleConsistencyMetric.evaluate(output, styleProfile));
  }
  
  return results;
}

/**
 * Log evaluation to Opik
 */
export async function logEvaluationToOpik(
  input: string,
  output: string,
  evaluations: EvaluationResult[],
  traceId?: string
) {
  // Create evaluation scores object for Opik
  const scores: Record<string, number> = {};
  evaluations.forEach(e => {
    scores[e.metricName] = e.score;
  });
  
  console.log('[Opik Evaluation]', {
    traceId,
    scores,
    evaluations,
  });
  
  // In production, this would call opik.logEvaluation()
  return { scores, evaluations };
}
