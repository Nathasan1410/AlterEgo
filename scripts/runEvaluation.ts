// scripts/runEvaluation.ts
// Opik Evaluation Script - Run this to demo AI quality testing to judges
// Usage: npm run evaluate

import { Opik } from 'opik';
import { Groq } from 'groq-sdk';

// Initialize clients
const opik = new Opik({
  apiKey: process.env.OPIK_API_KEY,
  projectName: 'commit-to-career-evaluation'
});

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

// Test dataset - topics we want to evaluate
const testDataset = [
  { 
    input: "Tips for junior developers", 
    expectedTone: "Encouraging",
    expectedLength: "medium"
  },
  { 
    input: "Why networking matters for career growth", 
    expectedTone: "Professional",
    expectedLength: "medium"
  },
  { 
    input: "Lessons from my first year in tech", 
    expectedTone: "Storytelling",
    expectedLength: "medium"
  },
  { 
    input: "The future of AI in the workplace", 
    expectedTone: "Analytical",
    expectedLength: "medium"
  }
];

// Simple scoring functions
const scoreHook = (hook: string): Record<string, number> => {
  const hasHookPattern = (hook.includes('?') || hook.includes('!') || hook.toLowerCase().includes('why') || hook.toLowerCase().includes('how')) ? 1 : 0.5;
  const isConcise = hook.split(' ').length <= 20 ? 1 : 0.5;
  const notGeneric = (!hook.toLowerCase().includes('in this post') && !hook.toLowerCase().includes('today i want')) ? 1 : 0.3;
  const viralityScore = (hasHookPattern + isConcise + notGeneric) / 3;
  
  return {
    has_hook_pattern: hasHookPattern,
    is_concise: isConcise,
    not_generic: notGeneric,
    virality_score: viralityScore
  };
};

const scoreBody = (body: string, expectedLength: string): Record<string, number> => {
  const wordCount = body.split(' ').length;
  
  let lengthScore = 0;
  switch (expectedLength) {
    case 'short':
      lengthScore = (wordCount >= 50 && wordCount <= 100) ? 1 : 0.5;
      break;
    case 'medium':
      lengthScore = (wordCount >= 100 && wordCount <= 200) ? 1 : 0.5;
      break;
    case 'long':
      lengthScore = wordCount >= 200 ? 1 : 0.5;
      break;
  }
  
  return {
    length_score: lengthScore,
    has_formatting: body.includes('\n\n') ? 1 : 0.5,
    emoji_balance: (body.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length <= 5 ? 1 : 0.5,
    word_count: wordCount
  };
};

// Main evaluation function
async function runEvaluation() {
  console.log('='.repeat(60));
  console.log('OPIK EVALUATION - CommitToCareer AI Quality Testing');
  console.log('='.repeat(60));
  console.log('');
  
  const results: Array<{
    topic: string;
    hook: string;
    hookScores: Record<string, number>;
    bodyScores: Record<string, number>;
  }> = [];
  
  for (const testCase of testDataset) {
    console.log(`\nTesting: "${testCase.input}"`);
    console.log('-'.repeat(40));
    
    // Create evaluation trace
    const trace = opik.trace({
      name: "Evaluation_Run",
      input: testCase,
      tags: ["evaluation", "quality-check"],
      metadata: { expectedTone: testCase.expectedTone }
    });
    
    try {
      // Step 1: Generate hook
      const hookSpan = trace.span({
        name: "Generate_Hook",
        type: "llm",
        input: { topic: testCase.input },
        metadata: { step: "hook" }
      });
      
      const hookCompletion = await groq.chat.completions.create({
        messages: [{ 
          role: 'user', 
          content: `Write a viral LinkedIn hook for: "${testCase.input}". Return only the hook, nothing else.`
        }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
      });
      
      const hook = hookCompletion.choices[0]?.message?.content || '';
      const hookScores = scoreHook(hook);
      
      hookSpan.end();
      
      console.log(`  Hook: "${hook.substring(0, 60)}..."`);
      console.log(`  Hook Score: ${(hookScores.virality_score * 100).toFixed(0)}%`);
      
      // Step 2: Generate body
      const bodySpan = trace.span({
        name: "Generate_Body",
        type: "llm",
        input: { hook, topic: testCase.input },
        metadata: { step: "body" }
      });
      
      const bodyCompletion = await groq.chat.completions.create({
        messages: [{ 
          role: 'user', 
          content: `Write a ${testCase.expectedLength} LinkedIn post body for this hook: "${hook}". Topic: "${testCase.input}". Return only the body text.`
        }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
      });
      
      const body = bodyCompletion.choices[0]?.message?.content || '';
      const bodyScores = scoreBody(body, testCase.expectedLength);
      
      bodySpan.end();
      
      console.log(`  Body Length: ${bodyScores.word_count} words`);
      console.log(`  Length Score: ${(bodyScores.length_score * 100).toFixed(0)}%`);
      
      // Calculate overall score
      const overallScore = (hookScores.virality_score + bodyScores.length_score + bodyScores.has_formatting) / 3;
      
      trace.end();
      
      results.push({
        topic: testCase.input,
        hook,
        hookScores,
        bodyScores
      });
      
      console.log(`  Overall Score: ${(overallScore * 100).toFixed(0)}%`);
      
    } catch (error) {
      trace.end();
      console.log(`  ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('EVALUATION SUMMARY');
  console.log('='.repeat(60));
  
  const avgViralityScore = results.reduce((sum, r) => sum + r.hookScores.virality_score, 0) / results.length;
  const avgLengthScore = results.reduce((sum, r) => sum + r.bodyScores.length_score, 0) / results.length;
  
  console.log(`\nTests Run: ${results.length}`);
  console.log(`Average Hook Virality: ${(avgViralityScore * 100).toFixed(0)}%`);
  console.log(`Average Length Accuracy: ${(avgLengthScore * 100).toFixed(0)}%`);
  console.log(`\nCheck Opik Dashboard to see detailed traces!`);
  console.log('https://www.comet.com/opik');
  
  // Flush traces
  await opik.flush();
}

// Run the evaluation
runEvaluation()
  .then(() => {
    console.log('\nEvaluation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Evaluation failed:', error);
    process.exit(1);
  });
