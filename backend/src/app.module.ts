import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BillModule } from './modules/bill/bill.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MysqlConnectionOptions => {
        const host = configService.get<string>('DB_HOST', 'localhost');
        const port = configService.get<number>('DB_PORT', 3306);
        const username = configService.get<string>('DB_USERNAME', 'billfold_dev');
        const database = configService.get<string>('DB_DATABASE', 'billfold');
        const nodeEnv = configService.get<string>('NODE_ENV');

        console.log('========== Database Configuration ==========');
        console.log('DB_HOST:', host);
        console.log('DB_PORT:', port);
        console.log('DB_USERNAME:', username);
        console.log('DB_DATABASE:', database);
        console.log('NODE_ENV:', nodeEnv);
        console.log('============================================');

        return {
          type: 'mysql',
          host,
          port,
          username,
          password: configService.get<string>('DB_PASSWORD', 'dev_password'),
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
