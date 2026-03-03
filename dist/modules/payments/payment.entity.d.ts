import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
export type PaymentMethod = 'cash' | 'stripe' | 'jazzcash';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export declare class Payment {
    id: string;
    order: Order;
    customer: User;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId: string | null;
    createdAt: Date;
}
