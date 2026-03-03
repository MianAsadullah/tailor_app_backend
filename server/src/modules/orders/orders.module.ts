import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
import { Measurement } from '../measurements/measurement.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Shop, Measurement])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}

