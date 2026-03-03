import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    me(req: AuthRequest): Promise<{
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
}
