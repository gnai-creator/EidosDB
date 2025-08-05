// src/storage/symbolicStore.ts

import type { DataPoint, EvaluatedPoint } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";
import { saveToDisk, loadFromDisk } from "./persistence";

/**
 * Armazenamento simbólico encapsulado.
 */
export class EidosStore {
  private memory: DataPoint[] = [];

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
   * Insere um novo ponto simbólico na memória.
   */
  insert(point: DataPoint): void {
    this.memory.push(point);
  }

  /**
   * Retorna os pontos avaliados e ordenados por v (decrescente).
   */
  query(w: number, c: number = DEFAULT_C): EvaluatedPoint[] {
    return this.memory
      .map((point) => ({
        ...point,
        v: calculateV(w, point.r, c),
      }))
      .sort((a, b) => b.v - a.v);
  }

  /**
   * Retorna apenas o ponto mais “presente” simbolicamente.
   */
  getMostRelevant(
    w: number,
    c: number = DEFAULT_C
  ): EvaluatedPoint | undefined {
    return this.query(w, c)[0];
  }

  /**
   * Limpa a memória simbólica.
   */
  clear(): void {
    this.memory.length = 0;
  }

  /**
   * Retorna todos os pontos crus (sem avaliar).
   */
  dump(): DataPoint[] {
    return [...this.memory];
  }
}
