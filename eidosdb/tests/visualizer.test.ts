import fs from 'fs';
import path from 'path';
import { visualizeIdeas } from '../src/semantic/visualizer';
import { SemanticIdea } from '../src/core/symbolicTypes';

describe('visualizeIdeas', () => {
  it('gera arquivo de imagem com PCA', async () => {
    const ideas: SemanticIdea[] = [
      { id: '1', label: 'a', vector: [1, 0, 0], w: 1, r: 1, context: 'A' },
      { id: '2', label: 'b', vector: [0, 1, 0], w: 1, r: 1, context: 'B' },
      { id: '3', label: 'c', vector: [0, 0, 1], w: 1, r: 1, context: 'A' },
    ];
    const out = path.join(__dirname, 'test.png');
    await visualizeIdeas(ideas, out, { method: 'pca', width: 200, height: 200 });
    expect(fs.existsSync(out)).toBe(true);
    fs.unlinkSync(out);
  });
});
