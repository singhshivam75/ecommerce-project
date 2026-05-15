import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  brand?: string;

  @ApiProperty({ description: 'Category UUID' })
  @IsUUID()
  categoryId!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  basePrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  seoDescription?: string;
}