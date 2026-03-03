"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const env = () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || 'changeme',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
});
exports.env = env;
//# sourceMappingURL=env.js.map