import argon2 from 'argon2';

export async function hashString(str: string): Promise<string> {
  return await argon2.hash(str, {
    type: argon2.argon2id,
  });
}

export async function verifyHash(hash: string, real: string): Promise<boolean> {
  if (typeof hash !== 'string' || typeof real !== 'string') {
    return false;
  }

  if (hash.length === 0 || real.length === 0) {
    return false;
  }

  return await argon2.verify(hash, real);
}
