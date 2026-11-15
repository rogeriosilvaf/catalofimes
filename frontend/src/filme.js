// Serve as duas páginas de detalhes: filme.html e serie.html (pelo data-tipo do <body>).
import { detalhar } from "./api.js";

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tipo = document.body.dataset.tipo;
const id = new URLSearchParams(location.search).get("id");
const alvo = document.getElementById("detalhe");

function playerInternetArchive(link, titulo) {
  if (!link || tipo !== "filme") return "";

  let url;
  try {
    url = new URL(link);
  } catch {
    return "";
  }

  if (url.protocol !== "https:" || url.hostname !== "archive.org" || !url.pathname.startsWith("/embed/")) {
    return "";
  }

  return `
    <div class="player-internet-archive">
      <div class="player-frame">
        <iframe src="${esc(url.href)}" title="Player de ${esc(titulo)} no Internet Archive"
          loading="lazy" referrerpolicy="no-referrer" allow="fullscreen" allowfullscreen></iframe>
      </div>
    </div>`;
}

try {
  const x = await detalhar(tipo, id);
  if (!x) throw new Error("não encontrado");
  document.title = x.titulo + " · CataloFilmes";
  const meta = [
    x.nota ? `<b>★ ${Number(x.nota).toFixed(1)}</b>` : "",
    esc(x.ano),
    tipo === "serie" && x.temporadas ? `${x.temporadas} temporada${x.temporadas > 1 ? "s" : ""}` : esc(x.duracao),
  ].filter(Boolean).join('<i>•</i>');
  alvo.innerHTML = `
    <div class="detalhe-poster">${x.poster
      ? `<img src="${esc(x.poster)}" alt="Pôster de ${esc(x.titulo)}">`
      : `<div class="sem-poster">${esc(x.titulo)}</div>`}</div>
    <div class="detalhe-info">
      <h1>${esc(x.titulo)}</h1>
      ${x.original && x.original !== x.titulo ? `<p class="original">${esc(x.original)}</p>` : ""}
      <p class="meta">${meta}</p>
      <div class="generos">${x.generos.map((g) => `<span>${esc(g)}</span>`).join("")}</div>
      ${tipo === "serie" && x.criadores ? `<p><strong>Criada por:</strong> ${esc(x.criadores)}</p>` : ""}
      ${tipo === "filme" && x.diretor ? `<p><strong>Direção:</strong> ${esc(x.diretor)}</p>` : ""}
      <h2>Sinopse</h2>
      <p class="sinopse">${esc(x.sinopse)}</p>
    </div>
    ${playerInternetArchive(x.linkAssistir, x.titulo)}`;
} catch (erro) {
  console.error(erro);
  alvo.innerHTML = `<p class="aviso">Não encontramos este título. <a href="index.html">Voltar ao catálogo</a></p>`;
}
