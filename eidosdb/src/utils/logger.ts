// src/utils/logger.ts

import type { SemanticIdea } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";

/**
 * Estrutura de métricas simbólicas calculadas.
 */
export interface SymbolicMetrics {
  averageV: number;
  dominantCluster: string | null;
  heatmap: number[][];
}

/**
 * Calcula métricas simbólicas como v médio e cluster dominante.
 */
export function computeSymbolicMetrics(
  ideas: SemanticIdea[],
  c: number = DEFAULT_C,
): SymbolicMetrics {
  if (ideas.length === 0) {
    return { averageV: 0, dominantCluster: null, heatmap: [] };
  }

  let sumV = 0;
  const clusterWeights = new Map<string, number>();

  // Lista de valores de v para construir o mapa de calor
  const valoresV: number[] = [];

  for (const idea of ideas) {
    const v = calculateV(idea.w, idea.r, c);
    valoresV.push(v);
    sumV += v;
    clusterWeights.set(
      idea.context,
      (clusterWeights.get(idea.context) ?? 0) + idea.w,
    );
  }

  let dominantCluster: string | null = null;
  let maxWeight = -Infinity;
  for (const [context, weight] of clusterWeights) {
    if (weight > maxWeight) {
      dominantCluster = context;
      maxWeight = weight;
    }
  }

  // Converte a lista linear de v em uma grade quadrada para o heatmap
  const tamanho = Math.ceil(Math.sqrt(valoresV.length));
  const heatmap: number[][] = Array.from({ length: tamanho }, () =>
    Array(tamanho).fill(0),
  );
  valoresV.forEach((v, idx) => {
    const linha = Math.floor(idx / tamanho);
    const coluna = idx % tamanho;
    heatmap[linha][coluna] = v;
  });

  return {
    averageV: sumV / ideas.length,
    dominantCluster,
    heatmap,
  };
}

/**
 * Faz log das métricas simbólicas atuais do armazenamento.
 */
export async function logSymbolicMetrics(
  provider: { snapshot: (userId?: string) => Promise<SemanticIdea[]> },
  userId?: string,
  c: number = DEFAULT_C,
): Promise<void> {
  const snapshot = await provider.snapshot(userId);
  const metrics = computeSymbolicMetrics(snapshot, c);
  console.log(
    `📊 v médio: ${metrics.averageV.toFixed(4)} | cluster dominante: ${
      metrics.dominantCluster ?? "nenhum"
    }`,
  );
}

