import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, IsNull } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { BillType } from '../shared/enums/bill-type.enum';
import { CurrencyCode } from '../shared/enums/currency.enum';

export interface BillQueryOptions {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  billType?: BillType;
  billCategory?: string;
  currencyCode?: CurrencyCode;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  async create(userId: number, createBillDto: CreateBillDto): Promise<Bill> {
    const bill = this.billRepository.create({
      ...createBillDto,
      userId,
    });
    return this.billRepository.save(bill);
  }

  async findAll(userId: number, options: BillQueryOptions = {}): Promise<PaginatedResult<Bill>> {
    const { page = 1, pageSize = 20, startDate, endDate, billType, billCategory, currencyCode } = options;

    const queryBuilder = this.billRepository
      .createQueryBuilder('bill')
      .where('bill.userId = :userId', { userId })
      .andWhere('bill.deletedAt IS NULL')
      .orderBy('bill.date', 'DESC')
      .addOrderBy('bill.createdAt', 'DESC');

    if (startDate && endDate) {
      queryBuilder.andWhere('bill.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else if (startDate) {
      queryBuilder.andWhere('bill.date >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('bill.date <= :endDate', { endDate });
    }

    if (billType) {
      queryBuilder.andWhere('bill.billType = :billType', { billType });
    }

    if (billCategory) {
      queryBuilder.andWhere('bill.billCategory = :billCategory', { billCategory });
    }

    if (currencyCode) {
      queryBuilder.andWhere('bill.currencyCode = :currencyCode', { currencyCode });
    }

    const total = await queryBuilder.getCount();
    const totalPages = Math.ceil(total / pageSize);

    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    const items = await queryBuilder.getMany();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async findOne(userId: number, id: number): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!bill) {
      throw new NotFoundException('账单不存在');
    }

    if (bill.userId !== userId) {
      throw new ForbiddenException('无权访问该账单');
    }

    return bill;
  }

  async update(userId: number, id: number, updateBillDto: CreateBillDto): Promise<Bill> {
    const bill = await this.findOne(userId, id);
    Object.assign(bill, updateBillDto);
    return this.billRepository.save(bill);
  }

  async softDelete(userId: number, id: number): Promise<void> {
    const bill = await this.findOne(userId, id);
    await this.billRepository.softRemove(bill);
  }
}
