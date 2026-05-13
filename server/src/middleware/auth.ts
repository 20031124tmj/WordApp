import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: '未提供认证令牌' } });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== 'access') {
      return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: '无效的令牌类型' } });
    }
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: '令牌已过期' } });
  }
}
