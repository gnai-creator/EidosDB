// src/storage/memoryStore.ts

import { SemanticIdea } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";

/**
 * Armazenamento em memória dos dados simbólicos com vetor.
 */
const ideaStore: SemanticIdea[] = [];

/**
 * Insere uma nova ideia simbólica no banco.
 */
export function insertIdea(idea: SemanticIdea): void {
  ideaStore.push(idea);
}

/**
 * Consulta as ideias ordenadas por v (descendente) com base em w de consulta.
 */
export function queryIdeasByW(
  w: number,
  c: number = DEFAULT_C
): (SemanticIdea & { v: number })[] {
  return ideaStore
    .map((idea) => ({
      ...idea,
      v: calculateV(w, idea.r, c),
    }))
    .sort((a, b) => b.v - a.v);
}

/**
 * Limpa todas as ideias da memória (útil para testes).
 */
export function clearMemory(): void {
  ideaStore.length = 0;
}
