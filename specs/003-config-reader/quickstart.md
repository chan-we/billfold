# Quickstart: 配置文件读取优化

**Feature Branch**: `003-config-reader`
**Date**: 2026-01-06

## 概述

本功能扩展 billfold 后端的配置系统，支持新的配置项并统一配置读取方式。

## 快速开始

### 1. 更新 .env 文件

复制以下模板到 `backend/.env`：

```env
# 数据库配置 (必须)
DB_HOST=192.168.54.63
DB_PORT=3306
DB_USER=chan_we
DB_PASS=canwe233

# Redis 配置 (可选)
REDIS_HOST=192.168.54.63
REDIS_PORT=6379
REDIS_PASS=canwe233

# Cloudflare KV 配置 (可选)
CF_ACCOUNT_ID=9ab271d366d1eb88addf3e54fcbfcabe
CF_NAMESPACE_ID=f1745b0e041142d49a0314d6f3c0dc99
CF_API_TOKEN=z-Haa-Q1KENQ1wYZ1-Z1unXZwXN2WrPf3ulbSWLf

# 安全配置 (可选)
JWT_SECRET=cowboy_hat
REDIRECT_WHITELIST=*.ushiwe.com
```

### 2. 启动应用

```bash
cd backend
npm run start:dev
```

### 3. 验证配置加载

启动时应看到配置加载日志：

```
[ConfigModule] Database configuration loaded: 192.168.54.63:3306
[ConfigModule] Redis configuration loaded: 192.168.54.63:6379
[ConfigModule] Cloudflare KV configuration loaded
[ConfigModule] Security configuration loaded
```

若可选配置缺失，将看到警告：

```
[ConfigModule] WARN: Redis configuration not found, caching will be disabled
[ConfigModule] WARN: Cloudflare KV configuration not found, edge storage will be disabled
```

## 在代码中使用配置

### 注入 ConfigService

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    // 访问数据库配置
    const dbHost = this.configService.get<string>('database.host');

    // 访问可选的 Redis 配置
    const redisHost = this.configService.get<string>('redis.host');
    if (!redisHost) {
      // 处理 Redis 不可用的情况
    }

    // 访问 Cloudflare 配置
    const cfAccountId = this.configService.get<string>('cloudflare.accountId');
  }
}
```

### 类型安全访问

```typescript
// 使用泛型获取完整配置对象
const databaseConfig = this.configService.get('database');
// databaseConfig: { host: string, port: number, user: string, pass: string }

const redisConfig = this.configService.get('redis');
// redisConfig: { host?: string, port?: number, pass?: string }
```

## 配置项参考

| 环境变量 | 命名空间路径 | 必须 | 说明 |
|----------|--------------|------|------|
| DB_HOST | database.host | ✅ | MySQL 主机地址 |
| DB_PORT | database.port | ✅ | MySQL 端口 |
| DB_USER | database.user | ✅ | MySQL 用户名 |
| DB_PASS | database.pass | ✅ | MySQL 密码 |
| REDIS_HOST | redis.host | ❌ | Redis 主机地址 |
| REDIS_PORT | redis.port | ❌ | Redis 端口 |
| REDIS_PASS | redis.pass | ❌ | Redis 密码 |
| CF_ACCOUNT_ID | cloudflare.accountId | ❌ | Cloudflare 账户 ID |
| CF_NAMESPACE_ID | cloudflare.namespaceId | ❌ | Cloudflare KV 命名空间 ID |
| CF_API_TOKEN | cloudflare.apiToken | ❌ | Cloudflare API Token |
| JWT_SECRET | security.jwtSecret | ❌ | JWT 签名密钥 |
| REDIRECT_WHITELIST | security.redirectWhitelist | ❌ | 重定向白名单 (支持通配符) |

## 迁移注意事项

如果从旧版本迁移，需要更新以下键名：

- `DB_USERNAME` → `DB_USER`
- `DB_PASSWORD` → `DB_PASS`

## 故障排除

### 应用启动失败

检查必须配置项是否完整：

```bash
grep -E "^DB_(HOST|PORT|USER|PASS)=" backend/.env
```

### 配置值包含特殊字符

如果密码包含 `=` 或 `#`，使用引号包裹：

```env
DB_PASS="my#complex=password"
```

### 环境变量覆盖

环境变量优先于 `.env` 文件。在容器中运行时：

```bash
docker run -e DB_HOST=prod-db.example.com ...
```
