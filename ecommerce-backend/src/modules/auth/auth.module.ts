import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.stratigy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    RefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}