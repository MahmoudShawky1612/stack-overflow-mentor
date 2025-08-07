import * as natural from "natural";
import { findDuplicates } from "./stackoverflow";

const classifier = new natural.BayesClassifier();

classifier.addDocument("it doesn't work", "vague");
classifier.addDocument("help me fix this", "vague");
classifier.addDocument("getting error 404", "specific");
classifier.train();

export async function analyzeQuestion(body: string, title: string) {
  const suggestions: string[] = [];

  const vaguePhrases = [
    "doesn't work",
    "not working",
    "something wrong",
    "help me",
  ];
  const isVague = vaguePhrases.some((phrase) =>
    body.toLowerCase().includes(phrase)
  );

  if (isVague) {
    suggestions.push("Try to be more specific about the problem");
  }

  const hasCode =
    body.includes("```") ||
    /<code>/.test(body) ||
    /function\s+\w+\(/.test(body) ||
    /def\s+\w+\(/.test(body);

  if (!hasCode) {
    suggestions.push("Consider adding a code example");
  }

  if (body.length < 50) {
    suggestions.push("Add more details about what you've tried");
  }

  const duplicates = await findDuplicates(title);

  return {
    suggestions,
    qualityScore: calculateQualityScore(body, suggestions.length),
    duplicates,
  };
}

function calculateQualityScore(body: string, issueCount: number): number {
  const baseScore = 80;
  const bodyScore = Math.min(body.length / 50, 20);
  return baseScore + bodyScore - issueCount * 5;
}
