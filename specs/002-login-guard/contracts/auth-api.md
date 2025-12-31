# API Contracts: 用户登录态检查

**Feature**: 002-login-guard
**Date**: 2025-12-31
**Updated**: 2025-12-31 (Fence 网关集成)

## Overview

本功能与 Fence API 网关集成，认证由网关统一处理。后端服务不需要自行验证 JWT，只需从 `CH-USER` Header 获取用户 ID。

## Authentication Architecture

```
┌──────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───▶│  Nginx  │───▶│  Fence   │───▶│  Redis   │
│          │    │         │    │ (验证)    │    │ (白名单)  │
└──────────┘    └────┬────┘    └────┬─────┘    └──────────┘
                     │              │
                     │  ✓ 200 OK    │
                     │  + CH-USER   │
                     ▼              │
               ┌──────────┐        │
               │ Backend  │◀───────┘
               │ Service  │
               └──────────┘
```

## Token Specification

### Cookie-Based Authentication (推荐，Web 端)

**Cookie 名称**: `CowboyHat`

**Cookie 规范**:
```
Cookie: CowboyHat=<jwt_token>
```

**Cookie 属性** (由统一登录系统设置):
- `HttpOnly`: true
- `Secure`: true (生产环境)
- `SameSite`: Lax
- `Path`: /

### Header-Based Authentication (移动端/API)

```
Authorization: Bearer <jwt_token>
```

### JWT Claims

```json
{
  "sub": "user_id",
  "exp": 1735689600
}
```

| Claim | Description |
|-------|-------------|
| `sub` | 用户 ID，透传到后端的 `CH-USER` Header |
| `exp` | Token 过期时间 (Unix timestamp) |

## Fence Gateway Behavior

### 认证成功

**Fence 响应**: `200 OK`

**透传 Header**:
| Header | Description |
|--------|-------------|
| `CH-USER` | 用户 ID (来自 JWT `sub` claim) |

**后端接收**:
```typescript
// 从 Request Header 获取用户 ID
const userId = request.headers['ch-user'];
```

### 认证失败

**Fence 响应**: `401 Unauthorized`

**Response**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**触发条件**:
- 请求未携带 `CowboyHat` Cookie 或 `Authorization` Header
- Token 已过期
- Token 签名无效
- Token 格式错误

**注意**: 未认证请求不会到达后端服务，由 Fence 网关直接返回 401。

## Backend API Contract

### User ID Retrieval

后端无需实现 AuthGuard，只需从 Header 读取用户 ID。

**NestJS Decorator Pattern**:
```typescript
// backend/src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['ch-user'];
  },
);
```

**使用示例**:
```typescript
@Get('bills')
findAll(@CurrentUser() userId: string) {
  return this.billService.findAllByUser(userId);
}
```

### User ID Rules

| Scenario | `CH-USER` Header | Meaning |
|----------|------------------|---------|
| 已认证请求 | 存在且非空 | 已登录用户，值为用户 ID |
| 白名单路径 | 不存在 | 公开接口，无需登录 |

## Frontend Redirect Contract

### Redirect to Login

当 API 返回 401 时，前端重定向到统一登录页。

**URL 格式**:
```
{LOGIN_URL}?redirect={encodeURIComponent(currentPath)}
```

**示例**:
```
https://login.example.com/login?redirect=%2Fbills%2F123
```

**参数说明**:
| Parameter | Description |
|-----------|-------------|
| redirect | 用户原始请求的完整路径（包含 query string）|

### Axios Interceptor Implementation

```typescript
import axios from 'axios';
import { AuthConfig } from '@/config/auth.config';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${AuthConfig.loginUrl}?redirect=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }
    return Promise.reject(error);
  }
);
```

## White List Configuration

通过 Fence 网关的 Redis 白名单管理公开路径。

**Redis Key**: `fence:whitelist`
**格式**: `METHOD:PATH`

**添加白名单**:
```bash
LPUSH fence:whitelist "GET:/api/health"
```

**当前配置**: 无白名单（所有路径需认证）

## Integration Checklist

| 集成点 | 状态 | 备注 |
|--------|------|------|
| Cookie 名称 | ✅ 已确定 | `CowboyHat` |
| JWT 算法 | ✅ 已确定 | HS256 |
| 用户 ID 透传 | ✅ 已确定 | `CH-USER` Header |
| 统一登录页 URL | 待配置 | 需在 auth.config.ts 中配置 |
| Token 刷新机制 | 暂不实现 | 如需要可在后续版本添加 |
