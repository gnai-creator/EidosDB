// src/storage/storageAdapter.ts

import type { SemanticIdea, QuerySelectors } from "../core/symbolicTypes";

/**
 * Interface para adaptadores de armazenamento simbólico.
 */
export interface StorageAdapter {
  insert(idea: SemanticIdea): Promise<void>;
  query(
    w: number,
    c?: number,
    selectors?: QuerySelectors
  ): Promise<(SemanticIdea & { v: number })[]>;
  tick(): Promise<void>;
  reinforce(id: string, factor?: number): Promise<void>;
  save(filePath?: string): Promise<void>;
  load(filePath?: string): Promise<void>;
  clear(): Promise<void>;
  snapshot(): Promise<SemanticIdea[]>;
  restore(snapshot: SemanticIdea[]): Promise<void>;
}
