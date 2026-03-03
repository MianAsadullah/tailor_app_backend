import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<User>);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getMe(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import("../users/user.entity").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(): Promise<{
        success: boolean;
    }>;
    private toSafeUser;
}
