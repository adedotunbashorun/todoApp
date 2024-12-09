import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';

@Middleware({ type: 'after' }) // Runs after route handlers
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // console.error('Error caught by middleware:', error);

    const status = res.statusCode !== 200 ? res.statusCode : 500; // Default to 500 if no status is set

    res.status(status).json({
      status: 'error',
      message: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Include stack trace only in development
    });

    next(error); // Optionally forward the error to other handlers if needed
  }
}
