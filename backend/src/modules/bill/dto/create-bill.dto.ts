import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  Matches,
  IsDateString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillType, isValidCategoryForType } from '../../shared/enums/bill-type.enum';
import { CurrencyCode } from '../../shared/enums/currency.enum';

@ValidatorConstraint({ name: 'isPositiveDecimal', async: false })
class IsPositiveDecimalConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  }

  defaultMessage() {
    return '金额必须大于0';
  }
}

@ValidatorConstraint({ name: 'isCategoryMatchType', async: false })
class IsCategoryMatchTypeConstraint implements ValidatorConstraintInterface {
  validate(category: string, args: ValidationArguments) {
    const object = args.object as CreateBillDto;
    return isValidCategoryForType(object.billType, category);
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateBillDto;
    const typeLabel = object.billType === BillType.EXPENSE ? '支出' : '收入';
    return `该类别不属于${typeLabel}类型`;
  }
}

export class CreateBillDto {
  @ApiProperty({ description: '金额，必须大于0', example: '128.50' })
  @IsNotEmpty({ message: '请填写金额' })
  @IsString({ message: '金额格式不正确' })
  @Matches(/^\d+(\.\d{1,2})?$/, { message: '金额格式不正确，最多两位小数' })
  @Validate(IsPositiveDecimalConstraint)
  amount: string;

  @ApiProperty({ description: '账单日期', example: '2025-12-30' })
  @IsNotEmpty({ message: '请选择日期' })
  @IsDateString({}, { message: '日期格式不正确' })
  date: string;

  @ApiProperty({ description: '账单类型', enum: BillType, example: BillType.EXPENSE })
  @IsNotEmpty({ message: '请选择账单类型' })
  @IsEnum(BillType, { message: '账单类型不正确' })
  billType: BillType;

  @ApiProperty({ description: '账单类别', example: 'food' })
  @IsNotEmpty({ message: '请选择账单类别' })
  @IsString()
  @Validate(IsCategoryMatchTypeConstraint)
  billCategory: string;

  @ApiProperty({ description: '货币类型', enum: CurrencyCode, example: CurrencyCode.CNY })
  @IsNotEmpty({ message: '请选择货币类型' })
  @IsEnum(CurrencyCode, { message: '货币类型不正确' })
  currencyCode: CurrencyCode;

  @ApiPropertyOptional({ description: '备注', example: '午餐', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '备注不能超过500字符' })
  note?: string;
}
