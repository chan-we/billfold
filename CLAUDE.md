# billfold Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-30

## Active Technologies
- TypeScript 5.x (Frontend & Backend) (002-login-guard)
- MySQL (通过 TypeORM) (002-login-guard)
- TypeScript 5.x (NestJS 10.x) + @nestjs/config ^4.0.2, @nestjs/typeorm ^10.0.1, class-validator, class-transformer (003-config-reader)

- TypeScript 5.x (Frontend [EXTRACTED FROM ALL PLAN.MD FILES] Backend) (001-bill-management)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x (Frontend [LANGUAGE-SPECIFIC, ONLY FOR LANGUAGES IN USE] Backend): Follow standard conventions

## Recent Changes
- 003-config-reader: Added TypeScript 5.x (NestJS 10.x) + @nestjs/config ^4.0.2, @nestjs/typeorm ^10.0.1, class-validator, class-transformer
- 002-login-guard: Added TypeScript 5.x (Frontend & Backend)
- 002-login-guard: Added TypeScript 5.x (Frontend & Backend)


<!-- MANUAL ADDITIONS START -->

## Submodules

### fence-knowledge

fence（API 网关服务）的知识库，包含：

- `architecture.md` - 架构设计文档
- `integration-guide.md` - 集成指南

路径: `fence-knowledge/`

用于了解 fence API 网关的认证机制和集成方式，与本项目的登录态检查功能相关。

<!-- MANUAL ADDITIONS END -->
