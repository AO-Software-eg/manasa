import { type Request, type Response } from 'express';

import * as err from './error.ts';
import * as auth from '../auth.ts';

export function isNumberParameter(param: string | string[]): param is string {
  if (typeof param !== 'string') {
    return false;
  }
  if (/^\d+$/.test(param) === false) {
    return false;
  }

  return true;
}

export function getUserPayload(req: Request) {
  if (!req.cookies.user_token) {
    throw new err.UserTokenNotFoundError();
  }

  const userPayload = auth.verifyToken(req.cookies.user_token);

  if (!userPayload.id) {
    throw new Error("Malformed token: payload missing 'id' field");
  }
  if (!userPayload.email) {
    throw new Error("Malformed token: payload missing 'email' field");
  }

  return userPayload;
}
