// src/storage/memoryStore.ts

import type { SemanticIdea, QuerySelectors } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";
import { saveToDisk, loadFromDisk } from "./persistence";
import type { StorageAdapter } from "./storageAdapter";

/**
 * Armazenamento simbólico em memória.
 */
export class MemoryStore implements StorageAdapter {
  private memory: Map<string, SemanticIdea[]> = new Map();
  private readonly decayFactor: number = 0.95; // 5% de perda por tick
  private readonly minW: number = 1e-6; // Valor mínimo simbólico

  /**
   * Remove ideias expiradas baseadas em timestamp + ttl.
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [user, ideas] of this.memory) {
      this.memory.set(
        user,
        ideas.filter((idea) => {
          if (idea.ttl === undefined || idea.timestamp === undefined) return true;
          return idea.timestamp + idea.ttl > now;
        }),
      );
    }
  }

  /**
   * Aplica decaimento simbólico em todos os pontos da memória.
   */
  async tick(): Promise<void> {
    this.cleanupExpired();
    for (const [user, ideas] of this.memory) {
      this.memory.set(
        user,
        ideas.map((idea) => ({
          ...idea,
          w: Math.max(idea.w * this.decayFactor, this.minW),
        })),
      );
    }
  }

  /**
   * Reestimula uma ideia simbólica, mantendo-a viva.
   */
  async reinforce(userId: string, id: string, factor: number = 1.1): Promise<void> {
    this.cleanupExpired();
    const ideas = this.memory.get(userId);
    if (!ideas) return;
    this.memory.set(
      userId,
      ideas.map((idea) => (idea.id === id ? { ...idea, w: idea.w * factor } : idea)),
    );
  }

  /**
   * Salva os dados atuais em disco.
   */
  async save(filePath?: string): Promise<void> {
    this.cleanupExpired();
    const allIdeas = Array.from(this.memory.values()).flat();
    saveToDisk(allIdeas, filePath);
  }

  /**
   * Carrega dados do disco, substituindo a memória atual.
   */
  async load(filePath?: string): Promise<void> {
    const loaded = loadFromDisk(filePath);
    this.memory.clear();
    for (const idea of loaded) {
      const arr = this.memory.get(idea.userId) ?? [];
      arr.push(idea);
      this.memory.set(idea.userId, arr);
    }
    this.cleanupExpired();
  }

  /**
   * Insere uma nova ideia simbólica na memória.
   */
  async insert(idea: SemanticIdea): Promise<void> {
    this.cleanupExpired();
    if (!idea.timestamp) {
      idea.timestamp = Date.now();
    }
    const arr = this.memory.get(idea.userId) ?? [];
    arr.push(idea);
    this.memory.set(idea.userId, arr);
  }

  /**
   * Retorna as ideias avaliadas e ordenadas por v (desc).
   */
  async query(
    w: number,
    selectors: QuerySelectors,
    c: number = DEFAULT_C
  ): Promise<(SemanticIdea & { v: number })[]> {
    this.cleanupExpired();
    const ideas = this.memory.get(selectors.userId) ?? [];
    return ideas
      .filter((idea) => {
        if (selectors.context && idea.context !== selectors.context) return false;

        if (selectors.tags && selectors.tags.length > 0) {
          if (!idea.tags) return false;
          if (!selectors.tags.every((tag) => idea.tags!.includes(tag))) return false;
        }

        if (selectors.metadata) {
          for (const [key, value] of Object.entries(selectors.metadata)) {
            const ideaVal = idea.metadata?.[key];
            if (Array.isArray(value)) {
              if (!Array.isArray(ideaVal)) return false;
              if (!value.every((v) => (ideaVal as any[]).includes(v))) return false;
            } else {
              if (ideaVal !== value) return false;
            }
          }
        }

        return true;
      })
      .map((idea) => ({
        ...idea,
        v: calculateV(w, idea.r, c),
      }))
      .sort((a, b) => b.v - a.v);
  }

  /**
   * Limpa a memória simbólica.
   */
  async clear(): Promise<void> {
    this.memory.clear();
  }

  /**
   * Cria um snapshot profundo da memória atual.
   */
  async snapshot(userId?: string): Promise<SemanticIdea[]> {
    this.cleanupExpired();
    if (userId) {
      return (this.memory.get(userId) ?? []).map((idea) => ({ ...idea }));
    }
    return Array.from(this.memory.values())
      .flat()
      .map((idea) => ({ ...idea }));
  }

  /**
   * Restaura o estado da memória a partir de um snapshot.
   */
  async restore(snapshot: SemanticIdea[], userId?: string): Promise<void> {
    if (userId) {
      this.memory.set(
        userId,
        snapshot.map((idea) => ({ ...idea, userId })),
      );
    } else {
      this.memory.clear();
      for (const idea of snapshot) {
        const arr = this.memory.get(idea.userId) ?? [];
        arr.push({ ...idea });
        this.memory.set(idea.userId, arr);
      }
    }
    this.cleanupExpired();
  }
}
