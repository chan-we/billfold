import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// This file is used for TypeORM CLI commands (migrations, etc.)
// For runtime configuration, use configuration.ts with ConfigModule

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'billfold_dev',
  password: process.env.DB_PASS || 'dev_password',
  database: process.env.DB_DATABASE || 'billfold',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: ['error', 'warn', 'query'],
  charset: 'utf8mb4_unicode_ci',
  connectTimeout: 10000,
  extra: {
    connectionLimit: 10,
  },
};
