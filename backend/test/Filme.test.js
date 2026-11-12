import Filme from '../src/model/Filme.js';

describe('Filme Model Test', () => {

    test('Deve criar um objeto Filme corretamente com todos os atributos do TMDB', () => {
        const imdbId = "tt4633694";
        const titulo = "Homem-Aranha: No Aranhaverso";
        const tipo = "movie";
        const sinopse = "Miles Morales é um jovem negro do Brooklyn que se tornou o Homem-Aranha inspirado no legado de Peter Parker, já falecido. Entretanto, ao visitar o túmulo de seu ídolo em uma noite chuvosa, ele é surpreendido com a presença do próprio Peter, vestindo o traje do herói aracnídeo sob um sobretudo. A surpresa fica ainda maior quando Miles descobre que ele veio de uma dimensão paralela, assim como outras variações do Homem-Aranha.";
        const dataLancamento = "2019-01-10";

        const filme = new Filme(imdbId, titulo, tipo, sinopse, dataLancamento);

        expect(filme.id).toBe(imdbId);
        expect(filme.title).toBe(titulo);
        expect(filme.mediaType).toBe(tipo);
        expect(filme.overview).toBe(sinopse);
        expect(filme.releaseDate).toBe(dataLancamento);
    });

    test('Deve permitir criar um filme mesmo se os campos opcionais estiverem vazios', () => {
        const filme = new Filme("tt4633694", "Homem-Aranha: No Aranhaverso", "movie");

        expect(filme.id).toBe("tt4633694");
        expect(filme.title).toBe("Homem-Aranha: No Aranhaverso");
        expect(filme.overview).toBe("");
        expect(filme.releaseDate).toBe("");
    });
});