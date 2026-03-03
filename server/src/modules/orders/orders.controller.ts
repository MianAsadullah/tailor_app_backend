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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/assign-tailor')
  assignTailor(
    @Param('id') id: string,
    @Body('tailorId') tailorId: string,
  ) {
    return this.ordersService.assignTailor(id, tailorId);
  }

  @Patch(':id/change-delivery-date')
  changeDeliveryDate(
    @Param('id') id: string,
    @Body('deliveryDate') deliveryDate: string | null,
  ) {
    return this.ordersService.changeDeliveryDate(id, deliveryDate);
  }

  @Get(':id/timeline')
  timeline(@Param('id') id: string) {
    return this.ordersService.timeline(id);
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.ordersService.findByCustomer(customerId);
  }

  @Get('tailor/:tailorId')
  findByTailor(@Param('tailorId') tailorId: string) {
    return this.ordersService.findByTailor(tailorId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post(':id/repeat')
  repeat(@Param('id') id: string) {
    return this.ordersService.repeatOrder(id);
  }

  @Post('repeat/:orderId')
  repeatByParam(@Param('orderId') orderId: string) {
    return this.ordersService.repeatOrder(orderId);
  }

  @Post('cancel/:id')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  @Post('estimate-price')
  estimatePrice(
    @Body('dressType') dressType: string,
    @Body('complexity') complexity?: 'low' | 'medium' | 'high',
  ) {
    return this.ordersService.estimatePrice({ dressType, complexity });
  }

  @Post('bulk-update-status')
  bulkUpdateStatus(
    @Body('orderIds') orderIds: string[],
    @Body('status') status: string,
  ) {
    return this.ordersService.bulkUpdateStatus(orderIds, status as any);
  }

  @Post('bulk-assign')
  bulkAssign(
    @Body('orderIds') orderIds: string[],
    @Body('tailorId') tailorId: string,
  ) {
    return this.ordersService.bulkAssign(orderIds, tailorId);
  }
}

