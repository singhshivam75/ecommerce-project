import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductSpecification } from './entities/product-specification.entity';
import { ProductFaq } from './entities/product-faq.entity';
import { ProductSlugHistory } from './entities/product-slug-history.entity';

import { Category } from 'src/modules/categories/entities/category.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

import { applyProductFilters } from './utils/query.helper';
import { StockStatus } from './enums/product.enums';

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

    @InjectRepository(ProductFaq)
    private readonly faqRepo: Repository<ProductFaq>,

    @InjectRepository(ProductSlugHistory)
    private readonly slugHistoryRepo: Repository<ProductSlugHistory>,
  ) { }

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
      status: dto.status,
      tags: dto.tags ?? [],
      discountType: dto.discountType,
      discountValue: dto.discountValue?.toString(),
      saleStartDate: dto.saleStartDate ? new Date(dto.saleStartDate) : null,
      saleEndDate: dto.saleEndDate ? new Date(dto.saleEndDate) : null,
      isFeatured: dto.isFeatured ?? false,
      isNewArrival: dto.isNewArrival ?? false,
      metaKeywords: dto.metaKeywords ?? [],
      searchKeywords: dto.searchKeywords ?? [],
      weight: dto.weight?.toString(),
      length: dto.length?.toString(),
      width: dto.width?.toString(),
      height: dto.height?.toString(),
      shippingClass: dto.shippingClass,
      warranty: dto.warranty,
      returnPolicy: dto.returnPolicy,
      countryOfOrigin: dto.countryOfOrigin,
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

    qb = applyProductFilters(qb, filters);

    const sortBy = filters.sortBy || 'createdAt';
    const order: 'ASC' | 'DESC' = filters.order === 'ASC' ? 'ASC' : 'DESC';

    const allowedSortFields = [
      'createdAt',
      'title',
      'basePrice',
      'viewCount',
      'soldCount',
      'averageRating',
    ];

    const sortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : 'createdAt';

    qb.orderBy(
      `product.${sortField}`,
      order,
    );
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

  async findOne(identifier: string) {

    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    const product =
      await this.productRepo.findOne({
        where: isUUID
          ? { id: identifier }
          : { slug: identifier },

        relations: [
          'variants',
          'images',
          'specifications',
          'category',
        ],
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  async findById(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'variants',
        'images',
        'specifications',
        'category',
      ],
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findById(id);
    if (dto.title) {
      const slug = this.slugify(dto.title);

      const existingProduct =
        await this.productRepo.findOne({
          where: { slug },
        });

      if (
        existingProduct &&
        existingProduct.id !== id
      ) {
        throw new BadRequestException(
          'Product with same slug already exists',
        );
      }

      // record slug history if changed
      if (product.slug && product.slug !== slug) {
        await this.slugHistoryRepo.save({ product, oldSlug: product.slug } as any);
      }

      dto['slug'] = slug;
    }

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
    const product = await this.findById(id);
    await this.productRepo.remove(product);
    return { success: true };
  }

  async toggle(id: string) {
    const product = await this.findById(id);
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

    if ((dto as any).barcode) {
      const b = await this.variantRepo.findOne({ where: { barcode: (dto as any).barcode } });
      if (b) throw new ConflictException('Barcode already exists');
    }

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
      attributes: (dto as any).attributes ?? {},
      price: dto.price.toString(),
      compareAtPrice: dto.compareAtPrice?.toString(),
      stock: dto.stock,
      reservedStock: (dto as any).reservedStock ?? 0,
      image: dto.image,
      thumbnail: (dto as any).thumbnail,
      galleryUrls: (dto as any).galleryUrls ?? [],
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
      barcode: (dto as any).barcode ?? null,
      costPrice: (dto as any).costPrice?.toString() ?? null,
      lowStockThreshold: (dto as any).lowStockThreshold ?? 5,
      allowBackOrder: (dto as any).allowBackOrder ?? false,
      trackInventory: (dto as any).trackInventory ?? true,
      stockStatus: StockStatus.IN_STOCK,
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

    if ((dto as any).barcode && (dto as any).barcode !== variant.barcode) {
      const b = await this.variantRepo.findOne({ where: { barcode: (dto as any).barcode } });
      if (b) throw new ConflictException('Barcode already exists');
    }

    if (dto.isDefault) {
      await this.variantRepo.createQueryBuilder()
        .update(ProductVariant)
        .set({ isDefault: false })
        .where('productId = :productId', { productId: variant.product.id })
        .execute();
    }

    Object.assign(variant, dto as any);

    // recompute stock status when inventory-related fields changed
    const computed = this.computeStockStatus(variant.stock, variant.reservedStock || 0, variant.lowStockThreshold, !!variant.allowBackOrder);
    variant.stockStatus = computed;

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
      imageType: dto.imageType ?? undefined,
      altText: dto.altText,
      width: dto.width,
      height: dto.height,
      fileSize: dto.fileSize,
      mimeType: dto.mimeType,
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
      group: (dto as any).group,
      sortOrder: (dto as any).sortOrder ?? 0,
      isHighlighted: (dto as any).isHighlighted ?? false,
    } as any);

    return this.specRepo.save(spec);
  }

  async createFaq(dto: any) {
    const category = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!category) throw new NotFoundException('Product not found');

    const faq = this.faqRepo.create({
      product: category,
      question: dto.question,
      answer: dto.answer,
      sortOrder: dto.sortOrder ?? 0,
    } as any);

    return this.faqRepo.save(faq);
  }

  async deleteSpecification(id: string) {
    const spec = await this.specRepo.findOne({ where: { id } });
    if (!spec) throw new NotFoundException('Specification not found');
    await this.specRepo.remove(spec);
    return { success: true };
  }

  // Inventory helpers
  private computeStockStatus(stock: number, reserved: number, lowThreshold: number, allowBackOrder: boolean) {
    const available = Math.max(0, stock - (reserved || 0));
    if (allowBackOrder && stock <= 0) return StockStatus.PRE_ORDER;
    if (available <= 0) return StockStatus.OUT_OF_STOCK;
    if (available <= (lowThreshold || 0)) return StockStatus.LOW_STOCK;
    return StockStatus.IN_STOCK;
  }

  async incrementVariantStock(variantId: string, amount = 1) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    // Atomic increment
    const qb = this.variantRepo.createQueryBuilder()
      .update()
      .set({ stock: () => `stock + ${amount}` })
      .where('id = :id', { id: variantId })
      .returning('*');

    const res = await qb.execute();
    const updated: any = res.raw?.[0];
    if (!updated) throw new NotFoundException('Variant not found');

    // Recompute status
    const status = this.computeStockStatus(Number(updated.stock), Number(updated.reservedStock || 0), updated.lowStockThreshold, !!updated.allowBackOrder);
    await this.variantRepo.update(variantId, { stockStatus: status } as any);
    return this.variantRepo.findOne({ where: { id: variantId } });
  }

  async decrementVariantStock(variantId: string, amount = 1) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    // Ensure no negative stock
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');
    if (variant.trackInventory === false) {
      // Not tracking inventory: nothing to do
      return variant;
    }

    if (variant.stock - amount < 0 && !variant.allowBackOrder) {
      throw new BadRequestException('Insufficient stock');
    }

    const qb = this.variantRepo.createQueryBuilder()
      .update()
      .set({ stock: () => `stock - ${amount}` })
      .where('id = :id', { id: variantId })
      .returning('*');

    const res = await qb.execute();
    const updated: any = res.raw?.[0];
    if (!updated) throw new NotFoundException('Variant not found');

    const status = this.computeStockStatus(Number(updated.stock), Number(updated.reservedStock || 0), updated.lowStockThreshold, !!updated.allowBackOrder);
    await this.variantRepo.update(variantId, { stockStatus: status } as any);
    return this.variantRepo.findOne({ where: { id: variantId } });
  }

  async reserveStock(variantId: string, amount = 1) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    // Atomic increment reservedStock with check
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');
    const available = Math.max(0, variant.stock - (variant.reservedStock || 0));
    if (amount > available && !variant.allowBackOrder) {
      throw new BadRequestException('Not enough available stock to reserve');
    }

    await this.variantRepo.createQueryBuilder()
      .update()
      .set({ reservedStock: () => `reservedStock + ${amount}` })
      .where('id = :id', { id: variantId })
      .execute();

    const updated = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!updated) throw new NotFoundException('Variant not found');
    const status = this.computeStockStatus(updated.stock, updated.reservedStock, updated.lowStockThreshold, !!updated.allowBackOrder);
    await this.variantRepo.update(variantId, { stockStatus: status } as any);
    return updated;
  }

  async releaseReservedStock(variantId: string, amount = 1) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const toRelease = Math.min(amount, variant.reservedStock || 0);
    await this.variantRepo.createQueryBuilder()
      .update()
      .set({ reservedStock: () => `GREATEST(reservedStock - ${toRelease}, 0)` })
      .where('id = :id', { id: variantId })
      .execute();

    const updated = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!updated) throw new NotFoundException('Variant not found');
    const status = this.computeStockStatus(updated.stock, updated.reservedStock, updated.lowStockThreshold, !!updated.allowBackOrder);
    await this.variantRepo.update(variantId, { stockStatus: status } as any);
    return updated;
  }
}
