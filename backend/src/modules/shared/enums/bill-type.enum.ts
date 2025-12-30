export enum BillType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  HOUSING = 'housing',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  PERSONAL = 'personal',
  SOCIAL = 'social',
  OTHER_EXPENSE = 'other_expense',
}

export enum IncomeCategory {
  SALARY = 'salary',
  BONUS = 'bonus',
  INVESTMENT = 'investment',
  FREELANCE = 'freelance',
  REFUND = 'refund',
  GIFT = 'gift',
  OTHER_INCOME = 'other_income',
}

export const ExpenseCategoryLabels: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '餐饮',
  [ExpenseCategory.TRANSPORT]: '交通',
  [ExpenseCategory.SHOPPING]: '购物',
  [ExpenseCategory.ENTERTAINMENT]: '娱乐',
  [ExpenseCategory.HOUSING]: '住房',
  [ExpenseCategory.UTILITIES]: '水电燃气',
  [ExpenseCategory.HEALTHCARE]: '医疗健康',
  [ExpenseCategory.EDUCATION]: '教育培训',
  [ExpenseCategory.PERSONAL]: '个人护理',
  [ExpenseCategory.SOCIAL]: '社交人情',
  [ExpenseCategory.OTHER_EXPENSE]: '其他支出',
};

export const IncomeCategoryLabels: Record<IncomeCategory, string> = {
  [IncomeCategory.SALARY]: '工资',
  [IncomeCategory.BONUS]: '奖金',
  [IncomeCategory.INVESTMENT]: '投资理财',
  [IncomeCategory.FREELANCE]: '兼职收入',
  [IncomeCategory.REFUND]: '退款',
  [IncomeCategory.GIFT]: '礼金',
  [IncomeCategory.OTHER_INCOME]: '其他收入',
};

export const AllExpenseCategories = Object.values(ExpenseCategory);
export const AllIncomeCategories = Object.values(IncomeCategory);
export const AllBillCategories = [...AllExpenseCategories, ...AllIncomeCategories];

export function isValidCategoryForType(billType: BillType, category: string): boolean {
  if (billType === BillType.EXPENSE) {
    return AllExpenseCategories.includes(category as ExpenseCategory);
  }
  return AllIncomeCategories.includes(category as IncomeCategory);
}

export function getCategoryLabel(category: string): string {
  return (
    ExpenseCategoryLabels[category as ExpenseCategory] ||
    IncomeCategoryLabels[category as IncomeCategory] ||
    category
  );
}
