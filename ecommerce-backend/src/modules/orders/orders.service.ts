import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { CartItem } from 'src/modules/cart/entities/cart-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
  ) {}

  async placeOrder(userId: string) {
    return await this.orderRepo.manager.transaction(async (manager) => {
      const cart = await manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.variant'], // ✅ FIX
      });

      if (!cart || cart.items.length === 0) {
        throw new NotFoundException('Cart is empty');
      }

      let total = 0;

      const orderItems = cart.items.map((item) => {
        const price = Number(item.variant.price); // ✅ FIX

        total += price * item.quantity;

        return manager.create(OrderItem, {
          variant: item.variant, // ✅ FIX
          quantity: item.quantity,
          price: item.variant.price,
        });
      });

      const order = manager.create(Order, {
        user: { id: userId },
        totalPrice: total.toString(), // ✅ FIX
        items: orderItems,
      });

      const savedOrder = await manager.save(order);

      // clear cart
      await manager.delete(CartItem, {
        cart: { id: cart.id },
      });

      return savedOrder;
    });
  }

  async getUserOrders(userId: string) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.variant'], // ✅ FIX
    });
  }

  async getAllOrders() {
  return this.orderRepo.find({
    relations: ['user', 'items', 'items.variant'],
    order: { createdAt: 'DESC' },
  });
}

async updateOrderStatus(orderId: string, status: string) {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  order.status = status as any;

  return this.orderRepo.save(order);
}
}