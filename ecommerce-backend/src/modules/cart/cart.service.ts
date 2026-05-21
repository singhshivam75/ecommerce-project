import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { ProductVariant } from 'src/modules/products/entities/product-variant.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,

    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
  ) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.variant', 'items.variant.product'],
    });

    if (!cart) {
      cart = this.cartRepo.create({
        user: { id: userId },
      });
      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addToCart(userId: string, variantId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const variant = await this.variantRepo.findOne({
      where: { id: variantId },
    });

    if (!variant) throw new NotFoundException('Variant not found');

    let item = await this.cartItemRepo.findOne({
      where: {
        cart: { id: cart.id },
        variant: { id: variant.id },
      },
    });

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartItemRepo.create({
        cart,
        variant,
        quantity,
      });
    }

    await this.cartItemRepo.save(item);

    return this.getCart(userId);
  }

  async getCart(userId: string) {
    return this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.variant', 'items.variant.product'],
    });
  }

  async updateItem(itemId: string, quantity: number) {
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId },
    });

    if (!item) throw new NotFoundException('Item not found');

    item.quantity = quantity;

    return this.cartItemRepo.save(item);
  }

  async removeItem(itemId: string) {
    return this.cartItemRepo.delete(itemId);
  }
}