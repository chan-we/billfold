# Research: 用户登录态检查

**Feature**: 002-login-guard
**Date**: 2025-12-31
**Updated**: 2025-12-31 (Fence 网关集成)

## Research Topics

### 1. Fence API 网关认证机制 ⭐ 核心

**Decision**: 利用现有 Fence 网关进行统一认证，后端无需自行验证 JWT

**Rationale**:
- Fence 网关已实现 Forward Auth 模式，与 Nginx 配合拦截未认证请求
- 认证通过后，用户 ID 通过 `CH-USER` Header 透传到后端
- 避免重复实现 JWT 验证逻辑，符合 Simplicity 原则

**Key Integration Details** (from fence-knowledge):
| 配置项 | 值 |
|--------|-----|
| Cookie 名称 | `CowboyHat` |
| JWT 算法 | HS256 |
| JWT 签名密钥 | `cowboy_hat` |
| 用户 ID 字段 | JWT `sub` claim |
| 用户 ID 透传 | `CH-USER` Header |
| Token 备选传递 | `Authorization: Bearer <token>` |

**Architecture Flow**:
```
Client → Nginx → Fence (验证) → Backend Service
                    │
                    └─ 401 (未认证请求直接返回，不到达后端)
```

**Implementation Impact**:
- 后端：只需从 `CH-USER` Header 读取用户 ID，无需 AuthGuard
- 前端：监听 401 响应并重定向到登录页

### 2. React Router 路由守卫最佳实践

**Decision**: 使用高阶组件 (HOC) 或 Wrapper 组件包裹受保护路由

**Rationale**:
- React Router v6 不再支持 route render props，推荐使用组件包装模式
- 可以在路由层级统一处理认证逻辑
- 支持在加载受保护内容前显示 loading 状态

**Alternatives Considered**:
- Outlet 组件 + loader: 需要 React Router 6.4+ 的 data router，当前项目可能需要重构
- 全局中间件: React Router 不原生支持，需额外库

**Implementation Pattern**:
```tsx
// AuthGuard 包裹受保护路由
<Route element={<AuthGuard />}>
  <Route path="/bills" element={<BillsPage />} />
  <Route path="/statistics" element={<StatisticsPage />} />
</Route>
```

### 3. 后端用户 ID 获取 (更新)

**Decision**: 使用 NestJS Decorator 从 `CH-USER` Header 获取用户 ID

**Rationale**:
- Fence 网关已验证 Token，后端只需读取透传的用户 ID
- 使用 Decorator 模式使代码更简洁
- 无需实现 AuthGuard，因为未认证请求不会到达后端

**Alternatives Considered**:
- 自行验证 JWT：重复工作，增加复杂性
- 中间件读取：不够灵活，Decorator 更符合 NestJS 风格

**Implementation Pattern**:
```typescript
// backend/src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['ch-user'];
  },
);

// 使用示例
@Get('bills')
findAll(@CurrentUser() userId: string) {
  return this.billService.findAllByUser(userId);
}
```

### 4. Cookie 认证与 Token 传递

**Decision**: 使用 Cookie `CowboyHat` 存储 JWT Token

**Rationale**:
- 与 Fence 网关配置一致
- Cookie 自动随请求发送，无需手动在每个请求中添加 Header
- 支持 HttpOnly 属性防止 XSS 攻击

**Cookie Specification** (from Fence):
- **名称**: `CowboyHat`
- **属性**: HttpOnly, Secure, SameSite=Lax
- **内容**: JWT Token (HS256, 签名密钥 `cowboy_hat`)

**备选方案** (移动端/API):
```
Authorization: Bearer <jwt_token>
```

### 5. 登录成功后返回原页面

**Decision**: 使用 URL 参数 `redirect` 传递原始请求路径

**Rationale**:
- 简单直接，无需额外存储
- 统一登录页可以读取参数并在登录成功后重定向
- 支持直接分享包含重定向信息的 URL

**Alternatives Considered**:
- SessionStorage/LocalStorage: 需要额外清理逻辑，跨标签页不同步
- State 参数: 语义更适合 OAuth 流程，简单场景过于复杂

**Implementation Pattern**:
```typescript
// 重定向到登录页时携带原始路径
const currentPath = window.location.pathname + window.location.search;
window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(currentPath)}`;
```

### 6. Axios 拦截器处理 401 响应

**Decision**: 使用 Axios Response Interceptor 统一处理未授权响应

**Rationale**:
- 集中处理所有 API 的 401 响应（由 Fence 网关返回）
- 避免在每个 API 调用处重复处理
- 可以实现自动重定向到登录页

**Implementation Pattern**:
```typescript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

### 7. 白名单路径配置

**Decision**: 通过 Fence 网关的 Redis 白名单管理公开路径

**Rationale**:
- Fence 网关支持基于 Redis 的白名单机制
- 白名单路径不会触发认证检查
- 集中管理，无需在应用代码中硬编码

**White List Format**:
```
METHOD:PATH
```

**示例**:
```bash
# 添加健康检查接口到白名单
LPUSH fence:whitelist "GET:/api/health"
```

**Note**: 当前应用所有页面都需要登录保护，暂不需要配置白名单。

## Summary

基于 Fence 网关集成，技术方案大幅简化：

| 组件 | 技术方案 |
|------|----------|
| 认证验证 | Fence 网关 (Forward Auth) |
| Token 存储 | Cookie `CowboyHat` |
| 用户 ID 获取 | `CH-USER` Header + NestJS Decorator |
| 前端路由守卫 | React Router v6 Wrapper 组件 |
| 返回原页面 | URL redirect 参数 |
| API 错误处理 | Axios Response Interceptor |
| 白名单管理 | Fence Redis (fence:whitelist) |

**已解决的问题**:
- ~~Token 验证方式~~：由 Fence 网关处理
- ~~后端 AuthGuard 实现~~：不需要，网关已拦截

**剩余开放问题**:
- Token 刷新机制：如需要可在后续版本添加
