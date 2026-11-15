# catalofimes
Site de catálogos de filmes gratuitos.

## Executar localmente

1. Instale as dependências com `npm install`.
2. Crie um arquivo `.env` com base em `.env.example` e informe seu token de acesso (API Read Access Token) do TMDB em `TMDB_TOKEN`.
3. Compile e inicie o servidor:

   ```sh
   npm run build
   npm start
   ```

4. Acesse `http://localhost:3000`.

O servidor disponibiliza filmes e séries populares, pesquisa por título e páginas de detalhes usando a API do TMDB. A chave fica no backend e não é enviada ao navegador.
