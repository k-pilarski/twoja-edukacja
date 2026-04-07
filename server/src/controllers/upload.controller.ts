import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { supabase } from '../utils/supabase.js';

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Brak pliku do wgrania.' });
    }

    const timestamp = Date.now();
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    const fileName = `${timestamp}-${safeName}`;
    const bucketName = 'courses-media'; 

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    res.status(201).json({ 
      message: 'Plik wgrany pomyślnie', 
      path: data.path 
    });
  } catch (error: any) {
    // ZMIANA TUTAJ: Wypisujemy dokładny błąd, żeby zobaczyć go w terminalu backendu
    console.error('PEŁNY BŁĄD UPLOADU:', error); 
    res.status(500).json({ 
      error: 'Błąd podczas wgrywania pliku.',
      details: error.message || error
    });
  }
};

export const getSecureUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { path } = req.body; 
    if (!path) return res.status(400).json({ error: 'Brak parametru path.' });

    const bucketName = 'courses-media';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 7200);

    if (error) throw error;

    res.json({ secureUrl: data.signedUrl });
  } catch (error: any) {
    console.error('Błąd Secure URL:', error.message);
    res.status(500).json({ error: 'Błąd generowania bezpiecznego linku.' });
  }
};