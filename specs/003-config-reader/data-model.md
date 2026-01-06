# Data Model: 配置文件读取优化

**Feature Branch**: `003-config-reader`
**Date**: 2026-01-06

## 配置结构

本功能不涉及数据库实体变更，仅定义应用配置的 TypeScript 接口。

### 配置接口定义

```typescript
// 数据库配置 (必须)
interface DatabaseConfig {
  host: string;      // DB_HOST - 必须
  port: number;      // DB_PORT - 必须 (默认 3306)
  user: string;      // DB_USER - 必须
  pass: string;      // DB_PASS - 必须
}

// Redis 配置 (可选)
interface RedisConfig {
  host?: string;     // REDIS_HOST - 可选
  port?: number;     // REDIS_PORT - 可选 (默认 6379)
  pass?: string;     // REDIS_PASS - 可选
}

// Cloudflare KV 配置 (可选)
interface CloudflareConfig {
  accountId?: string;    // CF_ACCOUNT_ID - 可选
  namespaceId?: string;  // CF_NAMESPACE_ID - 可选
  apiToken?: string;     // CF_API_TOKEN - 可选
}

// 安全配置 (可选)
interface SecurityConfig {
  jwtSecret?: string;           // JWT_SECRET - 可选
  redirectWhitelist?: string;   // REDIRECT_WHITELIST - 可选 (支持通配符)
}

// 应用配置聚合
interface AppConfig {
  database: DatabaseConfig;
  redis: RedisConfig;
  cloudflare: CloudflareConfig;
  security: SecurityConfig;
}
```

## 配置命名空间

| 命名空间 | 环境变量 | 类型 | 必须 | 默认值 |
|----------|----------|------|------|--------|
| database.host | DB_HOST | string | ✅ | - |
| database.port | DB_PORT | number | ✅ | 3306 |
| database.user | DB_USER | string | ✅ | - |
| database.pass | DB_PASS | string | ✅ | - |
| redis.host | REDIS_HOST | string | ❌ | undefined |
| redis.port | REDIS_PORT | number | ❌ | 6379 |
| redis.pass | REDIS_PASS | string | ❌ | undefined |
| cloudflare.accountId | CF_ACCOUNT_ID | string | ❌ | undefined |
| cloudflare.namespaceId | CF_NAMESPACE_ID | string | ❌ | undefined |
| cloudflare.apiToken | CF_API_TOKEN | string | ❌ | undefined |
| security.jwtSecret | JWT_SECRET | string | ❌ | undefined |
| security.redirectWhitelist | REDIRECT_WHITELIST | string | ❌ | undefined |

## 验证规则

### 必须配置项

| 配置项 | 验证规则 | 失败行为 |
|--------|----------|----------|
| DB_HOST | 非空字符串 | 阻止启动，输出错误 |
| DB_PORT | 正整数 | 阻止启动，输出错误 |
| DB_USER | 非空字符串 | 阻止启动，输出错误 |
| DB_PASS | 非空字符串 | 阻止启动，输出错误 |

### 可选配置项

| 配置项 | 验证规则 | 缺失行为 |
|--------|----------|----------|
| REDIS_* | 字符串/数字 | 警告日志，功能禁用 |
| CF_* | 字符串 | 警告日志，功能禁用 |
| JWT_SECRET | 字符串 | 警告日志，功能禁用 |
| REDIRECT_WHITELIST | 字符串 | 警告日志，功能禁用 |

## 配置分组完整性

Cloudflare KV 配置需要三个值同时存在才能使用：

- 如果 `CF_ACCOUNT_ID` 存在但 `CF_NAMESPACE_ID` 或 `CF_API_TOKEN` 缺失，应记录警告
- 建议在配置访问层面添加完整性检查

```typescript
function isCloudflareConfigComplete(config: CloudflareConfig): boolean {
  return !!(config.accountId && config.namespaceId && config.apiToken);
}
```

## 迁移说明

### 键名变更

| 旧键名 | 新键名 | 影响文件 |
|--------|--------|----------|
| DB_USERNAME | DB_USER | app.module.ts, database.config.ts, .env |
| DB_PASSWORD | DB_PASS | app.module.ts, database.config.ts, .env |

### 向后兼容

本次迁移不提供向后兼容。开发者需要：
1. 更新 `.env` 文件中的键名
2. 如使用 CI/CD 环境变量，同步更新配置
