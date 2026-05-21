import { IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsUUID()
  variantId!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity!: number;
}