import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { QueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ CREATE
  @Post()
  @ApiOperation({ summary: 'Create user (admin)' })
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  // ✅ GET ALL
    @Get()
  @ApiOperation({ summary: 'Get all users (admin)' })
  getAllUsers(@Query() query: QueryDto) {
    return this.usersService.getAllUsers(query);
  }

  // ✅ GET BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id (admin)' })
  getUser(@Param('id') id: string) {
    return this.usersService.getUserById(+id);
  }

  // ✅ UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Update user (admin)' })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(+id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (admin)' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}