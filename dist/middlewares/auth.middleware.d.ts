import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare class AuthMiddleware implements NestMiddleware {
    use(req: AuthRequest, _res: Response, next: NextFunction): void;
}
