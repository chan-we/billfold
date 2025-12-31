# Implementation Plan: 用户登录态检查

**Branch**: `002-login-guard` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-login-guard/spec.md`

## Summary

实现用户登录态检查功能，与 Fence API 网关对接。Fence 网关统一处理 JWT 验证，后端服务只需从 `CH-USER` Header 获取用户 ID。前端需处理 401 响应并重定向到统一登录页。

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend & Backend)
**Primary Dependencies**:
- Frontend: React 18, React Router 6, Axios, Ant Design 5
- Backend: NestJS 10, TypeORM, class-validator
**Storage**: MySQL (通过 TypeORM)
**Testing**:
- Frontend: Vitest
- Backend: Jest
**Target Platform**: Web Browser (现代浏览器)
**Project Type**: Web application (frontend + backend monorepo)
**Performance Goals**: 登录状态检查增加页面加载时间 < 100ms
**Constraints**:
- 认证由 Fence API 网关统一处理（Forward Auth 模式）
- JWT Token 存储在 Cookie `CowboyHat` 中
- 用户 ID 通过 `CH-USER` Header 从网关透传到后端
- 统一登录页 URL 硬编码在前端配置文件
**Scale/Scope**: 单用户应用，所有页面需登录保护

## Fence 网关集成

### 架构概述

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

### 关键集成点

| 配置项 | 值 |
|--------|-----|
| Cookie 名称 | `CowboyHat` |
| JWT 算法 | HS256 |
| JWT 签名密钥 | `cowboy_hat` |
| 用户 ID 字段 | JWT `sub` claim |
| 用户 ID 透传 | `CH-USER` Header |
| Token 传递方式 | Cookie 或 `Authorization: Bearer` |

### 后端职责简化

由于 Fence 网关已处理认证，后端服务：
- **不需要**：验证 JWT Token
- **不需要**：实现 AuthGuard（网关已拦截未认证请求）
- **只需要**：从 `CH-USER` Header 读取用户 ID

### 前端职责

- 监听 401 响应（网关返回）并重定向到登录页
- 重定向时携带 `redirect` 参数保存原始路径
- Token 由登录系统设置到 Cookie `CowboyHat`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User-Centric Design | ✅ PASS | 登录流程简洁，重定向回原页面提升体验 |
| II. Data Integrity | ✅ PASS | 登录状态检查不涉及财务数据修改 |
| III. Privacy First | ✅ PASS | Token 使用 Cookie 传输，网关统一验证 |
| IV. Incremental Delivery | ✅ PASS | 功能可分阶段交付（P1 核心拦截 → P2 返回原页面） |
| V. Simplicity | ✅ PASS | 利用现有 Fence 网关，无需重复实现认证逻辑 |
| Security Standards | ✅ PASS | 使用 Fence 网关的 JWT + HS256 认证 |

**Gate Result**: PASS - 可继续 Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-login-guard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── common/
│   │   └── decorators/
│   │       └── user.decorator.ts   # NEW: 从 CH-USER 获取用户 ID
│   ├── config/
│   │   └── auth.config.ts          # NEW: Auth 配置（可选）
│   └── main.ts
└── tests/

frontend/
├── src/
│   ├── components/
│   │   └── AuthGuard/              # NEW: Route protection component
│   ├── config/
│   │   └── auth.config.ts          # NEW: Login URL configuration
│   ├── utils/
│   │   └── auth.ts                 # NEW: Auth utilities
│   └── App.tsx                     # Router wrapper with AuthGuard
└── tests/
```

**Structure Decision**: Web application structure (frontend + backend)，利用 Fence 网关简化后端认证逻辑。

## Complexity Tracking

> 无宪法违规需要记录
