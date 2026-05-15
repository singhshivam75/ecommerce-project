import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Order will be created from user cart',
    description: 'No body required, order is created from cart',
  })
  note?: string;
}