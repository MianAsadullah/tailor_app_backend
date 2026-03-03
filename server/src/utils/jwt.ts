import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  role: string;
}

export const signToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || 'changeme';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret as jwt.Secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'changeme';
  return jwt.verify(token, secret) as JwtPayload;
};

