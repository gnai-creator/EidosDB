import { registrarUso, obterUso, resetarUso } from '../src/utils/usageTracker';

/**
 * Testes para o rastreador de uso e prevenção de abuso.
 * Comentários escritos em português.
 */
describe('Usage tracker', () => {
  beforeEach(() => {
    resetarUso(); // garante estado limpo antes de cada teste
  });

  it('bloqueia chave após exceder o limite', () => {
    expect(registrarUso('test', 2)).toBe(true);
    expect(registrarUso('test', 2)).toBe(true);
    expect(registrarUso('test', 2)).toBe(false);
    expect(obterUso('test')).toEqual({
      requests: 2,
      reinforcements: 0,
      decays: 0,
    });
  });

  it('contabiliza reforços e decays', () => {
    registrarUso('k', undefined, 'reinforce');
    registrarUso('k', undefined, 'decay');
    expect(obterUso('k')).toEqual({
      requests: 0,
      reinforcements: 1,
      decays: 1,
    });
  });
});

