import { UserRole } from '../user.entity';
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
}
