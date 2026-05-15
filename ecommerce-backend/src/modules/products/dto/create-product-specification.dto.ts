import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class CreateProductSpecificationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  productId!: number;

  @ApiProperty()
  @IsNotEmpty()
  key!: string;

  @ApiProperty()
  @IsNotEmpty()
  value!: string;
}