// Devolve pra o front-end
export interface FilmeResumo {
    id: number;
    titulo: string;
    ano: string;
    poster: string;
}

export interface Filme extends FilmeResumo {
    diretor: string;
    sinopse: string;
    linkAssistir: string;
}

// TMDB devolve p nós
export interface FilmeTmdb {
    id: number;
    title: string;
    release_date: string;
    poster_path: string | null;
    overview: string;
}

export interface ListaTmdb {
    results: FilmeTmdb[];
}

export interface DetalheTmdb extends FilmeTmdb {
    credits: {
        crew: { job: string; name: string }[];
    };
}
