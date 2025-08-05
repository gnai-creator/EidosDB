import { EidosStore } from "./storage/symbolicStore";
import type { DataPoint } from "./core/symbolicTypes";
import { renderMemoryField } from "./utils/chart";

function displayResults(
  title: string,
  points: ReturnType<EidosStore["query"]>
) {
  console.log(`\n=== ${title} ===`);
  for (const point of points) {
    console.log(
      `ID: ${point.id} | w: ${point.w.toFixed(6)} | r: ${point.r.toFixed(
        2
      )} | v: ${point.v.toFixed(2)}`
    );
  }
}

async function main() {
  const store = new EidosStore();

  // Inserir dados simbólicos de exemplo
  const examples: DataPoint[] = [
    { id: "alpha", w: 0.002, r: 2000 },
    { id: "beta", w: 0.004, r: 1500 },
    { id: "gamma", w: 0.001, r: 4000 },
    { id: "delta", w: 0.006, r: 1000 },
    { id: "epsilon", w: 0.002, r: 3000 },
  ];

  examples.forEach((dp) => store.insert(dp));

  const wQuery = 0.003;

  // Consulta inicial
  const result = store.query(wQuery);
  displayResults(`Query with w = ${wQuery}`, result);

  // Salvar em disco
  store.save();
  console.log("\n🧠 Memória salva em 'data/eidosdb.json'");

  // Limpar e restaurar
  store.clear();
  console.log("\n🚫 Memória limpa:", store.dump());

  store.load();
  console.log("\n🔁 Memória restaurada:");
  displayResults("Dump após load()", store.query(wQuery));

  // Gerar gráfico do campo de memória
  await renderMemoryField(store.query(wQuery), "memory_field.png");

  // Simular decaimento temporal
  console.log("\n⏳ Simulando 5 ciclos de decaimento:");
  for (let i = 1; i <= 5; i++) {
    store.tick();
    console.log(`\n--- Tick ${i} ---`);
    displayResults(`Query após tick ${i}`, store.query(wQuery));
  }

  // Reforçar uma ideia
  console.log("\n🔁 Reforçando 'beta'");
  store.reinforce("beta", 2.0);
  displayResults("Após reforço de 'beta'", store.query(wQuery));
}

main();
