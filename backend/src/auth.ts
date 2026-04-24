import jwt from 'jsonwebtoken'

if (!process.env.TOKEN_SECRET_KEY) {
  throw new Error('Secret key not set in environment variables.');
}

const TOKEN_SECRET_KEY: string = process.env.TOKEN_SECRET_KEY;

export function signToken(payload: object) {
  const token = jwt.sign(payload, TOKEN_SECRET_KEY);
  return token;
}

// Also returns the decoded payload
export function verifyToken(token: string) {
  const payload = jwt.verify(token, TOKEN_SECRET_KEY);
  if (typeof payload === "string") {
    // We should only use objects, enforce
    throw new Error("JWT payload is a string, expected an object.");
  }
  return payload;
}