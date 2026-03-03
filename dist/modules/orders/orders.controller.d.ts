import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<import("./order.entity").Order>;
    findAll(): Promise<import("./order.entity").Order[]>;
    findOne(id: string): Promise<import("./order.entity").Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<import("./order.entity").Order>;
    assignTailor(id: string, tailorId: string): Promise<import("./order.entity").Order>;
    changeDeliveryDate(id: string, deliveryDate: string | null): Promise<import("./order.entity").Order>;
    timeline(id: string): Promise<{
        id: string;
        status: import("./order.entity").OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deliveryDate: Date | null;
    }>;
    findByCustomer(customerId: string): Promise<import("./order.entity").Order[]>;
    findByTailor(tailorId: string): Promise<import("./order.entity").Order[]>;
    update(id: string, dto: UpdateOrderDto): Promise<import("./order.entity").Order>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    repeat(id: string): Promise<import("./order.entity").Order>;
    repeatByParam(orderId: string): Promise<import("./order.entity").Order>;
    cancel(id: string): Promise<import("./order.entity").Order>;
    estimatePrice(dressType: string, complexity?: 'low' | 'medium' | 'high'): Promise<{
        estimatedPrice: number;
    }>;
    bulkUpdateStatus(orderIds: string[], status: string): Promise<{
        success: boolean;
        count: number;
    }>;
    bulkAssign(orderIds: string[], tailorId: string): Promise<{
        success: boolean;
        count: number;
    }>;
}
