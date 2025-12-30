import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StatisticsService, StatisticsQuery } from './statistics.service';
import { AuthGuard, AuthenticatedRequest } from '../../common/guards/auth.guard';
import { BillType } from '../shared/enums/bill-type.enum';
import { CurrencyCode } from '../shared/enums/currency.enum';

@ApiTags('Statistics')
@ApiBearerAuth()
@Controller('statistics')
@UseGuards(AuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  @ApiOperation({ summary: '获取收支汇总' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'currencyCode', required: false, enum: CurrencyCode })
  async getSummary(
    @Req() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('currencyCode') currencyCode?: CurrencyCode,
  ) {
    const query: StatisticsQuery = { startDate, endDate, currencyCode };
    return this.statisticsService.getSummary(req.user.userId, query);
  }

  @Get('category')
  @ApiOperation({ summary: '获取分类统计' })
  @ApiQuery({ name: 'billType', required: true, enum: BillType })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'currencyCode', required: false, enum: CurrencyCode })
  async getCategoryStatistics(
    @Req() req: AuthenticatedRequest,
    @Query('billType') billType: BillType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('currencyCode') currencyCode?: CurrencyCode,
  ) {
    const query: StatisticsQuery = { startDate, endDate, currencyCode };
    return this.statisticsService.getCategoryStatistics(req.user.userId, billType, query);
  }

  @Get('trend')
  @ApiOperation({ summary: '获取趋势统计' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'currencyCode', required: false, enum: CurrencyCode })
  async getTrendStatistics(
    @Req() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('currencyCode') currencyCode?: CurrencyCode,
  ) {
    const query: StatisticsQuery = { startDate, endDate, currencyCode };
    return this.statisticsService.getTrendStatistics(req.user.userId, query);
  }
}
