import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function parseDatabaseUrl(urlString: string): Partial<TypeOrmModuleOptions> {
  const url = new URL(urlString);

  if (!url.hostname || !url.pathname) {
    throw new Error('Invalid DATABASE_URL: missing host or database name');
  }

  return {
    host: url.hostname,
    port: Number(url.port || 5432),
    username: url.username || undefined,
    password: url.password || undefined,
    database: url.pathname.replace(/^\//, ''),
    ssl: url.searchParams.has('sslmode')
      ? { rejectUnauthorized: url.searchParams.get('sslmode') !== 'disable' }
      : undefined,
  };
}

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  const commonOptions: Partial<TypeOrmModuleOptions> = {
    autoLoadEntities: true,
    // Enable synchronize only in non-production environments to avoid
    // accidental schema changes on production databases that can
    // cause runtime failures during serverless cold starts.
    synchronize: process.env.NODE_ENV !== 'production',
  };

  if (process.env.DATABASE_URL) {
    return {
      ...commonOptions,
      type: 'postgres',
      ...parseDatabaseUrl(process.env.DATABASE_URL),
    } as TypeOrmModuleOptions;
  }

  if (process.env.DB_HOST || process.env.DB_PORT || process.env.DB_USER || process.env.DB_PASSWORD || process.env.DB_NAME) {
    return {
      ...commonOptions,
      type: 'postgres',
      host: String(process.env.DB_HOST || 'localhost'),
      port: parseInt(String(process.env.DB_PORT || '5432'), 10),
      username: String(process.env.DB_USER || 'postgres'),
      password: String(process.env.DB_PASSWORD ?? ''),
      database: String(process.env.DB_NAME || 'postgres'),
    } as TypeOrmModuleOptions;
  }

  return {
    ...commonOptions,
    type: 'sqlite',
    database: ':memory:',
  } as TypeOrmModuleOptions;
};



