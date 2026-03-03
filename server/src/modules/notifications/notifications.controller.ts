import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
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
}

