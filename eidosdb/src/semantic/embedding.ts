// src/semantic/embedding.ts

let extractor: any | null = null;
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    const { env, pipeline } = await import("@huggingface/transformers");
    // env.allowRemoteModels = false;
    env.localModelPath = "/app/models";
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  const output: any = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}
