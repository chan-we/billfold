import { IsOptional, IsEnum, IsDateString, IsInt, Min, Max, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BillType } from '../../shared/enums/bill-type.enum';
import { CurrencyCode } from '../../shared/enums/currency.enum';

export class BillQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页条数', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页条数必须是整数' })
  @Min(1, { message: '每页条数最小为1' })
  @Max(100, { message: '每页条数最大为100' })
  pageSize?: number = 20;

  @ApiPropertyOptional({ description: '开始日期', example: '2025-01-01' })
  @IsOptional()
  @IsDateString({}, { message: '开始日期格式不正确' })
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期', example: '2025-12-31' })
  @IsOptional()
  @IsDateString({}, { message: '结束日期格式不正确' })
  endDate?: string;

  @ApiPropertyOptional({ description: '账单类型', enum: BillType })
  @IsOptional()
  @IsEnum(BillType, { message: '账单类型不正确' })
  billType?: BillType;

  @ApiPropertyOptional({ description: '账单类别' })
  @IsOptional()
  @IsString()
  billCategory?: string;

  @ApiPropertyOptional({ description: '货币类型', enum: CurrencyCode })
  @IsOptional()
  @IsEnum(CurrencyCode, { message: '货币类型不正确' })
  currencyCode?: CurrencyCode;
}
