import { PaymentMethod } from '../payment.entity';
export declare class CreatePaymentDto {
    orderId: string;
    customerId: string;
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
}
