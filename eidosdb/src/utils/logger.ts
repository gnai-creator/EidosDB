// src/utils/logger.ts

import type { SemanticIdea } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";

/**
 * Estrutura de métricas simbólicas calculadas.
 */
export interface SymbolicMetrics {
  averageV: number;
  dominantCluster: string | null;
}

/**
 * Calcula métricas simbólicas como v médio e cluster dominante.
 */
export function computeSymbolicMetrics(
  ideas: SemanticIdea[],
  c: number = DEFAULT_C,
): SymbolicMetrics {
  if (ideas.length === 0) {
    return { averageV: 0, dominantCluster: null };
  }

  let sumV = 0;
  const clusterWeights = new Map<string, number>();

  for (const idea of ideas) {
    const v = calculateV(idea.w, idea.r, c);
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

  return {
    averageV: sumV / ideas.length,
    dominantCluster,
  };
}

/**
 * Faz log das métricas simbólicas atuais do armazenamento.
 */
export async function logSymbolicMetrics(
  provider: { snapshot: () => Promise<SemanticIdea[]> },
  c: number = DEFAULT_C,
): Promise<void> {
  const snapshot = await provider.snapshot();
  const metrics = computeSymbolicMetrics(snapshot, c);
  console.log(
    `📊 v médio: ${metrics.averageV.toFixed(4)} | cluster dominante: ${
      metrics.dominantCluster ?? "nenhum"
    }`,
  );
}

