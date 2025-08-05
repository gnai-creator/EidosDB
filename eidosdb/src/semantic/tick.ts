// src/semantic/tick.ts
import { SemanticIdea } from "../core/symbolicTypes";

export function applyDecay(
  ideas: SemanticIdea[],
  decayFactor: number = 0.99,
  minThreshold: number = 0.001
): SemanticIdea[] {
  const now = Date.now();
  return ideas.filter((idea) => {
    // Expira ideias cujo tempo de vida (timestamp + ttl) foi atingido
    if (idea.ttl && idea.timestamp && idea.timestamp + idea.ttl <= now) {
      return false;
    }
    idea.w *= decayFactor;
    return idea.w >= minThreshold;
  });
}
