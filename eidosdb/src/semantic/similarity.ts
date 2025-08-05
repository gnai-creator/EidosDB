// src/semantic/similarity.ts
// Funções utilitárias para cálculo de similaridade vetorial.

/**
 * Calcula o produto escalar entre dois vetores.
 * Útil como medida de similaridade simples ou como fallback.
 */
export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
}

/**
 * Calcula a similaridade de cosseno entre dois vetores numéricos.
 * Retorna um valor entre -1 e 1 que indica o quão alinhados estão.
 * Se a norma de algum vetor for zero, realiza fallback para o
 * produto escalar simples.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = dotProduct(a, b);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  const denom = normA * normB;
  return denom === 0 ? dot : dot / (denom + 1e-8);
}

/**
 * Similaridade vetorial genérica com fallback.
 * Por padrão usa o cosseno; se esse cálculo não for válido,
 * recorre ao produto escalar (dot product).
 */
export function vectorSimilarity(
  a: number[],
  b: number[],
  method: "cosine" | "dot" = "cosine"
): number {
  if (method === "dot") return dotProduct(a, b);
  return cosineSimilarity(a, b);
}

