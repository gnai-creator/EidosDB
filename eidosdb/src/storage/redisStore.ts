// src/storage/redisStore.ts

import { createClient, type RedisClientType } from "redis";
import type { SemanticIdea, QuerySelectors } from "../core/symbolicTypes";
import { calculateV, DEFAULT_C } from "../core/formula";
import { saveToDisk, loadFromDisk } from "./persistence";
import type { StorageAdapter } from "./storageAdapter";

/**
 * Armazenamento simbólico usando Redis.
 */
export class RedisStore implements StorageAdapter {
  private client: RedisClientType;
  private readonly decayFactor: number = 0.95;
  private readonly minW: number = 1e-6;

  constructor(url?: string) {
    this.client = createClient({ url });
    this.client.connect().catch((err) => console.error("Redis connect", err));
  }

  /**
   * Limpa ideias expiradas no Redis.
   */
  private async cleanupExpired(): Promise<void> {
    const ids = await this.client.sMembers("ideas:ids");
    const now = Date.now();
    for (const id of ids) {
      const raw = await this.client.get(`idea:${id}`);
      if (!raw) {
        await this.client.sRem("ideas:ids", id);
        continue;
      }
      const idea: SemanticIdea = JSON.parse(raw);
      if (idea.ttl && idea.timestamp && idea.timestamp + idea.ttl <= now) {
        await this.client.del(`idea:${id}`);
        await this.client.sRem("ideas:ids", id);
      }
    }
  }

  /**
   * Insere uma nova ideia no Redis.
   */
  async insert(idea: SemanticIdea): Promise<void> {
    await this.cleanupExpired();
    if (!idea.timestamp) {
      idea.timestamp = Date.now();
    }
    await this.client.set(`idea:${idea.id}`, JSON.stringify(idea));
    await this.client.sAdd("ideas:ids", idea.id);
  }

  /**
   * Consulta ideias armazenadas aplicando seletores.
   */
  async query(
    w: number,
    c: number = DEFAULT_C,
    selectors: QuerySelectors = {}
  ): Promise<(SemanticIdea & { v: number })[]> {
    await this.cleanupExpired();
    const ids = await this.client.sMembers("ideas:ids");
    if (ids.length === 0) return [];
    const keys = ids.map((id) => `idea:${id}`);
    const raws = await this.client.mGet(keys);
    const ideas: SemanticIdea[] = [];
    raws.forEach((raw) => {
      if (raw) ideas.push(JSON.parse(raw));
    });
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
    await this.cleanupExpired();
    const ids = await this.client.sMembers("ideas:ids");
    for (const id of ids) {
      const raw = await this.client.get(`idea:${id}`);
      if (!raw) continue;
      const idea: SemanticIdea = JSON.parse(raw);
      idea.w = Math.max(idea.w * this.decayFactor, this.minW);
      await this.client.set(`idea:${id}`, JSON.stringify(idea));
    }
  }

  /**
   * Reforça uma ideia específica.
   */
  async reinforce(id: string, factor: number = 1.1): Promise<void> {
    await this.cleanupExpired();
    const raw = await this.client.get(`idea:${id}`);
    if (!raw) return;
    const idea: SemanticIdea = JSON.parse(raw);
    idea.w = idea.w * factor;
    await this.client.set(`idea:${id}`, JSON.stringify(idea));
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
   * Limpa todas as ideias do Redis.
   */
  async clear(): Promise<void> {
    const ids = await this.client.sMembers("ideas:ids");
    if (ids.length > 0) {
      const keys = ids.map((id) => `idea:${id}`);
      await this.client.del(keys);
    }
    await this.client.del("ideas:ids");
  }

  /**
   * Retorna um snapshot completo.
   */
  async snapshot(): Promise<SemanticIdea[]> {
    await this.cleanupExpired();
    const ids = await this.client.sMembers("ideas:ids");
    if (ids.length === 0) return [];
    const keys = ids.map((id) => `idea:${id}`);
    const raws = await this.client.mGet(keys);
    const ideas: SemanticIdea[] = [];
    raws.forEach((raw) => {
      if (raw) ideas.push(JSON.parse(raw));
    });
    return ideas;
  }

  /**
   * Restaura estado a partir de um snapshot.
   */
  async restore(snapshot: SemanticIdea[]): Promise<void> {
    await this.clear();
    for (const idea of snapshot) {
      await this.client.set(`idea:${idea.id}`, JSON.stringify(idea));
      await this.client.sAdd("ideas:ids", idea.id);
    }
  }
}
