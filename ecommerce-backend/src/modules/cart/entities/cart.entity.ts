import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => User, (user) => user.carts, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user!: User;

    @OneToMany(() => CartItem, (item) => item.cart, {
        cascade: true,
    })
    items!: CartItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}