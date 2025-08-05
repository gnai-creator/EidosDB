// src/utils/chart.ts

import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import type { EvaluatedPoint } from "../core/symbolicTypes";
import * as fs from "fs";
import * as path from "path";

const width = 800;
const height = 500;
const chartCallback = () => {};

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  chartCallback,
});

export async function renderMemoryField(
  points: EvaluatedPoint[],
  fileName = "memory_field.png"
) {
  const configuration = {
    type: "scatter" as const,
    data: {
      datasets: [
        {
          label: "Presença simbólica (v) por distância (r)",
          data: points.map((p) => ({ x: p.r, y: p.v })),
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointRadius: 5,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: "r (distância simbólica)" },
          beginAtZero: true,
        },
        y: {
          title: { display: true, text: "v (presença simbólica)" },
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Campo de Memória Simbólica",
        },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  const outputPath = path.resolve("data", fileName);
  fs.writeFileSync(outputPath, image);
  console.log(`🖼️  Campo de memória salvo em: ${outputPath}`);
}
