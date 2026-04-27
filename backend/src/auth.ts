import jwt from 'jsonwebtoken';

if (!process.env.TOKEN_SECRET_KEY) {
  throw new Error('Secret key not set in environment variables.');
}

const TOKEN_SECRET_KEY: string = process.env.TOKEN_SECRET_KEY;

type JwtPayload = {
  id: string;
  email?: string;
  name?: string;
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, TOKEN_SECRET_KEY, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

export function verifyToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, TOKEN_SECRET_KEY, {
      algorithms: ['HS256'],
    });

    if (typeof payload === 'string') {
      throw new Error('Invalid token payload');
    }

    return payload as JwtPayload;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}