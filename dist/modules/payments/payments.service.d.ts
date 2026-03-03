import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WebhookEventDto } from './dto/webhook-event.dto';
export declare class PaymentsService {
    private readonly paymentsRepo;
    private readonly ordersRepo;
    private readonly usersRepo;
    constructor(paymentsRepo: Repository<Payment>, ordersRepo: Repository<Order>, usersRepo: Repository<User>);
    create(dto: CreatePaymentDto): Promise<Payment>;
    createIntent(orderId: string, amount: number, method: Payment['method']): Promise<{
        clientSecret: string;
        amount: number;
        method: import("./payment.entity").PaymentMethod;
        orderId: string;
    }>;
    confirm(transactionId: string): Promise<{
        success: boolean;
    }>;
    findByOrder(orderId: string): Promise<Payment[]>;
    handleWebhook(dto: WebhookEventDto): Promise<{
        received: boolean;
        handled: boolean;
    }>;
    analytics(): Promise<{
        total: number;
        paid: number;
        refunded: number;
        revenue: number;
    }>;
    refund(transactionId: string): Promise<{
        success: boolean;
    }>;
    earningsForTailor(tailorId: string): Promise<{
        tailorId: string;
        earnings: number;
    }>;
}
