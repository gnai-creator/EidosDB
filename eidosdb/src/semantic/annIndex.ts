// src/semantic/annIndex.ts
import { SemanticIdea } from "../core/symbolicTypes";
import { cosineSimilarity } from "./similarity";

/**
 * Índice de vizinhança aproximada baseado em LSH (Locality Sensitive Hashing).
 * Utiliza hiperplanos aleatórios para particionar o espaço vetorial.
 * Ideias que caem no mesmo bucket têm grande chance de estar próximas.
 */
export class AnnIndex {
  private tables: Map<string, SemanticIdea[]>[] = [];
  private projections: number[][][] = [];

  constructor(
    private dimensions: number,
    private numTables: number = 4,
    private numHyperplanes: number = 10
  ) {
    // Pré-geração de hiperplanos aleatórios para cada tabela.
    for (let t = 0; t < numTables; t++) {
      this.tables.push(new Map());
      const planes: number[][] = [];
      for (let h = 0; h < numHyperplanes; h++) {
        planes.push(
          Array.from({ length: dimensions }, () => Math.random() * 2 - 1)
        );
      }
      this.projections.push(planes);
    }
  }

  /**
     * Adiciona uma ideia ao índice, calculando o hash em todas as tabelas.
     */
  add(idea: SemanticIdea): void {
    for (let t = 0; t < this.numTables; t++) {
      const hash = this.hash(idea.vector, t);
      const bucket = this.tables[t].get(hash) ?? [];
      bucket.push(idea);
      this.tables[t].set(hash, bucket);
    }
  }

  /**
   * Constrói o índice com uma lista de ideias.
   */
  build(ideas: SemanticIdea[]): void {
    ideas.forEach((i) => this.add(i));
  }

  /**
   * Consulta aproximada: busca candidatos nos buckets correspondentes
   * e avalia apenas esse subconjunto com similaridade de cosseno.
   */
  query(queryVector: number[], topK = 5): SemanticIdea[] {
    const candidates = new Set<SemanticIdea>();
    for (let t = 0; t < this.numTables; t++) {
      const hash = this.hash(queryVector, t);
      const bucket = this.tables[t].get(hash);
      if (bucket) bucket.forEach((i) => candidates.add(i));
    }
    const list = Array.from(candidates);
    if (list.length === 0) return [];

    return list
      .map((idea) => ({
        idea,
        score: cosineSimilarity(idea.vector, queryVector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((e) => e.idea);
  }

  /**
   * Calcula o hash de LSH para um vetor em uma tabela específica.
   */
  private hash(vector: number[], tableIndex: number): string {
    const planes = this.projections[tableIndex];
    let bits = "";
    for (const plane of planes) {
      const dot = vector.reduce((sum, v, i) => sum + v * plane[i], 0);
      bits += dot >= 0 ? "1" : "0";
    }
    return bits;
  }
}
