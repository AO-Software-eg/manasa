import * as db from '../../database.ts';
import * as validation from './auth.validation.ts';
import * as auth from '../../auth.ts';
import * as hash from '../../hash.ts';

import z from 'zod';

type SignupData = z.infer<typeof validation.signupSchema>;
type LoginData = z.infer<typeof validation.loginSchema>;

export class UserAlreadyExistsError extends Error {
  constructor() {
    super('User already exists');
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid Credentials');
  }
}

export async function signup(data: SignupData) {
  if (await db.isUserFound(data.email)) {
    throw new UserAlreadyExistsError();
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
export async function login(data: LoginData): Promise<string> {
  const user: db.SelectUser = await db.getUserByEmail(data.email);

  if ((await hash.verifyHash(user.password, data.password)) == false) {
    throw new InvalidCredentialsError();
  }

  const token = auth.signToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  return token;
}
