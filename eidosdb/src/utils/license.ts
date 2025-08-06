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

/**
 * Valida se a licença foi aceita em tempo de execução.
 * A validação é ignorada quando NODE_ENV === 'test'.
 * Define a variável de ambiente EIDOS_ACCEPT_LICENSE com
 * valor 'true' para permitir a execução.
 */
export function validarLicenca(): void {
  if (process.env.NODE_ENV === 'test') return;

  const aceite = process.env.EIDOS_ACCEPT_LICENSE;
  const aceitos = ['1', 'true', 'yes'];
  if (aceite && aceitos.includes(aceite.toLowerCase())) return;

  const texto = carregarLicenca();
  console.error('EidosDB requer a aceitação da licença CC BY-NC 4.0.');
  console.error(
    'Defina EIDOS_ACCEPT_LICENSE=true para confirmar que você concorda com os termos.'
  );
  console.error(texto);
  throw new Error('Licença não aceita');
}
