import { createHash } from 'crypto';
import { type Request } from 'express';

export function computeDeviceFingerprint(req: Request): string {
  if (!req.ip) {
    throw new Error("Can't find request ip");
  }

  const deviceId = createHash('sha256')
    .update(req.ip + req.headers['user-agent'])
    .digest('hex');

  return deviceId;
}
