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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMiddleware = void 0;
const common_1 = require("@nestjs/common");
let RoleMiddleware = class RoleMiddleware {
    constructor(roles = []) {
        this.roles = roles;
    }
    use(req, _res, next) {
        if (!req.user) {
            throw new common_1.ForbiddenException('No user in request');
        }
        if (this.roles.length > 0 && !this.roles.includes(req.user.role)) {
            throw new common_1.ForbiddenException('Insufficient role');
        }
        next();
    }
};
exports.RoleMiddleware = RoleMiddleware;
exports.RoleMiddleware = RoleMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array])
], RoleMiddleware);
//# sourceMappingURL=role.middleware.js.map