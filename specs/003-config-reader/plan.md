# Implementation Plan: 配置文件读取优化

**Branch**: `003-config-reader` | **Date**: 2026-01-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-config-reader/spec.md`

## Summary

扩展现有 NestJS 配置系统以支持新的配置项（Cloudflare KV、Redis、JWT、重定向白名单），同时将数据库配置键名从 `DB_USERNAME/DB_PASSWORD` 迁移至 `DB_USER/DB_PASS`。使用类型安全的配置模块，对必要配置进行启动时验证，对可选配置记录警告日志并优雅降级。

## Technical Context

**Language/Version**: TypeScript 5.x (NestJS 10.x)
**Primary Dependencies**: @nestjs/config ^4.0.2, @nestjs/typeorm ^10.0.1, class-validator, class-transformer
**Storage**: MySQL (通过 TypeORM)
**Testing**: Jest (NestJS 默认测试框架)
**Target Platform**: Node.js 服务端
**Project Type**: Web 应用 (frontend + backend)
**Performance Goals**: 应用启动时间增加不超过 500 毫秒
**Constraints**: 必须保持现有数据库连接的 100% 向后兼容
**Scale/Scope**: 12 个配置项，4 个配置分组

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User-Centric Design | ✅ PASS | 配置是开发者工具，不影响终端用户体验 |
| II. Data Integrity | ✅ PASS | 配置验证确保数据库连接正确，不涉及财务数据计算 |
| III. Privacy First | ✅ PASS | 敏感配置（密码、API Token）通过环境变量管理，不提交版本控制 |
| IV. Incremental Delivery | ✅ PASS | 配置读取独立于 Redis/Cloudflare 功能模块实现 |
| V. Simplicity | ✅ PASS | 使用 NestJS 内置 ConfigModule，无新依赖 |
| Secrets Management | ✅ PASS | 遵循环境变量管理，支持运行时注入 |

**Gate Status**: PASSED - 无违规项，可进入 Phase 0

### Post-Design Re-evaluation (Phase 1 完成后)

| Principle | Status | Re-check Notes |
|-----------|--------|----------------|
| I. User-Centric Design | ✅ PASS | 无变化 |
| II. Data Integrity | ✅ PASS | class-validator 确保配置值类型正确 |
| III. Privacy First | ✅ PASS | 日志仅输出主机/端口，不输出密码和 Token |
| IV. Incremental Delivery | ✅ PASS | 仅配置读取，可独立测试和部署 |
| V. Simplicity | ✅ PASS | 2 个新文件，复用现有依赖 |
| Secrets Management | ✅ PASS | 支持环境变量覆盖，便于容器化部署 |

**Final Gate Status**: PASSED

## Project Structure

### Documentation (this feature)

```text
specs/003-config-reader/
├── plan.md              # 本文件
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - 无新 API)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.config.ts      # 现有 - 需更新键名
│   │   ├── configuration.ts        # 新增 - 类型安全配置加载
│   │   └── config.validation.ts    # 新增 - 配置验证逻辑
│   ├── modules/
│   │   └── ... (无变更)
│   ├── app.module.ts               # 更新 ConfigModule 配置
│   └── main.ts                     # 添加配置加载日志
├── .env                            # 更新键名
└── .env.example                    # 更新模板

frontend/
└── ... (无变更 - 前端配置不在本次范围)
```

**Structure Decision**: 使用现有 Web 应用结构，仅在 backend/src/config/ 目录新增配置相关文件。

## Complexity Tracking

> 无 Constitution 违规项，此部分留空。

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (无) | - | - |
