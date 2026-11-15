export type TipoCatalogo = 'filme' | 'serie';

export interface GeneroTmdb {
    id: number;
    name: string;
}

export interface ItemTmdb {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    release_date?: string;
    first_air_date?: string;
    poster_path?: string | null;
    vote_average?: number;
    overview?: string;
    genre_ids?: number[];
    genres?: GeneroTmdb[];
    runtime?: number | null;
    number_of_seasons?: number;
    credits?: {
        crew?: { job: string; name: string }[];
    };
    created_by?: { id: number; name: string }[];
}

export interface ListaTmdb {
    results: ItemTmdb[];
}

export interface GenerosTmdb {
    genres: GeneroTmdb[];
}

export interface ItemCatalogo {
    id: number;
    titulo: string;
    titulo_original: string;
    ano: string;
    poster: string;
    generos: string[];
    nota: number | null;
    sinopse: string;
    duracao: string;
    temporadas: number | null;
    diretor: string;
    criadores: string;
    linkAssistir: string;
}
