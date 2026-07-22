import { type Request, type Response } from 'express';

import * as service from './auth.service.ts';

import * as validation from './auth.validation.ts';

import { ZodError } from 'zod';
import { RowNotFoundError } from './../../database.ts';

export async function signup(req: Request, res: Response) {
  if (!req.is('application/json')) {
    return res.status(415).send();
  }

  const data = validation.signupSchema.parse(req.body);

  await service.signup(data);

  return res.status(200).send();
}

// No check for if the user is already logged in, we just refresh the token
export async function login(req: Request, res: Response) {
  if (!req.is('application/json')) {
    return res.status(415).send();
  }
  if (!req.ip) {
    throw new Error("Couldn't get request IP");
  }

  const data = validation.loginSchema.parse(req.body);

  const sessionData: validation.SessionData = {
    ip: req.ip,
  };

  const user_token = await service.login(data, sessionData);
  res.cookie('user_token', user_token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  return res.status(200).send();
}

export async function logout(req: Request, res: Response) {
  if (!req.cookies.user_token) {
    return res.status(200).send();
  }

  res.cookie('user_token', '', {
    expires: new Date(0),
    path: '/',
  });

  return res.status(200).send();
}
