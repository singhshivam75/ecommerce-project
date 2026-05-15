import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from 'src/modules/products/entities/product-variant.entity';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @ManyToOne(() => Cart, (cart) => cart.items, {
        onDelete: 'CASCADE',
    })
    cart!: Cart;

    @ManyToOne(() => ProductVariant, {
        eager: true,
    })
    variant!: ProductVariant;

    @Column()
    quantity!: number;
}