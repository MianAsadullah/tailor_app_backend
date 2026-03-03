import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
export declare class NotificationsService {
    private readonly notificationsRepo;
    constructor(notificationsRepo: Repository<Notification>);
    findForUser(userId: string): Promise<Notification[]>;
    markAsRead(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
