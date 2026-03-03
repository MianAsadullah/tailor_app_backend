import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './measurement.entity';
import { User } from '../users/user.entity';
import { MeasurementsService } from './measurements.service';
import { MeasurementsController } from './measurements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Measurement, User])],
  providers: [MeasurementsService],
  controllers: [MeasurementsController],
})
export class MeasurementsModule {}

