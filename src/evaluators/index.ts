/**
 * Evaluators Logic
 * Rule-based evaluation functions for fast feedback
 */

import { EvaluationResult } from '../models/generated';

/**
 * Style Consistency Evaluator
 */
export const evaluateStyle = async (content: string, styleProfile?: any): Promise<EvaluationResult> => {
  const hasEmojis = /[\u{1F600}-\u{1F64F}]/u.test(content);
  const shortParagraphs = content.split('\n\n').length > 2;
  const hasQuestion = content.includes('?');
  
  let score = 0.5;
  if (styleProfile) {
    if (styleProfile.emojiUsage === 'Heavy' && hasEmojis) score += 0.15;
    if (styleProfile.formatting?.includes('Short') && shortParagraphs) score += 0.15;
    if (styleProfile.closings?.includes('question') && hasQuestion) score += 0.2;
  } else {
    // Default checks if no profile
    if (shortParagraphs) score += 0.2;
    if (hasQuestion) score += 0.1;
  }
  
  return {
    metricName: 'Style Consistency',
    score: Math.min(score, 1),
    reasoning: `Analyzed formatting and vocabulary match against profile`,
  };
};

/**
 * Virality Prediction Evaluator
 */
export const evaluateVirality = (content: string): EvaluationResult => {
  let score = 0.3; // Base score
  
  // Viral indicators
  const firstLine = content.split('\n')[0] || '';
  const hasHook = firstLine.length < 100 && firstLine.length > 10;
  const hasNumbers = /\d+/.test(content);
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(content);
  const hasCTA = /comment|share|follow|agree|thoughts/i.test(content);
  const hasStory = /I |my |when I|years ago/i.test(content);
  
  if (hasHook) score += 0.2;
  if (hasNumbers) score += 0.1;
  if (hasEmoji) score += 0.05;
  if (hasCTA) score += 0.15;
  if (hasStory) score += 0.2;
  
  return {
    metricName: 'Virality Prediction',
    score: Math.min(score, 1),
    reasoning: `Hook strength, storytelling elements, and call-to-action presence`,
  };
};

/**
 * Engagement Potential Evaluator
 */
export const evaluateEngagement = (content: string): EvaluationResult => {
  let score = 0.4;
  
  const hasQuestion = content.includes('?');
  const hasControversial = /but |however|disagree|unpopular/i.test(content);
  const hasValue = /tip|learn|secret|mistake|how to/i.test(content);
  const endsWithQuestion = content.trim().endsWith('?');
  
  if (hasQuestion) score += 0.15;
  if (hasControversial) score += 0.15;
  if (hasValue) score += 0.2;
  if (endsWithQuestion) score += 0.1;
  
  return {
    metricName: 'Engagement Potential',
    score: Math.min(score, 1),
    reasoning: `Questions, value propositions, and conversational triggers`,
  };
};

/**
 * Aggregate Evaluation
 */
export const evaluateContent = async (content: string, styleProfile?: any): Promise<EvaluationResult[]> => {
  const results = [
    evaluateVirality(content),
    evaluateEngagement(content)
  ];
  
  if (styleProfile) {
    results.push(await evaluateStyle(content, styleProfile));
  }
  
  return results;
};
