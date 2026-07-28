import { type Request, type Response } from 'express';

import * as service from './auth.service.ts';

import * as validation from './auth.validation.ts';

import * as auth from '../../auth.ts';

import * as fingerprint from '../../fingerprint.ts';

const otpTransactions = new Map<string, string>();

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

  const deviceId = fingerprint.computeDeviceFingerprint(req);

  const tokens: service.userTokens = await service.login(data, deviceId);
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
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

export async function resetPassword(req: Request, res: Response) {
  const data = validation.resetPasswordSchema.parse(req.body);

  const tokenPayload = auth.verifyToken(data.resetToken);

  if (tokenPayload.purpose != 'reset-password') {
    return res.status(400).send();
  }

  await service.resetPassword(data, tokenPayload.id);

  return res.status(200).send();
}

export async function resetPasswordToken(req: Request, res: Response) {
  const data = validation.resetPasswordTokenSchema.parse(req.body);

  const resetToken = await service.resetPasswordToken(data);

  console.log(resetToken);

  return res.status(200).json({ resetToken });
}

export async function checkPhone(req: Request, res: Response) {
  const exists = await service.checkPhone(
    validation.checkPhoneSchema.parse(req.body),
  );

  return res.status(200).json({ exists });
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
