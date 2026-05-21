import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class CreateVariantDto {
  @ApiProperty()
  @IsUUID()
  productId!: string;

  @ApiProperty()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty()
  @IsNotEmpty()
  color!: string;

  @ApiProperty()
  @IsNotEmpty()
  size!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  compareAtPrice?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  stock!: number;

  @ApiPropertyOptional()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}