"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/order.entity");
const payment_entity_1 = require("../payments/payment.entity");
const user_entity_1 = require("../users/user.entity");
const shop_entity_1 = require("../shops/shop.entity");
let AnalyticsService = class AnalyticsService {
    constructor(ordersRepo, paymentsRepo, usersRepo, shopsRepo) {
        this.ordersRepo = ordersRepo;
        this.paymentsRepo = paymentsRepo;
        this.usersRepo = usersRepo;
        this.shopsRepo = shopsRepo;
    }
    async dashboard() {
        const [orders, customers, tailors, revenueRaw] = await Promise.all([
            this.ordersRepo.count(),
            this.usersRepo.count({ where: { role: 'customer' } }),
            this.usersRepo.count({ where: { role: 'tailor' } }),
            this.paymentsRepo
                .createQueryBuilder('payment')
                .select('SUM(payment.amount)', 'revenue')
                .where('payment.status = :status', { status: 'paid' })
                .getRawOne(),
        ]);
        const revenue = (revenueRaw === null || revenueRaw === void 0 ? void 0 : revenueRaw.revenue) ? Number(revenueRaw.revenue) : 0;
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
            .getRawMany();
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
            .getRawMany();
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
            .getRawMany();
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
            .addSelect(`SUM(CASE WHEN order.status = 'delivered' THEN 1 ELSE 0 END)`, 'completed')
            .groupBy('tailor.id')
            .addGroupBy('tailor.name')
            .getRawMany();
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
            .getRawMany();
        const items = rows.map((r) => {
            const hours = (new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime()) /
                (1000 * 60 * 60);
            return {
                orderId: r.id,
                hoursToComplete: Number(hours.toFixed(2)),
            };
        });
        const avgHours = items.length > 0
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
        const rows = orders.map((o) => {
            var _a, _b, _c;
            return [
                o.id,
                o.orderNumber,
                ((_a = o.customer) === null || _a === void 0 ? void 0 : _a.name) || '',
                ((_b = o.tailor) === null || _b === void 0 ? void 0 : _b.name) || '',
                ((_c = o.shop) === null || _c === void 0 ? void 0 : _c.name) || '',
                o.status,
                o.price.toString(),
                o.createdAt.toISOString(),
                o.deliveryDate ? o.deliveryDate.toISOString() : '',
            ];
        });
        const csv = header.join(',') +
            '\n' +
            rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        return { csv };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(shop_entity_1.Shop)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map