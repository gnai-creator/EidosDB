import { EidosStore } from "./storage/symbolicStore";
import type { DataPoint } from "./core/symbolicTypes";

const store = new EidosStore();

// Inserir dados
const examples: DataPoint[] = [
  { id: "alpha", w: 0.002, r: 2000 },
  { id: "beta", w: 0.004, r: 1500 },
  { id: "gamma", w: 0.001, r: 4000 },
  { id: "delta", w: 0.006, r: 1000 },
  { id: "epsilon", w: 0.002, r: 3000 },
];

examples.forEach((dp) => store.insert(dp));

// Consultar
const wQuery = 0.003;
const result = store.query(wQuery);

// Mostrar resultados
console.log(`\n=== Query with w = ${wQuery} ===`);
result.forEach((p) =>
  console.log(
    `ID: ${p.id} | w: ${p.w.toFixed(3)} | r: ${p.r.toFixed(
      2
    )} | v: ${p.v.toFixed(2)}`
  )
);
