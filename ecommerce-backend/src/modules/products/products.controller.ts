import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
  ) {}

  // ======================================================
  // CREATE PRODUCT
  // ======================================================

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create product',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(dto);
  }

  // ======================================================
  // GET ALL PRODUCTS
  // ======================================================

  @Get()
  @ApiOperation({
    summary: 'Get all products',
  })
  findAll(@Query() query: ProductFilterDto) {
    return this.productService.findAll(query);
  }

  // ======================================================
  // GET SINGLE PRODUCT
  // ======================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
  })
  findOne(
    @Param('id') id: string,
  ) {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new BadRequestException(
        'Invalid product ID',
      );
    }

    return this.productService.findOne(
      numericId,
    );
  }

  // ======================================================
  // UPDATE PRODUCT
  // ======================================================

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update product',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(
      +id,
      dto,
    );
  }

  // ======================================================
  // DELETE PRODUCT
  // ======================================================

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete product',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(
    @Param('id') id: string,
  ) {
    return this.productService.remove(+id);
  }

  // ======================================================
  // TOGGLE PRODUCT STATUS
  // ======================================================

  @Patch(':id/toggle')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Toggle product active status',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  toggle(
    @Param('id') id: string,
  ) {
    return this.productService.toggle(+id);
  }

  // ======================================================
  // ADD VARIANT
  // ======================================================

  @Post('variant')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add product variant',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addVariant(
    @Body() dto: CreateVariantDto,
  ) {
    return this.productService.createVariant(dto);
  }

  // ======================================================
  // UPDATE VARIANT
  // ======================================================

  @Patch('variant/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update variant',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateVariant(
    @Param('id') id: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productService.updateVariant(+id, dto);
  }

  // ======================================================
  // DELETE VARIANT
  // ======================================================

  @Delete('variant/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete variant',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeVariant(
    @Param('id') id: string,
  ) {
    return this.productService.deleteVariant(+id);
  }

  // ======================================================
  // ADD PRODUCT IMAGE
  // ======================================================

  @Post('image')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add product image',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addImage(
    @Body() dto: CreateProductImageDto,
  ) {
    return this.productService.createImage(dto);
  }

  // ======================================================
  // DELETE PRODUCT IMAGE
  // ======================================================

  @Delete('image/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete product image',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeImage(
    @Param('id') id: string,
  ) {
    return this.productService.deleteImage(+id);
  }

  // ======================================================
  // ADD SPECIFICATION
  // ======================================================

  @Post('specification')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add product specification',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addSpecification(
    @Body()
    dto: CreateProductSpecificationDto,
  ) {
    return this.productService.createSpecification(dto);
  }

  // ======================================================
  // DELETE SPECIFICATION
  // ======================================================

  @Delete('specification/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete specification',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeSpecification(
    @Param('id') id: string,
  ) {
    return this.productService.deleteSpecification(+id);
  }
}