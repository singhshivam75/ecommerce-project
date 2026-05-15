// src/common/guards/refresh-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';

export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}