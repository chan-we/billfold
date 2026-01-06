# Tasks: 配置文件读取优化

**Input**: Design documents from `/specs/003-config-reader/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: 未明确要求测试，本任务清单不包含测试任务。

**Organization**: 任务按用户故事组织，支持独立实现和测试。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 所属用户故事（US1, US2, US3）
- 描述中包含确切的文件路径

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- 本功能仅涉及后端配置，无前端变更

---

## Phase 1: Setup (共享基础设施)

**Purpose**: 配置文件模板更新

- [x] T001 [P] 更新 backend/.env.example 添加所有新配置项模板
- [x] T002 [P] 更新 backend/.env 使用新的键名 (DB_USER, DB_PASS)

---

## Phase 2: Foundational (阻塞性前置任务)

**Purpose**: 配置验证和类型定义，所有用户故事都依赖此阶段

**⚠️ CRITICAL**: 必须完成此阶段才能开始用户故事实现

- [x] T003 创建配置验证类 backend/src/config/config.validation.ts（定义 EnvironmentVariables 类，使用 class-validator 装饰器）
- [x] T004 创建配置工厂函数 backend/src/config/configuration.ts（使用 registerAs 定义 database、redis、cloudflare、security 命名空间）
- [x] T005 更新 backend/src/config/database.config.ts 使用新键名 (DB_USER, DB_PASS)

**Checkpoint**: 配置基础设施就绪 - 用户故事实现可以开始

---

## Phase 3: User Story 1 - 开发者配置应用环境变量 (Priority: P1) 🎯 MVP

**Goal**: 通过单一 `.env` 文件管理所有环境变量，启动时验证必要配置并输出加载状态日志

**Independent Test**: 创建 `.env` 文件并启动应用，验证配置加载日志输出

### Implementation for User Story 1

- [x] T006 [US1] 更新 backend/src/app.module.ts 集成新的配置模块（导入 configuration.ts 工厂函数，添加 validate 选项）
- [x] T007 [US1] 更新 backend/src/app.module.ts 中 TypeOrmModule.forRootAsync 使用新键名 (database.user, database.pass)
- [x] T008 [US1] 更新 backend/src/main.ts 添加配置加载状态日志（输出数据库主机/端口，警告可选配置缺失）

**Checkpoint**: User Story 1 完成 - 应用可通过 ConfigService 访问所有 12 个配置项

---

## Phase 4: User Story 2 - 应用连接 Redis 缓存服务 (Priority: P2)

**Goal**: 使 Redis 配置可通过 ConfigService 访问，缺失时记录警告日志

**Independent Test**: 启动应用，验证 Redis 配置可访问或警告日志正确输出

### Implementation for User Story 2

- [x] T009 [US2] 在 backend/src/main.ts 添加 Redis 配置状态检查和警告日志

**Checkpoint**: User Story 2 完成 - Redis 配置可访问，缺失时有明确警告

---

## Phase 5: User Story 3 - 应用使用 Cloudflare KV 存储 (Priority: P3)

**Goal**: 使 Cloudflare KV 配置可通过 ConfigService 访问，验证配置完整性

**Independent Test**: 启动应用，验证 Cloudflare 配置可访问或警告日志正确输出

### Implementation for User Story 3

- [x] T010 [US3] 在 backend/src/main.ts 添加 Cloudflare KV 配置完整性检查和警告日志（三个配置项需同时存在）

**Checkpoint**: User Story 3 完成 - Cloudflare 配置可访问，不完整时有明确警告

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 验证和清理

- [x] T011 运行 quickstart.md 验证：启动应用验证配置加载日志
- [x] T012 验证现有数据库连接功能正常（TypeORM 连接成功）
- [x] T013 清理 backend/src/config/database.config.ts 中的重复配置逻辑（统一使用 configuration.ts）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖 - 可立即开始
- **Foundational (Phase 2)**: 依赖 Setup 完成 - 阻塞所有用户故事
- **User Stories (Phase 3-5)**: 依赖 Foundational 完成
  - 用户故事可并行执行（如有多人）
  - 或按优先级顺序执行 (P1 → P2 → P3)
- **Polish (Phase 6)**: 依赖所有用户故事完成

### User Story Dependencies

- **User Story 1 (P1)**: 依赖 Foundational (Phase 2) - 无其他故事依赖
- **User Story 2 (P2)**: 依赖 Foundational (Phase 2) - 独立于 US1
- **User Story 3 (P3)**: 依赖 Foundational (Phase 2) - 独立于 US1/US2

### Within Each User Story

- 配置工厂函数 → 模块集成 → 日志输出
- 核心实现 → 验证
- 故事完成后再进入下一优先级

### Parallel Opportunities

- T001, T002 可并行执行（不同文件）
- US1, US2, US3 在 Foundational 完成后可并行执行

---

## Parallel Example: Setup Phase

```bash
# Launch all setup tasks together:
Task: "更新 backend/.env.example 添加所有新配置项模板"
Task: "更新 backend/.env 使用新的键名"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational (CRITICAL - 阻塞所有故事)
3. 完成 Phase 3: User Story 1
4. **STOP and VALIDATE**: 独立测试 User Story 1
5. 如满足需求可部署

### Incremental Delivery

1. 完成 Setup + Foundational → 基础就绪
2. 添加 User Story 1 → 独立测试 → 部署 (MVP!)
3. 添加 User Story 2 → 独立测试 → 部署
4. 添加 User Story 3 → 独立测试 → 部署
5. 每个故事独立增加价值，不破坏已有功能

---

## Notes

- [P] 任务 = 不同文件，无依赖
- [Story] 标签映射任务到特定用户故事，便于追踪
- 每个用户故事应可独立完成和测试
- 每个任务或逻辑组完成后提交代码
- 在任何检查点停止以独立验证故事
- 避免：模糊任务、同文件冲突、破坏独立性的跨故事依赖
