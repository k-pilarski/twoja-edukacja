import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import { prisma } from './lib/prisma.js';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import courseRoutes from './routes/course.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Serwer działa poprawnie' });
});

app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/auth', authRoutes); 
app.use('/api/courses', courseRoutes);
app.use('/api/uploads', uploadRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`);
});