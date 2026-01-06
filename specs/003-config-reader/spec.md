# Feature Specification: 配置文件读取优化

**Feature Branch**: `003-config-reader`
**Created**: 2026-01-06
**Status**: Draft
**Input**: 用户描述: "修改代码中配置文件的读取，支持新的配置项"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 开发者配置应用环境变量 (Priority: P1)

作为开发者，我希望通过单一的 `.env` 配置文件管理所有环境变量，包括数据库、Redis、Cloudflare KV、JWT 和重定向白名单等配置，以便在不同环境中轻松部署应用。

**Why this priority**: 这是应用正常运行的基础，所有其他功能（如缓存、外部存储、认证）都依赖于正确的配置读取机制。

**Independent Test**: 可以通过创建 `.env` 文件并启动应用来验证所有配置是否正确加载，应用启动时应打印配置加载状态日志。

**Acceptance Scenarios**:

1. **Given** 存在有效的 `.env` 文件，**When** 应用启动时，**Then** 所有配置项应被正确读取并可通过 ConfigService 访问
2. **Given** `.env` 文件缺少必要配置项，**When** 应用启动时，**Then** 应用应在启动日志中明确提示缺少的配置项名称
3. **Given** 配置值包含特殊字符（如密码中的特殊符号），**When** 读取配置时，**Then** 配置值应被正确解析而不被截断或损坏

---

### User Story 2 - 应用连接 Redis 缓存服务 (Priority: P2)

作为应用系统，我需要使用 Redis 配置（REDIS_HOST、REDIS_PORT、REDIS_PASS）来建立缓存连接，以提升数据访问性能。

**Why this priority**: Redis 缓存对于会话管理和性能优化至关重要，但应用核心功能可以在没有缓存的情况下降级运行。

**Independent Test**: 可以通过配置 Redis 连接信息并执行简单的缓存读写操作来验证 Redis 连接是否正常工作。

**Acceptance Scenarios**:

1. **Given** Redis 配置正确，**When** 应用尝试连接 Redis 时，**Then** 连接应成功建立且可进行读写操作
2. **Given** Redis 服务不可用，**When** 应用尝试连接 Redis 时，**Then** 应用应记录错误日志并继续运行（降级模式）

---

### User Story 3 - 应用使用 Cloudflare KV 存储 (Priority: P3)

作为应用系统，我需要使用 Cloudflare KV 配置（CF_ACCOUNT_ID、CF_NAMESPACE_ID、CF_API_TOKEN）来访问 Cloudflare Workers KV 存储服务。

**Why this priority**: Cloudflare KV 是可选的外部存储服务，主要用于边缘数据存储场景，不影响核心账单管理功能。

**Independent Test**: 可以通过配置 Cloudflare 凭据并执行简单的 KV 读写操作来验证配置是否正确。

**Acceptance Scenarios**:

1. **Given** Cloudflare KV 配置完整且有效，**When** 应用尝试访问 KV 存储时，**Then** 应能成功读写数据
2. **Given** Cloudflare KV 配置缺失，**When** 应用启动时，**Then** 应用应跳过 Cloudflare 功能初始化并记录提示日志

---

### Edge Cases

- 当配置文件路径不存在时，应用应使用环境变量或默认值
- 当 REDIRECT_WHITELIST 包含通配符模式（如 `*.ushiwe.com`）时，应正确解析并用于 URL 验证
- 当数据库端口配置为非标准端口时，应正确连接
- 当密码包含等号（=）或引号时，配置解析器应正确处理

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须从 `.env` 文件读取所有配置项，包括 Cloudflare KV 配置（CF_ACCOUNT_ID、CF_NAMESPACE_ID、CF_API_TOKEN）
- **FR-002**: 系统必须支持 MySQL 数据库配置读取（DB_HOST、DB_USER、DB_PORT、DB_PASS）
- **FR-003**: 系统必须支持 Redis 缓存配置读取（REDIS_HOST、REDIS_PORT、REDIS_PASS）
- **FR-004**: 系统必须支持 JWT 密钥配置读取（JWT_SECRET）
- **FR-005**: 系统必须支持重定向白名单配置读取（REDIRECT_WHITELIST），包括通配符模式
- **FR-006**: 系统必须在启动时验证必要配置项（DB_HOST、DB_USER、DB_PORT、DB_PASS）是否存在，缺失时输出明确的错误信息并阻止启动
- **FR-007**: 系统必须为可选配置项（REDIS_*、CF_*、JWT_SECRET、REDIRECT_WHITELIST）缺失时记录警告日志，相关功能返回空值或无操作
- **FR-008**: 配置读取必须支持从环境变量回退（当 `.env` 文件不存在时）

### Key Entities

- **ApplicationConfig**: 应用级配置容器，包含所有配置分组
- **DatabaseConfig**: 数据库连接配置（主机、端口、用户、密码）
- **RedisConfig**: Redis 缓存连接配置（主机、端口、密码）
- **CloudflareConfig**: Cloudflare KV 访问配置（账户ID、命名空间ID、API令牌）
- **SecurityConfig**: 安全相关配置（JWT密钥、重定向白名单）

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 应用启动时间不因配置读取增加超过 500 毫秒
- **SC-002**: 所有 12 个配置项均可通过统一的配置服务访问
- **SC-003**: 配置缺失时的错误信息包含具体的配置项名称，开发者可在 10 秒内定位问题
- **SC-004**: 现有数据库连接功能在配置迁移后保持 100% 兼容，无需修改业务代码

## Clarifications

### Session 2026-01-06

- Q: 哪些配置项是必须的，哪些是可选的？ → A: 必须: DB_* 仅; 可选: 其余所有配置项
- Q: 可选配置缺失时采用什么策略？ → A: 记录警告日志，功能返回空值/无操作

## Assumptions

- 后端使用 NestJS 框架的 `@nestjs/config` 模块作为配置管理方案
- `.env` 文件遵循标准的 dotenv 格式（KEY=VALUE）
- 生产环境可能通过容器环境变量注入配置，而非使用 `.env` 文件
- Redis 和 Cloudflare KV 功能模块尚未实现，本规范仅涵盖配置读取部分
- 数据库配置键名从 `DB_USERNAME` 调整为 `DB_USER`，从 `DB_PASSWORD` 调整为 `DB_PASS`，以匹配用户提供的配置格式
