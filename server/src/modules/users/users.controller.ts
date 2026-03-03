import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    const role = req.user?.role ?? 'customer';
    return this.usersService.findAll(role);
  }

  @Get('stats')
  async stats(@Req() req: AuthRequest) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admin can view stats');
    }
    return this.usersService.stats();
  }

  @Get('activity-log')
  async activityLog(@Req() req: AuthRequest) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admin can view activity log');
    }
    return this.usersService.activityLog();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/role')
  async updateRole(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admin can change roles');
    }
    return this.usersService.updateRole(id, role as any);
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admin can change status');
    }
    return this.usersService.updateStatus(id, isActive);
  }

}

