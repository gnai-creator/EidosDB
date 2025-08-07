// Módulo para rastrear uso de chaves de API e prevenir abuso
// Todos os comentários estão em português, conforme solicitado

// Limite padrão de requisições por chave em um período de 24 horas
const LIMITE_PADRAO = parseInt(process.env.USAGE_LIMIT || "10000", 10);

interface RegistroUso {
  requests: number; // número de requisições
  reinforcements: number; // número de reforços
  decays: number; // número de decays
  reinicio: number; // momento em que o contador será reiniciado
}

// Armazena o uso por chave
const uso: Map<string, RegistroUso> = new Map();
// Conjunto de chaves bloqueadas por abuso
const bloqueadas: Set<string> = new Set();

/**
 * Registra uma requisição para a chave informada.
 * Retorna false se a chave estiver bloqueada ou se exceder o limite diário.
 */
export function registrarUso(
  chave: string,
  limite = LIMITE_PADRAO,
  tipo: 'request' | 'reinforce' | 'decay' = 'request',
): boolean {
  if (bloqueadas.has(chave)) return false;

  const agora = Date.now();
  let registro = uso.get(chave);

  // Reinicia o contador caso o período de 24h tenha expirado
  if (!registro || agora > registro.reinicio) {
    registro = {
      requests: 0,
      reinforcements: 0,
      decays: 0,
      reinicio: agora + 24 * 60 * 60 * 1000,
    };
  }

  if (tipo === 'request') {
    // Verifica se a próxima requisição ultrapassa o limite
    if (registro.requests + 1 > limite) {
      bloqueadas.add(chave);
      uso.set(chave, registro);
      return false; // excedeu o limite diário
    }
    registro.requests++;
  } else if (tipo === 'reinforce') {
    registro.reinforcements++;
  } else if (tipo === 'decay') {
    registro.decays++;
  }

  uso.set(chave, registro);
  return true; // operação permitida
}

/**
 * Obtém o uso acumulado. Se nenhuma chave for fornecida, retorna todas.
 */
export function obterUso(
  chave?: string,
): Record<string, { requests: number; reinforcements: number; decays: number }> |
  { requests: number; reinforcements: number; decays: number } {
  if (chave) {
    const r = uso.get(chave);
    return r
      ? { requests: r.requests, reinforcements: r.reinforcements, decays: r.decays }
      : { requests: 0, reinforcements: 0, decays: 0 };
  }
  const resumo: Record<string, { requests: number; reinforcements: number; decays: number }> = {};
  uso.forEach((r, k) => {
    resumo[k] = {
      requests: r.requests,
      reinforcements: r.reinforcements,
      decays: r.decays,
    };
  });
  return resumo;
}

/** Bloqueia manualmente uma chave. */
export function bloquearChave(chave: string): void {
  bloqueadas.add(chave);
}

/** Lista as chaves atualmente bloqueadas. */
export function chavesBloqueadas(): string[] {
  return Array.from(bloqueadas);
}

/** Reseta todos os dados de uso (utilizado apenas em testes). */
export function resetarUso(): void {
  uso.clear();
  bloqueadas.clear();
}

