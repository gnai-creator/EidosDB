// src/semantic/search.ts
import { SemanticIdea } from "../core/symbolicTypes";

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB + 1e-8);
}

export function findNearestIdeas(
  ideas: SemanticIdea[],
  queryVector: number[],
  topK = 5
): SemanticIdea[] {
  return ideas
    .map((idea) => ({
      idea,
      score: cosineSimilarity(idea.vector, queryVector),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((entry) => entry.idea);
}
