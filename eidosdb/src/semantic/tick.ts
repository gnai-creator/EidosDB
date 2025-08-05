// src/semantic/tick.ts
import { SemanticIdea } from "../core/symbolicTypes";

// Tenta importar GPU.js dinamicamente para uso opcional
let GPUClass: any;
try {
  // Se o pacote não estiver instalado, permanece undefined
  GPUClass = require("gpu.js").GPU;
} catch {
  GPUClass = undefined;
}

export function applyDecay(
  ideas: SemanticIdea[],
  decayFactor: number = 0.99,
  minThreshold: number = 0.001
): SemanticIdea[] {
  const now = Date.now();

  // Se GPU.js estiver disponível, utiliza a GPU para aplicar o decaimento
  if (GPUClass) {
    // Cria kernel que multiplica cada peso pelo fator de decaimento
    const gpu = new GPUClass();
    const kernel = gpu
      .createKernel(function (pesos: number[], fator: number) {
        // Multiplica cada elemento; this.thread.x indica o índice atual
        return pesos[this.thread.x] * fator;
      })
      .setOutput([ideas.length]);

    const pesos = ideas.map((idea) => idea.w);
    const resultado = kernel(pesos, decayFactor) as number[];

    return ideas.filter((idea, idx) => {
      // Expira ideias cujo tempo de vida (timestamp + ttl) foi atingido
      if (idea.ttl && idea.timestamp && idea.timestamp + idea.ttl <= now) {
        return false;
      }
      // Atualiza o peso com valor processado pela GPU
      idea.w = resultado[idx];
      return idea.w >= minThreshold;
    });
  }

  // Caminho padrão em CPU caso a GPU não esteja disponível
  return ideas.filter((idea) => {
    // Expira ideias cujo tempo de vida (timestamp + ttl) foi atingido
    if (idea.ttl && idea.timestamp && idea.timestamp + idea.ttl <= now) {
      return false;
    }
    idea.w *= decayFactor;
    return idea.w >= minThreshold;
  });
}
