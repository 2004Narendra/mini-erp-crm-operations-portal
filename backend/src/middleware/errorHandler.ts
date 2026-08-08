import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: 'Invalid request data', errors: err.errors });
  }
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Something went wrong' });
};
