import { Router } from 'express';
import { buscarFilmes, listarPopulares, obterFilme } from '../tmdb.js';

export const rotaFilmes = Router();

rotaFilmes.get('/', async (req, res) => {
    const busca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';

    if (busca === '') {
        res.json(await listarPopulares());
        return;
    }
    res.json(await buscarFilmes(busca));
});

rotaFilmes.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const filme = Number.isInteger(id) ? await obterFilme(id) : null;

    if (!filme) {
        res.status(404).json({ erro: 'Filme não encontrado' });
        return;
    }
    res.json(filme);
});
