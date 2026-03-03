import { NotificationsService } from './notifications.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findMine(req: AuthRequest): Promise<import("./notification.entity").Notification[]>;
    markRead(id: string, req: AuthRequest): Promise<{
        success: boolean;
    }>;
}
