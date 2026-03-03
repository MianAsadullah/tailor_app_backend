import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
export declare class AnalyticsService {
    private readonly ordersRepo;
    private readonly paymentsRepo;
    private readonly usersRepo;
    private readonly shopsRepo;
    constructor(ordersRepo: Repository<Order>, paymentsRepo: Repository<Payment>, usersRepo: Repository<User>, shopsRepo: Repository<Shop>);
    dashboard(): Promise<{
        totalOrders: number;
        totalCustomers: number;
        totalTailors: number;
        totalRevenue: number;
    }>;
    revenue(): Promise<{
        method: string;
        amount: number;
    }[]>;
    orders(): Promise<{
        status: string;
        count: number;
    }[]>;
    customers(): Promise<{
        total: number;
        recent: {
            id: string;
            name: string;
            email: string;
            createdAt: Date;
        }[];
    }>;
    salesReport(): Promise<{
        shopId: string;
        shopName: string;
        orders: number;
        revenue: number;
    }[]>;
    tailorPerformance(): Promise<{
        tailorId: string;
        tailorName: string;
        totalOrders: number;
        completedOrders: number;
    }[]>;
    orderCompletionTime(): Promise<{
        averageHours: number;
        items: {
            orderId: string;
            hoursToComplete: number;
        }[];
    }>;
    exportCsv(): Promise<{
        csv: string;
    }>;
}
