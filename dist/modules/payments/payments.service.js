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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const order_entity_1 = require("../orders/order.entity");
const user_entity_1 = require("../users/user.entity");
let PaymentsService = class PaymentsService {
    constructor(paymentsRepo, ordersRepo, usersRepo) {
        this.paymentsRepo = paymentsRepo;
        this.ordersRepo = ordersRepo;
        this.usersRepo = usersRepo;
    }
    async create(dto) {
        var _a;
        const order = await this.ordersRepo.findOne({ where: { id: dto.orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const customer = await this.usersRepo.findOne({
            where: { id: dto.customerId },
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        const payment = this.paymentsRepo.create({
            order,
            customer,
            amount: dto.amount,
            method: dto.method,
            status: 'pending',
            transactionId: (_a = dto.transactionId) !== null && _a !== void 0 ? _a : null,
        });
        return this.paymentsRepo.save(payment);
    }
    async createIntent(orderId, amount, method) {
        const order = await this.ordersRepo.findOne({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const clientSecret = `mock_client_secret_${Date.now()}`;
        return { clientSecret, amount, method, orderId };
    }
    async confirm(transactionId) {
        const payment = await this.paymentsRepo.findOne({
            where: { transactionId },
            relations: ['order'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        payment.status = 'paid';
        await this.paymentsRepo.save(payment);
        payment.order.isPaid = true;
        await this.ordersRepo.save(payment.order);
        return { success: true };
    }
    async findByOrder(orderId) {
        const order = await this.ordersRepo.findOne({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.paymentsRepo.find({
            where: { order: { id: orderId } },
            relations: ['order', 'customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async handleWebhook(dto) {
        const payload = dto.payload;
        const transactionId = payload.transactionId || payload.id;
        const status = payload.status || 'pending';
        if (!transactionId) {
            return { received: true, handled: false };
        }
        const payment = await this.paymentsRepo.findOne({
            where: { transactionId },
            relations: ['order'],
        });
        if (!payment) {
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
    async analytics() {
        const total = await this.paymentsRepo.count();
        const paid = await this.paymentsRepo.count({ where: { status: 'paid' } });
        const refunded = await this.paymentsRepo.count({
            where: { status: 'failed' },
        });
        const revenueRaw = await this.paymentsRepo
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'revenue')
            .where('payment.status = :status', { status: 'paid' })
            .getRawOne();
        const revenue = (revenueRaw === null || revenueRaw === void 0 ? void 0 : revenueRaw.revenue) ? Number(revenueRaw.revenue) : 0;
        return { total, paid, refunded, revenue };
    }
    async refund(transactionId) {
        const payment = await this.paymentsRepo.findOne({
            where: { transactionId },
            relations: ['order'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        payment.status = 'failed';
        await this.paymentsRepo.save(payment);
        payment.order.isPaid = false;
        await this.ordersRepo.save(payment.order);
        return { success: true };
    }
    async earningsForTailor(tailorId) {
        const raw = await this.ordersRepo
            .createQueryBuilder('order')
            .select('SUM(order.price)', 'earnings')
            .where('order.tailorId = :tailorId', { tailorId })
            .andWhere('order.isPaid = true')
            .getRawOne();
        const earnings = (raw === null || raw === void 0 ? void 0 : raw.earnings) ? Number(raw.earnings) : 0;
        return { tailorId, earnings };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map