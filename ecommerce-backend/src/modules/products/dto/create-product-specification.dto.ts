import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class CreateProductSpecificationDto {
  @ApiProperty()
  @IsUUID()
  productId!: string;

  @ApiProperty()
  @IsNotEmpty()
  key!: string;

  @ApiProperty()
  @IsNotEmpty()
  value!: string;
}