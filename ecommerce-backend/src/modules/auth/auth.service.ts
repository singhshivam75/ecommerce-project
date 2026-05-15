import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.tokenService.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.usersService.update(user.id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    });

    return tokens;
  }

  async refreshToken(userPayload: any) {
    const user = await this.usersService.findByEmail(userPayload.email);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isMatch = await bcrypt.compare(
      userPayload.refreshToken,
      user.refreshToken,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.tokenService.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.usersService.update(user.id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    });

    return tokens;
  }
}