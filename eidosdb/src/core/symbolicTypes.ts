// src/core/symbolicTypes.ts

export interface SemanticIdea {
  id: string; // Hash simbólico único
  label: string; // Texto da ideia (ex: "tempo é ilusão")
  vector: number[]; // Embedding semântico (ex: 128 floats)
  w: number; // Frequência simbólica (atenção)
  r: number; // Distância simbólica (contexto)
  context: string; // Nome do cluster (ex: "futuro", "medo")
  timestamp?: number; // Momento de inserção ou ativação
  ttl?: number; // Tempo de vida em ms antes de expirar
  metadata?: Record<string, any>; // Emoção, tipo, origem, etc.
  tags?: string[]; // Marcadores simbólicos adicionais
}

export interface QueryParams {
  w0: number; // Frequência de consulta
  c?: number; // Constante simbólica
  label?: string; // Termo para embutir semanticamente
  vector?: number[]; // Vetor semântico direto
}

export interface EvaluatedIdea extends SemanticIdea {
  v: number; // Presença simbólica (calculada)
}

export interface QuerySelectors {
  context?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}
