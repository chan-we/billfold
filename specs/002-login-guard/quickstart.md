# Quickstart: 用户登录态检查

**Feature**: 002-login-guard
**Date**: 2025-12-31
**Updated**: 2025-12-31 (Fence 网关集成)

## Prerequisites

- Fence API 网关已部署并配置
- Nginx 已配置 Forward Auth 指向 Fence
- 统一登录系统 URL（需配置到 `auth.config.ts`）

## Architecture Overview

```
Client → Nginx → Fence (验证) → Backend Service
                    │
                    └─ 401 (未认证请求直接返回)
```

**Key Points**:
- 认证由 Fence 网关统一处理
- 后端不需要验证 JWT
- 用户 ID 通过 `CH-USER` Header 透传

## Implementation Steps

### Step 1: Frontend Auth Config

配置统一登录页 URL。

**文件**: `frontend/src/config/auth.config.ts`

```typescript
export const AuthConfig = {
  loginUrl: 'https://login.example.com/login', // 替换为实际 URL
  redirectParamName: 'redirect',
};
```

### Step 2: Axios Interceptor

设置 Axios 拦截器处理 401 响应（由 Fence 网关返回）。

**文件**: `frontend/src/services/http.ts` (或现有 Axios 实例文件)

```typescript
import axios from 'axios';
import { AuthConfig } from '@/config/auth.config';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${AuthConfig.loginUrl}?${AuthConfig.redirectParamName}=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }
    return Promise.reject(error);
  }
);
```

### Step 3: Frontend AuthGuard Component

创建路由守卫组件（可选，主要用于 UI 结构）。

**文件**: `frontend/src/components/AuthGuard/index.tsx`

```tsx
import { Outlet } from 'react-router-dom';

export function AuthGuard() {
  // 认证由 Fence 网关处理
  // 前端依赖 Axios interceptor 处理 401 响应
  return <Outlet />;
}
```

### Step 4: Apply AuthGuard to Routes

在路由配置中包裹受保护路由。

**文件**: `frontend/src/App.tsx` (或路由配置文件)

```tsx
import { AuthGuard } from '@/components/AuthGuard';

const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      { path: '/bills', element: <BillsPage /> },
      { path: '/statistics', element: <StatisticsPage /> },
      // ... 其他受保护路由
    ],
  },
]);
```

### Step 5: Backend User Decorator

创建 Decorator 从 `CH-USER` Header 获取用户 ID。

**文件**: `backend/src/common/decorators/user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['ch-user'];
  },
);
```

### Step 6: Use CurrentUser in Controllers

在 Controller 中使用 Decorator 获取用户 ID。

**示例**: `backend/src/modules/bills/bills.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/user.decorator';

@Controller('bills')
export class BillsController {
  @Get()
  findAll(@CurrentUser() userId: string) {
    // userId 来自 Fence 网关透传的 CH-USER Header
    return this.billsService.findAllByUser(userId);
  }
}
```

## What You DON'T Need

由于 Fence 网关已处理认证，以下内容**不需要**实现：

- ❌ 后端 AuthGuard
- ❌ JWT 验证库 (jsonwebtoken, @nestjs/jwt)
- ❌ JWT 签名密钥配置
- ❌ Cookie 解析逻辑（网关已处理）

## Testing

### Manual Testing

1. **未登录访问测试**:
   - 清除浏览器 Cookie `CowboyHat`
   - 访问任意受保护页面
   - 验证是否重定向到登录页

2. **已登录访问测试**:
   - 在统一登录系统完成登录（Cookie `CowboyHat` 已设置）
   - 访问受保护页面
   - 验证页面正常显示

3. **返回原页面测试**:
   - 未登录状态访问 `/bills/123`
   - 完成登录
   - 验证是否返回 `/bills/123`

### Local Development

本地开发时，可以模拟 Fence 网关行为：

1. **方式一**: 配置本地 Nginx + Fence
2. **方式二**: 在后端添加开发模式绕过
   ```typescript
   // 仅用于本地开发
   if (process.env.NODE_ENV === 'development' && !request.headers['ch-user']) {
     request.headers['ch-user'] = 'dev-user-id';
   }
   ```

## Configuration Checklist

- [ ] 配置统一登录页 URL 到 `frontend/src/config/auth.config.ts`
- [ ] 确认 Nginx 已配置 Forward Auth 指向 Fence
- [ ] 创建 `@CurrentUser()` Decorator
- [ ] 在需要用户 ID 的 Controller 中使用 `@CurrentUser()`
- [ ] 测试完整登录流程

## Fence Integration Reference

详见 `fence-knowledge/` 子模块：
- `architecture.md` - Fence 架构设计
- `integration-guide.md` - 子服务接入指南

## Key Configuration Values

| 配置项 | 值 |
|--------|-----|
| Cookie 名称 | `CowboyHat` |
| JWT 算法 | HS256 |
| 用户 ID Header | `CH-USER` |
| 重定向参数 | `redirect` |
