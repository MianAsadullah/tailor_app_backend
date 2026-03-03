import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WebhookEventDto } from './dto/webhook-event.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(dto: CreatePaymentDto): Promise<import("./payment.entity").Payment>;
    createIntent(orderId: string, amount: number, method: 'cash' | 'stripe' | 'jazzcash' | 'easypaisa'): Promise<{
        clientSecret: string;
        amount: number;
        method: import("./payment.entity").PaymentMethod;
        orderId: string;
    }>;
    confirm(transactionId: string): Promise<{
        success: boolean;
    }>;
    findByOrder(orderId: string): Promise<import("./payment.entity").Payment[]>;
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
    webhook(dto: WebhookEventDto): Promise<{
        received: boolean;
        handled: boolean;
    }>;
}
