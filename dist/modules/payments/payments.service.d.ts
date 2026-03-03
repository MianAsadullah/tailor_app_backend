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
    findByOrder(orderId: string): Promise<Payment[]>;
    handleWebhook(dto: WebhookEventDto): Promise<{
        received: boolean;
        handled: boolean;
    }>;
}
