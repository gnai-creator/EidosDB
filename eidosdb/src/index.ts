// src/index.ts

import {
  insertDataPoint,
  queryDataPoints,
  clearMemory,
} from "./storage/memoryStore";
import type { DataPoint } from "./core/symbolicTypes";

// Função auxiliar para exibir resultados
function displayResults(
  title: string,
  points: ReturnType<typeof queryDataPoints>
) {
  console.log(`\n=== ${title} ===`);
  for (const point of points) {
    console.log(
      `ID: ${point.id} | w: ${point.w.toFixed(3)} | r: ${point.r.toFixed(
        2
      )} | v: ${point.v.toFixed(2)}`
    );
  }
}

// Exemplo de uso
function main() {
  clearMemory();

  // Inserindo dados simbólicos fictícios
  const examples: DataPoint[] = [
    { id: "alpha", w: 0.002, r: 2000 },
    { id: "beta", w: 0.004, r: 1500 },
    { id: "gamma", w: 0.001, r: 4000 },
    { id: "delta", w: 0.006, r: 1000 },
    { id: "epsilon", w: 0.002, r: 3000 },
  ];

  for (const dp of examples) {
    insertDataPoint(dp);
  }

  // Consulta com frequência angular de leitura = 0.003
  const wQuery = 0.003;
  const result = queryDataPoints(wQuery);

  // Exibe os pontos ordenados por v
  displayResults(`Query with w = ${wQuery}`, result);
}

main();
