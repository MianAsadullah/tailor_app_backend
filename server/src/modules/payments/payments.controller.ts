import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create-intent')
  createIntent(
    @Body('orderId') orderId: string,
    @Body('amount') amount: number,
    @Body('method') method: 'cash' | 'stripe' | 'jazzcash' | 'easypaisa',
  ) {
    return this.paymentsService.createIntent(orderId, amount, method);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  confirm(@Body('transactionId') transactionId: string) {
    return this.paymentsService.confirm(transactionId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  analytics() {
    return this.paymentsService.analytics();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refund')
  refund(@Body('transactionId') transactionId: string) {
    return this.paymentsService.refund(transactionId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('earnings/tailor/:tailorId')
  earningsForTailor(@Param('tailorId') tailorId: string) {
    return this.paymentsService.earningsForTailor(tailorId);
  }

  @Post('webhook')
  webhook(@Body() dto: WebhookEventDto) {
    return this.paymentsService.handleWebhook(dto);
  }
}

