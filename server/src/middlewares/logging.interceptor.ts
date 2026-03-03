import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRequest } from './auth.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const { method, url } = req;
    const userId = req.user?.id;

    const started = Date.now();
    this.logger.log(
      `Request ${method} ${url} ${userId ? `user=${userId}` : ''}`.trim(),
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - started;
          this.logger.log(
            `Response ${method} ${url} ${ms}ms ${
              userId ? `user=${userId}` : ''
            }`.trim(),
          );
        },
      }),
    );
  }
}

