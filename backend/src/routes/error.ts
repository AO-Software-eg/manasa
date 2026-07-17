import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';

import { RowNotFoundError } from './../database.ts';
import { ZodError } from 'zod';

const { JsonWebTokenError } = jwt;

export class UserTokenNotFoundError extends Error {
  constructor() {
    super('User token not found');
  }
}

export class UserUnauthorizedError extends Error {
  constructor() {
    super('User is not authorized to access this resource');
  }
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super('User already exists');
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid Credentials');
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);

  res.status(500);

  if (err instanceof UserUnauthorizedError) {
    res.status(403);
  }

  if (err instanceof RowNotFoundError) {
    res.status(404);
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401);
  }

  if (err instanceof ZodError) {
    res.status(400);
  }

  if (err instanceof UserAlreadyExistsError) {
    res.status(409);
  }

  if (err instanceof InvalidCredentialsError) {
    return res.status(401).send();
  }

  if (err instanceof UserTokenNotFoundError) {
    return res.status(401).send();
  }

  res.send();
}
