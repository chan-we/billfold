import Decimal from 'decimal.js';
import { CurrencyCode } from '@/types/bill';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

export const CurrencyConfigs: Record<CurrencyCode, CurrencyConfig> = {
  [CurrencyCode.CNY]: { code: CurrencyCode.CNY, symbol: '¥', name: '人民币', decimalPlaces: 2 },
  [CurrencyCode.USD]: { code: CurrencyCode.USD, symbol: '$', name: '美元', decimalPlaces: 2 },
  [CurrencyCode.EUR]: { code: CurrencyCode.EUR, symbol: '€', name: '欧元', decimalPlaces: 2 },
  [CurrencyCode.GBP]: { code: CurrencyCode.GBP, symbol: '£', name: '英镑', decimalPlaces: 2 },
  [CurrencyCode.JPY]: { code: CurrencyCode.JPY, symbol: '¥', name: '日元', decimalPlaces: 0 },
  [CurrencyCode.HKD]: { code: CurrencyCode.HKD, symbol: 'HK$', name: '港币', decimalPlaces: 2 },
  [CurrencyCode.TWD]: { code: CurrencyCode.TWD, symbol: 'NT$', name: '新台币', decimalPlaces: 0 },
  [CurrencyCode.KRW]: { code: CurrencyCode.KRW, symbol: '₩', name: '韩元', decimalPlaces: 0 },
};

export function formatCurrency(amount: string | number, code: CurrencyCode): string {
  const config = CurrencyConfigs[code] ?? CurrencyConfigs[CurrencyCode.CNY];
  const decimal = new Decimal(amount);
  return `${config.symbol}${decimal.toFixed(config.decimalPlaces)}`;
}

export function formatAmount(amount: string | number, decimalPlaces: number = 2): string {
  const decimal = new Decimal(amount);
  return decimal.toFixed(decimalPlaces);
}

export function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
  return CurrencyConfigs[code];
}

export function getAllCurrencies(): CurrencyConfig[] {
  return Object.values(CurrencyConfigs);
}
