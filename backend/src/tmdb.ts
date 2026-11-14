import { FILMES_PUBLICOS } from './data/dados.js';
import type { DetalheTmdb, Filme, FilmeResumo, FilmeTmdb, ListaTmdb } from './tipos.js';

const URL_API = 'https://api.themoviedb.org/3';
const URL_IMAGEM = 'https://image.tmdb.org/t/p/w500';

const TOKEN = process.env.TMDB_TOKEN;
if (!TOKEN) {
    throw new Error('Defina TMDB_TOKEN no arquivo .env (veja o .env.example)');
}

async function chamarTmdb<T>(caminho: string, parametros: Record<string, string> = {}): Promise<T | null> {
    const url = new URL(URL_API + caminho);
    url.searchParams.set('language', 'pt-BR');
    for (const [nome, valor] of Object.entries(parametros)) {
        url.searchParams.set(nome, valor);
    }

    const resposta = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (resposta.status === 404) return null;
    if (!resposta.ok) throw new Error(`O TMDB respondeu com erro ${resposta.status}`);
    return (await resposta.json()) as T;
}

function paraResumo(filme: FilmeTmdb): FilmeResumo {
    return {
        id: filme.id,
        titulo: filme.title,
        ano: filme.release_date ? filme.release_date.slice(0, 4) : '',
        poster: filme.poster_path ? URL_IMAGEM + filme.poster_path : '',
    };
}

export async function listarPopulares(): Promise<FilmeResumo[]> {
    const lista = await chamarTmdb<ListaTmdb>('/movie/popular');
    return lista ? lista.results.map(paraResumo) : [];
}

export async function buscarFilmes(texto: string): Promise<FilmeResumo[]> {
    const lista = await chamarTmdb<ListaTmdb>('/search/movie', { query: texto });
    return lista ? lista.results.map(paraResumo) : [];
}

export async function obterFilme(id: number): Promise<Filme | null> {
    const filme = await chamarTmdb<DetalheTmdb>(`/movie/${id}`, { append_to_response: 'credits' });
    if (!filme) return null;

    const diretor = filme.credits.crew.find((pessoa) => pessoa.job === 'Director');

    return {
        ...paraResumo(filme),
        diretor: diretor ? diretor.name : '',
        sinopse: filme.overview,
        linkAssistir: FILMES_PUBLICOS[filme.id] ?? '',
    };
}
