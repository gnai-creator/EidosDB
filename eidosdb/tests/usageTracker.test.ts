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
    // limite pequeno para facilitar o teste
    expect(registrarUso('test', 2)).toBe(true);
    expect(registrarUso('test', 2)).toBe(true);
    // Terceira chamada deve ultrapassar o limite e retornar false
    expect(registrarUso('test', 2)).toBe(false);
    // Uso acumulado deve refletir as duas chamadas permitidas
    expect(obterUso('test')).toBe(2);
  });
});

