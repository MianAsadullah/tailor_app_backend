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
    update(id: string, dto: UpdateOrderDto): Promise<import("./order.entity").Order>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
