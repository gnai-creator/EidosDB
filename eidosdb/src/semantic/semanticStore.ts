// src/semantic/semanticStore.ts
import { SemanticIdea } from "../core/symbolicTypes";

export class SemanticStore {
  private ideasById = new Map<string, SemanticIdea>();
  private ideasByContext = new Map<string, SemanticIdea[]>();

  /**
   * Remove entradas expiradas de ambos os mapas.
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [id, idea] of this.ideasById) {
      if (idea.ttl && idea.timestamp && idea.timestamp + idea.ttl <= now) {
        this.ideasById.delete(id);
        const arr = this.ideasByContext.get(idea.context);
        if (arr) {
          const idx = arr.findIndex((i) => i.id === id);
          if (idx !== -1) arr.splice(idx, 1);
          if (arr.length === 0) this.ideasByContext.delete(idea.context);
        }
      }
    }
  }

  insert(idea: SemanticIdea) {
    this.cleanupExpired();
    if (!idea.timestamp) {
      idea.timestamp = Date.now();
    }
    this.ideasById.set(idea.id, idea);
    if (!this.ideasByContext.has(idea.context)) {
      this.ideasByContext.set(idea.context, []);
    }
    this.ideasByContext.get(idea.context)!.push(idea);
  }

  getById(id: string): SemanticIdea | undefined {
    this.cleanupExpired();
    return this.ideasById.get(id);
  }

  getByContext(context: string): SemanticIdea[] {
    this.cleanupExpired();
    return this.ideasByContext.get(context) || [];
  }

  getAll(): SemanticIdea[] {
    this.cleanupExpired();
    return [...this.ideasById.values()];
  }
}
