import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { QueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  // ================= CREATE =================

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category (Admin only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  // ================= GET MAIN CATEGORIES =================

  @Get()
  @ApiOperation({
    summary: 'Get main categories',
  })
  getMainCategories(@Query() query: QueryDto) {
    return this.categoryService.getMainCategories(query);
  }

  // ================= GET ALL SUB CATEGORIES =================

  @Get('subcategories')
  @ApiOperation({
    summary: 'Get all subcategories',
  })
  getAllSubCategories(@Query() query: QueryDto) {
    return this.categoryService.getAllSubCategories(query);
  }

  // ================= GET SUBCATEGORY BY CATEGORY =================

  @Get(':id/subcategories')
  @ApiParam({ name: 'id', description: 'Category UUID', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Get subcategories of a category' })
  getSubcategories(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getSubcategories(id);
  }

  // ================= TREE =================

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree (nested)' })
  getTree() {
    return this.categoryService.getTree();
  }

  // ================= FIND ONE =================

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Category UUID', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Get single category with children' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  // ================= DELETE =================

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Category UUID', type: 'string', format: 'uuid' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }

  // ================= UPDATE =================

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Category UUID', type: 'string', format: 'uuid' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update category (Admin only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }
}