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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/user.entity");
const jwt_1 = require("../../utils/jwt");
let AuthService = class AuthService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    async register(dto) {
        var _a, _b;
        const existing = await this.usersRepo.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.usersRepo.create({
            name: dto.name,
            email: dto.email,
            phone: (_a = dto.phone) !== null && _a !== void 0 ? _a : null,
            passwordHash,
            role: (_b = dto.role) !== null && _b !== void 0 ? _b : 'customer',
            isActive: true,
        });
        const saved = await this.usersRepo.save(user);
        const token = (0, jwt_1.signToken)({ sub: saved.id, role: saved.role });
        return {
            token,
            user: this.toSafeUser(saved),
        };
    }
    async login(dto) {
        if (!dto.email && !dto.phone) {
            throw new common_1.BadRequestException('Email or phone is required');
        }
        if (!dto.password) {
            throw new common_1.BadRequestException('Password is required');
        }
        const user = await this.usersRepo.findOne({
            where: dto.email
                ? { email: dto.email, isActive: true }
                : { phone: dto.phone, isActive: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = (0, jwt_1.signToken)({ sub: user.id, role: user.role });
        return {
            token,
            user: this.toSafeUser(user),
        };
    }
    async getMe(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toSafeUser(user);
    }
    async logout() {
        return { success: true };
    }
    toSafeUser(user) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map