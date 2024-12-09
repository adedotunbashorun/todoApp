import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response } from 'express';

@Middleware({ type: 'before' }) // Runs before route handlers
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: (err?: Error) => Error): void {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

@Middleware({ type: 'before' })
export class SameOriginMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: (err?: Error) => Error): void {
    const origin = req.get('origin');
    const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
    if (origin && origin !== allowedOrigin) {
      res.status(403).send('Cross-origin requests are not allowed');
    }
    next();
  }
}
