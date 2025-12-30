import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// 打印数据库连接配置（用于调试）
console.log('========== Database Configuration ==========');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_PORT:', process.env.DB_PORT || '3306');
console.log('DB_USERNAME:', process.env.DB_USERNAME || 'billfold_dev');
console.log('DB_DATABASE:', process.env.DB_DATABASE || 'billfold');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('============================================');

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'billfold_dev',
  password: process.env.DB_PASSWORD || 'dev_password',
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
