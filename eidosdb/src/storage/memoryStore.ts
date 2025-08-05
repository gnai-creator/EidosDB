// src/storage/memoryStore.ts

import type { DataPoint, EvaluatedPoint } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";

/**
 * Armazenamento em memória dos dados simbólicos.
 */
const dataPoints: DataPoint[] = [];

/**
 * Insere um novo ponto simbólico no banco.
 */
export function insertDataPoint(point: DataPoint): void {
  dataPoints.push(point);
}

/**
 * Retorna os dados avaliados e ordenados por v (desc).
 */
export function queryDataPoints(
  w: number,
  c: number = DEFAULT_C
): EvaluatedPoint[] {
  return dataPoints
    .map((point) => {
      const v = calculateV(w, point.r, c);
      return { ...point, v };
    })
    .sort((a, b) => b.v - a.v);
}

/**
 * Limpa todos os dados da memória (útil para testes).
 */
export function clearMemory(): void {
  dataPoints.length = 0;
}
