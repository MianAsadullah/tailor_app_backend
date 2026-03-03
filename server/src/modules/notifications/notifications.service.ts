import { Injectable, NotFoundException } from '@nestjs/common';
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

  async markAllAsRead(userId: string) {
    await this.notificationsRepo.update(
      { user: { id: userId }, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }

  async delete(id: string, userId: string) {
    const result = await this.notificationsRepo.softDelete({
      id,
      user: { id: userId } as any,
    });
    return { success: !!result.affected };
  }

  async send(userId: string, title: string, message: string) {
    const notification = this.notificationsRepo.create({
      user: { id: userId } as any,
      title,
      message,
      isRead: false,
    });
    return this.notificationsRepo.save(notification);
  }

  async unreadCount(userId: string) {
    const count = await this.notificationsRepo.count({
      where: { user: { id: userId }, isRead: false },
    });
    return { count };
  }

  async broadcast(title: string, message: string) {
    // Lightweight broadcast: create a single "system" notification without user linking
    const systemNotification = this.notificationsRepo.create({
      user: null as any,
      title,
      message,
      isRead: false,
    });
    await this.notificationsRepo.save(systemNotification);
    return { success: true };
  }
}

