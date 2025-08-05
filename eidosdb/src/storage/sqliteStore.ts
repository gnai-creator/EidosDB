// src/storage/sqliteStore.ts

import Database from "better-sqlite3";
import type { SemanticIdea, QuerySelectors } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";
import { saveToDisk, loadFromDisk } from "./persistence";
import type { StorageAdapter } from "./storageAdapter";

/**
 * Armazenamento simbólico utilizando SQLite.
 */
export class SQLiteStore implements StorageAdapter {
  private db: Database.Database;
  private readonly decayFactor: number = 0.95;
  private readonly minW: number = 1e-6;

  constructor(file: string = "data/eidos.db") {
    this.db = new Database(file);
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS ideas (id TEXT PRIMARY KEY, data TEXT)"
    );
  }

  /**
   * Remove ideias expiradas do banco.
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const rows = this.db.prepare("SELECT id, data FROM ideas").all();
    const remove: string[] = [];
    rows.forEach((row: any) => {
      const idea: SemanticIdea = JSON.parse(row.data);
      if (idea.ttl && idea.timestamp && idea.timestamp + idea.ttl <= now) {
        remove.push(row.id);
      }
    });
    if (remove.length) {
      const stmt = this.db.prepare(
        `DELETE FROM ideas WHERE id IN (${remove.map(() => "?").join(",")})`
      );
      stmt.run(...remove);
    }
  }

  /**
   * Insere uma nova ideia.
   */
  async insert(idea: SemanticIdea): Promise<void> {
    this.cleanupExpired();
    if (!idea.timestamp) {
      idea.timestamp = Date.now();
    }
    const stmt = this.db.prepare(
      "INSERT OR REPLACE INTO ideas (id, data) VALUES (?, ?)"
    );
    stmt.run(idea.id, JSON.stringify(idea));
  }

  /**
   * Consulta ideias aplicando seletores.
   */
  async query(
    w: number,
    c: number = DEFAULT_C,
    selectors: QuerySelectors = {}
  ): Promise<(SemanticIdea & { v: number })[]> {
    this.cleanupExpired();
    const rows = this.db.prepare("SELECT data FROM ideas").all();
    const ideas: SemanticIdea[] = rows.map((r: any) => JSON.parse(r.data));
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
   * Aplica decaimento simbólico.
   */
  async tick(): Promise<void> {
    this.cleanupExpired();
    const rows = this.db.prepare("SELECT id, data FROM ideas").all();
    const update = this.db.prepare("UPDATE ideas SET data = ? WHERE id = ?");
    rows.forEach((row: any) => {
      const idea: SemanticIdea = JSON.parse(row.data);
      idea.w = Math.max(idea.w * this.decayFactor, this.minW);
      update.run(JSON.stringify(idea), row.id);
    });
  }

  /**
   * Reforça uma ideia.
   */
  async reinforce(id: string, factor: number = 1.1): Promise<void> {
    this.cleanupExpired();
    const row = this.db
      .prepare("SELECT data FROM ideas WHERE id = ?")
      .get(id) as any;
    if (!row) return;
    const idea: SemanticIdea = JSON.parse(row.data);
    idea.w = idea.w * factor;
    this.db
      .prepare("UPDATE ideas SET data = ? WHERE id = ?")
      .run(JSON.stringify(idea), id);
  }

  /**
   * Salva snapshot em disco.
   */
  async save(filePath?: string): Promise<void> {
    const data = await this.snapshot();
    saveToDisk(data, filePath);
  }

  /**
   * Carrega snapshot do disco.
   */
  async load(filePath?: string): Promise<void> {
    const data = loadFromDisk(filePath);
    await this.restore(data);
  }

  /**
   * Limpa todas as ideias do banco.
   */
  async clear(): Promise<void> {
    this.db.prepare("DELETE FROM ideas").run();
  }

  /**
   * Retorna snapshot completo.
   */
  async snapshot(): Promise<SemanticIdea[]> {
    this.cleanupExpired();
    const rows = this.db.prepare("SELECT data FROM ideas").all();
    return rows.map((r: any) => JSON.parse(r.data));
  }

  /**
   * Restaura estado a partir de snapshot.
   */
  async restore(snapshot: SemanticIdea[]): Promise<void> {
    const insert = this.db.prepare(
      "INSERT OR REPLACE INTO ideas (id, data) VALUES (?, ?)"
    );
    const trx = this.db.transaction((ideas: SemanticIdea[]) => {
      this.db.prepare("DELETE FROM ideas").run();
      ideas.forEach((idea) => insert.run(idea.id, JSON.stringify(idea)));
    });
    trx(snapshot);
  }
}
