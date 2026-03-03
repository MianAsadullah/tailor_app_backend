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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const user_entity_1 = require("../users/user.entity");
const shop_entity_1 = require("../shops/shop.entity");
const measurement_entity_1 = require("../measurements/measurement.entity");
let OrdersService = class OrdersService {
    constructor(ordersRepo, usersRepo, shopsRepo, measurementsRepo) {
        this.ordersRepo = ordersRepo;
        this.usersRepo = usersRepo;
        this.shopsRepo = shopsRepo;
        this.measurementsRepo = measurementsRepo;
    }
    async create(dto) {
        var _a, _b, _c, _d;
        const customer = await this.usersRepo.findOne({ where: { id: dto.customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        const tailor = await this.usersRepo.findOne({ where: { id: dto.tailorId } });
        if (!tailor)
            throw new common_1.NotFoundException('Tailor not found');
        const shop = await this.shopsRepo.findOne({ where: { id: dto.shopId } });
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const measurement = await this.measurementsRepo.findOne({ where: { id: dto.measurementId } });
        if (!measurement)
            throw new common_1.NotFoundException('Measurement not found');
        const order = this.ordersRepo.create({
            orderNumber: dto.orderNumber,
            customer,
            tailor,
            shop,
            measurement,
            dressType: dto.dressType,
            fabricImageUrl: (_a = dto.fabricImageUrl) !== null && _a !== void 0 ? _a : null,
            designNotes: (_b = dto.designNotes) !== null && _b !== void 0 ? _b : null,
            status: (_c = dto.status) !== null && _c !== void 0 ? _c : 'pending',
            price: dto.price,
            deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
            isPaid: (_d = dto.isPaid) !== null && _d !== void 0 ? _d : false,
        });
        return this.ordersRepo.save(order);
    }
    async findAll() {
        return this.ordersRepo.find({
            relations: ['customer', 'tailor', 'shop', 'measurement'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.ordersRepo.findOne({
            where: { id },
            relations: ['customer', 'tailor', 'shop', 'measurement'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async update(id, dto) {
        var _a, _b, _c, _d, _e, _f;
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (dto.customerId) {
            const customer = await this.usersRepo.findOne({ where: { id: dto.customerId } });
            if (!customer)
                throw new common_1.NotFoundException('Customer not found');
            order.customer = customer;
        }
        if (dto.tailorId) {
            const tailor = await this.usersRepo.findOne({ where: { id: dto.tailorId } });
            if (!tailor)
                throw new common_1.NotFoundException('Tailor not found');
            order.tailor = tailor;
        }
        if (dto.shopId) {
            const shop = await this.shopsRepo.findOne({ where: { id: dto.shopId } });
            if (!shop)
                throw new common_1.NotFoundException('Shop not found');
            order.shop = shop;
        }
        if (dto.measurementId) {
            const measurement = await this.measurementsRepo.findOne({ where: { id: dto.measurementId } });
            if (!measurement)
                throw new common_1.NotFoundException('Measurement not found');
            order.measurement = measurement;
        }
        Object.assign(order, {
            orderNumber: (_a = dto.orderNumber) !== null && _a !== void 0 ? _a : order.orderNumber,
            dressType: (_b = dto.dressType) !== null && _b !== void 0 ? _b : order.dressType,
            fabricImageUrl: (_c = dto.fabricImageUrl) !== null && _c !== void 0 ? _c : order.fabricImageUrl,
            designNotes: (_d = dto.designNotes) !== null && _d !== void 0 ? _d : order.designNotes,
            status: (_e = dto.status) !== null && _e !== void 0 ? _e : order.status,
            price: (_f = dto.price) !== null && _f !== void 0 ? _f : order.price,
            deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : order.deliveryDate,
            isPaid: typeof dto.isPaid === 'boolean' ? dto.isPaid : order.isPaid,
        });
        return this.ordersRepo.save(order);
    }
    async updateStatus(id, dto) {
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.status = dto.status;
        return this.ordersRepo.save(order);
    }
    async assignTailor(id, tailorId) {
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const tailor = await this.usersRepo.findOne({ where: { id: tailorId } });
        if (!tailor)
            throw new common_1.NotFoundException('Tailor not found');
        order.tailor = tailor;
        return this.ordersRepo.save(order);
    }
    async changeDeliveryDate(id, deliveryDate) {
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
        return this.ordersRepo.save(order);
    }
    async timeline(id) {
        const order = await this.ordersRepo.findOne({
            where: { id },
            relations: ['customer', 'tailor', 'shop', 'measurement'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return {
            id: order.id,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            deliveryDate: order.deliveryDate,
        };
    }
    async findByCustomer(customerId) {
        return this.ordersRepo.find({
            where: { customer: { id: customerId } },
            relations: ['customer', 'tailor', 'shop', 'measurement'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByTailor(tailorId) {
        return this.ordersRepo.find({
            where: { tailor: { id: tailorId } },
            relations: ['customer', 'tailor', 'shop', 'measurement'],
            order: { createdAt: 'DESC' },
        });
    }
    async bulkUpdateStatus(orderIds, status) {
        const orders = await this.ordersRepo.findByIds(orderIds);
        orders.forEach((o) => {
            o.status = status;
        });
        await this.ordersRepo.save(orders);
        return { success: true, count: orders.length };
    }
    async bulkAssign(orderIds, tailorId) {
        const tailor = await this.usersRepo.findOne({ where: { id: tailorId } });
        if (!tailor) {
            throw new common_1.NotFoundException('Tailor not found');
        }
        const orders = await this.ordersRepo.findByIds(orderIds);
        orders.forEach((o) => {
            o.tailor = tailor;
        });
        await this.ordersRepo.save(orders);
        return { success: true, count: orders.length };
    }
    async remove(id) {
        const result = await this.ordersRepo.softDelete({ id });
        if (!result.affected)
            throw new common_1.NotFoundException('Order not found');
        return { success: true };
    }
    async repeatOrder(id) {
        const existing = await this.ordersRepo.findOne({
            where: { id },
            relations: ['customer', 'tailor', 'shop', 'measurement'],
        });
        if (!existing)
            throw new common_1.NotFoundException('Order not found');
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
    async cancel(id) {
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.status = 'cancelled';
        return this.ordersRepo.save(order);
    }
    async estimatePrice(input) {
        const base = input.dressType.toLowerCase() === 'suit'
            ? 3000
            : input.dressType.toLowerCase() === 'shalwar kameez'
                ? 2000
                : 2500;
        const multiplier = input.complexity === 'high'
            ? 1.4
            : input.complexity === 'low'
                ? 1.0
                : 1.2;
        const price = Math.round(base * multiplier);
        return { estimatedPrice: price };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(shop_entity_1.Shop)),
    __param(3, (0, typeorm_1.InjectRepository)(measurement_entity_1.Measurement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map