import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  findForUser(userId: string) {
    return this.notificationsRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationsRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!notification) {
      return { success: false };
    }
    notification.isRead = true;
    await this.notificationsRepo.save(notification);
    return { success: true };
  }
}

