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
exports.MeasurementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const measurement_entity_1 = require("./measurement.entity");
const user_entity_1 = require("../users/user.entity");
let MeasurementsService = class MeasurementsService {
    constructor(measurementsRepo, usersRepo) {
        this.measurementsRepo = measurementsRepo;
        this.usersRepo = usersRepo;
    }
    getTemplates() {
        return [
            {
                key: 'shalwar_kameez',
                title: 'Shalwar Kameez',
                fields: [
                    'chest',
                    'waist',
                    'hip',
                    'shoulder',
                    'armLength',
                    'shirtLength',
                    'trouserLength',
                ],
            },
            {
                key: 'suit',
                title: 'Suit',
                fields: [
                    'chest',
                    'waist',
                    'hip',
                    'shoulder',
                    'armLength',
                    'shirtLength',
                    'trouserLength',
                ],
            },
        ];
    }
    async duplicate(id) {
        const existing = await this.measurementsRepo.findOne({
            where: { id },
            relations: ['customer'],
        });
        if (!existing) {
            throw new common_1.NotFoundException('Measurement not found');
        }
        const copy = this.measurementsRepo.create({
            customer: existing.customer,
            title: `${existing.title} (copy)`,
            gender: existing.gender,
            measurements: { ...existing.measurements },
        });
        return this.measurementsRepo.save(copy);
    }
    async findByCustomer(customerId) {
        const customer = await this.usersRepo.findOne({ where: { id: customerId } });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return this.measurementsRepo.find({
            where: { customer: { id: customerId } },
            relations: ['customer'],
        });
    }
    async create(dto) {
        var _a;
        const customer = await this.usersRepo.findOne({
            where: { id: dto.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const measurement = this.measurementsRepo.create({
            customer,
            title: dto.title,
            gender: dto.gender,
            measurements: (_a = dto.measurements) !== null && _a !== void 0 ? _a : {},
        });
        return this.measurementsRepo.save(measurement);
    }
    async findAll() {
        return this.measurementsRepo.find({ relations: ['customer'] });
    }
    async findOne(id) {
        const measurement = await this.measurementsRepo.findOne({
            where: { id },
            relations: ['customer'],
        });
        if (!measurement) {
            throw new common_1.NotFoundException('Measurement not found');
        }
        return measurement;
    }
    async update(id, dto) {
        var _a, _b, _c;
        const measurement = await this.measurementsRepo.findOne({ where: { id } });
        if (!measurement) {
            throw new common_1.NotFoundException('Measurement not found');
        }
        if (dto.customerId) {
            const customer = await this.usersRepo.findOne({
                where: { id: dto.customerId },
            });
            if (!customer) {
                throw new common_1.NotFoundException('Customer not found');
            }
            measurement.customer = customer;
        }
        Object.assign(measurement, {
            title: (_a = dto.title) !== null && _a !== void 0 ? _a : measurement.title,
            gender: (_b = dto.gender) !== null && _b !== void 0 ? _b : measurement.gender,
            measurements: (_c = dto.measurements) !== null && _c !== void 0 ? _c : measurement.measurements,
        });
        return this.measurementsRepo.save(measurement);
    }
    async remove(id) {
        const result = await this.measurementsRepo.softDelete({ id });
        if (!result.affected) {
            throw new common_1.NotFoundException('Measurement not found');
        }
        return { success: true };
    }
    async createFromTemplate(dto) {
        const customer = await this.usersRepo.findOne({
            where: { id: dto.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const templates = this.getTemplates();
        const template = templates.find((t) => t.key === dto.templateKey);
        if (!template) {
            throw new common_1.BadRequestException('Invalid template key');
        }
        const measurements = {};
        template.fields.forEach((field) => {
            measurements[field] = 0;
        });
        const entity = this.measurementsRepo.create({
            customer,
            title: dto.title,
            gender: dto.gender,
            measurements,
        });
        return this.measurementsRepo.save(entity);
    }
};
exports.MeasurementsService = MeasurementsService;
exports.MeasurementsService = MeasurementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(measurement_entity_1.Measurement)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MeasurementsService);
//# sourceMappingURL=measurements.service.js.map