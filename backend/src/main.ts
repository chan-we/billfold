import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validationPipeConfig } from './common/pipes/validation.pipe';
import { isCloudflareConfigComplete } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Log configuration status
  logConfigurationStatus(configService, logger);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes, filters, interceptors
  app.useGlobalPipes(validationPipeConfig);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Billfold API')
    .setDescription('账单管理 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

function logConfigurationStatus(
  configService: ConfigService,
  logger: Logger,
): void {
  // Database configuration (required)
  const dbHost = configService.get<string>('database.host');
  const dbPort = configService.get<number>('database.port');
  logger.log(`Database configuration loaded: ${dbHost}:${dbPort}`);

  // Redis configuration (optional)
  const redisHost = configService.get<string>('redis.host');
  if (redisHost) {
    const redisPort = configService.get<number>('redis.port') || 6379;
    logger.log(`Redis configuration loaded: ${redisHost}:${redisPort}`);
  } else {
    logger.warn(
      'Redis configuration not found, caching features will be disabled',
    );
  }

  // Cloudflare KV configuration (optional)
  const cloudflareConfig = {
    accountId: configService.get<string>('cloudflare.accountId'),
    namespaceId: configService.get<string>('cloudflare.namespaceId'),
    apiToken: configService.get<string>('cloudflare.apiToken'),
  };

  if (isCloudflareConfigComplete(cloudflareConfig)) {
    logger.log('Cloudflare KV configuration loaded');
  } else if (
    cloudflareConfig.accountId ||
    cloudflareConfig.namespaceId ||
    cloudflareConfig.apiToken
  ) {
    logger.warn(
      'Cloudflare KV configuration incomplete (requires CF_ACCOUNT_ID, CF_NAMESPACE_ID, and CF_API_TOKEN)',
    );
  } else {
    logger.warn(
      'Cloudflare KV configuration not found, edge storage will be disabled',
    );
  }

  // Security configuration (optional)
  const jwtSecret = configService.get<string>('security.jwtSecret');
  const redirectWhitelist = configService.get<string>(
    'security.redirectWhitelist',
  );

  if (jwtSecret) {
    logger.log('JWT secret configured');
  } else {
    logger.warn('JWT_SECRET not configured, JWT features will be disabled');
  }

  if (redirectWhitelist) {
    logger.log(`Redirect whitelist configured: ${redirectWhitelist}`);
  } else {
    logger.warn(
      'REDIRECT_WHITELIST not configured, redirect validation will be disabled',
    );
  }
}

bootstrap();
