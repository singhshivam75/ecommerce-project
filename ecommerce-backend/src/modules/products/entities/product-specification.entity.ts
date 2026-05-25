import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Product } from './product.entity';

@Entity()
export class ProductSpecification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column()
  key!: string;

  @Column()
  value!: string;

  @Column({ type: 'text', nullable: true })
  group?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ default: false })
  isHighlighted!: boolean;
}