# Implementation Plan: 账单明细管理

**Branch**: `001-bill-management` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-bill-management/spec.md`

## Summary

实现一个面向C端用户的账单管理功能，支持PC端和H5端。用户可以进行账单明细的增删改查操作（包含金额、日期、备注、货币类型、账单类型等字段），并通过统计报表可视化展示收支情况。采用React + TypeScript构建响应式前端，NestJS提供RESTful API，MySQL存储账单数据。

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend & Backend)
**Primary Dependencies**:
- Frontend: React 18, Ant Design/Ant Design Mobile, ECharts, Axios
- Backend: NestJS, TypeORM, class-validator
**Storage**: MySQL 8.0
**Testing**: Jest (Unit), Playwright (E2E)
**Target Platform**: Web (PC + H5 响应式)
**Project Type**: Web application (frontend + backend)
**Performance Goals**:
- 账单列表加载 < 2秒 (100条以内)
- 统计报表渲染 < 3秒 (1年数据)
**Constraints**:
- 响应式设计，适配320px-1920px屏幕宽度
- 金额计算使用decimal类型，避免浮点精度问题
**Scale/Scope**:
- 初期支持1000用户
- 每用户最多10000条账单记录

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: User-Centric Design ✅
- **30秒录入目标**: 规范SC-001已定义，UI设计将优化输入流程
- **2秒加载目标**: 规范SC-002/SC-004已定义，符合宪法要求
- **用户友好错误提示**: FR-012/FR-013已定义字段校验，将使用中文提示

### Principle II: Data Integrity ✅
- **金额精度**: 使用MySQL DECIMAL(15,2)存储金额，避免浮点误差
- **事务原子性**: NestJS + TypeORM支持事务管理
- **双层校验**: class-validator(后端) + 表单校验(前端)
- **软删除**: 账单数据使用软删除，保留审计轨迹

### Principle III: Privacy First ✅
- **传输加密**: HTTPS强制
- **存储加密**: 敏感字段可加密存储
- **数据隔离**: 每条账单关联userId，API层强制过滤
- **日志脱敏**: 不记录具体金额和备注内容

### Principle IV: Incremental Delivery ✅
- **用户故事优先级**: P1(增/查) → P2(改/删) → P3(统计) 可独立交付
- **数据库迁移**: TypeORM migration支持版本化迁移
- **向后兼容**: API版本化 (/api/v1/)

### Principle V: Simplicity ✅
- **架构简洁**: 标准三层架构 (Controller → Service → Repository)
- **依赖精简**: 仅使用必要依赖，避免过度工程化
- **代码清晰**: TypeScript类型系统自文档化

## Project Structure

### Documentation (this feature)

```text
specs/001-bill-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── modules/
│   │   ├── bill/              # 账单模块
│   │   │   ├── bill.controller.ts
│   │   │   ├── bill.service.ts
│   │   │   ├── bill.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── statistics/        # 统计模块
│   │   │   ├── statistics.controller.ts
│   │   │   ├── statistics.service.ts
│   │   │   └── statistics.module.ts
│   │   └── shared/            # 共享模块（枚举、常量）
│   ├── common/                # 通用工具、拦截器、过滤器
│   ├── config/                # 配置
│   └── main.ts
├── test/
│   ├── unit/
│   └── e2e/
├── package.json
└── tsconfig.json

frontend/
├── src/
│   ├── components/
│   │   ├── BillForm/          # 账单表单组件
│   │   ├── BillList/          # 账单列表组件
│   │   ├── BillCard/          # 账单卡片（H5）
│   │   ├── StatisticsChart/   # 统计图表组件
│   │   └── common/            # 通用组件
│   ├── pages/
│   │   ├── Bills/             # 账单列表页
│   │   ├── BillDetail/        # 账单详情/编辑页
│   │   └── Statistics/        # 统计报表页
│   ├── services/
│   │   ├── billService.ts     # 账单API服务
│   │   └── statisticsService.ts
│   ├── hooks/                 # 自定义Hooks
│   ├── utils/                 # 工具函数
│   ├── types/                 # TypeScript类型定义
│   └── App.tsx
├── tests/
│   └── e2e/
├── package.json
└── tsconfig.json
```

**Structure Decision**: 采用Web application结构（前后端分离），frontend和backend作为两个独立的项目目录。前端使用React + TypeScript实现响应式Web应用，后端使用NestJS提供RESTful API。

## Complexity Tracking

> 无Constitution违规，无需记录复杂性权衡。
