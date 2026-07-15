import * as db from '../../database.ts';
import * as validation from '../../validation.ts';
import * as auth from '../../auth.ts';

export async function getMe(userToken: string) {
  const payload = auth.verifyToken(userToken);
  if (!payload.id) {
    throw new Error("Malformed token: payload missing 'id' field");
  }

  const user: db.SelectUser = await db.getUserById(payload.id);
  if (user.password) {
    user.password = '';
  } else {
    throw new Error("Couldn't find password field to remove in SelectUser");
  }

  return user;
}

export async function getBalance(userToken: string) {
  const payload = auth.verifyToken(userToken);
  if (!payload.id) {
    throw new Error("Malformed token: payload missing 'id' field");
  }

  return await db.getBalance(payload.id);
}
