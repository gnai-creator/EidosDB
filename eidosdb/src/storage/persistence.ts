// src/storage/persistence.ts

import type { SemanticIdea } from "../core/symbolicTypes";
import * as fs from "fs";
import * as path from "path";

const DEFAULT_FILE = path.resolve("data", "eidosdb.json");

/**
 * Garante que a pasta /data exista.
 */
function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Salva as ideias simbólicas em um arquivo JSON.
 */
export function saveToDisk(
  data: SemanticIdea[],
  filePath: string = DEFAULT_FILE
): void {
  ensureDirectoryExists(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Carrega as ideias simbólicas de um arquivo JSON.
 */
export function loadFromDisk(filePath: string = DEFAULT_FILE): SemanticIdea[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as SemanticIdea[];
}
