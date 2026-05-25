import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSpecification } from './entities/product-specification.entity';
import { ProductFaq } from './entities/product-faq.entity';
import { ProductSlugHistory } from './entities/product-slug-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductImage,
      ProductSpecification,
      ProductFaq,
      ProductSlugHistory,
      Category,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [TypeOrmModule],
})
export class ProductsModule {}