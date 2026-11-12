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

    test('Deve buscar metadados e opções oficiais usando um ID do TMDB', async () => {
        const detalhes = {
            id: 550,
            title: "Clube da Luta",
            overview: "Um funcionário insone conhece Tyler Durden.",
            release_date: "1999-10-15"
        };
        const provedores = {
            results: {
                BR: {
                    link: "https://www.themoviedb.org/movie/550/watch",
                    flatrate: [{ provider_name: "Provedor oficial" }]
                }
            }
        };
        const fetchMock = jest.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(new Response(JSON.stringify(detalhes)))
            .mockResolvedValueOnce(new Response(JSON.stringify(provedores)));

        const resultado = await TmdbService.obterFilmePorId("550");

        expect(resultado.id).toBe(550);
        expect(resultado.title).toBe("Clube da Luta");
        expect(resultado.watch_providers).toEqual(provedores.results.BR);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

});