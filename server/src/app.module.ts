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

console.log('Hi, i am app.module.ts');

const featureModules = [
  AuthModule,
  UsersModule,
  ShopsModule,
  MeasurementsModule,
  OrdersModule,
  PaymentsModule,
  NotificationsModule,
  AnalyticsModule,
];

const importsArray = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [env],
  }),
  TypeOrmModule.forRootAsync({
    useFactory: () => getTypeOrmConfig(),
  }),
  ...featureModules,
];

@Module({
  imports: importsArray,
  controllers: [SystemController, UploadController],
})
export class AppModule {}

