import { listarFilmes } from "./api.js";

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const lista = document.getElementById("lista-filmes");
const aviso = document.getElementById("aviso");

function card(f) {
  const capa = f.poster
    ? `<img src="${esc(f.poster)}" alt="Pôster de ${esc(f.titulo)}" loading="lazy">`
    : `<div class="sem-poster">${esc(f.titulo)}</div>`;
  return `<a class="card" href="filme.html?id=${encodeURIComponent(f.id)}">
    <div class="capa">${capa}</div>
    <h3>${esc(f.titulo)}</h3>
    <p>${esc(f.ano)}</p></a>`;
}

async function carregar(texto = "") {
  try {
    const filmes = await listarFilmes(texto);
    lista.innerHTML = filmes.map(card).join("") || `<p class="aviso">Nenhum filme encontrado.</p>`;
    aviso.hidden = true;
  } catch (erro) {
    console.error(erro);
    aviso.hidden = false;
    aviso.textContent = "Não foi possível carregar os filmes. O servidor está rodando? (npm start)";
  }
}

let espera;
document.getElementById("busca").addEventListener("input", (e) => {
  clearTimeout(espera);
  espera = setTimeout(() => carregar(e.target.value.trim()), 300);
});

carregar();
