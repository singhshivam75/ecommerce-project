import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from './product.entity';

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

  @Column()
  color!: string;

  @Column()
  size!: string;

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

  @Column({ nullable: true })
  image?: string;

  @Column({ default: false })
  isDefault!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}