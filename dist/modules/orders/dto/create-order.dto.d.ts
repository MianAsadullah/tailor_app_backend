import { OrderStatus } from '../order.entity';
export declare class CreateOrderDto {
    orderNumber: string;
    customerId: string;
    tailorId: string;
    shopId: string;
    measurementId: string;
    dressType: string;
    fabricImageUrl?: string;
    designNotes?: string;
    status?: OrderStatus;
    price: number;
    deliveryDate?: string;
    isPaid?: boolean;
}
