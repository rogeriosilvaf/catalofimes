import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import TmdbService from '../src/service/TmdbService.js';

describe('TmdbService Test', () => {
    const apiKeyOriginal = process.env.TMDB_API_KEY;

    beforeEach(() => {
        process.env.TMDB_API_KEY = "test-api-key";
    });

    afterEach(() => {
        if (apiKeyOriginal === undefined) {
            delete process.env.TMDB_API_KEY;
        } else {
            process.env.TMDB_API_KEY = apiKeyOriginal;
        }
        jest.restoreAllMocks();
    });

    test('Deve retornar os dados do filme corretamente ao buscar por um IMDb ID válido', async () => {
        const imdbId = "tt4633694";
        const dadosEsperados = {
            id: 550,
            title: "Homem-Aranha: No Aranhaverso",
            media_type: "movie",
            overview: "Miles Morales é um jovem negro do Brooklyn que se tornou o Homem-Aranha inspirado no legado de Peter Parker, já falecido. Entretanto, ao visitar o túmulo de seu ídolo em uma noite chuvosa, ele é surpreendido com a presença do próprio Peter, vestindo o traje do herói aracnídeo sob um sobretudo. A surpresa fica ainda maior quando Miles descobre que ele veio de uma dimensão paralela, assim como outras variações do Homem-Aranha.",
            release_date: "2019-01-10"
        };

        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ movie_results: [dadosEsperados], tv_results: [] }))
        );
        const resultado = await TmdbService.obterFilmePorImdbId(imdbId);

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining(`/find/${imdbId}?`)
        );
        expect(resultado).toEqual(dadosEsperados);
        expect(resultado.title).toBe("Homem-Aranha: No Aranhaverso");
    });

    test('Deve lançar um erro se o ID do IMDb for inválido ou vazio', async () => {
        const imdbIdInvalido = "12345"; // Fora do padrão "tt..."
        const fetchMock = jest.spyOn(globalThis, "fetch");

        await expect(TmdbService.obterFilmePorImdbId(imdbIdInvalido))
            .rejects.toThrow('ID do IMDb inválido');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('Deve listar filmes populares em português', async () => {
        const catalogo = {
            page: 1,
            results: [{ id: 550, title: "Clube da Luta" }],
            total_pages: 1,
            total_results: 1
        };
        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify(catalogo))
        );

        const resultado = await TmdbService.listarPopulares();
        const url = new URL(String(fetchMock.mock.calls[0][0]));

        expect(url.pathname).toBe("/3/movie/popular");
        expect(url.searchParams.get("language")).toBe("pt-BR");
        expect(resultado.results).toEqual(catalogo.results);
    });

    test('Deve pesquisar filmes pelo título', async () => {
        const resultados = [{ id: 550, title: "Clube da Luta" }];
        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ page: 1, results: resultados }))
        );

        const resultado = await TmdbService.buscarFilmes(" Clube da Luta ");
        const url = new URL(String(fetchMock.mock.calls[0][0]));

        expect(url.pathname).toBe("/3/search/movie");
        expect(url.searchParams.get("query")).toBe("Clube da Luta");
        expect(resultado.results).toEqual(resultados);
    });

    test('Deve retornar detalhes e provedores oficiais de streaming', async () => {
        const detalhes = { id: 550, title: "Clube da Luta" };
        const disponibilidade = {
            results: {
                BR: {
                    link: "https://www.themoviedb.org/movie/550/watch",
                    flatrate: [{ provider_name: "Provedor oficial" }]
                }
            }
        };
        const fetchMock = jest.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(new Response(JSON.stringify(detalhes)))
            .mockResolvedValueOnce(new Response(JSON.stringify(disponibilidade)));

        const resultado = await TmdbService.obterDetalhesFilme("550");
        const paths = fetchMock.mock.calls.map(([url]) => new URL(String(url)).pathname);

        expect(paths).toContain("/3/movie/550");
        expect(paths).toContain("/3/movie/550/watch/providers");
        expect(resultado.watch_providers).toEqual(disponibilidade.results.BR);
    });
});