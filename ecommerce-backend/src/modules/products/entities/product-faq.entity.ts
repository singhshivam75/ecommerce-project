import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductFaq {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, (p) => p.faqs, { onDelete: 'CASCADE' })
  product!: Product;

  @Column()
  question!: string;

  @Column('text')
  answer!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
