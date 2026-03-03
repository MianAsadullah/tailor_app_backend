import { User } from '../users/user.entity';
export type Gender = 'male' | 'female';
export interface MeasurementValues {
    chest?: number;
    waist?: number;
    hip?: number;
    shoulder?: number;
    armLength?: number;
    shirtLength?: number;
    trouserLength?: number;
    [key: string]: number | undefined;
}
export declare class Measurement {
    id: string;
    customer: User;
    title: string;
    gender: Gender;
    measurements: MeasurementValues;
    createdAt: Date;
}
