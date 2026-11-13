import express, {} from 'express';
const app = express();
const PORT = 3000;
app.get('/', (req, res) => { res.send('Hello World!'); });
app.listen(PORT, () => { console.log(`O servidor na porta: http://localhost:${PORT}`); });
//# sourceMappingURL=app.js.map