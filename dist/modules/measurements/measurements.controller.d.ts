import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { FromTemplateDto } from './dto/from-template.dto';
export declare class MeasurementsController {
    private readonly measurementsService;
    constructor(measurementsService: MeasurementsService);
    getTemplates(): {
        key: string;
        title: string;
        fields: string[];
    }[];
    duplicate(id: string): Promise<import("./measurement.entity").Measurement>;
    fromTemplate(dto: FromTemplateDto): Promise<import("./measurement.entity").Measurement>;
    findByCustomer(customerId: string): Promise<import("./measurement.entity").Measurement[]>;
    create(dto: CreateMeasurementDto): Promise<import("./measurement.entity").Measurement>;
    findAll(): Promise<import("./measurement.entity").Measurement[]>;
    findOne(id: string): Promise<import("./measurement.entity").Measurement>;
    update(id: string, dto: UpdateMeasurementDto): Promise<import("./measurement.entity").Measurement>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
