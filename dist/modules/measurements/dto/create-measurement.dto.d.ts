import { Gender } from '../measurement.entity';
export declare class CreateMeasurementDto {
    customerId: string;
    title: string;
    gender: Gender;
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
