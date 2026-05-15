import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { applyQuery } from 'src/common/utils/query-builder.util';
import { QueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  // ✅ CREATE
  async createUser(data: Partial<User>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.userRepo.save(data);
  }

  // ✅ GET ALL

  async getAllUsers(query: QueryDto) {
    const qb = this.userRepo.createQueryBuilder('user');

    qb.where('user.role = :role', { role: 'user' });

    const result = await applyQuery(qb, {
      ...query,
      searchFields: ['name', 'email', 'mobile'],
    });

    return {
      ...result,
      data: result.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        mobile: user.mobile,
        role: user.role,
      })),
    };
  }

  // ✅ GET ONE
  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      mobile: user.mobile,
      role: user.role,
    };
  }

  // ✅ UPDATE
  async updateUser(id: number, data: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepo.update(id, data);

    return { message: 'User updated successfully' };
  }

  // ✅ DELETE
  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.delete(id);

    return { message: 'User deleted successfully' };
  }

  // existing
  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async update(id: number, data: Partial<User>) {
    return await this.userRepo.update(id, data);
  }
}