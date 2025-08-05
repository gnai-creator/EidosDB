// src/utils/chart.ts

import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import type { EvaluatedIdea } from "../core/symbolicTypes";
import * as fs from "fs";
import * as path from "path";

const width = 800;
const height = 500;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export async function renderMemoryField(
  points: EvaluatedIdea[],
  fileName = "memory_field.png"
): Promise<void> {
  const configuration: import("chart.js").ChartConfiguration = {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Presença simbólica (v) por distância (r)",
          data: points.map((p) => ({ x: p.r, y: p.v })),
          backgroundColor: "rgba(54, 162, 235, 1)",
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "r (distância simbólica)",
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: "v (presença simbólica)",
          },
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
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, image);
  console.log(`🖼️  Campo de memória salvo em: ${outputPath}`);
}
