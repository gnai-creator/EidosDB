import fs from 'fs';
import path from 'path';

/**
 * Carrega as chaves de API e seus tiers a partir de um arquivo JSON.
 * O arquivo deve estar localizado em data/api-keys.json.
 */
const caminho = path.join(__dirname, '..', '..', 'data', 'api-keys.json');
let chaves: Record<string, string> = {};

try {
  const conteudo = fs.readFileSync(caminho, 'utf-8');
  chaves = JSON.parse(conteudo);
} catch {
  chaves = {};
}

/** Retorna o tier associado à chave de API fornecida. */
export function obterTier(chave: string): string | undefined {
  return chaves[chave];
}

/** Limites de requisições por minuto para cada tier. */
export const limitesPorTier: Record<string, number> = {
  basic: 5,
  premium: 1000,
};
