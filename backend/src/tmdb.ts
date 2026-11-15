import { FILMES_PUBLICOS } from './data/dados.js';
import type { GenerosTmdb, ItemCatalogo, ItemTmdb, ListaTmdb, TipoCatalogo } from './tipos.js';

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

const cacheGeneros = new Map<TipoCatalogo, Promise<Map<number, string>>>();

function obterGeneros(tipo: TipoCatalogo): Promise<Map<number, string>> {
    const cacheado = cacheGeneros.get(tipo);
    if (cacheado) return cacheado;

    const caminho = tipo === 'filme' ? '/genre/movie/list' : '/genre/tv/list';
    const requisicao = chamarTmdb<GenerosTmdb>(caminho).then((resposta) => {
        if (!resposta) throw new Error(`O TMDB não retornou os gêneros de ${tipo}`);
        return new Map(resposta.genres.map((genero): [number, string] => [genero.id, genero.name]));
    }).catch((erro: unknown) => {
        cacheGeneros.delete(tipo);
        throw erro;
    });

    cacheGeneros.set(tipo, requisicao);
    return requisicao;
}

function paraCatalogo(item: ItemTmdb, tipo: TipoCatalogo, generos: Map<number, string>): ItemCatalogo {
    const generoItem = item.genres?.map((genero) => genero.name)
        ?? (item.genre_ids ?? []).flatMap((id) => {
            const nome = generos.get(id);
            return nome ? [nome] : [];
        });

    const titulo = item.title ?? item.name ?? 'Sem título';
    const diretor = tipo === 'filme'
        ? item.credits?.crew?.find((pessoa) => pessoa.job === 'Director')?.name ?? ''
        : '';

    return {
        id: item.id,
        titulo,
        titulo_original: item.original_title ?? item.original_name ?? '',
        ano: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
        poster: item.poster_path ? URL_IMAGEM + item.poster_path : '',
        generos: generoItem,
        nota: item.vote_average ?? null,
        sinopse: item.overview ?? '',
        duracao: item.runtime ? `${item.runtime} min` : '',
        temporadas: item.number_of_seasons ?? null,
        diretor,
        criadores: (item.created_by ?? []).map((pessoa) => pessoa.name).join(', '),
        linkAssistir: tipo === 'filme' ? FILMES_PUBLICOS[item.id] ?? '' : '',
    };
}

function caminhoLista(tipo: TipoCatalogo, busca: string): string {
    if (busca) return tipo === 'filme' ? '/search/movie' : '/search/tv';
    return tipo === 'filme' ? '/movie/popular' : '/tv/popular';
}

export async function listarTitulos(tipo: TipoCatalogo, busca = ''): Promise<ItemCatalogo[]> {
    const texto = busca.trim();
    const parametros = texto ? { query: texto, include_adult: 'false' } : {};
    const [lista, generos] = await Promise.all([
        chamarTmdb<ListaTmdb>(caminhoLista(tipo, texto), parametros),
        obterGeneros(tipo),
    ]);

    return lista ? lista.results.map((item) => paraCatalogo(item, tipo, generos)) : [];
}

export async function obterTitulo(tipo: TipoCatalogo, id: number): Promise<ItemCatalogo | null> {
    const caminho = tipo === 'filme' ? `/movie/${id}` : `/tv/${id}`;
    const item = await chamarTmdb<ItemTmdb>(caminho, { append_to_response: 'credits' });
    if (!item) return null;

    return paraCatalogo(item, tipo, new Map());
}
