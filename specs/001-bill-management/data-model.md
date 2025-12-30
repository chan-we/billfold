# Data Model: 账单明细管理

**Feature**: 001-bill-management
**Date**: 2025-12-30

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│     User     │       │   BillType   │
│──────────────│       │──────────────│
│ id (PK)      │       │ (Enum)       │
│ ...          │       │ - EXPENSE    │
└──────┬───────┘       │ - INCOME     │
       │               └──────────────┘
       │ 1:N
       ▼
┌──────────────────────────────────────┐
│                Bill                   │
│──────────────────────────────────────│
│ id (PK)                              │
│ userId (FK → User)                   │
│ amount (DECIMAL)                     │
│ date                                 │
│ billCategory                         │
│ currencyCode                         │
│ note                                 │
│ createdAt                            │
│ updatedAt                            │
│ deletedAt (soft delete)              │
└──────────────────────────────────────┘
```

## Entities

### Bill (账单明细)

主要实体，存储用户的每一笔收入或支出记录。

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | 唯一标识符 |
| userId | BIGINT | NOT NULL, FK | 所属用户ID |
| amount | DECIMAL(15,2) | NOT NULL, > 0 | 金额（精确到分） |
| date | DATE | NOT NULL | 账单日期 |
| billType | ENUM | NOT NULL | 账单大类：EXPENSE(支出) / INCOME(收入) |
| billCategory | VARCHAR(50) | NOT NULL | 账单细分类别 |
| currencyCode | VARCHAR(3) | NOT NULL, DEFAULT 'CNY' | 货币代码 (ISO 4217) |
| note | VARCHAR(500) | NULLABLE | 备注 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | 创建时间 |
| updatedAt | DATETIME | NOT NULL, ON UPDATE NOW | 更新时间 |
| deletedAt | DATETIME | NULLABLE | 软删除时间 |

**Indexes**:
- `idx_bill_user_date` (userId, date DESC) - 支持用户账单时间排序查询
- `idx_bill_user_category` (userId, billCategory) - 支持分类筛选
- `idx_bill_user_type` (userId, billType) - 支持收入/支出筛选

**Validation Rules**:
- amount > 0 (正数)
- date 允许未来日期（预记账场景）
- note 最大500字符
- billCategory 必须是预定义的类别之一

---

### BillType (账单类型枚举)

区分收入和支出的顶级分类。

```typescript
enum BillType {
  EXPENSE = 'EXPENSE', // 支出
  INCOME = 'INCOME',   // 收入
}
```

---

### BillCategory (账单类别枚举)

细分的账单类别，分为支出类和收入类。

```typescript
// 支出类别
enum ExpenseCategory {
  FOOD = 'food',               // 餐饮
  TRANSPORT = 'transport',     // 交通
  SHOPPING = 'shopping',       // 购物
  ENTERTAINMENT = 'entertainment', // 娱乐
  HOUSING = 'housing',         // 住房
  UTILITIES = 'utilities',     // 水电燃气
  HEALTHCARE = 'healthcare',   // 医疗健康
  EDUCATION = 'education',     // 教育培训
  PERSONAL = 'personal',       // 个人护理
  SOCIAL = 'social',           // 社交人情
  OTHER_EXPENSE = 'other_expense', // 其他支出
}

// 收入类别
enum IncomeCategory {
  SALARY = 'salary',           // 工资
  BONUS = 'bonus',             // 奖金
  INVESTMENT = 'investment',   // 投资理财
  FREELANCE = 'freelance',     // 兼职收入
  REFUND = 'refund',           // 退款
  GIFT = 'gift',               // 礼金
  OTHER_INCOME = 'other_income', // 其他收入
}
```

**Validation**: billCategory 必须与 billType 匹配
- 当 billType = EXPENSE 时，billCategory 必须是 ExpenseCategory 之一
- 当 billType = INCOME 时，billCategory 必须是 IncomeCategory 之一

---

### CurrencyCode (货币代码枚举)

支持的货币类型，遵循 ISO 4217 标准。

```typescript
enum CurrencyCode {
  CNY = 'CNY', // 人民币 ¥
  USD = 'USD', // 美元 $
  EUR = 'EUR', // 欧元 €
  GBP = 'GBP', // 英镑 £
  JPY = 'JPY', // 日元 ¥
  HKD = 'HKD', // 港币 HK$
  TWD = 'TWD', // 新台币 NT$
  KRW = 'KRW', // 韩元 ₩
}
```

**Display Config**:
```typescript
const CurrencyDisplay = {
  CNY: { symbol: '¥', name: '人民币', decimalPlaces: 2 },
  USD: { symbol: '$', name: '美元', decimalPlaces: 2 },
  EUR: { symbol: '€', name: '欧元', decimalPlaces: 2 },
  GBP: { symbol: '£', name: '英镑', decimalPlaces: 2 },
  JPY: { symbol: '¥', name: '日元', decimalPlaces: 0 },
  HKD: { symbol: 'HK$', name: '港币', decimalPlaces: 2 },
  TWD: { symbol: 'NT$', name: '新台币', decimalPlaces: 0 },
  KRW: { symbol: '₩', name: '韩元', decimalPlaces: 0 },
};
```

---

## State Transitions

### Bill Lifecycle

```
[Created] → [Active] → [Deleted (soft)]
                ↑
                └── [Updated]
```

- **Created**: 新建账单，状态正常
- **Active**: 正常状态，可被查询、编辑
- **Updated**: 字段被修改，updatedAt更新
- **Deleted (soft)**: deletedAt设置为当前时间，查询时默认过滤

---

## Statistics Aggregations

### 时间范围统计

| Metric | Formula | Description |
|--------|---------|-------------|
| totalIncome | SUM(amount) WHERE billType=INCOME | 总收入 |
| totalExpense | SUM(amount) WHERE billType=EXPENSE | 总支出 |
| balance | totalIncome - totalExpense | 结余 |

### 分类统计

| Metric | Formula | Description |
|--------|---------|-------------|
| categorySum | SUM(amount) GROUP BY billCategory | 各分类金额 |
| categoryPercent | categorySum / totalExpense * 100 | 各分类占比 |

### 趋势统计

| Metric | Granularity | Description |
|--------|-------------|-------------|
| monthlyIncome | 按月聚合 | 月度收入趋势 |
| monthlyExpense | 按月聚合 | 月度支出趋势 |
| dailyExpense | 按日聚合 | 日均支出（用于周/月视图） |

---

## Database Schema (MySQL DDL)

```sql
CREATE TABLE `bill` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `date` DATE NOT NULL,
  `bill_type` ENUM('EXPENSE', 'INCOME') NOT NULL,
  `bill_category` VARCHAR(50) NOT NULL,
  `currency_code` VARCHAR(3) NOT NULL DEFAULT 'CNY',
  `note` VARCHAR(500) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_bill_user_date` (`user_id`, `date` DESC),
  INDEX `idx_bill_user_category` (`user_id`, `bill_category`),
  INDEX `idx_bill_user_type` (`user_id`, `bill_type`),
  CONSTRAINT `chk_amount_positive` CHECK (`amount` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
