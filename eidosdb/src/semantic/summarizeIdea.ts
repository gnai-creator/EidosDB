// src/semantic/summarizeIdea.ts
import type { SemanticIdea } from "../core/symbolicTypes";

/**
 * Gera um resumo textual curto de uma ideia semântica.
 * Inclui tags, emoção e um trecho do rótulo.
 */
export function summarizeIdea(idea: SemanticIdea): string {
  const parts: string[] = [];
  if (idea.tags && idea.tags.length > 0) {
    parts.push(`tags: ${idea.tags.join(", ")}`);
  }
  const emotion = idea.metadata?.emotion;
  if (emotion) {
    parts.push(`emotion: ${emotion}`);
  }
  let label = idea.label || "";
  if (label.length > 80) {
    label = label.slice(0, 80) + "...";
  }
  parts.push(label);
  return parts.join(" | ");
}
