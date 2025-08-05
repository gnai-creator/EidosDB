// src/storage/symbolicStore.ts

import type { SemanticIdea, QuerySelectors } from "../core/symbolicTypes";
import type { StorageAdapter } from "./storageAdapter";
import { MemoryStore } from "./memoryStore";

/**
 * Fachada que delega operações a um adaptador de armazenamento.
 */
export class EidosStore {
  constructor(private adapter: StorageAdapter = new MemoryStore()) {}

  insert(idea: SemanticIdea): Promise<void> {
    return this.adapter.insert(idea);
  }

  query(
    w: number,
    c?: number,
    selectors?: QuerySelectors
  ): Promise<(SemanticIdea & { v: number })[]> {
    return this.adapter.query(w, c, selectors);
  }

  tick(): Promise<void> {
    return this.adapter.tick();
  }

  reinforce(id: string, factor?: number): Promise<void> {
    return this.adapter.reinforce(id, factor);
  }

  save(filePath?: string): Promise<void> {
    return this.adapter.save(filePath);
  }

  load(filePath?: string): Promise<void> {
    return this.adapter.load(filePath);
  }

  clear(): Promise<void> {
    return this.adapter.clear();
  }

  snapshot(): Promise<SemanticIdea[]> {
    return this.adapter.snapshot();
  }

  restore(snapshot: SemanticIdea[]): Promise<void> {
    return this.adapter.restore(snapshot);
  }
}
