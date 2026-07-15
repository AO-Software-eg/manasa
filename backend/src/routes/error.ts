import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';
import * as authService from './auth/auth.service.ts';
import * as userController from './user/user.controller.ts';

import { RowNotFoundError } from './../database.ts';
import { ZodError } from 'zod';

const { JsonWebTokenError } = jwt;

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);

  res.status(500);
  if (err instanceof RowNotFoundError) {
    res.status(404);
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401);
  }

  if (err instanceof ZodError) {
    res.status(400);
  }

  if (err instanceof authService.UserAlreadyExistsError) {
    res.status(409);
  }

  if (err instanceof authService.InvalidCredentialsError) {
    return res.status(401).send();
  }

  if (err instanceof userController.UserTokenNotFoundError) {
    return res.status(401).send();
  }

  res.send();
}
