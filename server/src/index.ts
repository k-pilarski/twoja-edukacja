import express, { type Express, type Request, type Response } from 'express';
import { prisma } from './lib/prisma.js';

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Serwer działa poprawnie' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ status: 'db_ok', data: users });
  } catch (err) {
    res.status(500).json({ status: 'db_error', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});