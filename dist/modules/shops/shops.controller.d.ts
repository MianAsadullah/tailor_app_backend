import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
export declare class ShopsController {
    private readonly shopsService;
    constructor(shopsService: ShopsService);
    create(dto: CreateShopDto): Promise<import("./shop.entity").Shop>;
    findAll(): Promise<import("./shop.entity").Shop[]>;
    findOne(id: string): Promise<import("./shop.entity").Shop>;
    update(id: string, dto: UpdateShopDto): Promise<import("./shop.entity").Shop>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    analytics(id: string): Promise<{
        totalOrders: number;
        completedOrders: number;
        pendingOrders: number;
        revenue: number;
    }>;
    updateSettings(id: string, settings: Record<string, unknown>): Promise<import("./shop.entity").Shop>;
    inviteTailor(id: string, tailorId: string): Promise<{
        success: boolean;
    }>;
    members(id: string): Promise<{
        owner: import("../users/user.entity").User;
        members: import("../users/user.entity").User[];
    }>;
    removeMember(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
