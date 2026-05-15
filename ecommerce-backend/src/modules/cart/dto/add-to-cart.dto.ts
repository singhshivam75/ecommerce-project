import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  variantId!: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity!: number;
}