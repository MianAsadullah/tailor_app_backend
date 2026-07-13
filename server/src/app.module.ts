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

const importsArray = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [env],
  }),
  // Only initialize TypeORM if database configuration is present.
  // This prevents serverless function invocations from failing
  // when no DB is configured in the environment (e.g., preview deployments).
  ...(process.env.DATABASE_URL || process.env.DB_HOST
    ? [
        TypeOrmModule.forRootAsync({
          useFactory: () => getTypeOrmConfig(),
        }),
      ]
    : []),
  AuthModule,
  UsersModule,
  ShopsModule,
  MeasurementsModule,
  OrdersModule,
  PaymentsModule,
  NotificationsModule,
  AnalyticsModule,
];

@Module({
  imports: importsArray,
  controllers: [SystemController, UploadController],
})
export class AppModule {}

