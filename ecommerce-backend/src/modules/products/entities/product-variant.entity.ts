import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Product } from './product.entity';
import { StockStatus } from '../enums/product.enums';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(
    () => Product,
    (product) => product.variants,
    {
      onDelete: 'CASCADE',
    },
  )
  product!: Product;

  @Column({ unique: true })
  sku!: string;

  // Backwards-compatible color/size fields (deprecated in favor of flexible attributes)
  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  size?: string;

  // Flexible attributes stored as JSONB: { color: 'Black', size: 'XL', ram: '8GB' }
  @Column({ type: 'jsonb', nullable: true, default: {} })
  attributes?: Record<string, string>;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price!: string;

  @Column('decimal', {
    nullable: true,
    precision: 10,
    scale: 2,
  })
  compareAtPrice?: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ default: 0 })
  reservedStock!: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column('text', { array: true, default: [] })
  galleryUrls!: string[];

  @Column({ default: false })
  isDefault!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Index({ unique: true, where: 'barcode IS NOT NULL' })
  @Column({ type: 'text', nullable: true })
  barcode?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costPrice?: string;

  @Column({ type: 'int', default: 5 })
  lowStockThreshold!: number;

  @Column({ type: 'enum', enum: StockStatus, default: StockStatus.IN_STOCK })
  stockStatus!: StockStatus;

  @Column({ default: false })
  allowBackOrder!: boolean;

  @Column({ default: true })
  trackInventory!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}