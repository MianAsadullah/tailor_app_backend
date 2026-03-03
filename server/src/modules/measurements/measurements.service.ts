import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './measurement.entity';
import { User } from '../users/user.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private readonly measurementsRepo: Repository<Measurement>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateMeasurementDto) {
    const customer = await this.usersRepo.findOne({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const measurement = this.measurementsRepo.create({
      customer,
      title: dto.title,
      gender: dto.gender,
      measurements: dto.measurements ?? {},
    });

    return this.measurementsRepo.save(measurement);
  }

  async findAll() {
    return this.measurementsRepo.find({ relations: ['customer'] });
  }

  async findOne(id: string) {
    const measurement = await this.measurementsRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!measurement) {
      throw new NotFoundException('Measurement not found');
    }
    return measurement;
  }

  async update(id: string, dto: UpdateMeasurementDto) {
    const measurement = await this.measurementsRepo.findOne({ where: { id } });
    if (!measurement) {
      throw new NotFoundException('Measurement not found');
    }

    if (dto.customerId) {
      const customer = await this.usersRepo.findOne({
        where: { id: dto.customerId },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      measurement.customer = customer;
    }

    Object.assign(measurement, {
      title: dto.title ?? measurement.title,
      gender: dto.gender ?? measurement.gender,
      measurements: dto.measurements ?? measurement.measurements,
    });

    return this.measurementsRepo.save(measurement);
  }

  async remove(id: string) {
    const measurement = await this.measurementsRepo.findOne({ where: { id } });
    if (!measurement) {
      throw new NotFoundException('Measurement not found');
    }
    await this.measurementsRepo.remove(measurement);
    return { success: true };
  }
}

