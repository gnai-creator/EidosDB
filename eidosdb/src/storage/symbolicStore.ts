// src/storage/symbolicStore.ts

import type { SemanticIdea, QuerySelectors } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";
import { saveToDisk, loadFromDisk } from "./persistence";

/**
 * Armazenamento simbólico encapsulado.
 */
export class EidosStore {
  private memory: SemanticIdea[] = [];
  private readonly decayFactor: number = 0.95; // 5% de perda por tick
  private readonly minW: number = 1e-6; // Valor mínimo simbólico

  /**
   * Aplica decaimento simbólico em todos os pontos da memória.
   */
  tick(): void {
    this.memory = this.memory.map((idea) => ({
      ...idea,
      w: Math.max(idea.w * this.decayFactor, this.minW),
    }));
  }

  /**
   * Reestimula uma ideia simbólica, mantendo-a “viva”.
   */
  reinforce(id: string, factor: number = 1.1): void {
    this.memory = this.memory.map((idea) =>
      idea.id === id ? { ...idea, w: idea.w * factor } : idea
    );
  }

  /**
   * Salva os dados atuais em disco.
   */
  save(filePath?: string): void {
    saveToDisk(this.memory, filePath);
  }

  /**
   * Carrega dados do disco, substituindo a memória atual.
   */
  load(filePath?: string): void {
    this.memory = loadFromDisk(filePath);
  }

  /**
   * Insere uma nova ideia simbólica na memória.
   */
  insert(idea: SemanticIdea): void {
    this.memory.push(idea);
  }

  /**
   * Retorna as ideias avaliadas e ordenadas por v (desc).
   */
  query(
    w: number,
    c: number = DEFAULT_C,
    selectors: QuerySelectors = {}
  ): (SemanticIdea & { v: number })[] {
    return this.memory
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
   * Retorna apenas a ideia mais “presente” simbolicamente.
   */
  getMostRelevant(
    w: number,
    c: number = DEFAULT_C
  ): (SemanticIdea & { v: number }) | undefined {
    return this.query(w, c)[0];
  }

  /**
   * Limpa a memória simbólica.
   */
  clear(): void {
    this.memory.length = 0;
  }

  /**
   * Cria um snapshot profundo da memória atual.
   * Retorna uma cópia independente para evitar mutações externas.
   */
  snapshot(): SemanticIdea[] {
    return this.memory.map((idea) => ({ ...idea }));
  }

  /**
   * Restaura o estado da memória a partir de um snapshot.
   * Todo conteúdo existente é substituído pelo snapshot fornecido.
   */
  restore(snapshot: SemanticIdea[]): void {
    this.memory = snapshot.map((idea) => ({ ...idea }));
  }

  /**
   * Retorna todas as ideias sem avaliação (estado bruto).
   * Mantido como alias para `snapshot()` por compatibilidade.
   */
  dump(): SemanticIdea[] {
    return this.snapshot();
  }
}
