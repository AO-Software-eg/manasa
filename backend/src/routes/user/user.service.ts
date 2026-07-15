import * as db from '../../database.ts';
import * as validation from './user.validation.ts';
import * as auth from '../../auth.ts';

export async function getMe(userPayload: any) {
  if (!userPayload.id) {
    throw new Error("Malformed token: payload missing 'id' field");
  }

  const user: db.SelectUser = await db.getUserById(userPayload.id);
  if (user.password) {
    user.password = '';
  } else {
    throw new Error("Couldn't find password field to remove in SelectUser");
  }

  return user;
}

export async function getBalance(userPayload: any) {
  return await db.getBalance(userPayload.id);
}

export async function enrollCourse(userPayload: any) {}
