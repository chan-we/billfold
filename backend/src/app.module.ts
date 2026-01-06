import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BillModule } from './modules/bill/bill.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import {
  databaseConfig,
  redisConfig,
  cloudflareConfig,
  securityConfig,
} from './config/configuration';
import { validate } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, redisConfig, cloudflareConfig, securityConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MysqlConnectionOptions => {
        const host = configService.get<string>('database.host', 'localhost');
        const port = configService.get<number>('database.port', 3306);
        const username = configService.get<string>(
          'database.user',
          'billfold_dev',
        );
        const password = configService.get<string>(
          'database.pass',
          'dev_password',
        );
        const database = configService.get<string>(
          'database.database',
          'billfold',
        );
        const nodeEnv = configService.get<string>('NODE_ENV');

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize: nodeEnv === 'development',
          logging: ['error', 'warn', 'query'],
          charset: 'utf8mb4_unicode_ci',
          connectTimeout: 10000,
        };
      },
      inject: [ConfigService],
    }),
    BillModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
