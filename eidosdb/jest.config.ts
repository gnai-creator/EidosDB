import type { JestConfigWithTsJest } from 'ts-jest';

/**
 * Configuração do Jest para testes em TypeScript.
 * Comentários escritos em português para explicar cada parte.
 */
const config: JestConfigWithTsJest = {
  preset: 'ts-jest', // usa ts-jest para compilar arquivos .ts
  testEnvironment: 'node', // ambiente de testes baseado em Node.js
  testMatch: ['**/tests/**/*.test.ts'], // localiza os testes dentro da pasta tests
  clearMocks: true, // limpa mocks automaticamente entre os testes
};

export default config;
