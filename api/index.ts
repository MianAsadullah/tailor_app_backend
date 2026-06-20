import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../server/src/app.module';
import { AllExceptionsFilter } from '../server/src/middlewares/error.middleware';

let cachedApp: any;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedApp) {
      const app = await NestFactory.create(AppModule);

      app.useGlobalFilters(new AllExceptionsFilter());
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      app.setGlobalPrefix('api');

      await app.init();
      cachedApp = app.getHttpAdapter().getInstance();
    }

    return cachedApp(req, res);
  } catch (err) {
    // Surface initialization/runtime errors to Vercel logs
    console.error('Handler error:', err);
    try {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ statusCode: 500, message: 'Internal server error' }));
    } catch (e) {
      // ignore
    }
  }
}

