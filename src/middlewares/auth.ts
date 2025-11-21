import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Étendre le type Request pour ajouter userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

export default authMiddleware;