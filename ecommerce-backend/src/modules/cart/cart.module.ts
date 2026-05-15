import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductVariant } from 'src/modules/products/entities/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      ProductVariant,
    ]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}