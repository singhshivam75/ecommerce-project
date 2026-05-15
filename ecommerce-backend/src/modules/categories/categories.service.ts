import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, IsNull } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { applyQuery } from 'src/common/utils/query-builder.util';
import { QueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) { }

  // better slug generator
  generateSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // ensure unique slug
  async generateUniqueSlug(base: string) {
    let slug = this.generateSlug(base);
    let counter = 1;

    while (await this.categoryRepo.findOne({ where: { slug } })) {
      slug = `${this.generateSlug(base)}-${counter++}`;
    }

    return slug;
  }

  // ================= CIRCULAR CHECK =================

  async isCircular(parentId: string, childId: string): Promise<boolean> {
    if (!parentId) return false;

    let current = await this.categoryRepo.findOne({ where: { id: parentId } });

    while (current) {
      if (current.id === childId) return true;
      if (!current.parentId) break;
      current = await this.categoryRepo.findOne({ where: { id: current.parentId } });
    }

    return false;
  }

  // ================= CREATE =================

  async create(dto: CreateCategoryDto) {
    let parent: Category | null = null;

    if (dto.parentId) {
      parent = await this.categoryRepo.findOne({ where: { id: dto.parentId } });

      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
    }

    const exists = await this.categoryRepo.findOne({
      where: { name: dto.name, parentId: parent ? parent.id : IsNull() },
    });

    if (exists) {
      throw new BadRequestException('Category already exists under this parent');
    }

    const slug = dto.slug
      ? await this.generateUniqueSlug(dto.slug)
      : await this.generateUniqueSlug(dto.name);

    // initial create without path (id needed)
    const initial = this.categoryRepo.create({
      name: dto.name,
      slug,
      description: dto.description,
      image: dto.image,
      isActive: dto.isActive ?? true,
      isFeatured: dto.isFeatured ?? false,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      sortOrder: dto.sortOrder ?? 0,
      parentId: parent ? parent.id : null,
      level: parent ? parent.level + 1 : 0,
    });

    const saved = await this.categoryRepo.save(initial);

    // compute path including self for fast descendant queries
    const parentPath = parent ? (parent.path ?? parent.id) : null;
    saved.path = parentPath ? `${parentPath}/${saved.id}` : saved.id;

    return this.categoryRepo.save(saved);
  }

  // ================= FIND ALL =================

async findAll(query: QueryDto, parentId?: string | null) {
  const qb = this.categoryRepo
    .createQueryBuilder('category')
    .leftJoinAndSelect('category.parent', 'parent');

  // ✅ Parent filter
  if (parentId !== undefined) {
    if (parentId === null) {
      qb.where('category.parentId IS NULL');
    } else {
      qb.where('category.parentId = :parentId', { parentId });
    }
  }

  // ✅ Active filter
  qb.andWhere('category.isActive = :isActive', { isActive: true });

  // ================= SEARCH =================
  if (query.search) {
    qb.andWhere(
      `(category.name ILIKE :search 
        OR category.slug ILIKE :search 
        OR category.description ILIKE :search)`,
      { search: `%${query.search}%` },
    );
  }

  // ================= PAGINATION =================
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  qb.skip((page - 1) * limit).take(limit);

  // ================= SORT =================
  const sortBy = query.sortBy || 'createdAt';
  const order = (query.order || 'DESC').toUpperCase() as 'ASC' | 'DESC';

  qb.orderBy(`category.${sortBy}`, order);

  // ================= EXECUTE =================
  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}

async getMainCategories(query: QueryDto) {
  const qb = this.categoryRepo
    .createQueryBuilder('category')
    .leftJoinAndSelect('category.parent', 'parent')
    .where('category.parentId IS NULL')
    .andWhere('category.isActive = true');

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}

async getAllSubCategories(query: QueryDto) {
  const qb = this.categoryRepo
    .createQueryBuilder('category')
    .leftJoinAndSelect('category.parent', 'parent')
    .where('category.parentId IS NOT NULL')
    .andWhere('category.isActive = true');

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}

  // ================= TREE =================

  async getTree() {
    const categories = await this.categoryRepo.find({ order: { sortOrder: 'ASC', name: 'ASC' } });

    const map = new Map<string, any>();
    const roots: any[] = [];

    categories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));

    categories.forEach((cat) => {
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) parent.children.push(map.get(cat.id));
        else roots.push(map.get(cat.id));
      } else {
        roots.push(map.get(cat.id));
      }
    });

    return roots;
  }

  // ================= FIND ONE =================

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) throw new BadRequestException('Category not found');

    const children = await this.categoryRepo.find({ where: { parentId: id }, order: { name: 'ASC' } });

    return { ...category, children };
  }

  // ================= DELETE =================

  async remove(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) throw new BadRequestException('Category not found');

    const hasChildren = await this.categoryRepo.findOne({ where: { parentId: id } });

    if (hasChildren) throw new BadRequestException('Cannot delete category with subcategories');

    await this.categoryRepo.softDelete(id);

    return { message: 'Category deleted' };
  }

  // ================= UPDATE =================

  async update(id: string, dto: CreateCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) throw new BadRequestException('Category not found');

    let parent: Category | null = null;
    const oldParentId = category.parentId ?? null;
    const oldLevel = category.level ?? 0;
    const oldPath = category.path ?? category.id;

    if (dto.parentId !== undefined) {
      if (dto.parentId !== null) {
        parent = await this.categoryRepo.findOne({ where: { id: dto.parentId } });

        if (!parent) throw new BadRequestException('Parent category not found');

        if (await this.isCircular(dto.parentId, id)) {
          throw new BadRequestException('Circular hierarchy not allowed');
        }
      }
    }

    // prevent duplicate under same parent
    if (dto.name) {
      const parentMatcher = parent ? parent.id : (oldParentId === null ? IsNull() : oldParentId);
      const exists = await this.categoryRepo.findOne({
        where: { name: dto.name, parentId: parentMatcher as any },
      });

      if (exists && exists.id !== id) throw new BadRequestException('Category already exists under this parent');
    }

    // slug logic
    let slug = category.slug;

    if (dto.slug) slug = await this.generateUniqueSlug(dto.slug);
    else if (dto.name && dto.name !== category.name) slug = await this.generateUniqueSlug(dto.name);

    Object.assign(category, {
      name: dto.name ?? category.name,
      slug,
      description: dto.description ?? category.description,
      image: dto.image ?? category.image,
      isActive: dto.isActive ?? category.isActive,
      isFeatured: dto.isFeatured ?? category.isFeatured,
      metaTitle: dto.metaTitle ?? category.metaTitle,
      metaDescription: dto.metaDescription ?? category.metaDescription,
      sortOrder: dto.sortOrder ?? category.sortOrder,
      parentId: dto.parentId !== undefined ? (parent ? parent.id : null) : category.parentId,
    });

    // save to persist basic changes
    const saved = await this.categoryRepo.save(category);

    // if parent changed, update path and level for this and descendants
    const newParentId = saved.parentId ?? null;
    if (newParentId !== oldParentId) {
      const newLevel = parent ? parent.level + 1 : 0;

      const parentPath = parent ? (parent.path ?? parent.id) : null;
      const newPath = parentPath ? `${parentPath}/${saved.id}` : saved.id;

      const levelDiff = newLevel - oldLevel;

      // update current
      saved.level = newLevel;
      saved.path = newPath;
      await this.categoryRepo.save(saved);

      // update descendants
      const oldFullPath = oldPath ? `${oldPath}` : saved.id;
      const newFullPath = newPath;

      const descendants = await this.categoryRepo
        .createQueryBuilder()
        .where('path LIKE :like', { like: `${oldFullPath}/%` })
        .getMany();

      for (const desc of descendants) {
        if (desc.path) {
          desc.path = desc.path.replace(oldFullPath, newFullPath);
        } else {
          desc.path = `${newFullPath}/${desc.id}`;
        }

        desc.level = (desc.level ?? 0) + levelDiff;
      }

      if (descendants.length) await this.categoryRepo.save(descendants);
    }

    return saved;
  }

  // ================= GET SUBCATEGORY =================

  async getSubcategories(parentId: string) {
    const parent = await this.categoryRepo.findOne({ where: { id: parentId } });

    if (!parent) throw new BadRequestException('Category not found');

    return this.categoryRepo.find({ where: { parentId, isActive: true }, order: { name: 'ASC' } });
  }
}