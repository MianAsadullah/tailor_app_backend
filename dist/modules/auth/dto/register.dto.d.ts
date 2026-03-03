import { UserRole } from '../../users/user.entity';
export declare class RegisterDto {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: UserRole;
}
