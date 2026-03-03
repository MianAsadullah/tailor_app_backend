import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['pending', 'accepted', 'stitching', 'ready', 'delivered', 'cancelled'] })
  @IsEnum(['pending', 'accepted', 'stitching', 'ready', 'delivered', 'cancelled'])
  status!: OrderStatus;
}

