import jwt from 'jsonwebtoken';

if (!process.env.TOKEN_SECRET_KEY) {
  throw new Error('Secret key not set in environment variables.');
}

const TOKEN_SECRET_KEY: string = process.env.TOKEN_SECRET_KEY;
const ISSUER = 'manasa-backend';
const AUDIENCE = 'manasa-client';

export function signToken(
  payload: object,
  expiresIn?: string | number | undefined,
) {
  const options: jwt.SignOptions = {
    algorithm: 'HS256',
    issuer: ISSUER,
    audience: AUDIENCE,
  };
  if (expiresIn) {
    options.expiresIn = expiresIn as jwt.SignOptions['expiresIn'];
  }

  const token = jwt.sign(payload, TOKEN_SECRET_KEY, options);
  return token;
}

// Also returns the decoded payload
export function verifyToken(token: string) {
  const payload = jwt.verify(token, TOKEN_SECRET_KEY, {
    algorithms: ['HS256'],
    issuer: ISSUER,
    audience: AUDIENCE,
  });

  if (typeof payload === 'string') {
    // We should only use objects, enforce
    throw new Error('JWT payload is a string, expected an object.');
  }
  return payload;
}
