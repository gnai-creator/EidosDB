// src/semantic/embedding.ts
import type { FeatureExtractionPipeline } from "@xenova/transformers" with { "resolution-mode": "import" };

/**
 * Gera um vetor de embedding semântico utilizando sentence transformers em Node.
 * O tamanho do vetor depende do modelo escolhido.
 */
let extractor: FeatureExtractionPipeline | null = null;

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    const { pipeline } = await import("@xenova/transformers");
    const model = process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
    extractor = (await pipeline("feature-extraction", model)) as FeatureExtractionPipeline;
  }

  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}
