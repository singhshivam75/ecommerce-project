import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from 'src/constants/roles.constant';
import { OneToMany } from 'typeorm';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Order } from 'src/modules/orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: Role.USER })
  role!: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  gender?: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}