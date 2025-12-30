# Research: 账单明细管理

**Feature**: 001-bill-management
**Date**: 2025-12-30

## Technology Decisions

### 1. Frontend Framework: React 18 + TypeScript

**Decision**: 使用React 18 + TypeScript作为前端框架

**Rationale**:
- 用户选择，符合团队技术栈偏好
- 成熟的生态系统，组件库丰富
- TypeScript提供类型安全，减少运行时错误
- React 18的Concurrent Mode可优化大列表渲染性能

**Alternatives Considered**:
- Vue 3: 同样优秀，但用户偏好React
- Next.js: SSR对账单应用不是必需，增加复杂度

---

### 2. UI Component Library: Ant Design + Ant Design Mobile

**Decision**: PC端使用Ant Design，H5端使用Ant Design Mobile

**Rationale**:
- 同一设计语言，保持视觉一致性
- 两个库都有完善的表单、表格、日期选择器组件
- 响应式断点可通过媒体查询统一管理
- 中文文档完善，社区活跃

**Alternatives Considered**:
- Material-UI: 优秀但中文化不如Ant Design
- TailwindCSS + Headless UI: 灵活但需要更多开发工作
- Vant (H5): 优秀的移动端库，但与PC端风格不统一

---

### 3. Backend Framework: NestJS

**Decision**: 使用NestJS作为后端框架

**Rationale**:
- 用户选择，Node.js生态
- TypeScript原生支持，与前端技术栈统一
- 模块化架构，便于代码组织
- 内置验证、异常处理、拦截器等功能
- 与TypeORM无缝集成

**Alternatives Considered**:
- Express + TypeScript: 更轻量但缺乏结构化
- Fastify: 性能优秀但NestJS也支持Fastify适配器

---

### 4. ORM: TypeORM

**Decision**: 使用TypeORM进行数据库操作

**Rationale**:
- NestJS官方推荐，集成最佳
- TypeScript装饰器定义实体，代码即文档
- 支持Migration版本化管理数据库变更
- 支持DECIMAL类型处理金额精度

**Alternatives Considered**:
- Prisma: 优秀但与NestJS集成需要额外配置
- Sequelize: 成熟但TypeScript支持不如TypeORM

---

### 5. Database: MySQL 8.0

**Decision**: 使用MySQL 8.0作为数据库

**Rationale**:
- 用户选择
- 成熟稳定，社区支持广泛
- DECIMAL类型支持精确金额计算
- JSON类型支持可能的扩展字段
- 索引优化支持大数据量查询

**Alternatives Considered**:
- PostgreSQL: 功能更强但MySQL已满足需求
- MongoDB: 不适合强关系型的财务数据

---

### 6. Charts Library: ECharts

**Decision**: 使用ECharts进行统计图表展示

**Rationale**:
- 功能强大，支持饼图、折线图、柱状图
- 响应式支持，适配不同屏幕
- 中文文档完善
- 性能优秀，支持大数据量渲染

**Alternatives Considered**:
- Chart.js: 轻量但功能不如ECharts丰富
- Recharts: React友好但定制性不如ECharts
- AntV G2: 优秀但学习曲线较陡

---

### 7. HTTP Client: Axios

**Decision**: 使用Axios进行前端HTTP请求

**Rationale**:
- 成熟稳定，社区广泛使用
- 支持请求/响应拦截器，便于统一处理认证和错误
- 支持请求取消，优化用户体验
- TypeScript类型支持完善

**Alternatives Considered**:
- Fetch API: 原生但需要封装
- SWR/React Query: 数据缓存优秀但对简单CRUD可能过重

---

### 8. Responsive Strategy: CSS Media Queries + Conditional Rendering

**Decision**: 使用CSS媒体查询 + 条件渲染实现PC/H5适配

**Rationale**:
- PC端(≥768px): 表格布局，显示更多列
- H5端(<768px): 卡片布局，信息精简
- 共用业务逻辑和API服务
- Ant Design内置响应式栅格系统

**Implementation**:
```typescript
// 使用自定义Hook检测屏幕宽度
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // ... resize listener
  return { isMobile };
};
```

---

### 9. Currency Handling: Decimal.js + DECIMAL(15,2)

**Decision**: 前端使用decimal.js，数据库使用DECIMAL(15,2)

**Rationale**:
- 避免JavaScript浮点数精度问题
- DECIMAL(15,2)支持最大金额: 9,999,999,999,999.99
- 所有计算在后端进行，前端仅展示

**Implementation**:
```typescript
// 后端Entity
@Column({ type: 'decimal', precision: 15, scale: 2 })
amount: string; // TypeORM返回string避免精度丢失

// 前端展示
import Decimal from 'decimal.js';
const formatted = new Decimal(amount).toFixed(2);
```

---

### 10. Bill Types: Predefined Enum

**Decision**: 使用预定义枚举管理账单类型

**Rationale**:
- 符合规范假设：预设常用类型，暂不支持自定义
- 类型安全，前后端共享定义
- 便于统计分类

**Implementation**:
```typescript
// 支出类型
enum ExpenseType {
  FOOD = 'food',           // 餐饮
  TRANSPORT = 'transport', // 交通
  SHOPPING = 'shopping',   // 购物
  ENTERTAINMENT = 'entertainment', // 娱乐
  HOUSING = 'housing',     // 住房
  UTILITIES = 'utilities', // 水电
  HEALTHCARE = 'healthcare', // 医疗
  EDUCATION = 'education', // 教育
  OTHER_EXPENSE = 'other_expense', // 其他支出
}

// 收入类型
enum IncomeType {
  SALARY = 'salary',       // 工资
  BONUS = 'bonus',         // 奖金
  INVESTMENT = 'investment', // 投资
  FREELANCE = 'freelance', // 兼职
  OTHER_INCOME = 'other_income', // 其他收入
}
```

---

### 11. Currency Types: ISO 4217 Subset

**Decision**: 使用ISO 4217货币代码子集

**Rationale**:
- 符合国际标准
- 预设常用货币，可扩展

**Implementation**:
```typescript
enum CurrencyCode {
  CNY = 'CNY', // 人民币
  USD = 'USD', // 美元
  EUR = 'EUR', // 欧元
  GBP = 'GBP', // 英镑
  JPY = 'JPY', // 日元
  HKD = 'HKD', // 港币
}
```

---

## Best Practices

### API Design
- RESTful命名规范: `/api/v1/bills`, `/api/v1/statistics`
- 分页: `?page=1&pageSize=20`
- 筛选: `?startDate=2025-01-01&endDate=2025-12-31&type=food`
- 响应格式统一: `{ code, message, data }`

### Error Handling
- 后端: NestJS ExceptionFilter统一处理
- 前端: Axios拦截器统一处理，用户友好提示

### Security
- API层userId校验，确保数据隔离
- 输入验证: class-validator
- XSS防护: React默认转义

### Performance
- 账单列表分页，避免一次加载过多数据
- 统计数据后端聚合，减少数据传输
- 前端虚拟滚动(可选优化)
