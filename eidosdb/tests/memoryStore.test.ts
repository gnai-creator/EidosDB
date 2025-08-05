import { MemoryStore } from '../src/storage/memoryStore';
import type { SemanticIdea } from '../src/core/symbolicTypes';

/**
 * Cria uma ideia simbólica básica para os testes.
 */
function createIdea(id: string, w: number, r: number = 1): SemanticIdea {
  return {
    id,
    label: id,
    vector: [0],
    w,
    r,
    context: 'teste',
  };
}

/**
 * Testa inserção e consulta com ordenação por v.
 */
test('insere e consulta ideias ordenadas por v', async () => {
  const store = new MemoryStore();
  await store.insert(createIdea('a', 0.002, 1));
  await store.insert(createIdea('b', 0.004, 2));

  const result = await store.query(0.003);
  expect(result.map((i) => i.id)).toEqual(['b', 'a']);
});

/**
 * Verifica se o decaimento reduz w corretamente.
 */
test('aplica decaimento com tick', async () => {
  const store = new MemoryStore();
  const idea = createIdea('a', 1);
  await store.insert(idea);
  await store.tick();
  const result = await store.query(0.5);
  expect(result[0].w).toBeCloseTo(idea.w * 0.95);
});

/**
 * Testa reforço simbólico de uma ideia.
 */
test('reforca ideia especifica', async () => {
  const store = new MemoryStore();
  await store.insert(createIdea('a', 1));
  await store.reinforce('a', 2);
  const result = await store.query(0.5);
  expect(result[0].w).toBe(2);
});

/**
 * Remove ideias expiradas utilizando ttl.
 */
test('remove ideias expiradas', async () => {
  const store = new MemoryStore();
  const expired: SemanticIdea = {
    id: 'old',
    label: 'old',
    vector: [0],
    w: 1,
    r: 1,
    context: 'teste',
    timestamp: Date.now() - 1000,
    ttl: 10,
  };
  await store.insert(expired);
  await store.tick();
  const result = await store.query(0.5);
  expect(result.length).toBe(0);
});
