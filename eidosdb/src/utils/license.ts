import * as fs from 'fs';
import * as path from 'path';

/**
 * Função utilitária para carregar o texto da licença CC BY-NC 4.0.
 * Lê o arquivo LICENSE localizado na raiz do projeto.
 */
export function carregarLicenca(): string {
  // Monta o caminho absoluto até o arquivo de licença
  const caminho = path.join(__dirname, '..', '..', '..', 'LICENSE');

  // Retorna o conteúdo do arquivo como string
  return fs.readFileSync(caminho, 'utf-8');
}
