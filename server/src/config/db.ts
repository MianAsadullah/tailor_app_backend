import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: String(process.env.DB_HOST || 'localhost'),
  port: parseInt(String(process.env.DB_PORT || '5432'), 10),
  username: String(process.env.DB_USER || 'postgres'),
  password: String(process.env.DB_PASSWORD ?? ''),
  database: String(process.env.DB_NAME || 'postgres'),
  autoLoadEntities: true,
  synchronize: true,
});



