import { NotificationsService } from './notifications.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findMine(req: AuthRequest): Promise<import("./notification.entity").Notification[]>;
    markRead(id: string, req: AuthRequest): Promise<{
        success: boolean;
    }>;
    markAll(req: AuthRequest): Promise<{
        success: boolean;
    }>;
    remove(id: string, req: AuthRequest): Promise<{
        success: boolean;
    }>;
    send(req: AuthRequest, userId: string, title: string, message: string): Promise<import("./notification.entity").Notification>;
    unreadCount(req: AuthRequest): Promise<{
        count: number;
    }>;
    broadcast(req: AuthRequest, title: string, message: string): Promise<{
        success: boolean;
    }>;
}
