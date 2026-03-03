import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

export type PaymentMethod = 'cash' | 'stripe' | 'jazzcash';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, { nullable: false })
  order!: Order;

  @ManyToOne(() => User, { nullable: false })
  customer!: User;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 20 })
  method!: PaymentMethod;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

