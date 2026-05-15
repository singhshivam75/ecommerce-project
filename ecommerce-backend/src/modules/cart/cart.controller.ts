import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Cart') // ✅ Swagger group
@ApiBearerAuth() // 🔐 JWT required
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@GetUser() user, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(
      user.sub,
      dto.variantId,
      dto.quantity,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@GetUser() user) {
    return this.cartService.getCart(user.sub);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateItem(+itemId, dto.quantity);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(+itemId);
  }
}