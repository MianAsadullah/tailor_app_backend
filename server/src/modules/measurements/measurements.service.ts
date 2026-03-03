import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './measurement.entity';
import { User } from '../users/user.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { FromTemplateDto } from './dto/from-template.dto';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private readonly measurementsRepo: Repository<Measurement>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  getTemplates() {
    return [
      {
        key: 'shalwar_kameez',
        title: 'Shalwar Kameez',
        fields: [
          'chest',
          'waist',
          'hip',
          'shoulder',
          'armLength',
          'shirtLength',
          'trouserLength',
        ],
      },
      {
        key: 'suit',
        title: 'Suit',
        fields: [
          'chest',
          'waist',
          'hip',
          'shoulder',
          'armLength',
          'shirtLength',
          'trouserLength',
        ],
      },
    ];
  }

  async duplicate(id: string) {
    const existing = await this.measurementsRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!existing) {
      throw new NotFoundException('Measurement not found');
    }

    const copy = this.measurementsRepo.create({
      customer: existing.customer,
      title: `${existing.title} (copy)`,
      gender: existing.gender,
      measurements: { ...existing.measurements },
    });

    return this.measurementsRepo.save(copy);
  }

  async findByCustomer(customerId: string) {
    const customer = await this.usersRepo.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return this.measurementsRepo.find({
      where: { customer: { id: customerId } },
      relations: ['customer'],
    });
  }

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
    const result = await this.measurementsRepo.softDelete({ id });
    if (!result.affected) {
      throw new NotFoundException('Measurement not found');
    }
    return { success: true };
  }

  async createFromTemplate(dto: FromTemplateDto) {
    const customer = await this.usersRepo.findOne({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const templates = this.getTemplates();
    const template = templates.find((t) => t.key === dto.templateKey);
    if (!template) {
      throw new BadRequestException('Invalid template key');
    }

    const measurements: Record<string, number> = {};
    template.fields.forEach((field) => {
      measurements[field] = 0;
    });

    const entity = this.measurementsRepo.create({
      customer,
      title: dto.title,
      gender: dto.gender,
      measurements,
    });

    return this.measurementsRepo.save(entity);
  }
}

