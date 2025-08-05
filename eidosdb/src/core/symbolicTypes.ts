// src/core/symbolicTypes.ts

export interface SemanticIdea {
  id: string; // Hash simbólico único
  label: string; // Texto da ideia (ex: "tempo é ilusão")
  vector: number[]; // Embedding semântico (ex: 128 floats)
  w: number; // Frequência simbólica (atenção)
  r: number; // Distância simbólica (contexto)
  context: string; // Nome do cluster (ex: "futuro", "medo")
  metadata?: Record<string, any>; // Emoção, tipo, origem, etc.
}

// Parâmetros de consulta
export interface QueryParams {
  w0: number; // Frequência de consulta
  c?: number; // Valor da constante simbólica (ex: velocidade-limite)
  label?: string; // Termo a ser embutido semanticamente
  vector?: number[]; // Vetor já embutido para consulta direta
}

// Resultado com cálculo de v
export interface EvaluatedIdea extends SemanticIdea {
  v: number; // Presença simbólica calculada
}
