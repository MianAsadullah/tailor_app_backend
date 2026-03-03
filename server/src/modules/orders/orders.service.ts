import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-status.dto';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
import { Measurement } from '../measurements/measurement.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Shop)
    private readonly shopsRepo: Repository<Shop>,
    @InjectRepository(Measurement)
    private readonly measurementsRepo: Repository<Measurement>,
  ) {}

  async create(dto: CreateOrderDto) {
    const customer = await this.usersRepo.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const tailor = await this.usersRepo.findOne({ where: { id: dto.tailorId } });
    if (!tailor) throw new NotFoundException('Tailor not found');

    const shop = await this.shopsRepo.findOne({ where: { id: dto.shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    const measurement = await this.measurementsRepo.findOne({ where: { id: dto.measurementId } });
    if (!measurement) throw new NotFoundException('Measurement not found');

    const order = this.ordersRepo.create({
      orderNumber: dto.orderNumber,
      customer,
      tailor,
      shop,
      measurement,
      dressType: dto.dressType,
      fabricImageUrl: dto.fabricImageUrl ?? null,
      designNotes: dto.designNotes ?? null,
      status: dto.status ?? 'pending',
      price: dto.price,
      deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
      isPaid: dto.isPaid ?? false,
    });

    return this.ordersRepo.save(order);
  }

  async findAll() {
    return this.ordersRepo.find({
      relations: ['customer', 'tailor', 'shop', 'measurement'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: ['customer', 'tailor', 'shop', 'measurement'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (dto.customerId) {
      const customer = await this.usersRepo.findOne({ where: { id: dto.customerId } });
      if (!customer) throw new NotFoundException('Customer not found');
      order.customer = customer;
    }

    if (dto.tailorId) {
      const tailor = await this.usersRepo.findOne({ where: { id: dto.tailorId } });
      if (!tailor) throw new NotFoundException('Tailor not found');
      order.tailor = tailor;
    }

    if (dto.shopId) {
      const shop = await this.shopsRepo.findOne({ where: { id: dto.shopId } });
      if (!shop) throw new NotFoundException('Shop not found');
      order.shop = shop;
    }

    if (dto.measurementId) {
      const measurement = await this.measurementsRepo.findOne({ where: { id: dto.measurementId } });
      if (!measurement) throw new NotFoundException('Measurement not found');
      order.measurement = measurement;
    }

    Object.assign(order, {
      orderNumber: dto.orderNumber ?? order.orderNumber,
      dressType: dto.dressType ?? order.dressType,
      fabricImageUrl: dto.fabricImageUrl ?? order.fabricImageUrl,
      designNotes: dto.designNotes ?? order.designNotes,
      status: (dto.status as OrderStatus | undefined) ?? order.status,
      price: dto.price ?? order.price,
      deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : order.deliveryDate,
      isPaid: typeof dto.isPaid === 'boolean' ? dto.isPaid : order.isPaid,
    });

    return this.ordersRepo.save(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = dto.status;
    return this.ordersRepo.save(order);
  }

  async assignTailor(id: string, tailorId: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const tailor = await this.usersRepo.findOne({ where: { id: tailorId } });
    if (!tailor) throw new NotFoundException('Tailor not found');

    order.tailor = tailor;
    return this.ordersRepo.save(order);
  }

  async changeDeliveryDate(id: string, deliveryDate: string | null) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    order.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    return this.ordersRepo.save(order);
  }

  async timeline(id: string) {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: ['customer', 'tailor', 'shop', 'measurement'],
    });
    if (!order) throw new NotFoundException('Order not found');

    return {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveryDate: order.deliveryDate,
    };
  }

  async findByCustomer(customerId: string) {
    return this.ordersRepo.find({
      where: { customer: { id: customerId } },
      relations: ['customer', 'tailor', 'shop', 'measurement'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTailor(tailorId: string) {
    return this.ordersRepo.find({
      where: { tailor: { id: tailorId } },
      relations: ['customer', 'tailor', 'shop', 'measurement'],
      order: { createdAt: 'DESC' },
    });
  }

  async bulkUpdateStatus(orderIds: string[], status: OrderStatus) {
    const orders = await this.ordersRepo.findByIds(orderIds);
    orders.forEach((o) => {
      o.status = status;
    });
    await this.ordersRepo.save(orders);
    return { success: true, count: orders.length };
  }

  async bulkAssign(orderIds: string[], tailorId: string) {
    const tailor = await this.usersRepo.findOne({ where: { id: tailorId } });
    if (!tailor) {
      throw new NotFoundException('Tailor not found');
    }
    const orders = await this.ordersRepo.findByIds(orderIds);
    orders.forEach((o) => {
      o.tailor = tailor;
    });
    await this.ordersRepo.save(orders);
    return { success: true, count: orders.length };
  }

  async remove(id: string) {
    const result = await this.ordersRepo.softDelete({ id });
    if (!result.affected) throw new NotFoundException('Order not found');
    return { success: true };
  }

  async repeatOrder(id: string) {
    const existing = await this.ordersRepo.findOne({
      where: { id },
      relations: ['customer', 'tailor', 'shop', 'measurement'],
    });
    if (!existing) throw new NotFoundException('Order not found');

    const copy = this.ordersRepo.create({
      orderNumber: `${existing.orderNumber}-R${Date.now()}`,
      customer: existing.customer,
      tailor: existing.tailor,
      shop: existing.shop,
      measurement: existing.measurement,
      dressType: existing.dressType,
      fabricImageUrl: existing.fabricImageUrl,
      designNotes: existing.designNotes,
      status: 'pending',
      price: existing.price,
      deliveryDate: null,
      isPaid: false,
    });

    return this.ordersRepo.save(copy);
  }

  async cancel(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = 'cancelled';
    return this.ordersRepo.save(order);
  }

  async estimatePrice(input: {
    dressType: string;
    complexity?: 'low' | 'medium' | 'high';
  }) {
    const base =
      input.dressType.toLowerCase() === 'suit'
        ? 3000
        : input.dressType.toLowerCase() === 'shalwar kameez'
        ? 2000
        : 2500;

    const multiplier =
      input.complexity === 'high'
        ? 1.4
        : input.complexity === 'low'
        ? 1.0
        : 1.2;

    const price = Math.round(base * multiplier);
    return { estimatedPrice: price };
  }
}

