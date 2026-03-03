"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeOrmConfig = void 0;
const getTypeOrmConfig = () => {
    var _a;
    return ({
        type: 'postgres',
        host: String(process.env.DB_HOST || 'localhost'),
        port: parseInt(String(process.env.DB_PORT || '5432'), 10),
        username: String(process.env.DB_USER || 'postgres'),
        password: String((_a = process.env.DB_PASSWORD) !== null && _a !== void 0 ? _a : ''),
        database: String(process.env.DB_NAME || 'postgres'),
        autoLoadEntities: true,
        synchronize: true,
    });
};
exports.getTypeOrmConfig = getTypeOrmConfig;
//# sourceMappingURL=db.js.map