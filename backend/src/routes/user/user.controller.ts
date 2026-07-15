import { type Request, type Response } from 'express';

import * as auth from '../../auth.ts';
import * as service from './user.service.ts';
import * as validation from './user.validation.ts';

import jwt from 'jsonwebtoken';

import { RowNotFoundError } from './../../database.ts';

const { JsonWebTokenError } = jwt;

export class UserTokenNotFoundError extends Error {
  constructor() {
    super('User token not found');
  }
}

function getUserPayload(req: Request) {
  if (!req.cookies.user_token) {
    throw new UserTokenNotFoundError();
  }

  return auth.verifyToken(req.cookies.user_token);
}

export async function getMe(req: Request, res: Response) {
  const me = await service.getMe(getUserPayload(req));

  return res.status(200).json(me);
}

export async function getBalance(req: Request, res: Response) {
  const balance = await service.getBalance(getUserPayload(req));

  return res.status(200).json(balance);
}
