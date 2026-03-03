import { User } from '../users/user.entity';
export declare class Shop {
    id: string;
    name: string;
    owner: User;
    address: string;
    city: string;
    logoUrl: string | null;
    isActive: boolean;
    createdAt: Date;
}
