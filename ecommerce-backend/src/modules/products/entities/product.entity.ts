import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Category } from 'src/modules/categories/entities/category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductSpecification } from './product-specification.entity';
import { ProductStatus, DiscountType } from '../enums/product.enums';
import { ProductFaq } from './product-faq.entity';
import { ProductSlugHistory } from './product-slug-history.entity';

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
  @Index()
  @Column({ default: false })
  isFeatured!: boolean;

  @Index()
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status!: ProductStatus;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating!: string;

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

  // Tags and Keywords
  @Column('text', { array: true, default: [] })
  tags!: string[];

  @Column('text', { array: true, default: [] })
  metaKeywords!: string[];

  @Column('text', { array: true, default: [] })
  searchKeywords!: string[];

  // Sale / Discount
  @Column({ type: 'enum', enum: DiscountType, nullable: true })
  discountType?: DiscountType | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountValue?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  saleStartDate?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  saleEndDate?: Date;

  @Column({ type: 'text', nullable: true })
  videoUrl?: string;

  // Ratings, counts
  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: 0 })
  soldCount!: number;

  @Index()
  @Column({ default: false })
  isNewArrival!: boolean;

  // Shipping
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  weight?: string | null;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  length?: string | null;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  width?: string | null;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  height?: string | null;

  @Column({ nullable: true })
  shippingClass?: string;

  // Warranty / Return / Origin
  @Column({ nullable: true })
  warranty?: string;

  @Column({ nullable: true })
  returnPolicy?: string;

  @Column({ nullable: true })
  countryOfOrigin?: string;

  // Relations: related / upsell / cross-sell
  @ManyToMany(() => Product, { cascade: false })
  @JoinTable({ name: 'product_related_products' })
  relatedProducts?: Product[];

  @ManyToMany(() => Product, { cascade: false })
  @JoinTable({ name: 'product_upsell_products' })
  upsellProducts?: Product[];

  @ManyToMany(() => Product, { cascade: false })
  @JoinTable({ name: 'product_crosssell_products' })
  crossSellProducts?: Product[];

  @OneToMany(() => ProductFaq, (faq) => faq.product, { cascade: true })
  faqs?: ProductFaq[];

  @OneToMany(() => ProductSlugHistory, (h) => h.product, { cascade: true })
  slugHistory?: ProductSlugHistory[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}