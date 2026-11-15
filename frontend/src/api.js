// ÚNICO arquivo que conversa com os dados.
const USAR_MOCK = false;
const API_URL = "/api";
const IMG_TMDB = "https://image.tmdb.org/t/p/w500";

// Traduz qualquer formato (mock, TMDB cru ou back-end) para o formato do front.
// Se o back-end usar outros nomes de campo, ajuste SÓ aqui.
function normalizar(x, tipo) {
  const data = x.release_date || x.first_air_date || "";
  return {
    id: x.id,
    tipo,
    titulo: x.titulo || x.title || x.name || "Sem título",
    original: x.titulo_original || x.original_title || x.original_name || "",
    ano: x.ano || data.slice(0, 4),
    generos: (x.generos || x.genres || []).map((g) => g.name || g),
    nota: x.nota ?? x.vote_average ?? null,
    sinopse: x.sinopse || x.overview || "Sem descrição disponível.",
    poster: x.poster || (x.poster_path ? IMG_TMDB + x.poster_path : null),
    duracao: x.duracao || (x.runtime ? x.runtime + " min" : ""),
    temporadas: x.temporadas || x.number_of_seasons || null,
    diretor: x.diretor || "",
    criadores: x.criadores || "",
    linkAssistir: x.linkAssistir || "",
  };
}

async function pegar(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Erro " + r.status + " em " + url);
  return r.json();
}

const rota = (tipo) => (tipo === "serie" ? "series" : "filmes");

export async function listar(tipo, busca = "") {
  const consulta = busca ? `?busca=${encodeURIComponent(busca)}` : "";
  const dados = USAR_MOCK
    ? (await pegar("mock.json"))[rota(tipo)]
    : await pegar(`${API_URL}/${rota(tipo)}${consulta}`);
  const itens = (Array.isArray(dados) ? dados : dados.results || []).map((x) => normalizar(x, tipo));
  if (!USAR_MOCK || !busca) return itens;

  const texto = busca.toLowerCase();
  return itens.filter((item) => `${item.titulo} ${item.generos.join(" ")}`.toLowerCase().includes(texto));
}

export async function detalhar(tipo, id) {
  if (!id) throw new Error("ID do título não informado");
  if (USAR_MOCK) {
    const todos = await listar(tipo);
    return todos.find((x) => String(x.id) === String(id));
  }
  return normalizar(await pegar(`${API_URL}/${rota(tipo)}/${encodeURIComponent(id)}`), tipo);
}
