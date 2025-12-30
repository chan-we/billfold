import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillType } from '../../shared/enums/bill-type.enum';
import { CurrencyCode } from '../../shared/enums/currency.enum';

export class BillResponseDto {
  @ApiProperty({ description: '账单ID' })
  id: number;

  @ApiProperty({ description: '金额' })
  amount: string;

  @ApiProperty({ description: '账单日期' })
  date: string;

  @ApiProperty({ description: '账单类型', enum: BillType })
  billType: BillType;

  @ApiProperty({ description: '账单类别' })
  billCategory: string;

  @ApiProperty({ description: '货币类型', enum: CurrencyCode })
  currencyCode: CurrencyCode;

  @ApiPropertyOptional({ description: '备注' })
  note?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}

export class PaginatedBillResponseDto {
  @ApiProperty({ type: [BillResponseDto] })
  items: BillResponseDto[];

  @ApiProperty({ description: '总条数' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页条数' })
  pageSize: number;

  @ApiProperty({ description: '总页数' })
  totalPages: number;
}

export class BillTypeOptionDto {
  @ApiProperty({ description: '类别值' })
  value: string;

  @ApiProperty({ description: '类别标签' })
  label: string;
}

export class BillTypesResponseDto {
  @ApiProperty({ type: [BillTypeOptionDto], description: '支出类别' })
  expense: BillTypeOptionDto[];

  @ApiProperty({ type: [BillTypeOptionDto], description: '收入类别' })
  income: BillTypeOptionDto[];
}

export class CurrencyOptionDto {
  @ApiProperty({ description: '货币代码' })
  code: string;

  @ApiProperty({ description: '货币名称' })
  name: string;

  @ApiProperty({ description: '货币符号' })
  symbol: string;
}
