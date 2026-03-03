import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
export declare class NotificationsService {
    private readonly notificationsRepo;
    constructor(notificationsRepo: Repository<Notification>);
    findForUser(userId: string): Promise<Notification[]>;
    markAsRead(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    delete(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    send(userId: string, title: string, message: string): Promise<Notification>;
    unreadCount(userId: string): Promise<{
        count: number;
    }>;
    broadcast(title: string, message: string): Promise<{
        success: boolean;
    }>;
}
