import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Shop)
    private readonly shopsRepo: Repository<Shop>,
  ) {}

  async dashboard() {
    const [orders, customers, tailors, revenueRaw] = await Promise.all([
      this.ordersRepo.count(),
      this.usersRepo.count({ where: { role: 'customer' } }),
      this.usersRepo.count({ where: { role: 'tailor' } }),
      this.paymentsRepo
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'revenue')
        .where('payment.status = :status', { status: 'paid' })
        .getRawOne<{ revenue: string | null }>(),
    ]);

    const revenue = revenueRaw?.revenue ? Number(revenueRaw.revenue) : 0;

    return {
      totalOrders: orders,
      totalCustomers: customers,
      totalTailors: tailors,
      totalRevenue: revenue,
    };
  }

  async revenue() {
    const byMethod = await this.paymentsRepo
      .createQueryBuilder('payment')
      .select('payment.method', 'method')
      .addSelect('SUM(payment.amount)', 'amount')
      .where('payment.status = :status', { status: 'paid' })
      .groupBy('payment.method')
      .getRawMany<{ method: string; amount: string }>();

    return byMethod.map((r) => ({
      method: r.method,
      amount: Number(r.amount),
    }));
  }

  async orders() {
    const byStatus = await this.ordersRepo
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany<{ status: string; count: string }>();

    return byStatus.map((r) => ({
      status: r.status,
      count: Number(r.count),
    }));
  }

  async customers() {
    const total = await this.usersRepo.count({ where: { role: 'customer' } });
    const recent = await this.usersRepo.find({
      where: { role: 'customer' },
      order: { createdAt: 'DESC' },
      take: 10,
    });
    return {
      total,
      recent: recent.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      })),
    };
  }

  async salesReport() {
    const byShop = await this.ordersRepo
      .createQueryBuilder('order')
      .leftJoin('order.shop', 'shop')
      .select('shop.id', 'shopId')
      .addSelect('shop.name', 'shopName')
      .addSelect('COUNT(order.id)', 'orders')
      .addSelect('SUM(order.price)', 'revenue')
      .groupBy('shop.id')
      .addGroupBy('shop.name')
      .getRawMany<{ shopId: string; shopName: string; orders: string; revenue: string }>();

    return byShop.map((r) => ({
      shopId: r.shopId,
      shopName: r.shopName,
      orders: Number(r.orders),
      revenue: Number(r.revenue),
    }));
  }

  async tailorPerformance() {
    const byTailor = await this.ordersRepo
      .createQueryBuilder('order')
      .leftJoin('order.tailor', 'tailor')
      .select('tailor.id', 'tailorId')
      .addSelect('tailor.name', 'tailorName')
      .addSelect('COUNT(order.id)', 'orders')
      .addSelect(
        `SUM(CASE WHEN order.status = 'delivered' THEN 1 ELSE 0 END)`,
        'completed',
      )
      .groupBy('tailor.id')
      .addGroupBy('tailor.name')
      .getRawMany<{ tailorId: string; tailorName: string; orders: string; completed: string }>();

    return byTailor.map((r) => ({
      tailorId: r.tailorId,
      tailorName: r.tailorName,
      totalOrders: Number(r.orders),
      completedOrders: Number(r.completed),
    }));
  }

  async orderCompletionTime() {
    const rows = await this.ordersRepo
      .createQueryBuilder('order')
      .select('order.id', 'id')
      .addSelect('order.createdAt', 'createdAt')
      .addSelect('order.updatedAt', 'updatedAt')
      .where(`order.status = 'delivered'`)
      .getRawMany<{ id: string; createdAt: Date; updatedAt: Date }>();

    const items = rows.map((r) => {
      const hours =
        (new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime()) /
        (1000 * 60 * 60);
      return {
        orderId: r.id,
        hoursToComplete: Number(hours.toFixed(2)),
      };
    });

    const avgHours =
      items.length > 0
        ? items.reduce((sum, i) => sum + i.hoursToComplete, 0) /
          items.length
        : 0;

    return { averageHours: Number(avgHours.toFixed(2)), items };
  }

  async exportCsv() {
    const orders = await this.ordersRepo.find({
      relations: ['customer', 'tailor', 'shop'],
      order: { createdAt: 'DESC' },
      take: 1000,
    });

    const header = [
      'orderId',
      'orderNumber',
      'customerName',
      'tailorName',
      'shopName',
      'status',
      'price',
      'createdAt',
      'deliveryDate',
    ];

    const rows = orders.map((o) => [
      o.id,
      o.orderNumber,
      o.customer?.name || '',
      o.tailor?.name || '',
      o.shop?.name || '',
      o.status,
      o.price.toString(),
      o.createdAt.toISOString(),
      o.deliveryDate ? o.deliveryDate.toISOString() : '',
    ]);

    const csv =
      header.join(',') +
      '\n' +
      rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

    return { csv };
  }
}

