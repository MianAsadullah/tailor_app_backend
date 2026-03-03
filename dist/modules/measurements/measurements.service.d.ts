import { Repository } from 'typeorm';
import { Measurement } from './measurement.entity';
import { User } from '../users/user.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
export declare class MeasurementsService {
    private readonly measurementsRepo;
    private readonly usersRepo;
    constructor(measurementsRepo: Repository<Measurement>, usersRepo: Repository<User>);
    create(dto: CreateMeasurementDto): Promise<Measurement>;
    findAll(): Promise<Measurement[]>;
    findOne(id: string): Promise<Measurement>;
    update(id: string, dto: UpdateMeasurementDto): Promise<Measurement>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
