import fs from 'fs';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { PCA } from 'ml-pca';
import { TSNE } from 'tsne-js';
import { SemanticIdea } from '../core/symbolicTypes';

/**
 * Opções aceitas pelo visualizador semântico
 */
export interface VisualizerOptions {
  method?: 'pca' | 'tsne';
  width?: number;
  height?: number;
}

/**
 * Gera um gráfico 2D das ideias fornecidas, agrupando por contexto
 * e aplicando redução de dimensionalidade (PCA ou t-SNE).
 */
export async function visualizeIdeas(
  ideas: SemanticIdea[],
  outputPath: string,
  options: VisualizerOptions = {}
): Promise<void> {
  const method = options.method ?? 'pca';
  const width = options.width ?? 800;
  const height = options.height ?? 600;

  // Extrai todos os vetores
  const vectors = ideas.map((i) => i.vector);
  let points: number[][];

  if (method === 'pca') {
    // PCA rápido para conjuntos pequenos
    const pca = new PCA(vectors);
    points = pca.predict(vectors, { nComponents: 2 }).to2DArray();
  } else {
    // t-SNE para visualização não linear
    const tsne = new TSNE({
      dim: 2,
      perplexity: Math.min(30, vectors.length - 1),
      earlyExaggeration: 4,
      learningRate: 100,
      nIter: 500,
    });
    tsne.init({ data: vectors, type: 'dense' });
    tsne.run();
    points = tsne.getOutputScaled();
  }

  // Agrupa pontos por contexto
  const contextMap = new Map<string, { x: number; y: number }[]>();
  points.forEach((p, idx) => {
    const ctx = ideas[idx].context || 'default';
    if (!contextMap.has(ctx)) contextMap.set(ctx, []);
    contextMap.get(ctx)!.push({ x: p[0], y: p[1] });
  });

  const colors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4',
    '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff',
    '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1',
    '#000075', '#808080'
  ];

  const datasets = Array.from(contextMap.entries()).map(([ctx, data], idx) => ({
    label: ctx,
    data,
    backgroundColor: colors[idx % colors.length],
  }));

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const configuration = {
    type: 'scatter' as const,
    data: { datasets },
    options: {
      scales: {
        x: { title: { display: true, text: 'dim1' } },
        y: { title: { display: true, text: 'dim2' } },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  await fs.promises.writeFile(outputPath, image);
}

// CLI simples para usar via linha de comando
if (require.main === module) {
  const [,, inputPath, outPath, method] = process.argv;
  if (!inputPath || !outPath) {
    console.error('Uso: ts-node src/semantic/visualizer.ts <ideias.json> <saida.png> [pca|tsne]');
    process.exit(1);
  }
  (async () => {
    const ideas: SemanticIdea[] = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    await visualizeIdeas(ideas, outPath, { method: method === 'tsne' ? 'tsne' : 'pca' });
  })();
}

