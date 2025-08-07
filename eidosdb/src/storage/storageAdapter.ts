// src/storage/storageAdapter.ts

import type { SemanticIdea, QuerySelectors } from "../core/symbolicTypes";

/**
 * Interface para adaptadores de armazenamento simbólico.
 */
export interface StorageAdapter {
  insert(idea: SemanticIdea): Promise<void>;
  query(
    w: number,
    selectors: QuerySelectors,
    c?: number
  ): Promise<(SemanticIdea & { v: number })[]>;
  tick(): Promise<void>;
  reinforce(userId: string, id: string, factor?: number): Promise<void>;
  save(filePath?: string): Promise<void>;
  load(filePath?: string): Promise<void>;
  clear(): Promise<void>;
  snapshot(userId?: string): Promise<SemanticIdea[]>;
  restore(snapshot: SemanticIdea[], userId?: string): Promise<void>;
}
