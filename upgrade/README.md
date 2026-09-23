# Arquivos de upgrade

Esta pasta contém arquivos prontos para substituição manual na raiz do projeto.

## Aplicação

1. Faça uma cópia dos arquivos atuais.
2. Copie `offline.html` e `dashboard.html` desta pasta para a raiz.
3. Revise o sitemap antes de substituir: páginas internas e provas não devem ser indexadas automaticamente.
4. Teste no GitHub Pages em janela anônima e em modo offline.

Os arquivos usam caminhos `../` porque estão dentro de `upgrade/`. Depois de copiados para a raiz, altere os caminhos para `./` conforme os arquivos originais. Por isso, estes arquivos são material de substituição assistida, não devem ser usados diretamente nessa subpasta.

## Observação

O controle de senha continua sendo apenas uma barreira de interface no navegador; não é autenticação real. Para proteger conteúdo, é necessário um backend ou serviço de autenticação.
