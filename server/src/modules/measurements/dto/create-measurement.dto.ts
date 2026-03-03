import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Gender } from '../measurement.entity';

export class CreateMeasurementDto {
  @ApiProperty()
  @IsUUID()
  customerId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ enum: ['male', 'female'] })
  @IsEnum(['male', 'female'])
  gender!: Gender;

  @ApiProperty({
    required: false,
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @IsOptional()
  measurements?: {
    chest?: number;
    waist?: number;
    hip?: number;
    shoulder?: number;
    armLength?: number;
    shirtLength?: number;
    trouserLength?: number;
    [key: string]: number | undefined;
  };
}

