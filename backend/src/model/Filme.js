export default class Filme {
    /**
     * @param {string} id
     * @param {string} title
     * @param {string} mediaType
     * @param {string} [overview]
     * @param {string} [releaseDate]
     */
    constructor(id, title, mediaType, overview = "", releaseDate = "") {
        this.id = id;
        this.title = title;
        this.mediaType = mediaType;
        this.overview = overview;
        this.releaseDate = releaseDate;
    }
}