import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Gender } from '../measurement.entity';

export class FromTemplateDto {
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

  @ApiProperty({ enum: ['shalwar_kameez', 'suit'] })
  @IsString()
  templateKey!: string;
}

