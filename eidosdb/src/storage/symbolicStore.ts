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
    selectors: QuerySelectors,
    c?: number
  ): Promise<(SemanticIdea & { v: number })[]> {
    return this.adapter.query(w, selectors, c);
  }

  tick(): Promise<void> {
    return this.adapter.tick();
  }

  reinforce(userId: string, id: string, factor?: number): Promise<void> {
    return this.adapter.reinforce(userId, id, factor);
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

  snapshot(userId?: string): Promise<SemanticIdea[]> {
    return this.adapter.snapshot(userId);
  }

  restore(snapshot: SemanticIdea[], userId?: string): Promise<void> {
    return this.adapter.restore(snapshot, userId);
  }
}
