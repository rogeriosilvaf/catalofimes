import EmbedMoviesService from '../src/service/EmbedMoviesService.js';

describe('EmbedMoviesService Test', () => {

    test('Deve gerar a URL de embed corretamente quando receber um ID do IMDb válido', () => {
        const imdbId = "tt4633694";
        const urlEsperada = "https://embedmovies.com/player?id=tt4633694";

        const urlGerada = EmbedMoviesService.gerarUrl(imdbId);

        expect(urlGerada).toBe(urlEsperada);
        expect(urlGerada).toContain(imdbId);
    });

    test('Deve lançar um erro ao tentar gerar URL com um ID nulo ou vazio', () => {
        expect(() => {
            EmbedMoviesService.gerarUrl(null);
        }).toThrow('ID do IMDb inválido');

        expect(() => {
            EmbedMoviesService.gerarUrl("");
        }).toThrow('ID do IMDb inválido');
    });

    test('Deve lançar um erro se o ID não seguir o padrão do IMDb (começar com "tt")', () => {
        const idInvalido = "1234567"; // Apenas números

        expect(() => {
            EmbedMoviesService.gerarUrl(idInvalido);
        }).toThrow('ID do IMDb inválido');
    });
});