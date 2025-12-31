# Data Model: 用户登录态检查

**Feature**: 002-login-guard
**Date**: 2025-12-31
**Updated**: 2025-12-31 (Fence 网关集成)
**Spec**: [spec.md](./spec.md)

## Overview

本功能与 Fence API 网关集成，不需要新建数据库实体。认证由网关统一处理，后端服务只需从 `CH-USER` Header 获取用户 ID。

## Entities

### 1. Login Credential (外部实体 - Fence 网关管理)

登录凭证存储在 Cookie 中，由统一登录系统设置，Fence 网关验证。

| Attribute | Type | Description |
|-----------|------|-------------|
| CowboyHat | JWT string | 认证令牌，存储在 Cookie 中 |
| sub | string | JWT payload 中的用户 ID |
| exp | timestamp | JWT 过期时间 |

**存储位置**: 浏览器 Cookie (HttpOnly, Secure, SameSite=Lax)

**Cookie 名称**: `CowboyHat`

**JWT 规范**:
- 算法: HS256
- 签名密钥: `cowboy_hat`
- 用户 ID 字段: `sub`

### 2. Auth Config (应用配置)

前端认证相关配置（后端无需配置，依赖 Fence 网关）。

#### Frontend Config

```typescript
// frontend/src/config/auth.config.ts
export const AuthConfig = {
  loginUrl: 'https://login.example.com/login',  // 统一登录页 URL
  redirectParamName: 'redirect',                 // 重定向参数名
};
```

#### Backend Config (可选)

```typescript
// backend/src/common/decorators/user.decorator.ts
// 只需创建 Decorator 从 CH-USER Header 获取用户 ID
// 无需 Auth 相关配置
```

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    统一登录系统                               │
│  ┌─────────────────┐                                        │
│  │   User Account  │ ──设置──> Cookie (CowboyHat)           │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Cookie 随请求发送
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (反向代理)                          │
│                          │                                   │
│                          │ Forward Auth                      │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Fence 网关                         │    │
│  │  ┌───────────┐    验证 JWT     ┌───────────┐        │    │
│  │  │ /verify   │ ─────────────> │ 200 + CH-USER │     │    │
│  │  └───────────┘     (有效)      └───────────┘        │    │
│  │                       │                              │    │
│  │                       │ (无效)                       │    │
│  │                       ▼                              │    │
│  │                 ┌───────────┐                        │    │
│  │                 │    401    │ (不转发到后端)         │    │
│  │                 └───────────┘                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 认证通过，携带 CH-USER Header
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Billfold Backend                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  @CurrentUser() decorator                              │  │
│  │  从 request.headers['ch-user'] 获取用户 ID            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. 未登录用户访问流程

```
用户 → Nginx → Fence 网关
                    │
                    ├─ 检查 Cookie CowboyHat
                    │
                    └─ Cookie 不存在或无效
                          │
                          ▼
                    返回 401 Unauthorized
                    (请求不到达后端)
                          │
                          ▼
              Axios Interceptor 捕获 401
                          │
                          ▼
                   重定向到登录页
                   (携带 redirect 参数)
```

### 2. 已登录用户访问流程

```
用户 → Nginx → Fence 网关
                    │
                    ├─ 检查 Cookie CowboyHat
                    │
                    └─ JWT 验证成功
                          │
                          ▼
                    返回 200 OK
                    设置 CH-USER Header
                          │
                          ▼
                    Nginx 转发请求到后端
                    (携带 CH-USER Header)
                          │
                          ▼
                    后端从 CH-USER 获取用户 ID
                    处理业务逻辑
```

### 3. Token 过期流程

```
用户 → Nginx → Fence 网关
                    │
                    ├─ 检查 Cookie CowboyHat
                    │
                    └─ JWT 已过期
                          │
                          ▼
                    返回 401 Unauthorized
                          │
                          ▼
              Axios Interceptor 捕获 401
                          │
                          ▼
                   重定向到登录页
```

## No Database Changes Required

本功能不需要数据库 migration，原因：

1. 用户身份信息存储在统一登录系统
2. JWT Token 由 Fence 网关验证，无需本地存储
3. 用户 ID 通过 `CH-USER` Header 透传，无需持久化
4. 不涉及新的业务实体创建

## Key Differences from Original Design

| 原设计 | 更新后 (Fence 集成) |
|--------|---------------------|
| Cookie 名称 `auth_token` | Cookie 名称 `CowboyHat` |
| 后端实现 AuthGuard 验证 JWT | 后端不验证，从 CH-USER 获取用户 ID |
| 后端返回 401 | Fence 网关返回 401 |
| 需要 JWT 验证库 | 不需要 |
