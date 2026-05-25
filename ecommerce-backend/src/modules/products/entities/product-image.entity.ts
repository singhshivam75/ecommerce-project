import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';

import { Product } from './product.entity';
import { ImageType } from '../enums/product.enums';

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

  @Index()
  @Column({ type: 'enum', enum: ImageType, default: ImageType.GALLERY })
  imageType!: ImageType;

  @Column({ nullable: true })
  altText?: string;

  @Column({ nullable: true, type: 'int' })
  width?: number;

  @Column({ nullable: true, type: 'int' })
  height?: number;

  @Column({ nullable: true, type: 'int' })
  fileSize?: number;

  @Column({ nullable: true })
  mimeType?: string;

  @Column({ default: false })
  isPrimary!: boolean;

  @Column({ default: 0 })
  sortOrder!: number;
}