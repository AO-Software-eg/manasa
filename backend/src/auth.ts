import jwt from 'jsonwebtoken'

if (!process.env.TOKEN_SECRET_KEY) {
  throw new Error('Secret key not set in environment variables.');
}

const TOKEN_SECRET_KEY: string = process.env.TOKEN_SECRET_KEY;

export function signToken(payload: object | string) {
  const token = jwt.sign(payload, TOKEN_SECRET_KEY);
  return token;
}

// Also returns the decoded payload
export function verifyToken(token: string) {
  return jwt.verify(token, TOKEN_SECRET_KEY);
}