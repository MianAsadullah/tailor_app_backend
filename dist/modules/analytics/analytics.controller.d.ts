import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
    sales(): Promise<{
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
