import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-status.dto';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
import { Measurement } from '../measurements/measurement.entity';
export declare class OrdersService {
    private readonly ordersRepo;
    private readonly usersRepo;
    private readonly shopsRepo;
    private readonly measurementsRepo;
    constructor(ordersRepo: Repository<Order>, usersRepo: Repository<User>, shopsRepo: Repository<Shop>, measurementsRepo: Repository<Measurement>);
    create(dto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, dto: UpdateOrderDto): Promise<Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order>;
    assignTailor(id: string, tailorId: string): Promise<Order>;
    changeDeliveryDate(id: string, deliveryDate: string | null): Promise<Order>;
    timeline(id: string): Promise<{
        id: string;
        status: OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        deliveryDate: Date | null;
    }>;
    findByCustomer(customerId: string): Promise<Order[]>;
    findByTailor(tailorId: string): Promise<Order[]>;
    bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<{
        success: boolean;
        count: number;
    }>;
    bulkAssign(orderIds: string[], tailorId: string): Promise<{
        success: boolean;
        count: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    repeatOrder(id: string): Promise<Order>;
    cancel(id: string): Promise<Order>;
    estimatePrice(input: {
        dressType: string;
        complexity?: 'low' | 'medium' | 'high';
    }): Promise<{
        estimatedPrice: number;
    }>;
}
