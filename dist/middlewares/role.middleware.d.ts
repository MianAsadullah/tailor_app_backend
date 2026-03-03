import { NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
export declare class RoleMiddleware implements NestMiddleware {
    private readonly roles;
    constructor(roles?: string[]);
    use(req: AuthRequest, _res: Response, next: NextFunction): void;
}
