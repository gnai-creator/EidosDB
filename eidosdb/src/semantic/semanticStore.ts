// src/semantic/semanticStore.ts
import { SemanticIdea } from "../core/symbolicTypes";

export class SemanticStore {
  private ideasById = new Map<string, SemanticIdea>();
  private ideasByContext = new Map<string, SemanticIdea[]>();

  insert(idea: SemanticIdea) {
    this.ideasById.set(idea.id, idea);
    if (!this.ideasByContext.has(idea.context)) {
      this.ideasByContext.set(idea.context, []);
    }
    this.ideasByContext.get(idea.context)!.push(idea);
  }

  getById(id: string): SemanticIdea | undefined {
    return this.ideasById.get(id);
  }

  getByContext(context: string): SemanticIdea[] {
    return this.ideasByContext.get(context) || [];
  }

  getAll(): SemanticIdea[] {
    return [...this.ideasById.values()];
  }
}
