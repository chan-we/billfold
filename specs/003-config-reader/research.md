# Research: 配置文件读取优化

**Feature Branch**: `003-config-reader`
**Date**: 2026-01-06

## 1. NestJS 配置模块最佳实践

### Decision: 使用 @nestjs/config 的 registerAs 工厂函数

**Rationale**:
- 提供命名空间隔离，避免配置键冲突
- 支持类型安全的配置访问
- 便于按模块组织配置（database、redis、cloudflare、security）

**Alternatives considered**:
1. 直接使用 `process.env` - 无类型安全，难以维护
2. 自定义配置服务 - 增加复杂度，重复造轮子
3. 外部配置库 (dotenv-safe, convict) - 增加依赖，NestJS 已内置足够能力

### 实现模式

```typescript
// configuration.ts
import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  pass: process.env.REDIS_PASS,
}));
```

## 2. 配置验证策略

### Decision: 使用 class-validator + class-transformer 进行启动时验证

**Rationale**:
- 项目已安装这两个依赖
- NestJS ConfigModule 原生支持 validate 选项
- 可定义必填/可选字段，提供清晰的错误消息

**Alternatives considered**:
1. Joi schema - 需要额外依赖
2. 手动验证 - 代码冗余，易出错
3. Zod - 需要额外依赖，且与现有 class-validator 生态不统一

### 验证模式

```typescript
// config.validation.ts
import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, IsOptional, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASS: string;

  @IsOptional()
  @IsString()
  REDIS_HOST?: string;

  // ... 其他可选配置
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
```

## 3. 配置键名迁移策略

### Decision: 直接更新键名，同时更新 .env.example

**Rationale**:
- 项目尚在开发阶段，无生产环境兼容性要求
- 新键名（DB_USER, DB_PASS）更简洁
- 一次性迁移比维护双键名更简单

**Alternatives considered**:
1. 支持双键名回退 - 增加代码复杂度，长期维护负担
2. 渐进式迁移 - 过度工程化，当前规模不需要

### 迁移检查清单

- [x] 更新 `app.module.ts` 中的 TypeORM 配置
- [x] 更新 `database.config.ts` 中的键名
- [x] 更新 `.env.example` 模板
- [x] 更新 `.env` 实际文件（开发环境）

## 4. 可选配置降级策略

### Decision: 缺失时返回 undefined，由使用方检查

**Rationale**:
- 符合规范澄清：记录警告日志，功能返回空值/无操作
- 避免硬编码默认值带来的意外连接
- Redis/Cloudflare 模块尚未实现，配置读取先行

**Alternatives considered**:
1. 硬编码默认值 (localhost:6379) - 可能意外连接错误服务
2. 抛出异常 - 过于严格，阻止应用启动
3. 禁用相关功能模块 - 需要动态模块加载，增加复杂度

### 日志模式

```typescript
// main.ts 或 bootstrap 阶段
if (!configService.get('redis.host')) {
  logger.warn('Redis configuration not found, caching will be disabled');
}
if (!configService.get('cloudflare.accountId')) {
  logger.warn('Cloudflare KV configuration not found, edge storage will be disabled');
}
```

## 5. 环境变量优先级

### Decision: 环境变量 > .env 文件

**Rationale**:
- NestJS ConfigModule 默认行为
- 符合 12-Factor App 原则
- 便于容器化部署时覆盖配置

**Alternatives considered**:
无 - 这是标准做法

## 6. 通配符白名单解析

### Decision: 作为字符串存储，在使用时解析

**Rationale**:
- REDIRECT_WHITELIST 可能包含 `*.ushiwe.com` 格式
- 配置模块只负责读取，验证逻辑由使用方实现
- 保持配置读取的单一职责

**Alternatives considered**:
1. 在配置读取时预编译为正则 - 超出配置模块职责
2. 拆分为数组 - 需要额外解析逻辑，当前只有一个值

## 总结

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 配置组织 | registerAs 工厂函数 | 类型安全 + 命名空间隔离 |
| 验证方式 | class-validator | 已有依赖，原生支持 |
| 键名迁移 | 直接更新 | 开发阶段，无兼容负担 |
| 可选配置 | 返回 undefined + 警告日志 | 符合澄清，避免意外连接 |
| 优先级 | 环境变量 > .env | 标准做法 |
