import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const PORT: number = 3000;

app.get('/',(req: Request, res: Response)=>{res.send('Hello World!');});

app.listen(PORT, ()=>{console.log(`O servidor na porta: http://localhost:${PORT}`);});