import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({ required: false })
  @IsOptional()
  group?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isHighlighted?: boolean;
}