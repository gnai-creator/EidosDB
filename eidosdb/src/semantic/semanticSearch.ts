// src/semantic/semanticSearch.ts
import { SemanticIdea } from "../core/symbolicTypes";
import { vectorSimilarity } from "./similarity";
import { AnnIndex } from "./annIndex";

/**
 * Busca exata de vizinhos mais próximos utilizando similaridade vetorial
 * (cosseno com fallback para dot product). Útil para conjuntos pequenos
 * de vetores.
 */
export function findNearestIdeas(
  ideas: SemanticIdea[],
  queryVector: number[],
  topK = 5
): SemanticIdea[] {
  return ideas
    .map((idea) => ({
      idea,
      score: vectorSimilarity(idea.vector, queryVector),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((entry) => entry.idea);
}

/**
 * Busca aproximada utilizando um índice ANN.
 * O índice é construído de forma simples via LSH com hiperplanos aleatórios
 * (ver `annIndex.ts`). Ele permite acelerar consultas em bases grandes
 * sacrificando um pouco de precisão.
 */
export function findNearestIdeasANN(
  ideas: SemanticIdea[],
  queryVector: number[],
  topK = 5
): SemanticIdea[] {
  if (ideas.length === 0) return [];
  const dims = ideas[0].vector.length;
  const index = new AnnIndex(dims);
  index.build(ideas);
  return index.query(queryVector, topK);
}

export { AnnIndex };
