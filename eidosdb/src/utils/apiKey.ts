import fs from 'fs';
import path from 'path';

/**
 * Carrega as chaves de API e seus tiers a partir de um arquivo JSON.
 * As chaves agora são agrupadas por um identificador de usuário estável
 * (sub ou e‑mail decodificado do JWT). O arquivo fica em data/api-keys.json.
 */
const caminho = path.join(__dirname, '..', '..', 'data', 'api-keys.json');
type ChavesPorIdentificador = Record<string, Record<string, string>>;
let chaves: ChavesPorIdentificador = {};

try {
  const conteudo = fs.readFileSync(caminho, 'utf-8');
  chaves = JSON.parse(conteudo);
} catch {
  chaves = {};
}

/** Retorna o tier associado à chave de API fornecida. */
export function obterTier(chave: string): string | undefined {
  for (const userKeys of Object.values(chaves)) {
    if (chave in userKeys) {
      return userKeys[chave];
    }
  }
  return undefined;
}

/** Retorna o identificador do usuário associado à chave. */
export function obterUsuarioDaChave(chave: string): string | undefined {
  for (const [usuario, userKeys] of Object.entries(chaves)) {
    if (chave in userKeys) {
      return usuario;
    }
  }
  return undefined;
}

/** Adiciona uma nova chave de API para um identificador de usuário e persiste no arquivo. */
export function adicionarChave(
  usuario: string,
  chave: string,
  tier: string
): void {
  if (!chaves[usuario]) chaves[usuario] = {};
  chaves[usuario][chave] = tier;
  fs.writeFileSync(caminho, JSON.stringify(chaves, null, 2));
}

/** Lista todas as chaves cadastradas de um identificador com seus tiers. */
export function listarChaves(
  usuario: string
): { key: string; tier: string }[] {
  const userKeys = chaves[usuario] || {};
  return Object.entries(userKeys).map(([key, tier]) => ({ key, tier }));
}

/** Limites de requisições por minuto para cada tier. */
export const limitesPorTier: Record<string, number> = {
  free: 5,
  premium: 1000,
  enterprise: 10000,
};

/** Limites diários de requisições por tier. */
export const limitesDiariosPorTier: Record<string, number> = {
  free: 10000,
  premium: 100000,
  enterprise: 1000000,
};
