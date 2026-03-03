import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WebhookEventDto } from './dto/webhook-event.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(dto: CreatePaymentDto): Promise<import("./payment.entity").Payment>;
    findByOrder(orderId: string): Promise<import("./payment.entity").Payment[]>;
    webhook(dto: WebhookEventDto): Promise<{
        received: boolean;
        handled: boolean;
    }>;
}
