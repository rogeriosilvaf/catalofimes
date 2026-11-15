import { buscarFilme } from "./api.js";

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const id = new URLSearchParams(location.search).get("id");
const alvo = document.getElementById("detalhe");

try {
  const f = await buscarFilme(id);
  document.title = f.titulo + " · CataloFilmes";
  const linkOk = /^https?:\/\//.test(f.linkAssistir || "");
  alvo.innerHTML = `
    <div class="detalhe-poster">${f.poster
      ? `<img src="${esc(f.poster)}" alt="Pôster de ${esc(f.titulo)}">`
      : `<div class="sem-poster">${esc(f.titulo)}</div>`}</div>
    <div class="detalhe-info">
      <h1>${esc(f.titulo)}</h1>
      <p class="meta">${esc(f.ano)}</p>
      ${f.diretor ? `<p class="diretor">Direção: ${esc(f.diretor)}</p>` : ""}
      <h2>Sinopse</h2>
      <p class="sinopse">${esc(f.sinopse || "Sem descrição disponível.")}</p>
      ${linkOk ? `<a class="botao" href="${esc(f.linkAssistir)}" target="_blank" rel="noopener">▶ Assistir</a>` : ""}
    </div>`;
} catch (erro) {
  console.error(erro);
  alvo.innerHTML = `<p class="aviso">Não encontramos este filme. <a href="index.html">Voltar ao catálogo</a></p>`;
}
