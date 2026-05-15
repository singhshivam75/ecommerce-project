import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class CreateProductImageDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;

  @ApiProperty({
    example: 'https://image-url.jpg',
  })
  @IsNotEmpty()
  url!: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}