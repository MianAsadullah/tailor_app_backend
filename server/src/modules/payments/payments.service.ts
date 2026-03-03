import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WebhookEventDto } from './dto/webhook-event.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.ordersRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const customer = await this.usersRepo.findOne({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    const payment = this.paymentsRepo.create({
      order,
      customer,
      amount: dto.amount,
      method: dto.method,
      status: 'pending',
      transactionId: dto.transactionId ?? null,
    });

    return this.paymentsRepo.save(payment);
  }

  async findByOrder(orderId: string) {
    const order = await this.ordersRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.paymentsRepo.find({
      where: { order: { id: orderId } },
      relations: ['order', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async handleWebhook(dto: WebhookEventDto) {
    // This is a simplified placeholder; real implementation would
    // verify signature and parse provider-specific payload.
    const payload = dto.payload as any;
    const transactionId = payload.transactionId || payload.id;
    const status: PaymentStatus =
      (payload.status as PaymentStatus) || 'pending';

    if (!transactionId) {
      return { received: true, handled: false };
    }

    const payment = await this.paymentsRepo.findOne({
      where: { transactionId },
      relations: ['order'],
    });

    if (!payment) {
      // Could create a new record or just acknowledge
      return { received: true, handled: false };
    }

    payment.status = status;
    await this.paymentsRepo.save(payment);

    if (status === 'paid') {
      payment.order.isPaid = true;
      await this.ordersRepo.save(payment.order);
    }

    return { received: true, handled: true };
  }
}

