export type UserRole = 'customer' | 'tailor' | 'admin';
export declare class User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
