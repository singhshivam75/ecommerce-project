import { IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductImageDto } from './create-product-image.dto';

export class CreateMultipleProductImagesDto {
  @IsUUID()
  productId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images!: CreateProductImageDto[];
}
