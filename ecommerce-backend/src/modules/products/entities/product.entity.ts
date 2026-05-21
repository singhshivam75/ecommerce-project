import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from 'src/modules/categories/entities/category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductSpecification } from './product-specification.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  shortDescription?: string;

  @Column({ nullable: true })
  brand?: string;

  @ManyToOne(() => Category, {
    onDelete: 'SET NULL',
  })
  category!: Category | null;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  basePrice!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column({ default: 0 })
  rating!: number;

  @Column({ default: 0 })
  totalReviews!: number;

  // SEO
  @Column({ nullable: true })
  seoTitle?: string;

  @Column({ nullable: true })
  seoDescription?: string;

  @OneToMany(
    () => ProductVariant,
    (variant) => variant.product,
    {
      cascade: true,
    },
  )
  variants!: ProductVariant[];

  @OneToMany(
    () => ProductImage,
    (image) => image.product,
    {
      cascade: true,
    },
  )
  images!: ProductImage[];

  @OneToMany(
    () => ProductSpecification,
    (spec) => spec.product,
    {
      cascade: true,
    },
  )
  specifications!: ProductSpecification[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}