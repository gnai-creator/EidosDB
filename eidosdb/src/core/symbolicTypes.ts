// src/core/symbolicTypes.ts

/**
 * Representa um ponto simbólico no banco de dados.
 */
export interface DataPoint {
  id: string;
  label?: string;
  w: number; // frequência angular simbólica
  r: number; // distância simbólica ao centro do pensamento
  metadata?: Record<string, any>; // informações adicionais (opcional)
}

/**
 * Parâmetros de consulta simbólica.
 */
export interface QueryParams {
  w: number;
  r: number;
  c?: number; // valor padrão para c, se não for informado
}

/**
 * Resultado da avaliação de um DataPoint.
 */
export interface EvaluatedPoint extends DataPoint {
  v: number; // velocidade simbólica calculada
}
