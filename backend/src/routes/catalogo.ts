import { Router } from 'express';
import { listarTitulos, obterTitulo } from '../tmdb.js';
import type { TipoCatalogo } from '../tipos.js';

export function criarRotaCatalogo(tipo: TipoCatalogo) {
    const rota = Router();

    rota.get('/', async (req, res) => {
        const busca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';
        res.json(await listarTitulos(tipo, busca));
    });

    rota.get('/:id', async (req, res) => {
        const id = Number(req.params.id);
        const item = Number.isSafeInteger(id) && id > 0 ? await obterTitulo(tipo, id) : null;

        if (!item) {
            res.status(404).json({ erro: tipo === 'filme' ? 'Filme não encontrado' : 'Série não encontrada' });
            return;
        }
        res.json(item);
    });

    return rota;
}
