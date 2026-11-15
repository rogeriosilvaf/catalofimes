// Filtra uma lista pelo texto digitado (título ou gênero).
export function filtrar(lista, texto) {
  if (!texto) return lista;
  return lista.filter((x) => (x.titulo + " " + x.generos.join(" ")).toLowerCase().includes(texto));
}
