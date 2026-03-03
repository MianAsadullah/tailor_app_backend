import { User } from '../users/user.entity';
export declare class Notification {
    id: string;
    user: User;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    deletedAt: Date | null;
}
