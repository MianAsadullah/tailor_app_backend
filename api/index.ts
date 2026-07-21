import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../server/src/app.module';
import { AllExceptionsFilter } from '../server/src/middlewares/error.middleware';

let cachedApp: any;

// Process-level handlers to ensure unhandled errors are logged in Vercel logs.
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection at:', reason && reason.stack ? reason.stack : reason);
});

process.on('uncaughtException', (err: any) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});

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
      app.setGlobalPrefix('api', { exclude: ['/', 'health', 'config'] });

      // Swagger setup so API docs are available in serverless handler
      const config = new DocumentBuilder()
        .setTitle('Tailor App API')
        .setDescription('API documentation for Tailor backend')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document,{
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js',
  ],
});

      await app.init();
      cachedApp = app.getHttpAdapter().getInstance();
    }

    return cachedApp(req, res);
  } catch (err: any) {
    // Surface initialization/runtime errors to Vercel logs
    console.error('Handler error:', err && err.stack ? err.stack : err);
    try {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ statusCode: 500, message: 'Internal server error' }));
    } catch (e) {
      // ignore
    }
  }
}

