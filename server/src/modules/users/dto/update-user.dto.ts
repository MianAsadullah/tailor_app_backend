import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ enum: ['customer', 'tailor', 'admin'] })
  @IsOptional()
  @IsString()
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

