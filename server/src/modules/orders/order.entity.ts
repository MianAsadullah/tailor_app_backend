import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
import { Measurement } from '../measurements/measurement.entity';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'stitching'
  | 'ready'
  | 'delivered'
  | 'cancelled';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  orderNumber!: string;

  @ManyToOne(() => User, { nullable: false })
  customer!: User;

  @ManyToOne(() => User, { nullable: false })
  tailor!: User;

  @ManyToOne(() => Shop, { nullable: false })
  shop!: Shop;

  @ManyToOne(() => Measurement, { nullable: false })
  measurement!: Measurement;

  @Column({ length: 100 })
  dressType!: string;

  @Column({ type: 'text', nullable: true })
  fabricImageUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  designNotes!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: OrderStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate!: Date | null;

  @Column({ default: false })
  isPaid!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}

