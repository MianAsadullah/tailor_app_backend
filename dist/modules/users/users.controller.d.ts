import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: AuthRequest): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import("./user.entity").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import("./user.entity").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import("./user.entity").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
