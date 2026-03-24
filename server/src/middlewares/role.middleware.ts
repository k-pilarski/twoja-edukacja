import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Brak dostępu. Zaloguj się najpierw.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: `Brak uprawnień. Wymagana rola to: ${allowedRoles.join(' lub ')}` 
      });
      return;
    }

    next();
  };
};