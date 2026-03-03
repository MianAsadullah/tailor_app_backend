import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';

@ApiTags('shops')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  create(@Body() dto: CreateShopDto) {
    return this.shopsService.create(dto);
  }

  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShopDto) {
    return this.shopsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }

  @Get(':id/analytics')
  analytics(@Param('id') id: string) {
    return this.shopsService.analytics(id);
  }

  @Patch(':id/settings')
  updateSettings(
    @Param('id') id: string,
    @Body() settings: Record<string, unknown>,
  ) {
    return this.shopsService.updateSettings(id, settings);
  }

  @Post(':id/invite-tailor')
  inviteTailor(
    @Param('id') id: string,
    @Body('tailorId') tailorId: string,
  ) {
    return this.shopsService.inviteTailor(id, tailorId);
  }

  @Get(':id/members')
  members(@Param('id') id: string) {
    return this.shopsService.members(id);
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.shopsService.removeMember(id, userId);
  }
}

