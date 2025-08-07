import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

/**
 * Carrega as chaves de API e seus tiers a partir de um arquivo JSON.
 * As chaves agora são agrupadas por um identificador de usuário estável
 * (sub ou e‑mail decodificado do JWT). O arquivo fica em data/api-keys.json.
 */
const caminho = path.join(__dirname, '..', '..', 'data', 'api-keys.json');
type ChavesPorIdentificador = Record<string, Record<string, string>>;
let chaves: ChavesPorIdentificador = {};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

try {
  const conteudo = fs.readFileSync(caminho, 'utf-8');
  chaves = JSON.parse(conteudo);
} catch {
  chaves = {};
}

/** Retorna o tier associado à chave de API fornecida. */
export async function obterTier(
  chave: string
): Promise<string | undefined> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('tier')
      .eq('key', chave)
      .maybeSingle();
    if (error || !data) return undefined;
    return data.tier as string;
  }
  for (const userKeys of Object.values(chaves)) {
    if (chave in userKeys) {
      return userKeys[chave];
    }
  }
  return undefined;
}

/** Retorna o identificador do usuário associado à chave. */
export async function obterUsuarioDaChave(
  chave: string
): Promise<string | undefined> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('user_id')
      .eq('key', chave)
      .maybeSingle();
    if (error || !data) return undefined;
    return data.user_id as string;
  }
  for (const [usuario, userKeys] of Object.entries(chaves)) {
    if (chave in userKeys) {
      return usuario;
    }
  }
  return undefined;
}

/** Adiciona uma nova chave de API para um identificador de usuário e persiste. */
export async function adicionarChave(
  usuario: string,
  chave: string,
  tier: string
): Promise<void> {
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from('api_keys')
      .insert({ user_id: usuario, key: chave, tier });
    if (error) {
      throw new Error(error.message);
    }
  }
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
