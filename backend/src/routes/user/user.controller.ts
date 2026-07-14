import { type Request, type Response } from 'express';

import * as service from './user.service.ts';

import jwt from 'jsonwebtoken';

import { RowNotFoundError } from './../../database.ts';

const { JsonWebTokenError } = jwt;

export async function getMe(req: Request, res: Response) {
  try {
    if (!req.cookies.user_token) {
      return res.status(401).send();
    }

    const me = await service.getMe(req.cookies.user_token);

    return res.status(200).json(me);
  } catch (err: any) {
    console.log(err);

    if (err instanceof RowNotFoundError) {
      return res.status(404).send();
    }

    if (err instanceof JsonWebTokenError) {
      return res.status(401).send();
    }

    return res.status(500).send();
  }
}
