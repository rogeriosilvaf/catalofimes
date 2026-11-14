import express, { type NextFunction, type Request, type Response } from 'express';
import { rotaFilmes } from './routes/filmes.js';

const app = express();
const PORT = 3000;

app.use('/api/filmes', rotaFilmes);
app.use(express.static('frontend'));

app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(erro.message);
    res.status(500).json({ erro: 'Não foi possível buscar os filmes agora' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
