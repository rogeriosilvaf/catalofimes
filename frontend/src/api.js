// ÚNICO arquivo que conversa com o back-end (só filmes).
// O back-end serve o site em http://localhost:3000, então o endereço é relativo.
const API = "/api/filmes";

async function pegar(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Erro " + r.status + " em " + url);
  return r.json();
}

// GET /api/filmes  ou  GET /api/filmes?busca=texto
// -> [ { id, titulo, ano, poster } ]
export function listarFilmes(busca = "") {
  return pegar(API + (busca ? "?busca=" + encodeURIComponent(busca) : ""));
}

// GET /api/filmes/:id
// -> { id, titulo, ano, poster, diretor, sinopse, linkAssistir }
export function buscarFilme(id) {
  return pegar(API + "/" + encodeURIComponent(id));
}
