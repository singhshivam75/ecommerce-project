import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsUrl,
  IsEnum,
  IsInt,
  Min,
  IsString,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { ImageType } from '../enums/product.enums';

export class CreateProductImageDto {
  @ApiProperty({
    description: 'Product UUID',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    example: 'https://image-url.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ enum: ImageType })
  @IsOptional()
  @IsEnum(ImageType)
  imageType?: ImageType;

  @ApiPropertyOptional({ description: 'Image alt text for accessibility/SEO' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Image width in pixels' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  width?: number;

  @ApiPropertyOptional({ description: 'Image height in pixels' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  height?: number;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fileSize?: number;

  @ApiPropertyOptional({ description: 'MIME type' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}