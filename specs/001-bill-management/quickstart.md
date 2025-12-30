# Quickstart: 账单明细管理

**Feature**: 001-bill-management
**Date**: 2025-12-30

本文档帮助开发者快速启动本地开发环境。

## Prerequisites

确保已安装以下工具：

- Node.js 18+ (推荐 20 LTS)
- pnpm 8+ (包管理器)
- MySQL 8.0+
- Git

## Project Setup

### 1. Clone and Install

```bash
# 进入项目目录
cd billfold

# 安装依赖 (monorepo结构)
pnpm install
```

### 2. Database Setup

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE billfold CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 创建开发用户 (可选)
mysql -u root -p -e "CREATE USER 'billfold_dev'@'localhost' IDENTIFIED BY 'dev_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON billfold.* TO 'billfold_dev'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### 3. Environment Configuration

```bash
# Backend
cp backend/.env.example backend/.env
```

编辑 `backend/.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=billfold_dev
DB_PASSWORD=dev_password
DB_DATABASE=billfold

# JWT (开发环境)
JWT_SECRET=your-dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
```

```bash
# Frontend
cp frontend/.env.example frontend/.env
```

编辑 `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

### 4. Run Migrations

```bash
cd backend
pnpm migration:run
```

### 5. Start Development Servers

打开两个终端：

**Terminal 1 - Backend**:
```bash
cd backend
pnpm dev
# Server running at http://localhost:3001
```

**Terminal 2 - Frontend**:
```bash
cd frontend
pnpm dev
# App running at http://localhost:5173
```

## Project Structure

```
billfold/
├── backend/              # NestJS 后端
│   ├── src/
│   │   ├── modules/      # 业务模块
│   │   ├── common/       # 通用工具
│   │   └── config/       # 配置
│   ├── test/             # 测试
│   └── package.json
├── frontend/             # React 前端
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── services/     # API服务
│   │   └── hooks/        # 自定义Hooks
│   ├── tests/            # 测试
│   └── package.json
├── specs/                # 规范文档
└── package.json          # Monorepo根配置
```

## Common Commands

### Backend

```bash
cd backend

# 开发模式
pnpm dev

# 生成迁移
pnpm migration:generate -- -n MigrationName

# 运行迁移
pnpm migration:run

# 回滚迁移
pnpm migration:revert

# 单元测试
pnpm test

# E2E测试
pnpm test:e2e

# Lint
pnpm lint
```

### Frontend

```bash
cd frontend

# 开发模式
pnpm dev

# 构建
pnpm build

# 预览构建
pnpm preview

# 测试
pnpm test

# Lint
pnpm lint
```

## API Documentation

启动后端后，访问 Swagger UI：
- http://localhost:3001/api/docs

## Development Tips

### 1. 热重载

前后端都支持热重载，修改代码后自动刷新。

### 2. 数据库可视化

推荐使用以下工具查看数据：
- MySQL Workbench
- DBeaver
- TablePlus

### 3. API调试

推荐使用：
- Postman
- Insomnia
- VS Code REST Client 扩展

### 4. 响应式开发

使用浏览器开发者工具切换设备模式：
- Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- 测试断点: 320px, 375px, 768px, 1024px, 1920px

### 5. 模拟用户认证（开发环境）

开发环境可使用固定测试用户：
```bash
# 获取测试Token (后端启动后)
curl -X POST http://localhost:3001/api/v1/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

## Troubleshooting

### 数据库连接失败

1. 检查MySQL服务是否运行
2. 验证 `.env` 中的数据库配置
3. 确保用户有权限访问数据库

### 端口被占用

```bash
# 检查端口占用
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# 或使用不同端口
PORT=3002 pnpm dev
```

### 依赖安装失败

```bash
# 清理并重装
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
pnpm install
```

## Next Steps

1. 阅读 [spec.md](./spec.md) 了解功能需求
2. 阅读 [data-model.md](./data-model.md) 了解数据结构
3. 查看 [contracts/openapi.yaml](./contracts/openapi.yaml) 了解API接口
4. 运行 `/speckit.tasks` 生成开发任务清单
