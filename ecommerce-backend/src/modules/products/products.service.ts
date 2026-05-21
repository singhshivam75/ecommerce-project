import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductSpecification } from './entities/product-specification.entity';

import { Category } from 'src/modules/categories/entities/category.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

import { applyProductFilters } from './utils/query.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,

    @InjectRepository(ProductSpecification)
    private readonly specRepo: Repository<ProductSpecification>,
  ) {}

  private slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  }

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Category not found');

    const slug = this.slugify(dto.title);
    const existing = await this.productRepo.findOne({ where: { slug } });
    if (existing) throw new BadRequestException('Product with same slug already exists');

    const product = this.productRepo.create({
      title: dto.title,
      slug,
      description: dto.description,
      shortDescription: dto.shortDescription,
      brand: dto.brand,
      basePrice: dto.basePrice.toString(),
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      category,
    } as any);

    return this.productRepo.save(product);
  }

  async findAll(filters: ProductFilterDto) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);

    let qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.specifications', 'spec');

    qb = applyProductFilters(qb as SelectQueryBuilder<Product>, filters as any);

    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order || 'DESC';

    qb.orderBy(sortBy.includes('.') ? sortBy : `product.${sortBy}`, order as 'ASC' | 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id }, relations: ['variants', 'images', 'specifications', 'category'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (dto.title) dto['slug'] = this.slugify(dto.title as string);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException('Category not found');
      // @ts-ignore: assign relation
      dto['category'] = category;
    }

    Object.assign(product, dto as any);
    return this.productRepo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return { success: true };
  }

  async toggle(id: string) {
    const product = await this.findOne(id);
    product.isActive = !product.isActive;
    await this.productRepo.save(product);
    return product;
  }

  // Variants
  async createVariant(dto: CreateVariantDto) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const exists = await this.variantRepo.findOne({ where: { sku: dto.sku } });
    if (exists) throw new ConflictException('SKU already exists');

    if (dto.isDefault) {
      await this.variantRepo.createQueryBuilder()
        .update(ProductVariant)
        .set({ isDefault: false })
        .where('productId = :productId', { productId: dto.productId })
        .execute();
    }

    const variant = this.variantRepo.create({
      product,
      sku: dto.sku,
      color: dto.color,
      size: dto.size,
      price: dto.price.toString(),
      compareAtPrice: dto.compareAtPrice?.toString(),
      stock: dto.stock,
      image: dto.image,
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
    } as any);

    return this.variantRepo.save(variant);
  }

  async updateVariant(id: string, dto: UpdateVariantDto) {
    const variant = await this.variantRepo.findOne({ where: { id }, relations: ['product'] });
    if (!variant) throw new NotFoundException('Variant not found');

    if (dto.sku && dto.sku !== variant.sku) {
      const exists = await this.variantRepo.findOne({ where: { sku: dto.sku } });
      if (exists) throw new ConflictException('SKU already exists');
    }

    if (dto.isDefault) {
      await this.variantRepo.createQueryBuilder()
        .update(ProductVariant)
        .set({ isDefault: false })
        .where('productId = :productId', { productId: variant.product.id })
        .execute();
    }

    Object.assign(variant, dto as any);
    return this.variantRepo.save(variant);
  }

  async deleteVariant(id: string) {
    const variant = await this.variantRepo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException('Variant not found');
    await this.variantRepo.remove(variant);
    return { success: true };
  }

  // Images
  async createImage(dto: CreateProductImageDto) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.isPrimary) {
      await this.imageRepo.createQueryBuilder()
        .update(ProductImage)
        .set({ isPrimary: false })
        .where('productId = :productId', { productId: dto.productId })
        .execute();
    }

    const image = this.imageRepo.create({
      product,
      url: dto.url,
      isPrimary: dto.isPrimary ?? false,
      sortOrder: dto.sortOrder ?? 0,
    } as any);

    return this.imageRepo.save(image);
  }

  async deleteImage(id: string) {
    const image = await this.imageRepo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    await this.imageRepo.remove(image);
    return { success: true };
  }

  // Specifications
  async createSpecification(dto: CreateProductSpecificationDto) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const spec = this.specRepo.create({
      product,
      key: dto.key,
      value: dto.value,
    } as any);

    return this.specRepo.save(spec);
  }

  async deleteSpecification(id: string) {
    const spec = await this.specRepo.findOne({ where: { id } });
    if (!spec) throw new NotFoundException('Specification not found');
    await this.specRepo.remove(spec);
    return { success: true };
  }
}
