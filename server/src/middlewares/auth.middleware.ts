import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Brak dostępu. Brakuje tokena.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Nieprawidłowy format tokena.' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('BRAK ZMIENNEJ JWT_SECRET W .ENV!');
    res.status(500).json({ error: 'Błąd konfiguracji serwera.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Nieautoryzowany dostęp. Nieważny token.' });
  }
};