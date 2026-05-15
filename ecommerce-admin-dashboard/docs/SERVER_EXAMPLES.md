# Server Examples (NestJS)

Below are example snippets illustrating the expected API contract for the Categories module. They are kept here in docs to avoid affecting the Next.js build.

### Controller (example)

```ts
// Example NestJS controller - place in your backend project
import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Return nested tree
  @Get('tree')
  async tree() {
    return this.categoriesService.getTree();
  }

  // Reorder or move node
  @Post('reorder')
  async reorder(@Body() payload: any) {
    // payload can be { orderedIds: string[] } or { movedId: string, newParentId?: string }
    return this.categoriesService.reorder(payload);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.categoriesService.saveImage(file);
    return { url };
  }
}
```

### Service (example)

```ts
// Example NestJS service - place in your backend project
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: Repository<Category>) {}

  async getTree() {
    const items = await this.repo.find({ relations: ['children'], order: { sortOrder: 'ASC' } });
    const map = new Map<string, any>();
    items.forEach((i) => map.set(i.id, { ...i, children: [] }));
    const roots: any[] = [];
    map.forEach((v) => {
      if (v.parentId) {
        const p = map.get(v.parentId);
        if (p) p.children.push(v);
        else roots.push(v);
      } else roots.push(v);
    });
    return roots;
  }

  async reorder(payload: any) {
    if (payload.orderedIds) {
      for (let i = 0; i < payload.orderedIds.length; i++) {
        await this.repo.update(payload.orderedIds[i], { sortOrder: i });
      }
      return { ok: true };
    }

    if (payload.movedId) {
      const moved = await this.repo.findOne({ where: { id: payload.movedId } });
      if (!moved) return { ok: false };
      moved.parentId = payload.newParentId ?? null;
      await this.repo.save(moved);
      return { ok: true };
    }

    return { ok: false };
  }

  async saveImage(file: Express.Multer.File) {
    const fakeUrl = `https://cdn.example.com/uploads/${Date.now()}_${file.originalname}`;
    return fakeUrl;
  }
}
```
