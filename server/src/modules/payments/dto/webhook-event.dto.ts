import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class WebhookEventDto {
  @ApiProperty()
  @IsString()
  provider!: 'stripe' | 'jazzcash';

  @ApiProperty()
  @IsString()
  eventType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  signature?: string;

  @ApiProperty({ type: 'object' })
  @IsObject()
  payload!: Record<string, unknown>;
}

