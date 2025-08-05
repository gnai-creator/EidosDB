// src/semantic/embedding.ts
/**
 * Gera um vetor de embedding semântico para um texto simbólico.
 * Por ora, é um mock. Depois pode ser integrado a um modelo real.
 */
export function generateEmbedding(text: string): number[] {
  // Mock simples: converter cada caractere para um valor e normalizar
  const raw = Array.from(text).map((c) => c.charCodeAt(0) % 100);
  const length = 128;
  const padded = [...raw, ...Array(length - raw.length).fill(0)].slice(
    0,
    length
  );
  return padded;
}
