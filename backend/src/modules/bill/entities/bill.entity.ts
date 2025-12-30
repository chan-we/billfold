import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { BillType } from '../../shared/enums/bill-type.enum';
import { CurrencyCode } from '../../shared/enums/currency.enum';

@Entity('bill')
@Index('idx_bill_user_date', ['userId', 'date'])
@Index('idx_bill_user_category', ['userId', 'billCategory'])
@Index('idx_bill_user_type', ['userId', 'billType'])
export class Bill {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @Column({ type: 'date' })
  date: string;

  @Column({
    name: 'bill_type',
    type: 'enum',
    enum: BillType,
  })
  billType: BillType;

  @Column({ name: 'bill_category', type: 'varchar', length: 50 })
  billCategory: string;

  @Column({
    name: 'currency_code',
    type: 'varchar',
    length: 3,
    default: CurrencyCode.CNY,
  })
  currencyCode: CurrencyCode;

  @Column({ type: 'varchar', length: 500, nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
