import { listar } from "./api.js";
import { filtrar } from "./busca.js";

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

function desenhar(texto = "") {
  for (const tipo of ["filme", "serie"]) {
    const alvo = document.getElementById(tipo === "filme" ? "lista-filmes" : "lista-series");
    const itens = filtrar(listas[tipo], texto);
    alvo.innerHTML = itens.map(card).join("") || `<p class="aviso">Nada encontrado.</p>`;
  }
}

document.getElementById("busca").addEventListener("input", (e) => desenhar(e.target.value.trim().toLowerCase()));

try {
  [listas.filme, listas.serie] = await Promise.all([listar("filme"), listar("serie")]);
  desenhar();
} catch (erro) {
  console.error(erro);
  const aviso = document.getElementById("aviso");
  aviso.hidden = false;
  aviso.textContent = "Não foi possível carregar o catálogo. Confira se o servidor está rodando.";
}
