import * as db from '../../database.ts';
import * as validation from './auth.validation.ts';
import * as auth from '../../auth.ts';
import * as hash from '../../hash.ts';
import * as err from '../error.ts';

import { createHash } from 'crypto';

import crypto from 'crypto';

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

export type userTokens = {
  accessToken: string;
  refreshToken: string;
};

// returns the JWT token
export async function login(
  data: validation.LoginData,
  deviceId: string,
): Promise<userTokens> {
  let user: db.SelectUser;
  if (data.identifier.includes('@')) {
    user = await db.getUserByEmail(data.identifier);
  } else {
    user = await db.getUserByPhone(data.identifier);
  }

  if ((await hash.verifyHash(user.password, data.password)) == false) {
    throw new err.InvalidCredentialsError();
  }

  try {
    // Generate session
    const sessionId = crypto.randomUUID();
    await db.createUserSession({
      userId: user.id,
      sessionId: sessionId,
      deviceId: deviceId,
    });
  } catch (err: any) {
    throw new Error('User session creation failed');
  }

  const session = await db.getUserSession(user.id);
  if (!session) {
    throw new Error('User session creation failed');
  }
  const accessToken = auth.signToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      sessionId: session.sessionId,
      jti: crypto.randomUUID(),
    },
    '15m',
  );

  return { accessToken: accessToken, refreshToken: session.sessionId };
}
}

export async function resetPassword(
  data: validation.ResetPasswordData,
  userId: number,
) {
  const newPasswordHash = await hash.hashString(data.newPassword);
  await db.updateUserPassword(userId, newPasswordHash);
}

export async function resetPasswordToken(
  data: validation.ResetPasswordTokenData,
) {
  const user = await db.getUserByPhone(data.phone);

  const resetToken = auth.signToken(
    {
      id: user.id,
      purpose: 'reset-password',
    },
    '10m',
  );

  return resetToken;
}

export async function checkPhone(data: validation.checkPhoneData) {
  return await db.isPhoneRegistered(data.phone);
}
