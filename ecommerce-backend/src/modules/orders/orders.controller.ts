import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  // 🛒 PLACE ORDER (USER)
  @Post()
  @ApiOperation({ summary: 'Place order from cart' })
  @UseGuards(JwtAuthGuard)
  placeOrder(@GetUser() user: any) {
    return this.ordersService.placeOrder(user.sub);
  }

  // 📦 GET MY ORDERS (USER)
  @Get()
  @ApiOperation({ summary: 'Get logged-in user orders' })
  @UseGuards(JwtAuthGuard)
  getMyOrders(@GetUser() user: any) {
    return this.ordersService.getUserOrders(user.sub);
  }

  // 📊 GET ALL ORDERS (ADMIN)
  @Get('all')
  @ApiOperation({ summary: 'Get all orders (Admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // 🔄 UPDATE ORDER STATUS (ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(+id, dto.status);
  }
}