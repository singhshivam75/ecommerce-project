import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
  Min,
  IsObject,
  IsString,
  IsInt,
  IsArray,
  Matches,
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

  @ApiPropertyOptional({ description: 'Deprecated: use attributes' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Deprecated: use attributes' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: 'Flexible attributes object' })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  compareAtPrice?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiPropertyOptional({ description: 'Reserved stock (system managed). optional' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reservedStock?: number;

  @ApiPropertyOptional()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryUrls?: string[];

  @ApiPropertyOptional({ description: 'Barcode, unique if provided' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_-]+$/)
  barcode?: string;

  @ApiPropertyOptional({ description: 'Cost price for profit calculations' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ description: 'Low stock threshold' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ description: 'Allow backorder when out of stock' })
  @IsOptional()
  @IsBoolean()
  allowBackOrder?: boolean;

  @ApiPropertyOptional({ description: 'Track inventory or not' })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}