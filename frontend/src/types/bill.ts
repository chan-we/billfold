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

export type BillCategory = ExpenseCategory | IncomeCategory;

export enum CurrencyCode {
  CNY = 'CNY',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  HKD = 'HKD',
  TWD = 'TWD',
  KRW = 'KRW',
}

export interface Bill {
  id: number;
  amount: string;
  date: string;
  billType: BillType;
  billCategory: string;
  currencyCode: CurrencyCode;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillRequest {
  amount: string;
  date: string;
  billType: BillType;
  billCategory: string;
  currencyCode: CurrencyCode;
  note?: string;
}

export interface UpdateBillRequest extends CreateBillRequest {}

export interface BillQueryParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  billType?: BillType;
  billCategory?: string;
  currencyCode?: CurrencyCode;
}

export interface BillTypeOption {
  value: string;
  label: string;
  icon?: string;
}

export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
  symbol: string;
}

export const ExpenseCategoryLabels: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '餐饮',
  [ExpenseCategory.TRANSPORT]: '交通',
  [ExpenseCategory.SHOPPING]: '购物',
  [ExpenseCategory.ENTERTAINMENT]: '娱乐',
  [ExpenseCategory.HOUSING]: '住房',
  [ExpenseCategory.UTILITIES]: '水电',
  [ExpenseCategory.HEALTHCARE]: '医疗',
  [ExpenseCategory.EDUCATION]: '教育',
  [ExpenseCategory.PERSONAL]: '个人护理',
  [ExpenseCategory.SOCIAL]: '社交',
  [ExpenseCategory.OTHER_EXPENSE]: '其他支出',
};

export const IncomeCategoryLabels: Record<IncomeCategory, string> = {
  [IncomeCategory.SALARY]: '工资',
  [IncomeCategory.BONUS]: '奖金',
  [IncomeCategory.INVESTMENT]: '投资收益',
  [IncomeCategory.FREELANCE]: '兼职',
  [IncomeCategory.REFUND]: '退款',
  [IncomeCategory.GIFT]: '礼金',
  [IncomeCategory.OTHER_INCOME]: '其他收入',
};

export const getCategoryLabel = (category: string): string => {
  return (
    ExpenseCategoryLabels[category as ExpenseCategory] ||
    IncomeCategoryLabels[category as IncomeCategory] ||
    category
  );
};

export const CurrencySymbols: Record<CurrencyCode, string> = {
  [CurrencyCode.CNY]: '¥',
  [CurrencyCode.USD]: '$',
  [CurrencyCode.EUR]: '€',
  [CurrencyCode.GBP]: '£',
  [CurrencyCode.JPY]: '¥',
  [CurrencyCode.HKD]: 'HK$',
  [CurrencyCode.TWD]: 'NT$',
  [CurrencyCode.KRW]: '₩',
};
