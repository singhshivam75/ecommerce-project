import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  ArrayUnique,
  IsBoolean,
  IsDateString,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { ProductStatus, DiscountType } from '../enums/product.enums';

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
  @Min(0)
  basePrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.DRAFT })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.DRAFT;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: DiscountType })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiPropertyOptional({ description: 'Discount value; percentage or fixed amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  saleStartDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  saleEndDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isNewArrival?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  searchKeywords?: string[];

  // Shipping
  @ApiPropertyOptional({ description: 'Weight in kg' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  length?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shippingClass?: string;

  @ApiPropertyOptional({ description: 'Warranty text, e.g. "1 Year Warranty"' })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({ description: 'Return policy text, e.g. "7 Days Return"' })
  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @ApiPropertyOptional({ description: 'Country of origin' })
  @IsOptional()
  @IsString()
  countryOfOrigin?: string;
}