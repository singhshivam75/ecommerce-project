import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(
    () => Product,
    (product) => product.images,
    {
      onDelete: 'CASCADE',
    },
  )
  product!: Product;

  @Column()
  url!: string;

  @Column({ default: false })
  isPrimary!: boolean;

  @Column({ default: 0 })
  sortOrder!: number;
}