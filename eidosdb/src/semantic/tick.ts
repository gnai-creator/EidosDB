// src/semantic/tick.ts
import { SemanticIdea } from "../core/symbolicTypes";

export function applyDecay(
  ideas: SemanticIdea[],
  decayFactor: number = 0.99,
  minThreshold: number = 0.001
): SemanticIdea[] {
  return ideas.filter((idea) => {
    idea.w *= decayFactor;
    return idea.w >= minThreshold;
  });
}
