import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
export declare class MeasurementsController {
    private readonly measurementsService;
    constructor(measurementsService: MeasurementsService);
    create(dto: CreateMeasurementDto): Promise<import("./measurement.entity").Measurement>;
    findAll(): Promise<import("./measurement.entity").Measurement[]>;
    findOne(id: string): Promise<import("./measurement.entity").Measurement>;
    update(id: string, dto: UpdateMeasurementDto): Promise<import("./measurement.entity").Measurement>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
