import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from 'src/modules/products/entities/product-variant.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order!: Order;

  @ManyToOne(() => ProductVariant)
  variant!: ProductVariant; // ✅ renamed

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: string; // ✅ FIX
}