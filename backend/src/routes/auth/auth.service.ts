import * as db from '../../database.ts';
import * as validation from './auth.validation.ts';
import * as auth from '../../auth.ts';
import * as hash from '../../hash.ts';
import * as err from '../error.ts';

import z from 'zod';

export async function signup(data: validation.SignupData) {
  if (await db.isUserFound(data.email)) {
    throw new err.UserAlreadyExistsError();
  }

  if (await db.isStudentPhoneFound(data.studentPhone)) {
    throw new err.UserAlreadyExistsError();
  }

  const passwordHash = await hash.hashString(data.password);
  const user: db.InsertUser = {
    email: data.email,
    name: data.name,
    studentPhone: data.studentPhone,
    parentPhone: data.parentPhone,
    specialization: data.specialization,
    governorate: data.governorate,
    year: data.YearCombo,
    password: passwordHash,
  };

  await db.insertUser(user);
}

// returns the JWT token
export async function login(
  data: validation.LoginData,
  sessionData: validation.SessionData,
): Promise<string> {
  const user: db.SelectUser = await db.getUserByEmail(data.email);

  if ((await hash.verifyHash(user.password, data.password)) == false) {
    throw new err.InvalidCredentialsError();
  }

  const token = auth.signToken({
    id: user.id,
    name: user.name,
    email: user.email,
    ip_hash: await hash.hashString(sessionData.ip),
  });

  return token;
}

export async function resetPassword(
  data: validation.ResetPasswordData,
  userId: number,
) {
  const newPasswordHash = await hash.hashString(data.newPassword);
  await db.updateUserPassword(userId, newPasswordHash);
}
