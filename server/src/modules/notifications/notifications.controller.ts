import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findMine(@Req() req: AuthRequest) {
    const userId = req.user?.id;
    return this.notificationsService.findForUser(userId!);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user?.id;
    return this.notificationsService.markAsRead(id, userId!);
  }

  @Patch('read-all')
  markAll(@Req() req: AuthRequest) {
    const userId = req.user?.id;
    return this.notificationsService.markAllAsRead(userId!);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user?.id;
    return this.notificationsService.delete(id, userId!);
  }

  @Post('send')
  send(
    @Req() req: AuthRequest,
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    // Could restrict to admin in future
    return this.notificationsService.send(userId, title, message);
  }

  @Get('unread-count')
  unreadCount(@Req() req: AuthRequest) {
    const userId = req.user?.id;
    return this.notificationsService.unreadCount(userId!);
  }

  @Post('broadcast')
  broadcast(
    @Req() req: AuthRequest,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    // Could restrict to admin in future
    return this.notificationsService.broadcast(title, message);
  }
}

