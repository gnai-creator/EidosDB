// src/semantic/hashGenerator.ts
import crypto from "crypto";

/**
 * Gera um hash simbólico único com base no conteúdo da ideia.
 */
export function generateHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}
