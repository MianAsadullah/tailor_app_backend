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
exports.ShopsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shop_entity_1 = require("./shop.entity");
const user_entity_1 = require("../users/user.entity");
let ShopsService = class ShopsService {
    constructor(shopsRepo, usersRepo) {
        this.shopsRepo = shopsRepo;
        this.usersRepo = usersRepo;
    }
    async create(dto) {
        var _a, _b;
        const owner = await this.usersRepo.findOne({ where: { id: dto.ownerId } });
        if (!owner) {
            throw new common_1.NotFoundException('Owner user not found');
        }
        const shop = this.shopsRepo.create({
            name: dto.name,
            owner,
            address: dto.address,
            city: dto.city,
            logoUrl: (_a = dto.logoUrl) !== null && _a !== void 0 ? _a : null,
            isActive: (_b = dto.isActive) !== null && _b !== void 0 ? _b : true,
        });
        const saved = await this.shopsRepo.save(shop);
        return saved;
    }
    async findAll() {
        return this.shopsRepo.find({ relations: ['owner'] });
    }
    async findOne(id) {
        const shop = await this.shopsRepo.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        return shop;
    }
    async update(id, dto) {
        var _a, _b, _c, _d;
        const shop = await this.shopsRepo.findOne({ where: { id } });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        if (dto.ownerId) {
            const owner = await this.usersRepo.findOne({
                where: { id: dto.ownerId },
            });
            if (!owner) {
                throw new common_1.NotFoundException('Owner user not found');
            }
            shop.owner = owner;
        }
        Object.assign(shop, {
            name: (_a = dto.name) !== null && _a !== void 0 ? _a : shop.name,
            address: (_b = dto.address) !== null && _b !== void 0 ? _b : shop.address,
            city: (_c = dto.city) !== null && _c !== void 0 ? _c : shop.city,
            logoUrl: (_d = dto.logoUrl) !== null && _d !== void 0 ? _d : shop.logoUrl,
            isActive: typeof dto.isActive === 'boolean' ? dto.isActive : shop.isActive,
        });
        return this.shopsRepo.save(shop);
    }
    async remove(id) {
        const shop = await this.shopsRepo.findOne({ where: { id } });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        await this.shopsRepo.remove(shop);
        return { success: true };
    }
};
exports.ShopsService = ShopsService;
exports.ShopsService = ShopsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shop_entity_1.Shop)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ShopsService);
//# sourceMappingURL=shops.service.js.map