import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
  // additional dynamic keys allowed
  [key: string]: number | undefined;
}

@Entity({ name: 'measurements' })
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  customer!: User;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'varchar', length: 10 })
  gender!: Gender;

  @Column({ type: 'jsonb' })
  measurements!: MeasurementValues;

  @CreateDateColumn()
  createdAt!: Date;
}

