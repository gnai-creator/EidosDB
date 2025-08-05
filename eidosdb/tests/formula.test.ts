import { calculateV, DEFAULT_C } from '../src/core/formula';

/**
 * Verifica se a fórmula calcula corretamente o valor de v.
 */
test('calcula v com valores simbólicos', () => {
  const v = calculateV(0.002, 2000);
  // valor esperado calculado manualmente
  const expected = (4 * 0.002 * 2000) / (Math.PI * Math.sqrt(1 - ((0.002 * 2000) / DEFAULT_C) ** 2));
  expect(v).toBeCloseTo(expected);
});

/**
 * Garante que quando w*r >= c o resultado seja infinito.
 */
test('retorna infinito quando razao ultrapassa a luz', () => {
  const v = calculateV(DEFAULT_C, 1, DEFAULT_C);
  expect(v).toBe(Number.POSITIVE_INFINITY);
});
