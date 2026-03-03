import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
import { Measurement } from '../measurements/measurement.entity';
export type OrderStatus = 'pending' | 'accepted' | 'stitching' | 'ready' | 'delivered' | 'cancelled';
export declare class Order {
    id: string;
    orderNumber: string;
    customer: User;
    tailor: User;
    shop: Shop;
    measurement: Measurement;
    dressType: string;
    fabricImageUrl: string | null;
    designNotes: string | null;
    status: OrderStatus;
    price: number;
    deliveryDate: Date | null;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
