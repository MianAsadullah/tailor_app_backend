import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderNumber!: string;

  @ApiProperty()
  @IsUUID()
  customerId!: string;

  @ApiProperty()
  @IsUUID()
  tailorId!: string;

  @ApiProperty()
  @IsUUID()
  shopId!: string;

  @ApiProperty()
  @IsUUID()
  measurementId!: string;

  @ApiProperty()
  @IsString()
  dressType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fabricImageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  designNotes?: string;

  @ApiProperty({ enum: ['pending', 'accepted', 'stitching', 'ready', 'delivered', 'cancelled'], required: false })
  @IsOptional()
  @IsEnum(['pending', 'accepted', 'stitching', 'ready', 'delivered', 'cancelled'])
  status?: OrderStatus;

  @ApiProperty()
  @IsNumber()
  price!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}

