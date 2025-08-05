// src/semantic/similarity.ts
// Funções utilitárias para cálculo de similaridade vetorial.

/**
 * Calcula a similaridade de cosseno entre dois vetores numéricos.
 * Retorna um valor entre -1 e 1 que indica o quão alinhados estão.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB + 1e-8);
}
