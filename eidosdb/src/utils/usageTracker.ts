// Módulo para rastrear uso de chaves de API e prevenir abuso
// Todos os comentários estão em português, conforme solicitado

// Limite padrão de requisições por chave em um período de 24 horas
const LIMITE_PADRAO = parseInt(process.env.USAGE_LIMIT || "10000", 10);

interface RegistroUso {
  contador: number; // número de requisições
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
export function registrarUso(chave: string, limite = LIMITE_PADRAO): boolean {
  if (bloqueadas.has(chave)) return false;

  const agora = Date.now();
  let registro = uso.get(chave);

  // Reinicia o contador caso o período de 24h tenha expirado
  if (!registro || agora > registro.reinicio) {
    registro = { contador: 0, reinicio: agora + 24 * 60 * 60 * 1000 };
  }

  // Verifica se a próxima requisição ultrapassa o limite
  if (registro.contador + 1 > limite) {
    bloqueadas.add(chave);
    uso.set(chave, registro);
    return false; // excedeu o limite diário
  }

  registro.contador++;
  uso.set(chave, registro);
  return true; // requisição permitida
}

/**
 * Obtém o uso acumulado. Se nenhuma chave for fornecida, retorna todas.
 */
export function obterUso(chave?: string): Record<string, number> | number {
  if (chave) {
    return uso.get(chave)?.contador || 0;
  }
  const resumo: Record<string, number> = {};
  uso.forEach((r, k) => {
    resumo[k] = r.contador;
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

