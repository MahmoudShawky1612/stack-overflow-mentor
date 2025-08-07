import natural from 'natural';
import { findDuplicates } from './stackoverflow';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

// Train classifier with examples
classifier.addDocument('it doesn\'t work', 'vague');
classifier.addDocument('help me fix this', 'vague');
classifier.addDocument('getting error 404', 'specific');
classifier.train();

export async function analyzeQuestion(body: string) {
  const suggestions: string[] = [];
  
  // 1. Check for vague language in body only
  const bodyVague = classifier.classify(body) === 'vague';
  if (bodyVague) {
    suggestions.push('Try to be more specific about the problem');
  }

  // 2. Check for code snippets in body
  const hasCode = body.includes('```') || /<code>/.test(body);
  if (!hasCode) {
    suggestions.push('Consider adding a code example');
  }

  // 3. Check body length only
  if (body.length < 100) {
    suggestions.push('Add more details about what you\'ve tried');
  }

  // 4. Skip duplicate search (not requested)
  
  return {
    suggestions,
    qualityScore: calculateQualityScore(body, suggestions.length),
  };
}

function calculateQualityScore(body: string, issueCount: number): number {
  const baseScore = 80;
  const bodyScore = Math.min(body.length / 50, 20); // max 20 points
  return baseScore + bodyScore - (issueCount * 5);
}

