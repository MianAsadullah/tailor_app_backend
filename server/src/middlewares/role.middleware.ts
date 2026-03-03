import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly roles: string[] = []) {}

  use(req: AuthRequest, _res: Response, next: NextFunction) {
    if (!req.user) {
      throw new ForbiddenException('No user in request');
    }

    if (this.roles.length > 0 && !this.roles.includes(req.user.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    next();
  }
}

