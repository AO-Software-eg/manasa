import { type Request, type Response } from 'express';

import * as service from './user.service.ts';

import jwt from 'jsonwebtoken';

import { RowNotFoundError } from './../../database.ts';

const { JsonWebTokenError } = jwt;

export async function getMe(req: Request, res: Response) {
  if (!req.cookies.user_token) {
    return res.status(401).send();
  }

  const me = await service.getMe(req.cookies.user_token);

  return res.status(200).json(me);
}

export async function getBalance(req: Request, res: Response) {
  if (!req.cookies.user_token) {
    return res.status(401).send();
  }

  const balance = await service.getBalance(req.cookies.user_token);

  return res.status(200).json(balance);
}
