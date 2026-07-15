import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(200).send();
}
