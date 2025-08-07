import { computeSymbolicMetrics } from '../src/utils/logger';
import { calculateV } from '../src/core/formula';
import type { SemanticIdea } from '../src/core/symbolicTypes';

function createIdea(
  id: string,
  w: number,
  r: number,
  context: string,
): SemanticIdea {
  return {
    id,
    label: id,
    vector: [0],
    w,
    r,
    context,
    userId: 'u1',
  };
}

test('calcula média de v e cluster dominante', () => {
  const ideas = [
    createIdea('a', 0.002, 1, 'alpha'),
    createIdea('b', 0.004, 2, 'beta'),
    createIdea('c', 0.003, 1.5, 'beta'),
  ];

  const metrics = computeSymbolicMetrics(ideas);
  const expectedAvg =
    (calculateV(0.002, 1) + calculateV(0.004, 2) + calculateV(0.003, 1.5)) /
    3;

  expect(metrics.averageV).toBeCloseTo(expectedAvg);
  expect(metrics.dominantCluster).toBe('beta');
  expect(metrics.heatmap.length).toBe(2);
  expect(metrics.heatmap[0][0]).toBeCloseTo(calculateV(0.002, 1));
});

test('retorna métricas neutras quando vazio', () => {
  const metrics = computeSymbolicMetrics([]);
  expect(metrics.averageV).toBe(0);
  expect(metrics.dominantCluster).toBeNull();
  expect(metrics.heatmap).toEqual([]);
});

