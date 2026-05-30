# NIC Formação Profissional

Site estático pronto para publicar no GitHub Pages.

## Como publicar

1. Crie um repositorio no GitHub.
2. Envie todos os arquivos desta pasta para o repositorio.
3. No GitHub, abra `Settings` > `Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha a branch principal e a pasta `/root`.
6. Salve e aguarde o GitHub gerar o link do site.

O arquivo inicial do site é `index.html`. A página `404.html` será usada automaticamente pelo GitHub Pages quando alguém acessar um endereço inexistente.

## Arquivos importantes

- `robots.txt` e `sitemap.xml`: ajudam mecanismos de busca a encontrar o site.
- `manifest.json` e `service-worker.js`: deixam o site preparado para funcionar como app instalável.
- `assets/`: ícones locais e imagem de compartilhamento.
- `privacidade.html`: política de privacidade do portal.

Endereço configurado para publicação: `https://profnucleoinfor.github.io/`.
