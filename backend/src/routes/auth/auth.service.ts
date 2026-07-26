import * as db from '../../database.ts';
import * as validation from './auth.validation.ts';
import * as auth from '../../auth.ts';
import * as hash from '../../hash.ts';
import * as err from '../error.ts';

import crypto from 'crypto';
import { type Request, type Response } from 'express';

const otpTransactions = new Map<string, string>();


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
  deviceId: string,
): Promise<string> {
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
  const token = auth.signToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionId: session.sessionId,
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


export async function akedlySend(req: Request, res: Response) {
  const { phoneNumber, powSolution, turnstileToken } = req.body;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-end-user-ip': req.ip ?? '',
  };

  const r = await fetch('https://api.akedly.io/api/v1.2/transactions/send', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      APIKey: process.env.AKEDLY_API_KEY,
      pipelineID: process.env.AKEDLY_PIPELINE_ID,
      verificationAddress: { phoneNumber },
      powSolution,
      turnstileToken,
    }),
  });
  const data = await r.json();

  otpTransactions.set(data.data.transactionReqID, phoneNumber);

  res.json(data);
}

export async function akedlyVerify(req: Request, res: Response) {
  const { transactionReqID, otp } = req.body;

  const r = await fetch('https://api.akedly.io/api/v1.2/transactions/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionReqID, otp }),
  });

  const data = await r.json();

  if (!r.ok) {
    return res.status(r.status).json(data);
  }

  const phoneNumber = otpTransactions.get(transactionReqID);

  if (!phoneNumber) {
    return res.status(400).json({
      message: 'Transaction not found',
    });
  }

  otpTransactions.delete(transactionReqID);

  const resetToken = auth.signToken(
    {
      phone: phoneNumber,
      purpose: 'reset-password',
    },
    '1h',
  );

  return res.json({
    status: 'success',
    resetToken,
  });
}

export async function akedlyChallenge(req: Request, res: Response) {
  const r = await fetch(
    `https://api.akedly.io/api/v1.2/transactions/challenge` +
      `?APIKey=${process.env.AKEDLY_API_KEY}` +
      `&pipelineID=${process.env.AKEDLY_PIPELINE_ID}`,
  );
  res.status(r.status).json(await r.json());
}

