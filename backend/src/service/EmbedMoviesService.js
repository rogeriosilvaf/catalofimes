const EMBED_PLAYER_URL = "https://embedmovies.com/player";

export default class EmbedMoviesService {
    /**
     * @param {unknown} imdbId
     * @returns {string}
     */
    static gerarUrl(imdbId) {
        if (typeof imdbId !== "string" || !/^tt\d{7,}$/.test(imdbId)) {
            throw new Error("ID do IMDb inválido");
        }

        const url = new URL(EMBED_PLAYER_URL);
        url.searchParams.set("id", imdbId);
        return url.toString();
    }
}
