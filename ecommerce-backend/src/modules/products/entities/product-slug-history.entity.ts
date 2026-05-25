import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductSlugHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, (p) => p.slugHistory, { onDelete: 'CASCADE' })
  product!: Product;

  @Index({ unique: true })
  @Column()
  oldSlug!: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  recordedAt!: Date;
}
