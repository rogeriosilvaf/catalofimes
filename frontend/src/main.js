import { listar } from "./api.js";

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function card(x) {
  const pagina = x.tipo === "serie" ? "serie.html" : "filme.html";
  const info = x.tipo === "serie" && x.temporadas
    ? `${x.temporadas} temporada${x.temporadas > 1 ? "s" : ""}` : x.ano;
  const capa = x.poster
    ? `<img src="${esc(x.poster)}" alt="Pôster de ${esc(x.titulo)}" loading="lazy">`
    : `<div class="sem-poster">${esc(x.titulo)}</div>`;
  const nota = x.nota ? `<span class="nota">★ ${Number(x.nota).toFixed(1)}</span>` : "";
  return `<a class="card" href="${pagina}?id=${encodeURIComponent(x.id)}">
    <div class="capa">${capa}${nota}</div>
    <h3>${esc(x.titulo)}</h3>
    <p>${esc(info)} · ${esc(x.generos[0] || "")}</p></a>`;
}

const listas = { filme: [], serie: [] };
const populares = { filme: [], serie: [] };
let buscaAtual = 0;
let temporizadorBusca;

function desenhar() {
  for (const tipo of ["filme", "serie"]) {
    const alvo = document.getElementById(tipo === "filme" ? "lista-filmes" : "lista-series");
    const itens = listas[tipo];
    alvo.innerHTML = itens.map(card).join("") || `<p class="aviso">Nada encontrado.</p>`;
  }
}

function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  aviso.hidden = !texto;
  aviso.textContent = texto;
}

document.getElementById("busca").addEventListener("input", (e) => {
  const texto = e.target.value.trim();
  const requisicao = ++buscaAtual;
  clearTimeout(temporizadorBusca);

  temporizadorBusca = setTimeout(async () => {
    if (requisicao !== buscaAtual) return;
    if (!texto) {
      listas.filme = populares.filme;
      listas.serie = populares.serie;
      mostrarAviso("");
      desenhar();
      return;
    }

    try {
      const [filmes, series] = await Promise.all([
        listar("filme", texto),
        listar("serie", texto),
      ]);
      if (requisicao !== buscaAtual) return;
      listas.filme = filmes;
      listas.serie = series;
      mostrarAviso("");
      desenhar();
    } catch (erro) {
      if (requisicao !== buscaAtual) return;
      console.error(erro);
      mostrarAviso("Não foi possível pesquisar no catálogo. Tente novamente.");
    }
  }, 300);
});

try {
  [populares.filme, populares.serie] = await Promise.all([listar("filme"), listar("serie")]);
  if (!document.getElementById("busca").value.trim()) {
    listas.filme = populares.filme;
    listas.serie = populares.serie;
    mostrarAviso("");
    desenhar();
  }
} catch (erro) {
  console.error(erro);
  mostrarAviso("Não foi possível carregar o catálogo. Confira se o servidor está rodando.");
}
