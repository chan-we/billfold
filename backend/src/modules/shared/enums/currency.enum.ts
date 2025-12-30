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

export const AllCurrencies = Object.values(CurrencyCode);

export function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
  return CurrencyConfigs[code];
}

export function formatCurrency(amount: string | number, code: CurrencyCode): string {
  const config = CurrencyConfigs[code];
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${config.symbol}${numAmount.toFixed(config.decimalPlaces)}`;
}
