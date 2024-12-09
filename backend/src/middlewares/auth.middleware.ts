import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const parts = req.headers.cookie.split(';');
  const authTokenPart = parts.find((part: string | string[]) => part.includes('auth_token='));
  const token = authTokenPart ? authTokenPart.split('=')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


@Middleware({ type: 'before' }) // Apply before route handlers
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: (err?: any) => any): void {
    authMiddleware(req, res, next);
  }
}
