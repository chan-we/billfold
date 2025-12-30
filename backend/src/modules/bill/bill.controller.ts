import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BillService, BillQueryOptions } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { Bill } from './entities/bill.entity';
import { AuthGuard, AuthenticatedRequest } from '../../common/guards/auth.guard';
import {
  BillType,
  ExpenseCategory,
  IncomeCategory,
  ExpenseCategoryLabels,
  IncomeCategoryLabels,
} from '../shared/enums/bill-type.enum';
import { CurrencyCode, CurrencyConfigs } from '../shared/enums/currency.enum';

@ApiTags('Bills')
@ApiBearerAuth()
@Controller('bills')
@UseGuards(AuthGuard)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @ApiOperation({ summary: '创建账单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Req() req: AuthenticatedRequest, @Body() createBillDto: CreateBillDto): Promise<Bill> {
    return this.billService.create(req.user.userId, createBillDto);
  }

  @Get()
  @ApiOperation({ summary: '获取账单列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'billType', required: false, enum: BillType })
  @ApiQuery({ name: 'billCategory', required: false, type: String })
  @ApiQuery({ name: 'currencyCode', required: false, enum: CurrencyCode })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('billType') billType?: BillType,
    @Query('billCategory') billCategory?: string,
    @Query('currencyCode') currencyCode?: CurrencyCode,
  ) {
    const options: BillQueryOptions = {
      page: page || 1,
      pageSize: pageSize || 20,
      startDate,
      endDate,
      billType,
      billCategory,
      currencyCode,
    };
    return this.billService.findAll(req.user.userId, options);
  }

  @Get('types')
  @ApiOperation({ summary: '获取账单类型列表' })
  getBillTypes() {
    const expense = Object.values(ExpenseCategory).map((value) => ({
      value,
      label: ExpenseCategoryLabels[value],
    }));

    const income = Object.values(IncomeCategory).map((value) => ({
      value,
      label: IncomeCategoryLabels[value],
    }));

    return { expense, income };
  }

  @Get('currencies')
  @ApiOperation({ summary: '获取货币列表' })
  getCurrencies() {
    return Object.values(CurrencyConfigs).map((config) => ({
      code: config.code,
      name: config.name,
      symbol: config.symbol,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: '获取账单详情' })
  @ApiResponse({ status: 200, description: '成功' })
  @ApiResponse({ status: 404, description: '账单不存在' })
  async findOne(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number): Promise<Bill> {
    return this.billService.findOne(req.user.userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新账单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '账单不存在' })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: CreateBillDto,
  ): Promise<Bill> {
    return this.billService.update(req.user.userId, id, updateBillDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除账单' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '账单不存在' })
  async remove(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.billService.softDelete(req.user.userId, id);
  }
}
