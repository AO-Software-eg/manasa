import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';

import { NonUniqueDataError, RowNotFoundError } from './../database.ts';
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

export class ItemAlreadyOwnedError extends Error {
  constructor() {
    super('Item already owned');
  }
}

export class NotPurchasableYetError extends Error {
  constructor() {
    super('The item type is valid, but purchasing it is not yet supported');
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

  if (err instanceof ItemAlreadyOwnedError) {
    res.status(409);
  }

  if (err instanceof NotPurchasableYetError) {
    res.status(501);
  }

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
    res.status(422);
  }

  if (err instanceof UserAlreadyExistsError) {
    res.status(409);
  }

  if (err instanceof InvalidCredentialsError) {
    res.status(401);
  }

  if (err instanceof UserTokenNotFoundError) {
    res.status(401);
  }

  if (err instanceof NonUniqueDataError) {
    res.status(409);
  }

  res.json(err.message);
}
