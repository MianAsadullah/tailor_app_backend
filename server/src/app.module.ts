import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './config/env';
import { getTypeOrmConfig } from './config/db';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ShopsModule } from './modules/shops/shops.module';
import { MeasurementsModule } from './modules/measurements/measurements.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SystemController } from './modules/system/system.controller';
import { UploadController } from './modules/upload/upload.controller';

function isLocalhostHost(host?: string) {
  if (!host) return false;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

const databaseUrl = process.env.DATABASE_URL;
const envDbHost = process.env.DB_HOST;

const dbEnabled = (() => {
  // Allow forcing DB-enabled mode (useful for local dev / docs)
  if (process.env.FORCE_ENABLE_DB === '1') return true;
  // If no DB config exists, disable DB modules
  if (!databaseUrl && !envDbHost) return false;

  // If running in production, treat localhost/127.0.0.1 as NOT configured
  // because serverless environments cannot reach local DBs.
  if (process.env.NODE_ENV === 'production') {
    if (databaseUrl) {
      const lower = databaseUrl.toLowerCase();
      if (lower.includes('localhost') || lower.includes('127.0.0.1')) {
        console.warn('DATABASE_URL points to localhost in production — treating DB as not configured.');
        return false;
      }
    }

    if (isLocalhostHost(envDbHost)) {
      console.warn('DB_HOST is localhost in production — treating DB as not configured.');
      return false;
    }
  }

  return true;
})();

const importsArray = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [env],
  }),
  // Only include TypeORM and DB-dependent modules when a database is configured.
  // This prevents serverless function invocations from failing in preview
  // deployments where no DB is available.
  ...(dbEnabled
    ? [
        TypeOrmModule.forRootAsync({
          useFactory: () => getTypeOrmConfig(),
        }),
        AuthModule,
        UsersModule,
        ShopsModule,
        MeasurementsModule,
        OrdersModule,
        PaymentsModule,
        NotificationsModule,
        AnalyticsModule,
      ]
    : []),
];

@Module({
  imports: importsArray,
  controllers: [SystemController, UploadController],
})
export class AppModule {}

