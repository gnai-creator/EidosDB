// src/core/formula.ts

/**
 * Constante padrão da velocidade da luz (simbolicamente).
 */
export const DEFAULT_C = 299_792_458;

/**
 * Calcula a velocidade simbólica 'v' com base na fórmula:
 * v = 4 * w * r / (pi * sqrt(1 - (wr / c)^2))
 */
export function calculateV(
  w: number,
  r: number,
  c: number = DEFAULT_C
): number {
  const pi = Math.PI;
  const wr = w * r;
  const ratio = wr / c;

  if (ratio >= 1) {
    // aproximação máxima permitida — evita infinito ou NaN
    return Number.POSITIVE_INFINITY;
  }

  const denominator = pi * Math.sqrt(1 - ratio ** 2);
  return (4 * wr) / denominator;
}
