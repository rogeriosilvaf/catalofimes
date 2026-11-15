import express, { type NextFunction, type Request, type Response } from 'express';
import { criarRotaCatalogo } from './routes/catalogo.js';

const app = express();
const PORT = 3000;

app.use('/api/filmes', criarRotaCatalogo('filme'));
app.use('/api/series', criarRotaCatalogo('serie'));
app.use(express.static('frontend'));

app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(erro.message);
    res.status(500).json({ erro: 'Não foi possível buscar os filmes agora' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
