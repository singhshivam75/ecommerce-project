import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
@Index(['slug'])
@Index(['parent'])
@Index(['isActive'])
@Index(['level'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 180,
    unique: true,
  })
  slug!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  parentId?: string | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  @Column({
    type: 'int',
    default: 0,
  })
  level!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  path?: string;

  @Column({
    type: 'int',
    default: 0,
  })
  sortOrder!: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isFeatured!: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  metaTitle?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  metaDescription?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}