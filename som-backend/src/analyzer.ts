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

export async function analyzeQuestion(title: string, body: string) {
  const suggestions: string[] = [];
  
  // 1. Check for vague language
  const titleVague = classifier.classify(title) === 'vague';
  if (titleVague) {
    suggestions.push('Avoid vague phrases like "it doesn\'t work" in your title. Be specific!');
  }

  // 2. Check for code snippets
  const hasCode = body.includes('```') || /<code>/.test(body);
  if (!hasCode) {
    suggestions.push('Add a code snippet to demonstrate your problem');
  }

  // 3. Check question length
  if (body.length < 100) {
    suggestions.push('Add more details about what you\'ve tried and where you\'re stuck');
  }

  // 4. Find duplicates
  const duplicates = await findDuplicates(title);
  
  return {
    suggestions,
    duplicates,
    qualityScore: calculateQualityScore(title, body, suggestions.length),
  };
}

function calculateQualityScore(title: string, body: string, issueCount: number): number {
  const baseScore = 80;
  const titleScore = title.length > 15 ? 10 : -5;
  const bodyScore = Math.min(body.length / 50, 10);
  return baseScore + titleScore + bodyScore - (issueCount * 5);
}