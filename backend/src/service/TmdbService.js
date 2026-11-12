const TMDB_API_URL = "https://api.themoviedb.org/3";

/**
 * @param {string} path
 * @param {Record<string, string | number>} [params]
 * @returns {URL}
 */
function criarUrl(path, params = {}) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        throw new Error("A variável TMDB_API_KEY não está configurada");
    }

    const url = new URL(`${TMDB_API_URL}${path}`);
    url.searchParams.set("api_key", apiKey);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }
    return url;
}

/**
 * @param {string} path
 * @param {Record<string, string | number>} [params]
 */
async function consultar(path, params = {}) {
    const response = await fetch(criarUrl(path, params).toString());
    if (!response.ok) {
        throw new Error(`Erro ao consultar o TMDB: ${response.status}`);
    }
    return response.json();
}

/**
 * @param {number} page
 * @returns {number}
 */
function validarPagina(page) {
    if (!Number.isInteger(page) || page < 1 || page > 500) {
        throw new Error("Número de página inválido");
    }
    return page;
}

export default class TmdbService {
    /**
     * @param {number} [page]
     */
    static async listarPopulares(page = 1) {
        const data = await consultar("/movie/popular", {
            language: "pt-BR",
            page: validarPagina(page)
        });
        return {
            page: data.page,
            results: data.results ?? [],
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    /**
     * @param {string} query
     * @param {number} [page]
     */
    static async buscarFilmes(query, page = 1) {
        if (typeof query !== "string" || query.trim() === "") {
            throw new Error("O termo de busca não pode estar vazio");
        }

        const data = await consultar("/search/movie", {
            language: "pt-BR",
            page: validarPagina(page),
            query: query.trim()
        });
        return {
            page: data.page,
            results: data.results ?? [],
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    /**
     * @param {string} tmdbId
     */
    static async obterDetalhesFilme(tmdbId) {
        if (typeof tmdbId !== "string" || !/^\d+$/.test(tmdbId)) {
            throw new Error("ID do TMDB inválido");
        }

        const encodedId = encodeURIComponent(tmdbId);
        const [filme, providers] = await Promise.all([
            consultar(`/movie/${encodedId}`, { language: "pt-BR" }),
            consultar(`/movie/${encodedId}/watch/providers`)
        ]);

        return {
            ...filme,
            watch_providers: providers.results?.BR ?? null
        };
    }

    /**
     * @param {string} imdbId
     */
    static async obterFilmePorImdbId(imdbId) {
        if (typeof imdbId !== "string" || !/^tt\d{7,}$/.test(imdbId)) {
            throw new Error("ID do IMDb inválido");
        }

        const data = await consultar(`/find/${encodeURIComponent(imdbId)}`, {
            external_source: "imdb_id",
            language: "pt-BR"
        });
        const filme = data.movie_results?.[0] ?? data.tv_results?.[0];
        if (!filme) {
            throw new Error(`Nenhum resultado encontrado para o IMDb ID ${imdbId}`);
        }

        return {
            id: filme.id,
            title: filme.title ?? filme.name,
            media_type: filme.media_type ?? (data.movie_results?.length ? "movie" : "tv"),
            overview: filme.overview ?? "",
            release_date: filme.release_date ?? filme.first_air_date ?? ""
        };
    }
}
