// src/storage/memoryStore.ts

import { SemanticIdea } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";

/**
 * Armazenamento em memória dos dados simbólicos com vetor.
 */
const ideaStore: SemanticIdea[] = [];

/**
 * Remove ideias expiradas baseadas em timestamp + ttl.
 */
function cleanupExpired() {
  const now = Date.now();
  for (let i = ideaStore.length - 1; i >= 0; i--) {
    const idea = ideaStore[i];
    if (idea.ttl && idea.timestamp && idea.timestamp + idea.ttl <= now) {
      ideaStore.splice(i, 1);
    }
  }
}

/**
 * Insere uma nova ideia simbólica no banco.
 */
export function insertIdea(idea: SemanticIdea): void {
  cleanupExpired();
  if (!idea.timestamp) {
    idea.timestamp = Date.now();
  }
  ideaStore.push(idea);
}

/**
 * Consulta as ideias ordenadas por v (descendente) com base em w de consulta.
 */
export function queryIdeasByW(
  w: number,
  c: number = DEFAULT_C
): (SemanticIdea & { v: number })[] {
  cleanupExpired();
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
