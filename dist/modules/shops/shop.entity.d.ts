import { User } from '../users/user.entity';
export declare class Shop {
    id: string;
    name: string;
    owner: User;
    address: string;
    city: string;
    logoUrl: string | null;
    isActive: boolean;
    settings: Record<string, unknown> | null;
    members: User[];
    createdAt: Date;
    deletedAt: Date | null;
}
