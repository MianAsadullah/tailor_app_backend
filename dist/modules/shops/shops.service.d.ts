import { Repository } from 'typeorm';
import { Shop } from './shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
export declare class ShopsService {
    private readonly shopsRepo;
    private readonly usersRepo;
    private readonly ordersRepo;
    constructor(shopsRepo: Repository<Shop>, usersRepo: Repository<User>, ordersRepo: Repository<Order>);
    create(dto: CreateShopDto): Promise<Shop>;
    findAll(): Promise<Shop[]>;
    findOne(id: string): Promise<Shop>;
    update(id: string, dto: UpdateShopDto): Promise<Shop>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    analytics(id: string): Promise<{
        totalOrders: number;
        completedOrders: number;
        pendingOrders: number;
        revenue: number;
    }>;
    updateSettings(id: string, settings: Record<string, unknown>): Promise<Shop>;
    inviteTailor(id: string, tailorId: string): Promise<{
        success: boolean;
    }>;
    members(id: string): Promise<{
        owner: User;
        members: User[];
    }>;
    removeMember(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
