import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Użytkownik o tym adresie email już istnieje.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'Rejestracja udana', userId: newUser.id });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    res.status(500).json({ error: 'Błąd serwera podczas rejestracji.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('Błąd: Brak JWT_SECRET w .env');
      res.status(500).json({ error: 'Błąd konfiguracji serwera.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Zalogowano pomyślnie', token });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ error: 'Błąd serwera podczas logowania.' });
  }
};

// Pobieranie danych aktualnie zalogowanego użytkownika (dla Reacta)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Brak autoryzacji' });
      return;
    }

    // Szukamy usera, ale KRYTYCZNE: nie pobieramy jego hasła!
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      }
    });

    if (!user) {
      res.status(404).json({ error: 'Nie znaleziono użytkownika' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Błąd pobierania danych użytkownika:', error);
    res.status(500).json({ error: 'Błąd serwera.' });
  }
};